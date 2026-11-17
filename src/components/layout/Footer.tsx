'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';
import { chapters, site } from '@/content/site';
import { services } from '@/content/services';
import { LOGOTYPE } from '@/components/brand/logo-data';
import { useScrollTo } from '@/components/motion/SmoothScroll';
import { MotionToggle } from './MotionToggle';
import { Arrow } from '@/components/ui/Arrow';
import styles from './Footer.module.css';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      if (isMotionReduced()) return;
      const q = gsap.utils.selector(ref);
      gsap.from(q(`.${styles.glyph}`), {
        yPercent: 105,
        stagger: 0.05,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: q(`.${styles.wordmark}`)[0], start: 'top 95%', once: true },
      });
    },
    { scope: ref },
  );

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!document.getElementById(id)) return; // other pages: navigate to /#id
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <footer ref={ref} className={`section ${styles.footer}`} data-theme="dark">
      <div className="container">
        <div className={styles.top}>
          <p className={styles.statement}>
            אתר הוא רק ההתחלה.
            <br />
            <span>החשיבה היא כל ההבדל.</span>
          </p>
          <Link href="/#top" className={styles.backTop} onClick={(e) => jump(e, 'top')}>
            <span>חזרה למעלה</span>
            <Arrow direction="up" className={styles.backArrow} />
          </Link>
        </div>

        <div className={styles.cols}>
          <nav aria-label="ניווט בכותרת התחתונה" className={styles.col}>
            <h2 className={styles.colTitle}>ניווט</h2>
            <ul role="list">
              {chapters.slice(1).map((c) => (
                <li key={c.id}>
                  <Link href={`/#${c.id}`} className={styles.link} onClick={(e) => jump(e, c.id)}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>מה יוצרים</h2>
            <ul role="list">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href="/#services" className={styles.link} onClick={(e) => jump(e, 'services')}>
                    {s.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>יצירת קשר</h2>
            <ul role="list">
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className={`${styles.link} ltr`}>
                    {site.email}
                  </a>
                </li>
              )}
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} className={`${styles.link} ltr`}>
                    {site.phone}
                  </a>
                </li>
              )}
              <li>
                <Link href="/#contact" className={styles.link} onClick={(e) => jump(e, 'contact')}>
                  טופס פנייה
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>מידע</h2>
            <ul role="list">
              <li>
                <Link href="/accessibility" className={styles.link}>
                  הצהרת נגישות
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.link}>
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <MotionToggle className={styles.link} />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.wordmark} aria-hidden="true">
        <svg viewBox={`0 ${LOGOTYPE.top} ${LOGOTYPE.width} ${LOGOTYPE.height}`} className={styles.wordSvg}>
          <defs>
            <clipPath id="footer-wordmark-clip">
              <rect x={-2} y={LOGOTYPE.top - 1} width={LOGOTYPE.width + 4} height={LOGOTYPE.height + 2} />
            </clipPath>
          </defs>
          <g clipPath="url(#footer-wordmark-clip)">
            {LOGOTYPE.glyphs.map((g, i) => (
              <path key={i} className={styles.glyph} d={g.d} />
            ))}
          </g>
        </svg>
      </div>

      <div className="container">
        <div className={styles.bottom}>
          <p>
            © {year} <span className="en">{site.fullName}</span>
          </p>
          <p className="en">{site.slogan}</p>
        </div>
      </div>
    </footer>
  );
}
