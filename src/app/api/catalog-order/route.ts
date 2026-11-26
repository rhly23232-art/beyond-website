/**
 * Orders from the photo-props rental catalog (public/catalog.html).
 *
 * The browser posts to this same-origin route (so it works behind filtered
 * networks such as NetFree), and the server delivers the order by email:
 *  1. Gmail SMTP, when GMAIL_APP_PASSWORD is configured (App Password);
 *  2. Resend, when RESEND_API_KEY is configured;
 *  3. otherwise FormSubmit (https://formsubmit.co), which needs a one-time
 *     "Activate Form" click in the first email it sends to the inbox.
 *
 * The inbox is set in the Vercel environment variable CATALOG_TO_EMAIL
 * (falls back to CONTACT_TO_EMAIL).
 */

export const runtime = 'nodejs';

const inbox = () => (process.env.CATALOG_TO_EMAIL || process.env.CONTACT_TO_EMAIL || '').split(',')[0].trim();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
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

const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

type Order = { name: string; phone: string; date: string; notes: string; items: string; total: number };

function renderOrder(order: Order) {
  const rows: [string, string][] = [
    ['שם', order.name],
    ['טלפון', order.phone],
    ['תאריך הצילום', order.date || '—'],
    ['הערות', order.notes || '—'],
  ];
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1c2130">
  <h2 style="margin:0 0 12px">הזמנה חדשה מהקטלוג</h2>
  <table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 0 4px 16px;color:#6b6f7b">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join('')}</table>
  <p style="margin:16px 0 4px;color:#6b6f7b">פריטים:</p>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(order.items)}</p>
  <p style="margin:16px 0 0;font-size:18px"><strong>סה״כ: ${order.total} ₪</strong></p>
</div>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nפריטים:\n${order.items}\n\nסה״כ: ${order.total} ₪`;
  return { html, text };
}

/** Gmail SMTP with an App Password: GMAIL_APP_PASSWORD (+ GMAIL_USER, defaults to the inbox). */
async function viaGmail(to: string, order: Order, subject: string) {
  const nodemailer = (await import('nodemailer')).default;
  const user = (process.env.GMAIL_USER || to).trim();
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass: (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '') },
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
  });
  const { html, text } = renderOrder(order);
  await transporter.sendMail({ from: `"קטלוג אביזרים" <${user}>`, to, subject, html, text });
}

async function viaResend(to: string, order: Order, subject: string) {
  const rows: [string, string][] = [
    ['שם', order.name],
    ['טלפון', order.phone],
    ['תאריך הצילום', order.date || '—'],
    ['הערות', order.notes || '—'],
  ];
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1c2130">
  <h2 style="margin:0 0 12px">הזמנה חדשה מהקטלוג</h2>
  <table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 0 4px 16px;color:#6b6f7b">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join('')}</table>
  <p style="margin:16px 0 4px;color:#6b6f7b">פריטים:</p>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(order.items)}</p>
  <p style="margin:16px 0 0;font-size:18px"><strong>סה״כ: ${order.total} ₪</strong></p>
</div>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nפריטים:\n${order.items}\n\nסה״כ: ${order.total} ₪`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'Catalog <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text().catch(() => '')}`);
}

async function viaFormSubmit(to: string, order: Order, subject: string, origin: string) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: origin,
      Referer: `${origin}/catalog.html`,
      'User-Agent': 'Mozilla/5.0 (compatible; BEYOND-catalog/1.0)',
    },
    body: JSON.stringify({
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      'שם': order.name,
      'טלפון': order.phone,
      'תאריך הצילום': order.date || '—',
      'הערות': order.notes || '—',
      'פריטים': order.items,
      'סה״כ': `${order.total} ₪`,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  const body = (await res.json().catch(() => ({}))) as { success?: unknown; message?: string };
  if (!res.ok || String(body.success) !== 'true') {
    throw new Error(`FormSubmit ${res.status}: ${body.message ?? 'no message'}`);
  }
}

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  // Honeypot: pretend success, send nothing.
  if (clean(input._honey, 200)) return json({ ok: true });

  const order: Order = {
    name: clean(input.name, 120),
    phone: clean(input.phone, 40),
    date: clean(input.date, 40),
    notes: clean(input.notes, 2000),
    items: clean(input.items, 6000),
    total: Number(input.total),
  };
  if (!order.name || order.phone.replace(/\D/g, '').length < 9 || !order.items || !Number.isFinite(order.total) || order.total < 0) {
    return json({ ok: false, error: 'invalid' }, 422);
  }

  const to = inbox();
  if (!to) {
    console.error('[catalog-order] CATALOG_TO_EMAIL is not set.');
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
  if (ip && rateLimited(ip)) return json({ ok: false, error: 'rate_limited' }, 429);

  const subject = `הזמנה חדשה מהקטלוג – ${order.name} – ${order.total} ₪`;
  const origin = new URL(request.url).origin;

  if (process.env.GMAIL_APP_PASSWORD) {
    try {
      await viaGmail(to, order, subject);
      return json({ ok: true, via: 'gmail' });
    } catch (err) {
      console.error('[catalog-order] Gmail failed, trying the next channel:', err);
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      await viaResend(to, order, subject);
      return json({ ok: true, via: 'resend' });
    } catch (err) {
      console.error('[catalog-order] Resend failed, trying FormSubmit:', err);
    }
  }

  try {
    await viaFormSubmit(to, order, subject, origin);
    return json({ ok: true, via: 'formsubmit' });
  } catch (err) {
    console.error('[catalog-order] FormSubmit failed:', err);
    return json({ ok: false, error: 'delivery_failed', detail: String(err).slice(0, 200) }, 502);
  }
}

export function GET() {
  return json(
    { ok: false, error: 'method_not_allowed', configured: Boolean(inbox()), gmail: Boolean(process.env.GMAIL_APP_PASSWORD) },
    405,
  );
}
