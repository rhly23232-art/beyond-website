/**
 * Global site configuration & navigation.
 * Public contact details are read from environment variables so nothing is
 * hard-coded or invented — leave them empty and the UI simply hides them.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const site = {
  name: 'BEYOND',
  fullName: 'BEYOND — Digital Experience Studio',
  slogan: 'THINK WIDER. BUILD BEYOND.',
  tagline: 'אתר הוא רק ההתחלה. החשיבה היא כל ההבדל.',
  description:
    'BEYOND הוא סטודיו לחוויות דיגיטליות שמחבר אסטרטגיה, אפיון UX, עיצוב UI ופיתוח — כדי לבנות אתרים ומוצרים דיגיטליים מדויקים, חכמים ומרשימים שעובדים בשביל העסק.',
  url: siteUrl.replace(/\/$/, ''),
  locale: 'he_IL',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
} as const;

export type NavItem = { id: string; label: string; en: string };

/** Main navigation (header + mobile menu). */
export const mainNav: NavItem[] = [
  { id: 'approach', label: 'גישה', en: 'Approach' },
  { id: 'services', label: 'שירותים', en: 'Services' },
  { id: 'work', label: 'עבודות', en: 'Work' },
  { id: 'process', label: 'תהליך', en: 'Process' },
  { id: 'faq', label: 'שאלות', en: 'FAQ' },
];

/** Chapters of the scroll journey (progress rail). */
export const chapters: NavItem[] = [
  { id: 'top', label: 'פתיחה', en: 'Intro' },
  { id: 'approach', label: 'גישה', en: 'Approach' },
  { id: 'services', label: 'שירותים', en: 'Services' },
  { id: 'work', label: 'עבודות', en: 'Work' },
  { id: 'why', label: 'למה BEYOND', en: 'Why' },
  { id: 'process', label: 'תהליך', en: 'Process' },
  { id: 'experience', label: 'שירות', en: 'Experience' },
  { id: 'faq', label: 'שאלות', en: 'FAQ' },
  { id: 'contact', label: 'יצירת קשר', en: 'Contact' },
];
