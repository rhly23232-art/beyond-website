'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';
import styles from './SectionHeading.module.css';

export type HeadingReveal = 'rise' | 'wipe' | 'sides' | 'skew';

type Props = {
  id: string;
  kicker: string;
  titleLines: readonly string[];
  lead?: ReactNode;
  reveal?: HeadingReveal;
  align?: 'start' | 'center';
  size?: 'l' | 'xl';
  /** Ends the title with the Signal Lime square instead of a full stop. */
  mark?: boolean;
  className?: string;
  as?: 'h1' | 'h2';
  aside?: ReactNode;
};

/**
 * Section title system: (index) · KICKER · multi-line title with deliberate
 * breaks · optional lead. Each section picks a different reveal so the page
 * never repeats the same entrance twice in a row.
 */
export function SectionHeading({
  id,
  kicker,
  titleLines,
  lead,
  reveal = 'rise',
  align = 'start',
  size = 'l',
  mark = false,
  className,
  as: Tag = 'h2',
  aside,
}: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (isMotionReduced()) return;
      const q = gsap.utils.selector(root);
      const lines = q(`.${styles.line}`);
      const inners = q(`.${styles.lineInner}`);
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out', duration: 1.2 },
        scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
      });

      tl.from(q(`.${styles.meta} > *`), { opacity: 0, x: 24, stagger: 0.08, duration: 0.8 }, 0);

      switch (reveal) {
        case 'wipe':
          tl.fromTo(
            lines,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.12, duration: 1.1, ease: 'power4.inOut' },
            0.05,
          ).from(inners, { yPercent: 40, stagger: 0.12, duration: 1.3 }, 0.05);
          break;
        case 'sides':
          lines.forEach((line, i) => {
            tl.from(line, { xPercent: i % 2 === 0 ? 14 : -14, opacity: 0, duration: 1.4 }, 0.05 + i * 0.08);
          });
          break;
        case 'skew':
          tl.from(inners, { yPercent: 110, skewY: 7, transformOrigin: '100% 0%', stagger: 0.1 }, 0.05);
          break;
        default:
          tl.from(inners, { yPercent: 112, rotate: 1.5, transformOrigin: '100% 100%', stagger: 0.1 }, 0.05);
      }

      if (lead) tl.from(q(`.${styles.lead}`), { opacity: 0, y: 24, duration: 1 }, 0.35);
      if (mark) tl.from(q(`.${styles.mark}`), { scale: 0, rotate: -90, duration: 0.8, ease: 'back.out(2)' }, 0.6);
      if (aside) tl.from(q(`.${styles.aside}`), { opacity: 0, y: 16, duration: 0.9 }, 0.45);
    },
    { scope: root },
  );

  return (
    <header
      ref={root}
      className={[styles.heading, styles[align], styles[size], className].filter(Boolean).join(' ')}
    >
      <div className={styles.meta}>
        <span className="kicker">
          <span className="mark" aria-hidden="true" />
          <span>{kicker}</span>
        </span>
      </div>
      <Tag id={id} className={styles.title}>
        {titleLines.map((line, i) => (
          <span key={i} className={styles.line}>
            <span className={styles.lineInner}>
              {line}
              {mark && i === titleLines.length - 1 && <span className={styles.mark} aria-hidden="true" />}
            </span>
            {i < titleLines.length - 1 ? ' ' : null}
          </span>
        ))}
      </Tag>
      {(lead || aside) && (
        <div className={styles.foot}>
          {lead && <p className={styles.lead}>{lead}</p>}
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
      )}
    </header>
  );
}
