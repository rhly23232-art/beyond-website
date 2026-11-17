'use client';

import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { chapters } from '@/content/site';
import { useScrollTo } from '@/components/motion/SmoothScroll';
import styles from './ProgressRail.module.css';

/**
 * Journey indicator (desktop): page progress + chapter ticks. Each tick jumps
 * to its chapter. Colours follow the theme of the section being read.
 */
export function ProgressRail() {
  const railRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const scrollTo = useScrollTo();

  useGSAP(() => {
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!rail || !fill) return;

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      refreshPriority: -10,
      onUpdate: (self) => {
        fill.style.transform = `scaleY(${self.progress.toFixed(4)})`;
        rail.dataset.visible = self.scroll() > window.innerHeight * 0.6 ? 'true' : 'false';
      },
    });

    chapters.forEach(({ id }, i) => {
      const section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        refreshPriority: -10,
        onToggle: (self) => {
          if (!self.isActive) return;
          setActive(i);
          rail.dataset.theme = section.dataset.theme ?? 'dark';
        },
      });
    });
  });

  return (
    <nav ref={railRef} className={styles.rail} aria-label="פרקי העמוד" data-visible="false" data-theme="dark">
      <p className={`${styles.current} en`} aria-hidden="true">
        <span>{String(active + 1).padStart(2, '0')}</span>
        <span className={styles.total}>/{String(chapters.length).padStart(2, '0')}</span>
      </p>
      <div className={styles.track} aria-hidden="true">
        <span ref={fillRef} className={styles.fill} />
      </div>
      <ol role="list" className={styles.list}>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={styles.tick}
              aria-current={i === active ? 'step' : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(`#${c.id}`);
              }}
            >
              <span className={styles.label}>{c.label}</span>
              <span className={styles.square} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
