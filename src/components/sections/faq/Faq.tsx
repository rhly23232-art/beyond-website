'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ_DESKTOP, isMotionReduced } from '@/lib/motion';
import { faq } from '@/content/about';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Faq.module.css';

/**
 * I. FAQ — an accordion everywhere (accessible markup), presented on desktop
 * as a two-pane console: questions on one side, a large answer panel on the
 * other. One question is always open on desktop.
 */
export function Faq() {
  const root = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);

  const isDesktop = () => typeof window !== 'undefined' && window.matchMedia(MQ_DESKTOP).matches;

  const toggle = (i: number) => {
    if (i === open) {
      if (!isDesktop()) setOpen(-1);
      return;
    }
    setOpen(i);
  };

  /* Panel content swap animation */
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel || isMotionReduced() || open < 0) return;
      const q = gsap.utils.selector(panel);
      gsap.fromTo(
        q('[data-panel-anim]'),
        { y: 26, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
        { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.07, duration: 0.8, ease: 'expo.out' },
      );
    },
    { scope: panelRef, dependencies: [open] },
  );

  /* Entrance */
  useGSAP(
    () => {
      if (isMotionReduced()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(`.${styles.item}`), {
        x: 30,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: q(`.${styles.list}`)[0], start: 'top 80%', once: true },
      });
    },
    { scope: root },
  );

  const current = open >= 0 ? faq.items[open] : null;

  return (
    <section id="faq" ref={root} className={`section ${styles.faq}`} data-theme="light" aria-labelledby="faq-title">
      <div className="container">
        <SectionHeading
          id="faq-title"
         
          kicker={faq.kicker}
          titleLines={faq.titleLines}
          lead={faq.lead}
          reveal="wipe"
          mark
        />

        <div className={styles.console}>
          <div className={styles.list}>
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className={styles.item} data-open={isOpen}>
                  <h3 className={styles.qWrap}>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      className={styles.q}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => toggle(i)}
                    >
                      <span className={styles.qText}>{item.q}</span>
                      <span className={styles.icon} aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={styles.a} inert={!isOpen}>
                    <div className={styles.aInner}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop presentation of the open answer (the accessible copy is in the accordion). */}
          <div ref={panelRef} className={styles.panel} aria-hidden="true">
            {current && (
              <>
                <div className={styles.panelTop}>
                  <span className={styles.topic} data-panel-anim>
                    {current.topic}
                  </span>
                </div>
                <p className={styles.panelQ} data-panel-anim>
                  {current.q}
                </p>
                <p className={styles.panelA} data-panel-anim>
                  {current.a}
                </p>
                <span className={styles.panelFrame} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
