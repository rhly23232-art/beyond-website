# BEYOND — Digital Experience Studio

**THINK WIDER. BUILD BEYOND.**

אתר הבית של BEYOND: Next.js 16 (App Router) · TypeScript · CSS Modules · GSAP + ScrollTrigger · Lenis.
עברית מלאה (RTL), נגיש, מותאם למובייל, עם מערכת תנועה עשירה שמכבדת "הפחתת תנועה".

---

## הרצה מקומית

```bash
npm install
cp .env.example .env.local   # ולמלא את מה שצריך
npm run dev                  # http://localhost:3000
```

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | שרת פיתוח |
| `npm run build` / `npm start` | בנייה והרצה בפרודקשן |
| `npm run typecheck` / `npm run lint` | בדיקות טיפוסים ו-ESLint |
| `npm run brand` | מחולל מחדש את קובצי הלוגו (SVG) מהגאומטריה |
| `node scripts/build-images.mjs` | מחולל מחדש OG, אייקונים ו-favicon (דורש Playwright) |

---

## מבנה

```
src/
  app/                 עמודים, layout, SEO (robots / sitemap / manifest), API
    api/contact/       קבלת פניות — ולידציה, אחסון במסד ושליחת התראות
    admin/             תיבת הפניות (מוגנת בסיסמה)
    accessibility/     הצהרת נגישות
    privacy/           מדיניות פרטיות
  content/             כל הטקסטים והנתונים — מופרדים מהממשק
  components/
    brand/             לוגו וסמל (SVG וקטורי)
    layout/            Header, תפריט מובייל, Footer, מחוון התקדמות
    ui/                Button, SectionHeading, GridLines, Cursor
    sections/          כל אזורי העמוד (Intro, Hero … Contact)
  lib/                 GSAP, העדפות תנועה, ולידציית טופס, שכבת שרת (db / notify)
  styles/tokens.css    מערכת העיצוב: צבעים, טיפוגרפיה, ריווח (8px), גריד 12/8/4
public/brand/          קובצי הלוגו: מלא, בהיר/כהה, מונוכרומטי, סמל, favicon
db/schema.sql          סכמת טבלת הפניות
```

## עריכת תוכן

כל הטקסטים נמצאים ב-`src/content/`:
`home.ts` (Hero, מניפסט, סיום) · `services.ts` · `projects.ts` · `about.ts` (למה BEYOND, תהליך, חוויית שירות, שאלות, טופס) · `site.ts` (ניווט ופרטי אתר).

### הוספת פרויקטים אמיתיים

באתר מוצגות כרגע **תבניות** (`status: 'template'`) — לא הומצאו פרויקטים, לקוחות או תוצאות.
להוספת פרויקט אמיתי ב-`src/content/projects.ts`:

1. שומרים תמונות ב-`public/work/<slug>/` — `desktop.webp` (≈2880×1800), `mobile.webp` (≈1170×2532), `cover.webp` (≈2400×1500).
2. ממלאים שם, תחום, אתגר, פתרון וחשיבה עיצובית, ומגדירים `status: 'published'`.
3. את `result` מוסיפים **רק** כשיש נתון אמיתי — אחרת הוא פשוט לא מוצג.
4. בוחרים `layout`: `wide` (דסקטופ + מובייל), `mobile` (שלושה מסכי מובייל) או `split` (תמונת שער + דסקטופ).

ברגע שקיים פרויקט אחד שפורסם — התבניות נעלמות אוטומטית.

---

## טופס יצירת קשר ומסד נתונים

כל פנייה עוברת ולידציה בדפדפן **ובשרת**, ומוצגת הודעת הצלחה רק אחרי אישור מהשרת.
אפשר להגדיר ערוץ אחד או יותר (ב-`.env.local` או בהגדרות האחסון):

| ערוץ | משתנים | הערות |
|---|---|---|
| **מסד נתונים (מומלץ)** | `DATABASE_URL` | כל Postgres: Neon, Supabase, Railway. הטבלה נוצרת אוטומטית בפנייה הראשונה (או ידנית מ-`db/schema.sql`). |
| אימייל (Resend) | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | השולח צריך להיות בדומיין מאומת ב-Resend. |
| Webhook | `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET` | JSON לכל פנייה, עם חתימת HMAC אופציונלית. |

אם לא הוגדר אף ערוץ — הטופס מחזיר שגיאה כנה ולא "הצלחה" מזויפת.
הגנות: honeypot, זיהוי שליחה מהירה מדי, הגבלת קצב לכל IP, ושמירת IP כגיבוב חד-כיווני בלבד.

### תיבת הפניות — `/admin`

מגדירים `ADMIN_PASSWORD` (ו-`ADMIN_USER`, ברירת מחדל `admin`) ונכנסים ל-`/admin`:
רשימת כל הפניות מהמסד, עם סימון "טופלה / חדשה". בלי סיסמה העמוד לא קיים (404).

---

## עלייה לאוויר (Vercel + Neon)

1. מעלים את הקוד ל-GitHub ומייבאים ב-[vercel.com/new](https://vercel.com/new) (הגדרות ברירת המחדל מתאימות).
2. בפרויקט ב-Vercel: **Storage → Create Database → Neon (Postgres)** ומחברים לפרויקט — `DATABASE_URL` נוסף אוטומטית.
3. ב-**Settings → Environment Variables** מוסיפים: `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `IP_HASH_SALT`, ואם רוצים גם התראות במייל — משתני Resend.
4. **Redeploy** — והאתר באוויר. דומיין משלכם מחברים תחת **Settings → Domains**.

---

## נגישות ותנועה

- ניווט מלא במקלדת, "דלגו לתוכן", פוקוס ברור, היררכיית כותרות, תוויות והודעות שגיאה נגישות בטופס.
- `prefers-reduced-motion` מכובד במלואו, ויש מתג "הפחתת תנועה" בפוטר: בלי פתיחה, בלי נעיצות, בלי גלילה חלקה — וכל התוכן זמין.
- סצנות נעוצות וגלילה אופקית פועלות בדסקטופ בלבד. במובייל יש קומפוזיציות ייעודיות שלא חוסמות את הגלילה.

## המותג

הלוגו נבנה לפי הקונספט: לוגוטייפ BEYOND ב-Space Grotesk Bold (מומר לקווי מתאר) וסמל של מסגרת פתוחה, חץ שיוצא החוצה וריבוע Signal Lime.
אם יש קובץ וקטורי מקורי ממצגת המיתוג — אפשר להחליף את הגאומטריה ב-`scripts/build-brand.mjs` ולהריץ `npm run brand`.
