import type { ReactNode } from 'react';
import { Footer } from './Footer';
import styles from './LegalPage.module.css';

/** Shared layout for text pages (accessibility statement, privacy policy). */
export function LegalPage({ kicker, title, updated, children }: { kicker: string; title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <main id="main" tabIndex={-1} className={`section ${styles.page}`} data-theme="light">
        <article className={`container ${styles.article}`}>
          <header className={styles.header}>
            <p className="kicker">
              <span className="mark" aria-hidden="true" />
              <span className="en">{kicker}</span>
            </p>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.updated}>עודכן לאחרונה: {updated}</p>
          </header>
          <div className={styles.body}>{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
