import { createHash } from 'node:crypto';
import { normalise, validateContact, type ContactPayload } from '@/lib/contact';
import { insertSubmission, isDatabaseConfigured } from '@/lib/server/db';
import { isEmailConfigured, isWebhookConfigured, sendEmail, sendWebhook } from '@/lib/server/notify';

export const runtime = 'nodejs';

/* Best-effort in-memory rate limit (per server instance): 5 / 10 min / IP. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  let input: Partial<ContactPayload>;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const data = normalise(input);

  // Bots: filled honeypot or an inhumanly fast submission. Answer like a
  // success so they move on, but store and send nothing.
  if (data.company || (data.elapsed !== undefined && data.elapsed < 1500)) {
    return json({ ok: true });
  }

  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) return json({ ok: false, errors }, 422);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
  if (ip && rateLimited(ip)) return json({ ok: false, error: 'rate_limited' }, 429);

  const channels = {
    db: isDatabaseConfigured(),
    email: isEmailConfigured(),
    webhook: isWebhookConfigured(),
  };
  if (!channels.db && !channels.email && !channels.webhook) {
    console.error('[contact] No delivery channel configured (DATABASE_URL / RESEND_API_KEY / CONTACT_WEBHOOK_URL).');
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const ipHash = ip
    ? createHash('sha256').update(`${ip}:${process.env.IP_HASH_SALT ?? 'beyond'}`).digest('hex').slice(0, 32)
    : undefined;

  let id: number | undefined;
  let delivered = false;

  if (channels.db) {
    try {
      id = await insertSubmission(data, { ipHash, userAgent: request.headers.get('user-agent') ?? undefined });
      delivered = true;
    } catch (err) {
      console.error('[contact] Database insert failed:', err);
    }
  }

  const notifications = await Promise.allSettled([
    channels.email ? sendEmail(data, id) : Promise.resolve('skipped'),
    channels.webhook ? sendWebhook(data, id) : Promise.resolve('skipped'),
  ]);
  notifications.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`[contact] ${i === 0 ? 'Email' : 'Webhook'} failed:`, r.reason);
    else if (r.value !== 'skipped') delivered = true;
  });

  if (!delivered) return json({ ok: false, error: 'delivery_failed' }, 502);
  return json({ ok: true, id });
}

export function GET() {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
