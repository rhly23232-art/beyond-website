/**
 * Selected Work — project data model.
 *
 * IMPORTANT: no projects, clients, results or testimonials are invented here.
 * The entries below are TEMPLATES (status: 'template') that demonstrate every
 * layout the Work section supports. Replace them with real case studies:
 *
 *   1. Put images in /public/work/<slug>/ (desktop.webp ≈ 2880×1800,
 *      mobile.webp ≈ 1170×2532, cover.webp ≈ 2400×1500).
 *   2. Fill in the fields, set `status: 'published'`.
 *   3. Add `result` ONLY when real, verifiable data exists — otherwise omit it
 *      and the "value" block is not rendered.
 *
 * Templates are hidden automatically once at least one published project
 * exists (see `getWorkItems`).
 */

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectLayout = 'wide' | 'split' | 'mobile';

export type ProjectAccent = 'cobalt' | 'lime' | 'mist';

export type Project = {
  slug: string;
  status: 'published' | 'template';
  name: string;
  sector: string;
  year?: string;
  disciplines: string[];
  challenge: string;
  solution: string;
  thinking: string;
  /** Only with real, verifiable data. */
  result?: string;
  /** Optional external link to the live product. */
  url?: string;
  layout: ProjectLayout;
  accent: ProjectAccent;
  media: {
    desktop?: ProjectImage;
    mobile?: ProjectImage;
    cover?: ProjectImage;
  };
};

export const workIntro = {
  kicker: 'Selected Work',
  title: 'עבודות נבחרות',
  lead: 'כל פרויקט כאן מתחיל באתגר עסקי ומסתיים במוצר שעובד. מאחורי כל מסך יש החלטה — וכאן רואים גם אותה.',
  dragHint: 'גללו כדי לנוע בין הפרויקטים',
  next: {
    kicker: 'Next case',
    title: 'הפרויקט הבא יכול להיות שלכם.',
    body: 'יש לכם אתגר שמחכה לחשיבה רחבה וביצוע מדויק? בואו נתחיל לשרטט אותו יחד.',
    button: 'בואו נדבר',
  },
  labels: {
    challenge: 'האתגר',
    solution: 'הפתרון',
    thinking: 'החשיבה העיצובית',
    result: 'הערך העסקי',
    open: 'החשיבה מאחורי הפרויקט',
    close: 'סגירה',
    desktop: 'Desktop',
    mobile: 'Mobile',
    template: 'תבנית לפרויקט',
    visit: 'לאתר החי',
  },
};

export const projects: Project[] = [
  {
    slug: 'case-01',
    status: 'template',
    name: 'שם הפרויקט',
    sector: 'תחום הפעילות',
    disciplines: ['Strategy', 'UX', 'UI', 'Development'],
    challenge: 'כאן יתואר האתגר העסקי: מה לא עבד, למי, ומה היה צריך להשתנות.',
    solution: 'כאן יתואר הפתרון: מה נבנה, עבור איזה קהל ובאיזה היקף.',
    thinking: 'כאן תוצג ההחלטה העיצובית המרכזית — ולמה דווקא היא.',
    layout: 'wide',
    accent: 'cobalt',
    media: {},
  },
  {
    slug: 'case-02',
    status: 'template',
    name: 'שם הפרויקט',
    sector: 'תחום הפעילות',
    disciplines: ['UX', 'UI', 'Mobile'],
    challenge: 'כאן יתואר האתגר: נקודת הפתיחה, המגבלות והמטרה.',
    solution: 'כאן יתואר הפתרון ואיך הוא עונה על כל אחת מהמטרות.',
    thinking: 'כאן תוסבר החשיבה: מסע המשתמש, ההיררכיה והשפה החזותית.',
    layout: 'mobile',
    accent: 'lime',
    media: {},
  },
  {
    slug: 'case-03',
    status: 'template',
    name: 'שם הפרויקט',
    sector: 'תחום הפעילות',
    disciplines: ['Strategy', 'Web Design', 'Development'],
    challenge: 'כאן יתואר האתגר העסקי בשניים־שלושה משפטים.',
    solution: 'כאן יתואר הפתרון — המבנה, הטכנולוגיה והחוויה.',
    thinking: 'כאן תוצג ההחלטה שהפכה את הפרויקט לשונה מכל השאר.',
    layout: 'split',
    accent: 'mist',
    media: {},
  },
];

/** Published projects win; templates are shown only while none exist. */
export function getWorkItems(): Project[] {
  const published = projects.filter((p) => p.status === 'published');
  return published.length > 0 ? published : projects;
}
