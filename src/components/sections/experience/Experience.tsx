'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';
import { experience } from '@/content/about';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Experience.module.css';

/**
 * H. Client Experience — "יש…" lines gain weight and colour as they are read,
 * while an example weekly update card ticks itself off alongside.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const card = q(`.${styles.card}`)[0] as HTMLElement;
      const lines = q(`.${styles.line}`);

      if (isMotionReduced()) {
        card.dataset.step = '4';
        return;
      }

      lines.forEach((line) => {
        const yesh = line.querySelector(`.${styles.yesh}`);
        const text = line.querySelector(`.${styles.text}`);
        const note = line.querySelector(`.${styles.note}`);
        const tick = line.querySelector(`.${styles.tick}`);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: line, start: 'top 82%', end: 'top 48%', scrub: 0.5 },
        });
        tl.fromTo(yesh, { fontWeight: 200, opacity: 0.35 }, { fontWeight: 900, opacity: 1 }, 0)
          .fromTo(text, { opacity: 0.18, x: 30 }, { opacity: 1, x: 0 }, 0)
          .fromTo(note, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.4)
          .fromTo(tick, { scale: 0, rotate: -90 }, { scale: 1, rotate: 0 }, 0.6);
      });

      gsap.to(card, {
        ease: 'none',
        scrollTrigger: {
          trigger: q(`.${styles.lines}`)[0],
          start: 'top 60%',
          end: 'bottom 55%',
          onUpdate: (self) => {
            card.dataset.step = String(Math.min(4, Math.floor(self.progress * 5)));
          },
        },
      });

      gsap.from(card, {
        y: 60,
        rotate: -2,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      });
    },
    { scope: root },
  );

  const u = experience.update;

  return (
    <section id="experience" ref={root} className={`section ${styles.experience}`} data-theme="wash" aria-labelledby="experience-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          <SectionHeading
            id="experience-title"
           
            kicker={experience.kicker}
            titleLines={experience.titleLines}
            lead={experience.lead}
            reveal="skew"
            mark
          />

          <ul role="list" className={styles.lines}>
            {experience.promises.map((p) => (
              <li key={p.text} className={styles.line}>
                <p className={styles.statement}>
                  <span className={styles.yesh}>יש</span> <span className={styles.text}>{p.text}</span>
                  <span className={styles.tick} aria-hidden="true" />
                </p>
                <p className={styles.note}>{p.note}</p>
              </li>
            ))}
          </ul>

          <p className={styles.closing}>{experience.closing}</p>
        </div>

        <aside className={styles.aside} aria-label={u.caption}>
          <div className={styles.card} data-step="0">
            <div className={styles.cardHead}>
              <span className={styles.cardDot} aria-hidden="true" />
              <p className={styles.cardTitle}>{u.title}</p>
              <span className={styles.cardWeek}>{u.week}</span>
            </div>
            <ul role="list" className={styles.cardList}>
              {u.items.map((it, i) => (
                <li key={it.text} className={styles.cardItem} data-i={i} data-base={it.state}>
                  <span className={styles.check} aria-hidden="true" />
                  {it.text}
                </li>
              ))}
            </ul>
            <p className={styles.cardNote}>
              <span className="mark" aria-hidden="true" />
              {u.note}
            </p>
          </div>
          <p className={styles.caption}>{u.caption}</p>
        </aside>
      </div>
    </section>
  );
}
