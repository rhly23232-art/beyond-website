'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MQ_DESKTOP, MQ_MOBILE, isMotionReduced } from '@/lib/motion';
import { why } from '@/content/about';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LayerFace } from './LayerFace';
import styles from './Why.module.css';

/**
 * F. Why BEYOND — seven differentiators as an exploded stack of layers.
 * Every item stays readable; the item being read lifts its layer, and at the
 * end of the list the layers compress into one product.
 */
export function Why() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const stage = q(`.${styles.stage}`)[0] as HTMLElement;
      const list = q(`.${styles.list}`)[0] as HTMLElement;
      const stack = q(`.${styles.stack}`)[0] as HTMLElement;

      if (isMotionReduced()) {
        el.dataset.assembled = 'true';
        gsap.set(stage, { '--gap': '0.7rem' });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MQ_DESKTOP, () => {
        q(`.${styles.item}`).forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 58%',
            end: 'bottom 58%',
            onToggle: (self) => {
              if (!self.isActive) return;
              list.dataset.active = String(i);
              stage.dataset.active = String(i);
            },
          });
        });
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: list,
              start: 'bottom 78%',
              end: 'bottom 42%',
              scrub: 0.6,
              onUpdate: (self) => {
                const done = self.progress > 0.85;
                el.dataset.assembled = String(done);
                if (done) stage.dataset.active = '';
              },
            },
          })
          .fromTo(stage, { '--gap': '4.2rem' }, { '--gap': '0.7rem' }, 0)
          .fromTo(stack, { '--rz': '-40deg', '--rx': '56deg' }, { '--rz': '-46deg', '--rx': '60deg' }, 0);
      });

      mm.add(MQ_MOBILE, () => {
        gsap.fromTo(
          stage,
          { '--gap': '2.6rem' },
          {
            '--gap': '0.45rem',
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top 75%',
              end: 'bottom 35%',
              scrub: 0.6,
              onLeave: () => (el.dataset.assembled = 'true'),
              onEnterBack: () => (el.dataset.assembled = 'false'),
            },
          },
        );
        gsap.from(q(`.${styles.item}`), {
          opacity: 0,
          y: 24,
          stagger: 0.06,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: list, start: 'top 80%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="why" ref={root} className={`section ${styles.why}`} data-theme="mist" aria-labelledby="why-title" data-assembled="false">
      <div className="container">
        <SectionHeading id="why-title" kicker={why.kicker} titleLines={why.titleLines} lead={why.lead} reveal="sides" />
      </div>

      <div className={`container ${styles.layout}`}>
        <ul role="list" className={styles.list} data-active="0">
          {why.layers.map((l, i) => (
            <li key={l.id} className={styles.item} data-i={i}>
              <span className={styles.itemMark} aria-hidden="true" />
              <div>
                <h3 className={styles.itemTitle}>{l.title}</h3>
                <p className={styles.itemText}>{l.text}</p>
                <p className={styles.itemProof}>{l.proof}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.stageWrap}>
          <div className={styles.stage} data-active="0" aria-hidden="true">
            <div className={styles.stack}>
              {why.layers.map((l, i) => (
                <div
                  key={l.id}
                  className={styles.layer}
                  data-i={i}
                  data-face={l.id}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <div className={styles.face}>
                    <LayerFace id={l.id} />
                  </div>
                </div>
              ))}
            </div>
            <p className={styles.closing}>
              <span className={styles.closingMark} />
              {why.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
