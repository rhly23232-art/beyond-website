/**
 * Home page copy — Hero, Manifesto (Think · Design · Build), Final CTA.
 */

export const hero = {
  kicker: 'סטודיו לאפיון, עיצוב ופיתוח אתרים',
  titleLines: ['לא עוד אתר.', 'נוכחות דיגיטלית', 'שעובדת'],
  audience: 'לעסקים שרוצים שהאתר יעבוד בשבילם: יביא פניות, יבנה אמון ויוביל לפעולה.',
  author: {
    name: 'נעמי מן',
    role: 'מפתחת ומעצבת UX/UI · פיתוח אינטראקטיבי בשילוב AI',
  },
  subtitle:
    'אני מחברת בין אסטרטגיה, אפיון, עיצוב וטכנולוגיה כדי ליצור מוצרים דיגיטליים מרשימים, חכמים ומדויקים.',
  primary: { label: 'בואו נבנה משהו אחר', href: '#contact' },
  secondary: { label: 'לתיק העבודות', href: '#work' },
  /** Used while the portfolio has no published projects yet. */
  secondaryFallback: { label: 'איך אני עובדת', href: '#approach' },
  disciplines: ['אסטרטגיה', 'UX', 'UI', 'פיתוח'],
  scrollCue: 'גללו — המסע מתחיל כאן',
} as const;

export const manifesto = {
  kicker: 'הגישה',
  statement: [
    { text: 'אתר' },
    { text: 'הוא' },
    { text: 'רק' },
    { text: 'ההתחלה.', tone: 'cobalt' },
    { text: 'החשיבה', tone: 'strong' },
    { text: 'היא' },
    { text: 'כל' },
    { text: 'ההבדל.', tone: 'lime' },
  ],
  body: 'אצלי כל פרויקט מתחיל בשאלות, לא בפיקסלים: מה העסק צריך להשיג, מי המשתמשים שלו, ואיפה נמצאת ההזדמנות שאחרים מפספסים. מהתשובות האלה נגזרים המבנה, העיצוב והקוד — ולכן התוצאה לא רק נראית טוב. היא עובדת.',
  stepsIntro: 'Think. Design. Build.',
  steps: [
    {
      id: 'think',
      word: 'THINK',
      index: '01',
      headline: 'מבינים את העסק, המטרות, המשתמשים וההזדמנויות.',
      body: 'לפני שמשרטטים מסך אחד, ממפים את התמונה המלאה: מה המטרה העסקית, מי הקהל, מה קורה בשוק — ואיפה נמצא היתרון שלכם.',
      tags: ['מטרות עסקיות', 'קהלי יעד', 'מיפוי שוק', 'הזדמנויות'],
    },
    {
      id: 'design',
      word: 'DESIGN',
      index: '02',
      headline: 'מתרגמים את החשיבה לחוויה מדויקת, שימושית וייחודית.',
      body: 'המבנה הופך למסע משתמש, המסע הופך לממשק, והממשק מקבל שפה חזותית שאי אפשר לבלבל עם אף אחד אחר.',
      tags: ['אפיון', 'מסעות משתמש', 'מערכת עיצוב', 'שפה חזותית'],
    },
    {
      id: 'build',
      word: 'BUILD',
      index: '03',
      headline: 'הופכים את הרעיון למוצר דיגיטלי עובד ברמה גבוהה.',
      body: 'קוד נקי, ביצועים גבוהים, נגישות ו-SEO כבר מהיסוד — ומוצר שמוכן לגדול יחד עם העסק.',
      tags: ['פיתוח', 'ביצועים', 'נגישות', 'השקה'],
    },
  ],
} as const;

export const finalCta = {
  kicker: 'הצעד הבא',
  he: ['העסק שלך יכול', 'להיראות אחרת.', 'בואו נחשוב איך.'],
  en: 'YOUR NEXT DIGITAL STEP STARTS BEYOND.',
  button: { label: 'בואו נדבר על הפרויקט', href: '#contact' },
  note: 'שיחת היכרות קצרה, בלי התחייבות.',
} as const;
