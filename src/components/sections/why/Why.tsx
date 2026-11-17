'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ_DESKTOP, MQ_MOBILE, isMotionReduced } from '@/lib/motion';
import { why } from '@/content/about';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LayerFace } from './LayerFace';
import styles from './Why.module.css';

const N = why.layers.length;

/**
 * F. Why BEYOND — seven differentiators as an exploded stack of layers.
 * Scrolling lights each layer, then compresses them into one product.
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
        const pin = q(`.${styles.pin}`)[0];
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              const t = self.progress * (N + 2);
              const idx = Math.min(N - 1, Math.floor(t));
              const assembled = t >= N + 0.4;
              list.dataset.active = String(idx);
              stage.dataset.active = assembled ? '' : String(idx);
              el.dataset.assembled = String(assembled);
            },
          },
        });
        tl.fromTo(stage, { '--gap': '4.2rem' }, { '--gap': '4.2rem', duration: N })
          .to(stage, { '--gap': '0.7rem', duration: 1.4, ease: 'power2.inOut' }, N)
          .to(stack, { '--rz': '-46deg', '--rx': '60deg', duration: 1.4, ease: 'power2.inOut' }, N)
          .to({}, { duration: 0.6 });
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
        <SectionHeading
          id="why-title"
          index="05"
          kicker={why.kicker}
          titleLines={why.titleLines}
          lead={why.lead}
          reveal="sides"
        />
      </div>

      <div className={styles.pin}>
        <div className={`container ${styles.layout}`}>
          <ol role="list" className={styles.list} data-active="0">
            {why.layers.map((l, i) => (
              <li key={l.id} className={styles.item} data-i={i}>
                <span className={`${styles.itemNum} en`}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className={styles.itemTitle}>{l.title}</h3>
                  <p className={styles.itemText}>{l.text}</p>
                </div>
              </li>
            ))}
          </ol>

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
                    <span className={`${styles.faceNum} en`}>{String(i + 1).padStart(2, '0')}</span>
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
