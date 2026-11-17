import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { isDatabaseConfigured, listSubmissions, updateSubmissionStatus, type SubmissionRow } from '@/lib/server/db';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'פניות מהאתר',
  robots: { index: false, follow: false },
};

const SERVICE_LABELS: Record<string, string> = {
  strategy: 'אסטרטגיה ואפיון',
  ux: 'UX',
  ui: 'UI',
  'web-design': 'עיצוב אתר',
  development: 'פיתוח',
  technology: 'טכנולוגיה',
  'not-sure': 'לא ברור',
};

async function toggleStatus(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  const next = formData.get('next') === 'handled' ? 'handled' : 'new';
  if (Number.isFinite(id)) await updateSubmissionStatus(id, next);
  revalidatePath('/admin');
}

const fmt = new Intl.DateTimeFormat('he-IL', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Jerusalem' });

/** Leads inbox — protected by Basic auth in src/proxy.ts. */
export default async function AdminPage() {
  let rows: SubmissionRow[] = [];
  let error = '';
  if (isDatabaseConfigured()) {
    try {
      rows = await listSubmissions();
    } catch (e) {
      error = e instanceof Error ? e.message : 'שגיאה לא ידועה';
    }
  }

  const fresh = rows.filter((r) => r.status === 'new').length;

  return (
    <main className={styles.admin} data-theme="light">
      <header className={styles.head}>
        <h1>פניות מהאתר</h1>
        <p>
          {rows.length} פניות · {fresh} חדשות
        </p>
      </header>

      {!isDatabaseConfigured() && (
        <p className={styles.notice}>
          מסד הנתונים לא מחובר עדיין. יש להגדיר את המשתנה <code>DATABASE_URL</code> בסביבת השרת.
        </p>
      )}
      {error && <p className={styles.notice}>לא ניתן לקרוא את הפניות: {error}</p>}

      {rows.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">תאריך</th>
                <th scope="col">שם</th>
                <th scope="col">פרטי קשר</th>
                <th scope="col">שירותים</th>
                <th scope="col">על הפרויקט</th>
                <th scope="col">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} data-status={r.status}>
                  <td className="en">{r.id}</td>
                  <td>{fmt.format(new Date(r.created_at))}</td>
                  <td>
                    <strong>{r.name}</strong>
                  </td>
                  <td>
                    <a href={`mailto:${r.email}`} className="ltr">
                      {r.email}
                    </a>
                    {r.phone && (
                      <>
                        <br />
                        <a href={`tel:${r.phone}`} className="ltr">
                          {r.phone}
                        </a>
                      </>
                    )}
                  </td>
                  <td>{r.services.map((s) => SERVICE_LABELS[s] ?? s).join(', ')}</td>
                  <td className={styles.msg}>{r.message}</td>
                  <td>
                    <form action={toggleStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="next" value={r.status === 'new' ? 'handled' : 'new'} />
                      <button type="submit" className={styles.status}>
                        {r.status === 'new' ? 'חדשה · סמנו כטופלה' : 'טופלה · החזירו לחדשה'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isDatabaseConfigured() && !error && rows.length === 0 && <p className={styles.notice}>עדיין אין פניות.</p>}
    </main>
  );
}
