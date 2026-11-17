'use client';

import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import {
  INTRO_STORAGE_KEY,
  getIntroPhase,
  isMotionReduced,
  onIntroDone,
  setIntroPhase,
} from '@/lib/motion';
import { LOCKUP, LOGOTYPE, SYMBOL } from '@/components/brand/logo-data';
import { useLenis, useScrollTo } from '@/components/motion/SmoothScroll';
import { GridLines } from '@/components/ui/GridLines';
import { site } from '@/content/site';
import styles from './Intro.module.css';

/**
 * A. Opening experience (signature moment #1).
 * Grid draws in → the open frame is drawn → the lime square appears and
 * launches the arrow → BEYOND is mask-revealed → the frame opens and expands
 * to the whole screen, revealing the hero through it.
 * ~2.8s on first visit, ~1.3s on return visits, skippable at any moment.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const skipFn = useRef<() => void>(() => {});
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  // Keep smooth scrolling paused until the page is revealed.
  useEffect(() => {
    if (!lenis || getIntroPhase() === 'done') return;
    lenis.stop();
    return onIntroDone(() => lenis.start());
  }, [lenis]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (isMotionReduced() || getIntroPhase() === 'done') {
        setIntroPhase('done');
        return;
      }

      const html = document.documentElement;
      const short = html.dataset.introMode === 'short';
      const hash = window.location.hash;
      window.scrollTo(0, 0);
      html.style.overflow = 'hidden';

      const q = gsap.utils.selector(el);
      const svg = el.querySelector<SVGSVGElement>('[data-lockup]')!;
      const frame = el.querySelector<SVGPathElement>('[data-part="frame"]')!;
      const arrow = q('[data-part="arrow"]')[0];
      const shaft = q('[data-part="shaft"]')[0];
      const head = q('[data-part="head"]')[0];
      const lime = q('[data-part="lime"]')[0];
      const word = q('[data-word]')[0];
      const glyphs = q('[data-glyph]');
      const caption = q('[data-caption]')[0];
      const lines = q('[data-introline]');
      const win = q('[data-window]')[0];
      const fill = q('[data-fill]')[0];

      const finish = () => {
        html.style.overflow = '';
        setIntroPhase('done');
        try {
          sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
        } catch {
          /* private mode — the full intro simply plays again next time */
        }
        if (hash.length > 1) {
          const target = document.querySelector(hash);
          if (target) requestAnimationFrame(() => scrollTo(hash, { immediate: true }));
        }
      };

      const placeWindow = () => {
        const r = frame.getBoundingClientRect();
        const unit = svg.getBoundingClientRect().width / LOCKUP.width;
        gsap.set(win, {
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
          '--bw': `${SYMBOL.stroke * unit}px`,
          autoAlpha: 1,
        });
        gsap.set(el, { backgroundColor: 'transparent' });
        gsap.set(frame, { opacity: 0 });
      };

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: finish });
      gsap.set(lime, { transformOrigin: '50% 50%' });

      if (short) {
        gsap.set(lines, { scaleY: 1 });
        gsap.set([frame, shaft, head], { strokeDashoffset: 0 });
        gsap.set(lime, { scale: 1, opacity: 1 });
        gsap.set(glyphs, { yPercent: 0, opacity: 1 });
        gsap.set(caption, { opacity: 1 });
        tl.from(svg, { opacity: 0, scale: 0.94, duration: 0.5, ease: 'power3.out' }, 0);
        tl.addLabel('expand', 0.55);
      } else {
        tl.fromTo(
          lines,
          { scaleY: 0 },
          { scaleY: 1, duration: 1.2, stagger: { each: 0.035, from: 'center' }, ease: 'power3.inOut' },
          0,
        )
          .fromTo(frame, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.2)
          .fromTo(
            lime,
            { scale: 0, rotate: -90, opacity: 1 },
            { scale: 1, rotate: 0, duration: 0.65, ease: 'back.out(2.4)' },
            0.72,
          )
          // the idea leads the motion: a small push toward the opening…
          .to(lime, { x: 2.5, y: -2.5, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 }, 1.02)
          // …and launches the arrow outward
          .fromTo(shaft, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, ease: 'power3.in' }, 1.04)
          .fromTo(head, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power3.out' }, 1.4)
          .fromTo(glyphs, { yPercent: 118, opacity: 1 }, { yPercent: 0, duration: 1.05, stagger: 0.065 }, 0.98)
          .fromTo(
            caption,
            { opacity: 0, letterSpacing: '0.55em' },
            { opacity: 1, letterSpacing: '0.22em', duration: 1.3, ease: 'expo.out' },
            1.25,
          )
          .addLabel('expand', 2.15);
      }

      // Signature: the frame opens and expands to the whole screen.
      tl.call(placeWindow, [], 'expand')
        .call(() => setIntroPhase('reveal'), [], 'expand+=0.08')
        .to([word, caption], { opacity: 0, y: -14, duration: 0.4, ease: 'power2.in' }, 'expand')
        .to(fill, { opacity: 0, duration: 0.55, ease: 'power2.out' }, 'expand+=0.05')
        .to(
          win,
          {
            left: 0,
            top: 0,
            width: () => window.innerWidth,
            height: () => window.innerHeight,
            '--bw': '1px',
            duration: 1.3,
            ease: 'expo.inOut',
          },
          'expand+=0.2',
        )
        .to(arrow, { x: 260, y: -260, duration: 1.1, ease: 'power3.in' }, 'expand+=0.15')
        .to(arrow, { opacity: 0, duration: 0.4, ease: 'none' }, 'expand+=0.85')
        .to(lime, { x: 120, y: -120, scale: 0.4, opacity: 0, duration: 1, ease: 'power3.in' }, 'expand+=0.3')
        .to(lines, { opacity: 0, duration: 0.7, ease: 'none' }, 'expand+=0.35')
        .to(win, { opacity: 0, duration: 0.45, ease: 'none' }, 'expand+=1.3');

      // Any intent to move on fast-forwards the sequence.
      let skipped = false;
      const skip = () => {
        if (skipped || tl.progress() === 1) return;
        skipped = true;
        if (tl.time() < tl.labels.expand) tl.seek('expand');
        tl.timeScale(2.4);
      };
      skipFn.current = skip;
      const opts = { passive: true } as const;
      window.addEventListener('wheel', skip, opts);
      window.addEventListener('touchstart', skip, opts);
      window.addEventListener('keydown', skip);

      return () => {
        window.removeEventListener('wheel', skip);
        window.removeEventListener('touchstart', skip);
        window.removeEventListener('keydown', skip);
        html.style.overflow = '';
        if (tl.progress() < 1) setIntroPhase('done');
      };
    },
    { scope: root },
  );

  const glyphClip = `intro-word-clip`;

  return (
    <>
      <div ref={root} className={styles.intro} aria-hidden="true">
        <GridLines className={styles.grid} hook="introline" />

        <div data-window className={styles.window}>
          <span data-fill className={styles.fill} />
          <i className={styles.bTop} />
          <i className={styles.bLeft} />
          <i className={styles.bBottom} />
          <i className={styles.bRight} />
        </div>

        <div className={styles.center}>
          <svg
            data-lockup
            className={styles.lockup}
            viewBox={`0 0 ${LOCKUP.width} ${LOCKUP.height}`}
            focusable="false"
          >
            <defs>
              <clipPath id={glyphClip}>
                <rect x={-4} y={LOGOTYPE.top - 2} width={LOGOTYPE.width + 8} height={LOGOTYPE.height + 4} />
              </clipPath>
            </defs>
            <g fill="none" stroke="currentColor" strokeWidth={SYMBOL.stroke} strokeLinejoin="miter">
              <path
                data-part="frame"
                className={styles.draw}
                d={SYMBOL.frame}
                strokeLinecap="square"
                pathLength={1}
              />
              <g data-part="arrow">
                <path
                  data-part="shaft"
                  className={styles.draw}
                  d={SYMBOL.shaft}
                  strokeLinecap="butt"
                  pathLength={1}
                />
                <path
                  data-part="head"
                  className={styles.draw}
                  d={SYMBOL.head}
                  strokeLinecap="square"
                  pathLength={1}
                />
              </g>
            </g>
            <rect
              data-part="lime"
              className={styles.lime}
              x={SYMBOL.lime.x}
              y={SYMBOL.lime.y}
              width={SYMBOL.lime.size}
              height={SYMBOL.lime.size}
            />
            <g transform={`translate(${LOCKUP.textX} ${LOCKUP.textY})`}>
              <g data-word clipPath={`url(#${glyphClip})`} fill="currentColor">
                {LOGOTYPE.glyphs.map((g, i) => (
                  <path key={i} data-glyph className={styles.glyph} d={g.d} />
                ))}
              </g>
            </g>
          </svg>
          <p data-caption className={`${styles.caption} en`}>
            {site.slogan}
          </p>
        </div>
      </div>
      <button ref={skipRef} type="button" className={styles.skip} onClick={() => skipFn.current()}>
        דלגו על הפתיחה
      </button>
    </>
  );
}
