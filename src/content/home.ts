/**
 * Home page copy — Hero, Manifesto (Think · Design · Build), Final CTA.
 */

export const hero = {
  kicker: 'Digital Experience Studio',
  titleLines: ['לא עוד אתר.', 'נוכחות דיגיטלית', 'שעובדת'],
  subtitle:
    'אני מחברת בין אסטרטגיה, אפיון, עיצוב וטכנולוגיה כדי ליצור מוצרים דיגיטליים מרשימים, חכמים ומדויקים.',
  primary: { label: 'בואו נבנה משהו אחר', href: '#contact' },
  secondary: { label: 'לצפייה בעבודות', href: '#work' },
  disciplines: ['Strategy', 'UX', 'UI', 'Development'],
  scrollCue: 'גללו — המסע מתחיל כאן',
} as const;

export const manifesto = {
  kicker: 'Manifesto',
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
  body: 'כל פרויקט מתחיל בשאלות, לא בפיקסלים: מה העסק צריך להשיג, מי המשתמשים שלו, ואיפה נמצאת ההזדמנות שאחרים מפספסים. מהתשובות האלה נגזרים המבנה, העיצוב והקוד — ולכן התוצאה לא רק נראית טוב. היא עובדת.',
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
  kicker: 'Next step',
  en: ['YOUR NEXT DIGITAL STEP', 'STARTS BEYOND.'],
  he: ['העסק שלך יכול להיראות אחרת.', 'בואו נחשוב איך.'],
  button: { label: 'בואו נדבר על הפרויקט', href: '#contact' },
} as const;
