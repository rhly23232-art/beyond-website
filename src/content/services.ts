/**
 * What We Create — six service modules.
 * Each module has its own title, explanation, business value and a dedicated
 * interactive graphic (see components/sections/services/graphics).
 */

export type ServiceGraphic = 'matrix' | 'journey' | 'system' | 'layout' | 'code' | 'network';

export type Service = {
  id: string;
  index: string;
  short: string;
  category: string;
  title: string;
  description: string;
  benefit: string;
  graphic: ServiceGraphic;
  hint: string;
  /** Value used to pre-select this service in the contact form. */
  formValue: string;
};

export const servicesIntro = {
  kicker: 'What We Create',
  titleLines: ['מהשאלה הראשונה', 'ועד השורה האחרונה בקוד.'],
  lead: 'שישה תחומים שעובדים כמערכת אחת. אפשר להתחיל מכל אחד מהם — אבל הכוח האמיתי נמצא בחיבור ביניהם.',
};

export const services: Service[] = [
  {
    id: 'strategy',
    index: '01',
    short: 'אסטרטגיה',
    category: 'אסטרטגיה ואפיון דיגיטלי',
    title: 'קודם מבינים. אחר כך מתכננים.',
    description:
      'מיפוי מטרות, קהלים ומתחרים, והגדרה של מה האתר או המוצר צריכים להשיג. מכאן נגזרים המבנה, היררכיית התוכן והפונקציונליות — במסמך אפיון ברור שכל הצדדים מבינים.',
    benefit: 'כל החלטה בהמשך נשענת על מטרה עסקית ולא על טעם אישי — פחות סבבי תיקונים, יותר תוצאות.',
    graphic: 'matrix',
    hint: 'הזיזו את העכבר כדי למצוא את נקודת המיצוב',
    formValue: 'strategy',
  },
  {
    id: 'ux',
    index: '02',
    short: 'UX',
    category: 'UX — חוויית משתמש ותכנון מסעות',
    title: 'מסע בלי נקודות עיוורות.',
    description:
      'תכנון הדרך שהמשתמש עובר, מהרגע שהוא נוחת ועד שהוא פועל: זרימות, מבנה ניווט ו-Wireframes שבודקים כל צומת החלטה — לפני שמשקיעים בעיצוב.',
    benefit: 'משתמשים מוצאים את מה שהם מחפשים ומתקדמים לפעולה — יותר פניות, פחות נטישה.',
    graphic: 'journey',
    hint: 'הזיזו את העכבר לאורך המסע',
    formValue: 'ux',
  },
  {
    id: 'ui',
    index: '03',
    short: 'UI',
    category: 'UI — מערכות עיצוב וממשקים',
    title: 'מערכת, לא אוסף מסכים.',
    description:
      'שפה חזותית שנבנית כמערכת: צבעים, טיפוגרפיה, רכיבים ומצבים. כל מסך חדש נולד מאותם חוקים — ולכן המוצר נשאר עקבי גם כשהוא גדל.',
    benefit: 'מראה מקצועי ואחיד שמייצר אמון, ופיתוח מהיר יותר של כל עמוד או פיצ׳ר עתידי.',
    graphic: 'system',
    hint: 'הזיזו את העכבר כדי לשנות טוקן אחד — ולראות את כל המערכת מתעדכנת',
    formValue: 'ui',
  },
  {
    id: 'web',
    index: '04',
    short: 'עיצוב אתרים',
    category: 'עיצוב אתרים',
    title: 'קומפוזיציה שמובילה את העין.',
    description:
      'עמודים שמספרים סיפור: היררכיה ברורה, טיפוגרפיה עם אופי ותנועה שמחזקת את המסר במקום להסיח ממנו. כל עמוד מתוכנן לדסקטופ ולמובייל — כל אחד לגופו.',
    benefit: 'רושם ראשוני חזק שמבדל אתכם מהמתחרים, ומוביל את המבקר בדיוק לאן שצריך.',
    graphic: 'layout',
    hint: 'עברו עם העכבר בין הקומפוזיציות',
    formValue: 'web-design',
  },
  {
    id: 'dev',
    index: '05',
    short: 'פיתוח',
    category: 'פיתוח אתרים ומוצרים דיגיטליים',
    title: 'קוד נקי. מהיר. מוכן לגדול.',
    description:
      'פיתוח בטכנולוגיות מודרניות, עם רכיבים מודולריים, ביצועים גבוהים ונגישות כבר מהיסוד. האתר נבנה כך שיהיה קל לתחזק, לעדכן ולהרחיב.',
    benefit: 'אתר שנטען מהר, מתאים למנועי חיפוש ולא דורש בנייה מחדש בכל שינוי.',
    graphic: 'code',
    hint: 'רחפו מעל שורות הקוד כדי לראות מה הן בונות',
    formValue: 'development',
  },
  {
    id: 'tech',
    index: '06',
    short: 'טכנולוגיה',
    category: 'פתרונות טכנולוגיים מתקדמים',
    title: 'הטכנולוגיה הנכונה לבעיה הנכונה.',
    description:
      'מערכות ניהול תוכן, אינטגרציות, אוטומציות, אזורים אישיים וכלים מבוססי AI — לפי מה שהפרויקט באמת צריך. בלי להעמיס, ובלי להתפשר על מה שחשוב.',
    benefit: 'תהליכים שרצים לבד, מערכות שמדברות זו עם זו, וזמן שמתפנה לעסק עצמו.',
    graphic: 'network',
    hint: 'רחפו מעל רכיב כדי לראות את החיבורים שלו',
    formValue: 'technology',
  },
];
