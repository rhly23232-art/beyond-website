/**
 * Contact form schema — shared by the client (instant feedback) and the API
 * route (authoritative validation). No external dependency needed.
 */

/** Window event used by "let's talk about…" links to pre-select a service. */
export const SERVICE_EVENT = 'beyond:select-service';

export const SERVICE_VALUES = [
  'strategy',
  'ux',
  'ui',
  'web-design',
  'development',
  'technology',
  'not-sure',
] as const;

export type ServiceValue = (typeof SERVICE_VALUES)[number];

/** Optional qualification fields (labels live in content/about.ts). */
export const BUDGET_VALUES = ['up-to-10k', '10-25k', '25-50k', '50k-plus', 'unknown'] as const;
export const TIMELINE_VALUES = ['asap', '1-month', '1-3-months', 'flexible'] as const;
export type BudgetValue = (typeof BUDGET_VALUES)[number];
export type TimelineValue = (typeof TIMELINE_VALUES)[number];

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  services: ServiceValue[];
  message: string;
  budget?: BudgetValue;
  timeline?: TimelineValue;
  /** Honeypot — must stay empty. */
  company?: string;
  /** ms since the form was rendered — rejects instant bot submissions. */
  elapsed?: number;
};

export type ContactField = 'name' | 'email' | 'phone' | 'services' | 'message';
export type ContactErrorCode = 'name' | 'email' | 'phone' | 'services' | 'message' | 'messageLong';
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

export const LIMITS = { name: 120, email: 254, phone: 32, message: 3000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export function normalise(input: Partial<ContactPayload>): ContactPayload {
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const services = Array.isArray(input.services)
    ? (input.services.filter((s): s is ServiceValue =>
        (SERVICE_VALUES as readonly string[]).includes(s as string),
      ) as ServiceValue[])
    : [];
  const pick = <T extends string>(v: unknown, allowed: readonly T[]) =>
    typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
  return {
    name: str(input.name, LIMITS.name),
    email: str(input.email, LIMITS.email),
    phone: str(input.phone, LIMITS.phone),
    services: Array.from(new Set(services)),
    message: typeof input.message === 'string' ? input.message.trim() : '',
    budget: pick(input.budget, BUDGET_VALUES),
    timeline: pick(input.timeline, TIMELINE_VALUES),
    company: str(input.company, 200),
    elapsed: typeof input.elapsed === 'number' ? input.elapsed : undefined,
  };
}

export function validateField(field: ContactField, data: ContactPayload): ContactErrorCode | null {
  switch (field) {
    case 'name':
      return data.name.length >= 2 ? null : 'name';
    case 'email':
      return EMAIL_RE.test(data.email) ? null : 'email';
    case 'phone': {
      if (!data.phone) return null;
      const digits = data.phone.replace(/\D/g, '');
      return PHONE_RE.test(data.phone) && digits.length >= 9 && digits.length <= 15 ? null : 'phone';
    }
    case 'services':
      return data.services.length > 0 ? null : 'services';
    case 'message':
      if (data.message.length < 10) return 'message';
      if (data.message.length > LIMITS.message) return 'messageLong';
      return null;
  }
}

export function validateContact(data: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  (['name', 'email', 'phone', 'services', 'message'] as const).forEach((f) => {
    const e = validateField(f, data);
    if (e) errors[f] = e;
  });
  return errors;
}
