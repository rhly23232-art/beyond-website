'use client';

import { Fragment, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { isFinePointer, isMotionReduced, onIntroReveal } from '@/lib/motion';
import { hero } from '@/content/home';
import { hasPublishedWork } from '@/content/projects';
import { Button } from '@/components/ui/Button';
import { useScrollTo } from '@/components/motion/SmoothScroll';
import { GridLines } from '@/components/ui/GridLines';
import { HeroSymbol } from './HeroSymbol';
import styles from './Hero.module.css';

/**
 * B. Hero — the statement. Giant type with deliberate breaks, an abstract 3D
 * BEYOND symbol and drifting light, all reacting to the pointer.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const secondary = hasPublishedWork ? hero.secondary : hero.secondaryFallback;

  useGSAP(
    () => {
      const el = root.current;
      if (!el || isMotionReduced()) return;
      const q = gsap.utils.selector(el);

      /* ---- Entrance (plays when the intro opens its frame) ---------------- */
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      tl.fromTo(
        q('[data-heroline]'),
        { scaleY: 0 },
        { scaleY: 1, duration: 1.4, stagger: { each: 0.04, from: 'end' }, ease: 'power3.inOut' },
        0,
      )
        .from(q(`.${styles.stage}`), { scale: 1.07, duration: 2.2 }, 0)
        .from(q(`.${styles.lineInner}`), { yPercent: 118, rotate: 2, duration: 1.5, stagger: 0.11 }, 0.12)
        .from(q(`.${styles.dot}`), { scale: 0, rotate: 135, duration: 0.9, ease: 'back.out(2.6)' }, 0.95)
        .from(
          q('[data-hero-rig-entrance]'),
          { rotationY: -75, rotationX: 28, scale: 0.55, opacity: 0, duration: 2.3 },
          0.05,
        )
        .from(q(`.${styles.meta} > *`), { opacity: 0, y: -10, stagger: 0.07, duration: 0.9 }, 0.45)
        .from(q(`.${styles.audience}, .${styles.subtitle}`), { opacity: 0, y: 28, stagger: 0.08, duration: 1.2 }, 0.6)
        .from(q(`.${styles.actions} > *`), { opacity: 0, y: 22, stagger: 0.1, duration: 1.1 }, 0.72)
        .from(q(`.${styles.cue}`), { opacity: 0, duration: 1 }, 1.2);

      const offReveal = onIntroReveal(() => tl.play());

      /* ---- Pointer: depth parallax + 3D rotation -------------------------- */
      const rig = q('[data-hero-rig]')[0] as HTMLElement;
      const glow = q(`.${styles.glow}`)[0] as HTMLElement;
      const lines = q(`.${styles.line}`);
      const rx = gsap.quickTo(rig, 'rotationX', { duration: 1.2, ease: 'power3.out' });
      const ry = gsap.quickTo(rig, 'rotationY', { duration: 1.2, ease: 'power3.out' });
      const gx = gsap.quickTo(glow, 'x', { duration: 1.6, ease: 'power3.out' });
      const gy = gsap.quickTo(glow, 'y', { duration: 1.6, ease: 'power3.out' });
      const lineTo = lines.map((line) => ({
        x: gsap.quickTo(line, 'x', { duration: 1.4, ease: 'power3.out' }),
        y: gsap.quickTo(line, 'y', { duration: 1.4, ease: 'power3.out' }),
      }));
      gsap.set(rig, { rotationX: 10, rotationY: -22 });

      let idle: gsap.core.Tween | null = null;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        if (e.clientY > r.bottom) return;
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        rx(10 - ny * 12);
        ry(-22 + nx * 18);
        gx(nx * 120);
        gy(ny * 80);
        rig.style.setProperty('--sheen', String(nx));
        lineTo.forEach((t, i) => {
          const depth = (i + 1) * 5;
          t.x(nx * -depth);
          t.y(ny * -depth * 0.5);
        });
      };

      if (isFinePointer()) {
        window.addEventListener('pointermove', onMove, { passive: true });
      } else {
        // Touch devices: a slow, calm sway instead of pointer tracking.
        const sway = { t: 0 };
        idle = gsap.to(sway, {
          t: Math.PI * 2,
          duration: 14,
          repeat: -1,
          ease: 'none',
          onUpdate: () => {
            gsap.set(rig, { rotationX: 10 + Math.sin(sway.t) * 6, rotationY: -22 + Math.cos(sway.t) * 10 });
          },
        });
      }

      /* ---- Scroll: the composition breaks apart into depth ---------------- */
      const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 } as const;
      gsap.to(q(`.${styles.title}`), { yPercent: -22, ease: 'none', scrollTrigger: st });
      gsap.to(q(`.${styles.visual}`), { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: st });
      gsap.to(q(`.${styles.bottom}`), { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: st });
      gsap.to(q(`.${styles.bg}`), { opacity: 0.35, ease: 'none', scrollTrigger: st });

      return () => {
        offReveal();
        idle?.kill();
        window.removeEventListener('pointermove', onMove);
      };
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className={`section ${styles.hero}`} data-theme="dark" aria-labelledby="hero-title">
      <div className={styles.bg} aria-hidden="true">
        <GridLines hook="heroline" className={styles.grid} />
        <div className={styles.glow} />
      </div>

      <div className={styles.stage}>
        <div className={styles.visual}>
          <HeroSymbol />
        </div>

        <div className={`container ${styles.inner}`}>
          <div className={styles.meta}>
            <p className="kicker">
              <span className="mark" aria-hidden="true" />
              <span>{hero.kicker}</span>
            </p>
            <span className={styles.disciplines}>{hero.disciplines.join(' · ')}</span>
          </div>

          <h1 id="hero-title" className={styles.title}>
            <span className={`${styles.line} ${styles.l1}`}>
              <span className={styles.mask}>
                <span className={styles.lineInner}>{hero.titleLines[0]}</span>
              </span>
            </span>{' '}
            <span className={`${styles.line} ${styles.l2}`}>
              {hero.titleLines[1].split(' ').map((word, i) => (
                <Fragment key={i}>
                  {i > 0 ? ' ' : null}
                  <span className={`${styles.mask} ${styles.word}`}>
                    <span className={styles.lineInner}>{word}</span>
                  </span>
                </Fragment>
              ))}
            </span>{' '}
            <span className={`${styles.line} ${styles.l3}`}>
              <span className={styles.mask}>
                <span className={styles.lineInner}>
                  {hero.titleLines[2]}
                  <span className={styles.dot} aria-hidden="true" />
                  <span className="visually-hidden">.</span>
                </span>
              </span>
            </span>
          </h1>

          <div className={styles.bottom}>
            <p className={styles.audience}>{hero.audience}</p>
            <p className={styles.subtitle}>{hero.subtitle}</p>
            <div className={styles.actions}>
              <Button href={hero.primary.href} size="lg" magnetic>
                {hero.primary.label}
              </Button>
              <Button href={secondary.href} variant="secondary" size="lg" arrow="down">
                {secondary.label}
              </Button>
            </div>
          </div>

          <a
            href="#approach"
            className={styles.cue}
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#approach');
            }}
          >
            <span className={styles.cueLine} aria-hidden="true" />
            <span>{hero.scrollCue}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
