/**
 * Selected Work — project data model.
 *
 * The three published projects are self-initiated CONCEPT projects (marked
 * `concept: true` and labelled on the site). No clients, results or
 * testimonials are invented: `result` is left empty on purpose.
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
 * Templates are never rendered. The Work section, its navigation link and the
 * hero's "view work" button appear automatically once one project is published.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** A live prototype rendered in place of a screenshot (no raster images). */
export type ProjectEmbed = {
  embed: string;
  title: string;
};

export type ProjectMedia = ProjectImage | ProjectEmbed;

export const isEmbed = (m?: ProjectMedia): m is ProjectEmbed => !!m && 'embed' in m;

export type ProjectLayout = 'wide' | 'split' | 'mobile';

export type ProjectAccent = 'cobalt' | 'lime' | 'mist' | 'brass' | 'indigo' | 'tangerine';

export type Project = {
  slug: string;
  status: 'published' | 'template';
  name: string;
  sector: string;
  year?: string;
  /** Shown on every panel: what the project is, in two or three sentences. */
  summary?: string;
  /** The full case study. */
  href?: string;
  /** Marks self-initiated concept work (no client). */
  concept?: boolean;
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
    desktop?: ProjectMedia;
    mobile?: ProjectMedia;
    cover?: ProjectMedia;
    /** Three phones for the 'mobile' layout (falls back to `mobile`). */
    phones?: ProjectMedia[];
  };
};

export const workIntro = {
  kicker: 'תיק עבודות',
  title: 'תיק עבודות',
  lead: 'שלושה פרויקטים משלושה עולמות: אתר תדמית, מערכת AI מורכבת ומוצר סטארטאפ. כל אחד מהם מתחיל באתגר ומסתיים במוצר שעובד. המסכים כאן הם אבות הטיפוס עצמם, חיים, ולא צילומי מסך.',
  dragHint: 'גללו כדי לנוע בין הפרויקטים',
  next: {
    kicker: 'הפרויקט הבא',
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
    desktop: 'מחשב',
    mobile: 'נייד',
    template: 'תבנית לפרויקט',
    visit: 'לאתר החי',
    view: 'לצפייה בפרויקט המלא',
    concept: 'פרויקט קונספט',
  },
};

export const projects: Project[] = [
  {
    slug: 'kav',
    status: 'published',
    concept: true,
    name: 'KAV',
    sector: 'אתר תדמית · סדנת שעונים ירושלמית',
    summary:
      'אתר תדמית לסדנת שעונים מכניים, בלי צילום אחד. השעון מצויר בקוד ומראה את השעה האמיתית בירושלים, המנגנון מתפרק לשכבות בגלילה, ומגדיר דגמים חי מוביל לקביעת ביקור בסדנה.',
    href: '/work/kav',
    disciplines: ['Brand Experience', 'UX', 'UI', 'Creative Dev'],
    challenge:
      'סדנה קטנה שמייצרת 30 שעונים בשנה צריכה להיראות ברשת כמו בית שעונים ותיק, בלי תקציב צילום. במוצר במחיר כזה המכירה קורית בפגישה, ולכן האתר צריך להביא את המבקר לסדנה.',
    solution:
      'חוויית גלילה אחת: שעון גנרטיבי חי, פירוק תלת-ממדי של המנגנון, קולקציה, מגדיר עם מחיר שקוף וחריטה, ולוח זמנים לקביעת ביקור.',
    thinking:
      'המגבלה הפכה לרעיון: בלי צילומים, השעון באתר הוא המוצר עצמו. הוא חי, מדויק ומראה את הזמן האמיתי. תנועה איטית ושקט טיפוגרפי משדרים יוקרה.',
    layout: 'wide',
    accent: 'brass',
    media: {
      desktop: { embed: '/prototypes/kav/index.html?embed=1', title: 'KAV: אתר התדמית' },
      mobile: { embed: '/prototypes/kav/index.html?embed=1', title: 'KAV במובייל' },
    },
  },
  {
    slug: 'moked',
    status: 'published',
    concept: true,
    name: 'מוקד',
    sector: 'מערכת AI · ניהול מוקד עירוני',
    summary:
      'מערכת לניהול מוקד עירוני שבה ה-AI מסווג ומתעדף כל פנייה ומסביר למה. היא מזהה כפילויות, מציעה צוות ומנסחת תשובה לתושב, וההחלטה נשארת תמיד אצל האדם.',
    href: '/work/moked',
    disciplines: ['System Design', 'AI UX', 'Data Viz', 'UI'],
    challenge:
      'מאות פניות ביום מכמה ערוצים, סיווג ידני וכפילויות ששולחות כמה צוותים לאותו מפגע. וכשמכניסים AI, צריך לענות על שאלה חדשה: איך סומכים על החלטה שלא מבינים?',
    solution:
      'שישה מסכים: מרכז שליטה עם מפה חיה, תור פניות עם ניתוח AI מוסבר, שיבוץ בגרירה, ניתוח נתונים עם תחזית, עוזר AI שעונה עם מקור, ומסך מדיניות שקובע מה מותר לאוטומציה.',
    thinking:
      'ב-AI UX המסך החשוב הוא זה שמסביר את ההחלטה. לכן כל סיווג מגיע עם פירוק גורמים וסימון הביטויים בהודעה המקורית, והגרדיאנט הסגול שמור רק לתוכן שה-AI יצר.',
    layout: 'split',
    accent: 'indigo',
    media: {
      cover: { embed: '/prototypes/moked/index.html?embed=1&view=overview&theme=dark', title: 'מוקד: מרכז שליטה במצב כהה' },
      desktop: { embed: '/prototypes/moked/index.html?embed=1&view=inbox', title: 'מוקד: תור פניות וניתוח AI' },
    },
  },
  {
    slug: 'gemachy',
    status: 'published',
    concept: true,
    name: 'גמ״חי',
    sector: 'מוצר סטארטאפ · אפליקציית מובייל',
    summary:
      'אפליקציה שמחברת בין משפחות לגמ״חים בשכונה: חיפוש לפי מרחק וזמינות, בקשת השאלה בשלוש לחיצות, כרטיס איסוף עם קוד ותזכורות החזרה. ממשק צבעוני, כיף וברור.',
    href: '/work/gemachy',
    disciplines: ['Product Strategy', 'Mobile UX', 'UI', 'Illustration'],
    challenge:
      'אלפי גמ״חים פועלים על פתקים וטלפונים. קשה לדעת מה קיים ומתי, המפעילים מתמודדים עם שיחות ופריטים שלא חוזרים, ומרקטפלייס דו-צדדי צריך לשכנע את שני הצדדים.',
    solution:
      'MVP עם 9 מסכים: היכרות, בית, חיפוש ומפה, עמוד פריט, בקשה בגיליון תחתון, אישור עם קוד, ההשאלות שלי, פרופיל השפעה והוספת פריט בשתי דקות.',
    thinking:
      'בלי צילומי משתמשים: ספריית איורים אחידה מייצרת שפה מותגית, שומרת על פרטיות ומתאימה לכל קהל. אמון נבנה מהתנהגות, כמו זמן תגובה והחזרה בזמן, ולא מדירוג כוכבים.',
    layout: 'mobile',
    accent: 'tangerine',
    media: {
      phones: [
        { embed: '/prototypes/gemachy/index.html?bare=1&screen=search', title: 'גמ״חי: חיפוש' },
        { embed: '/prototypes/gemachy/index.html?bare=1&screen=home', title: 'גמ״חי: בית' },
        { embed: '/prototypes/gemachy/index.html?bare=1&screen=item', title: 'גמ״חי: עמוד פריט' },
      ],
    },
  },
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

/** Only real, published case studies are ever shown on the site. */
export function getPublishedProjects(): Project[] {
  return projects.filter((p) => p.status === 'published');
}

/** The Work section (and every link to it) exists only once a real project is published. */
export const hasPublishedWork = projects.some((p) => p.status === 'published');
