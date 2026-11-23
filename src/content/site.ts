/**
 * Global site configuration & navigation.
 * Contact details and social links are read from environment variables so
 * nothing is hard-coded or invented — leave them empty and the UI hides them.
 */
import { hasPublishedWork } from './projects';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

/** Digits only, international format without "+", e.g. 972501234567. */
const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export const site = {
  name: 'BEYOND',
  fullName: 'BEYOND — Digital Experience Studio',
  slogan: 'THINK WIDER. BUILD BEYOND.',
  tagline: 'אתר הוא רק ההתחלה. החשיבה היא כל ההבדל.',
  description:
    'BEYOND הוא סטודיו לאפיון, עיצוב ופיתוח אתרים ומוצרים דיגיטליים — אסטרטגיה, UX, UI ופיתוח במקום אחד, כדי לבנות אתרים מדויקים שעובדים בשביל העסק.',
  url: siteUrl.replace(/\/$/, ''),
  locale: 'he_IL',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  whatsapp,
  social: [
    { id: 'linkedin', label: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || '' },
    { id: 'instagram', label: 'Instagram', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '' },
    { id: 'behance', label: 'Behance', url: process.env.NEXT_PUBLIC_BEHANCE_URL || '' },
  ].filter((s) => s.url),
} as const;

export function whatsappLink(message: string) {
  return site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}` : '';
}

export type NavItem = { id: string; label: string };

const withWork = <T extends { id: string }>(items: T[]) =>
  items.filter((item) => item.id !== 'work' || hasPublishedWork);

/** Main navigation (header + mobile menu). */
export const mainNav: NavItem[] = withWork([
  { id: 'approach', label: 'גישה' },
  { id: 'services', label: 'שירותים' },
  { id: 'work', label: 'עבודות' },
  { id: 'studio', label: 'מי אני' },
  { id: 'process', label: 'תהליך' },
  { id: 'faq', label: 'שאלות' },
]);

/** Chapters of the scroll journey (progress rail, footer). */
export const chapters: NavItem[] = withWork([
  { id: 'top', label: 'פתיחה' },
  { id: 'approach', label: 'גישה' },
  { id: 'services', label: 'שירותים' },
  { id: 'studio', label: 'מי מאחורי BEYOND' },
  { id: 'work', label: 'עבודות' },
  { id: 'why', label: 'למה BEYOND' },
  { id: 'process', label: 'תהליך' },
  { id: 'experience', label: 'שירות' },
  { id: 'faq', label: 'שאלות' },
  { id: 'contact', label: 'יצירת קשר' },
]);
