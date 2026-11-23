'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';
import { studio } from '@/content/about';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BrandSymbol } from '@/components/brand/BrandSymbol';
import styles from './Studio.module.css';

/**
 * Who's behind BEYOND — the positioning from the brief, in the studio's own
 * first-person voice. The symbol draws itself as the section is read.
 */
export function Studio() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (isMotionReduced()) return;
      const q = gsap.utils.selector(root);
      const strokes = q('.draw');
      gsap.fromTo(
        strokes,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          stagger: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: q(`.${styles.visual}`)[0], start: 'top 85%', end: 'center 50%', scrub: 0.6 },
        },
      );
      gsap.from(q('.lime'), {
        scale: 0,
        rotate: -90,
        transformOrigin: '50% 50%',
        ease: 'back.out(2)',
        duration: 0.8,
        scrollTrigger: { trigger: q(`.${styles.visual}`)[0], start: 'center 60%', once: true },
      });
      gsap.from(q(`.${styles.body}, .${styles.promise}, .${styles.owner}`), {
        opacity: 0,
        y: 26,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: q(`.${styles.body}`)[0], start: 'top 88%', once: true },
      });
      gsap.from(q(`.${styles.pillar}`), {
        opacity: 0,
        x: -30,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: q(`.${styles.pillars}`)[0], start: 'top 85%', once: true },
      });
    },
    { scope: root },
  );

  const { owner } = studio;

  return (
    <section id="studio" ref={root} className={`section ${styles.studio}`} data-theme="dark" aria-labelledby="studio-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          <SectionHeading id="studio-title" kicker={studio.kicker} titleLines={studio.titleLines} reveal="sides" size="xl" />
          {owner.name && (
            <p className={styles.owner}>
              נעים מאוד, אני {owner.name}
              {owner.role && <span>{owner.role}</span>}
            </p>
          )}
          <p className={styles.body}>{studio.body}</p>
          <p className={styles.promise}>{studio.promise}</p>
        </div>

        <div className={styles.side}>
          <div className={styles.visual} aria-hidden="true">
            <BrandSymbol
              className={styles.symbol}
              strokeWidth={2.4}
              parts={{ frame: 'draw', shaft: 'draw', head: 'draw', lime: 'lime' }}
            />
          </div>
          <ul role="list" className={styles.pillars}>
            {studio.pillars.map((p) => (
              <li key={p.title} className={styles.pillar}>
                <span className={styles.pillarMark} aria-hidden="true" />
                <div>
                  <h3 className={styles.pillarTitle}>{p.title}</h3>
                  <p className={styles.pillarText}>{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
