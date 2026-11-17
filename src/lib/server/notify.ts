import 'server-only';
import { createHmac } from 'node:crypto';
import type { ContactPayload } from '@/lib/contact';

/**
 * Optional notification channels for new inquiries:
 *  - Resend (email)    RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL)
 *  - Webhook (JSON)    CONTACT_WEBHOOK_URL (+ CONTACT_WEBHOOK_SECRET for HMAC)
 */

const SERVICE_LABELS: Record<string, string> = {
  strategy: 'אסטרטגיה ואפיון',
  ux: 'UX',
  ui: 'UI ומערכת עיצוב',
  'web-design': 'עיצוב אתר',
  development: 'פיתוח',
  technology: 'פתרון טכנולוגי',
  'not-sure': 'עדיין לא ברור',
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}

export function isWebhookConfigured() {
  return Boolean(process.env.CONTACT_WEBHOOK_URL);
}

export async function sendEmail(data: ContactPayload, id?: number) {
  const services = data.services.map((s) => SERVICE_LABELS[s] ?? s).join(', ');
  const rows: [string, string][] = [
    ['שם', data.name],
    ['אימייל', data.email],
    ['טלפון', data.phone || '—'],
    ['שירותים', services],
  ];
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#10131A">
  <h2 style="margin:0 0 12px">פנייה חדשה מהאתר${id ? ` · #${id}` : ''}</h2>
  <table style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 0 4px 16px;color:#5b6070">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
    )
    .join('')}</table>
  <p style="margin:16px 0 4px;color:#5b6070">על הפרויקט:</p>
  <p style="margin:0;white-space:pre-wrap">${escapeHtml(data.message)}</p>
</div>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nעל הפרויקט:\n${data.message}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'BEYOND <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL!.split(',').map((s) => s.trim()),
      reply_to: data.email,
      subject: `פנייה חדשה מהאתר — ${data.name}`,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text().catch(() => '')}`);
}

export async function sendWebhook(data: ContactPayload, id?: number) {
  const body = JSON.stringify({
    type: 'contact.submitted',
    id,
    submittedAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    services: data.services,
    message: data.message,
  });
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const secret = process.env.CONTACT_WEBHOOK_SECRET;
  if (secret) headers['X-Beyond-Signature'] = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
  const res = await fetch(process.env.CONTACT_WEBHOOK_URL!, {
    method: 'POST',
    headers,
    body,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}
