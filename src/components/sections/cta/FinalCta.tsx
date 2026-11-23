'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ_DESKTOP, MQ_MOBILE, isMotionReduced } from '@/lib/motion';
import { finalCta } from '@/content/home';
import { Button } from '@/components/ui/Button';
import { GridLines } from '@/components/ui/GridLines';
import styles from './FinalCta.module.css';

/* Symbol pieces in the 72-unit grid: [left, top, width, height, rotate°] */
const U = (n: number) => `${(n / 72) * 100}%`;
const PIECES: { id: string; box: [number, number, number, number]; rot?: number; lime?: boolean }[] = [
  { id: 'top', box: [0, 10, 38, 6] },
  { id: 'left', box: [0, 10, 6, 62] },
  { id: 'bottom', box: [0, 66, 62, 6] },
  { id: 'right', box: [56, 42, 6, 30] },
  { id: 'shaft', box: [23.55, 20, 50.9, 6], rot: -45 },
  { id: 'headTop', box: [46, 0, 26, 6] },
  { id: 'headRight', box: [66, 0, 6, 26] },
  { id: 'lime', box: [13, 45, 14, 14], lime: true },
];

/* Deterministic scatter (vw / vh / deg) so server and client render the same. */
const SCATTER: Record<string, [number, number, number]> = {
  top: [-34, -30, -70],
  left: [-40, 18, 90],
  bottom: [-26, 34, -40],
  right: [30, 30, 120],
  shaft: [38, -24, 160],
  headTop: [26, -38, -110],
  headRight: [44, 6, 60],
  lime: [-10, 40, 225],
};

const DEBRIS = [
  [12, 18, 3],
  [84, 22, 2],
  [20, 76, 2],
  [76, 70, 3],
  [50, 12, 2],
  [92, 54, 2],
  [6, 48, 2],
];

/**
 * J. Final CTA — the closing of the journey (signature moment #4): every
 * graphic piece seen along the way flies back and reassembles the BEYOND
 * symbol, then the final line is revealed.
 */
export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || isMotionReduced()) return;
      const q = gsap.utils.selector(el);
      const pieces = q('[data-piece]');
      const debris = q('[data-debris]');
      const lines = q(`.${styles.lineInner}`);
      const signature = q(`.${styles.signature}`);
      const action = q(`.${styles.action}`);

      const build = (tl: gsap.core.Timeline) => {
        pieces.forEach((p) => {
          const id = (p as HTMLElement).dataset.piece!;
          const [x, y, r] = SCATTER[id];
          const base = PIECES.find((piece) => piece.id === id)?.rot ?? 0;
          tl.fromTo(
            p,
            { x: `${x}vw`, y: `${y}vh`, rotate: base + r, opacity: 0.25 },
            { x: 0, y: 0, rotate: base, opacity: 1, duration: 1, ease: 'power3.inOut' },
            0,
          );
        });
        tl.fromTo(debris, { scale: 1, opacity: 0.6 }, { scale: 0, opacity: 0, duration: 0.6, stagger: 0.04 }, 0.35)
          .fromTo(q(`.${styles.glow}`), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6 }, 0.8)
          .fromTo(lines, { yPercent: 110 }, { yPercent: 0, stagger: 0.1, duration: 0.55, ease: 'expo.out' }, 0.9)
          .fromTo(
            signature,
            { opacity: 0, letterSpacing: '0.5em' },
            { opacity: 1, letterSpacing: '0.22em', duration: 0.5, ease: 'expo.out' },
            1.2,
          )
          .fromTo(action, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, 1.3);
        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add(MQ_DESKTOP, () => {
        build(
          gsap.timeline({
            scrollTrigger: {
              trigger: q(`.${styles.pin}`)[0],
              start: 'top top',
              end: '+=80%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          }),
        );
      });
      mm.add(MQ_MOBILE, () => {
        build(
          gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top 75%', end: 'center 45%', scrub: 0.6 },
          }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="start" ref={root} className={`section ${styles.cta}`} data-theme="dark" aria-labelledby="cta-title">
      <div className={styles.pin}>
        <GridLines className={styles.grid} />
        <div className={styles.inner}>
          <div className={styles.symbolWrap} aria-hidden="true">
            <span className={styles.glow} />
            <div className={styles.symbol}>
              {PIECES.map((p) => (
                <span
                  key={p.id}
                  data-piece={p.id}
                  className={p.lime ? styles.lime : styles.bar}
                  style={{
                    left: U(p.box[0]),
                    top: U(p.box[1]),
                    width: U(p.box[2]),
                    height: U(p.box[3]),
                    transform: p.rot ? `rotate(${p.rot}deg)` : undefined,
                  }}
                />
              ))}
            </div>
            {DEBRIS.map(([x, y, s], i) => (
              <span
                key={i}
                data-debris
                className={styles.debris}
                style={{ left: `${x}%`, top: `${y}%`, width: `${s * 4}px`, height: `${s * 4}px` }}
              />
            ))}
          </div>

          <p className={`${styles.kicker} kicker`}>
            <span className="mark" aria-hidden="true" />
            <span>{finalCta.kicker}</span>
          </p>

          <h2 id="cta-title" className={styles.title}>
            {finalCta.he.map((line, i) => (
              <span key={i} className={styles.line}>
                <span className={styles.lineInner}>{line}</span>{' '}
              </span>
            ))}
          </h2>

          <p className={`${styles.signature} en`}>
            {finalCta.en.replace('BEYOND.', '')}
            <span className={styles.accent}>BEYOND.</span>
          </p>

          <div className={styles.action}>
            <Button href={finalCta.button.href} size="xl" magnetic>
              {finalCta.button.label}
            </Button>
            <p className={styles.note}>{finalCta.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
