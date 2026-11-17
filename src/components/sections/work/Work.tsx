'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ_DESKTOP, MQ_MOBILE, isMotionReduced } from '@/lib/motion';
import { getWorkItems, workIntro } from '@/content/projects';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ProjectPanel } from './ProjectPanel';
import styles from './Work.module.css';

const ACCENT_BG: Record<string, string> = {
  cobalt: '#10131A',
  lime: '#141a17',
  mist: '#121726',
};

/**
 * E. Selected Work — the light section closes through an expanding open frame,
 * then projects travel horizontally (pinned) with clip-path reveals and inner
 * parallax (signature moment #3). Vertical, swipe-friendly list on mobile.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const items = getWorkItems();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const reduced = isMotionReduced();
      if (reduced) return;

      /* Light → dark: the open frame expands until the dark takes over */
      const win = q(`.${styles.frameWin}`)[0];
      gsap.fromTo(
        win,
        { width: '22vmin', height: '22vmin', '--bw': '6px' },
        {
          width: '160vmax',
          height: '160vmax',
          '--bw': '1px',
          ease: 'power2.in',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true },
        },
      );

      /* Giant outlined band drifts with the scroll */
      gsap.fromTo(
        q(`.${styles.band}`),
        { xPercent: -8 },
        {
          xPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: q(`.${styles.head}`)[0], start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );

      const mm = gsap.matchMedia();

      mm.add(MQ_DESKTOP, () => {
        const pin = q(`.${styles.pin}`)[0] as HTMLElement;
        const track = q(`.${styles.track}`)[0] as HTMLElement;
        const panels = q('[data-panel]');
        const fill = q(`.${styles.progressFill}`)[0];
        const counter = q('[data-work-counter]')[0];
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const move = gsap.to(track, {
          x: () => distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(fill, { scaleX: self.progress });
              // The project whose centre is closest to the viewport centre.
              const mid = window.innerWidth / 2;
              let best = 0;
              let bestDist = Infinity;
              panels.slice(0, items.length).forEach((p, i) => {
                const r = p.getBoundingClientRect();
                const d = Math.abs(r.left + r.width / 2 - mid);
                if (d < bestDist) {
                  bestDist = d;
                  best = i;
                }
              });
              if (counter) counter.textContent = String(best + 1).padStart(2, '0');
            },
          },
        });

        panels.forEach((panel, i) => {
          const media = panel.querySelector('[data-media]');
          const inner = panel.querySelector('[data-media-inner]');
          const name = panel.querySelector('[data-name]');
          const big = panel.querySelector('[data-bigindex]');
          const accent = (panel as HTMLElement).dataset.accent ?? 'cobalt';
          // RTL travel: panels enter from the left edge and move right.
          const st = { trigger: panel, containerAnimation: move, scrub: true } as const;

          if (i > 0) {
            gsap.fromTo(
              media,
              { clipPath: 'inset(16% 20% 16% 20% round 28px)' },
              {
                clipPath: 'inset(0% 0% 0% 0% round 20px)',
                ease: 'none',
                scrollTrigger: { ...st, start: 'right left', end: 'center center' },
              },
            );
            gsap.fromTo(
              inner,
              { scale: 1.3, xPercent: 10 },
              { scale: 1, xPercent: 0, ease: 'none', scrollTrigger: { ...st, start: 'right left', end: 'center center' } },
            );
            gsap.fromTo(
              name,
              { xPercent: 30, opacity: 0 },
              { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { ...st, start: 'right 25%', end: 'right 70%' } },
            );
          }
          gsap.fromTo(
            big,
            { xPercent: 40 },
            { xPercent: -40, ease: 'none', scrollTrigger: { ...st, start: 'right left', end: 'left right' } },
          );
          gsap.to(el, {
            '--work-bg': ACCENT_BG[accent] ?? ACCENT_BG.cobalt,
            ease: 'none',
            scrollTrigger: { ...st, start: 'right 35%', end: 'right 75%' },
          });
        });
      });

      mm.add(MQ_MOBILE, () => {
        q('[data-panel]').forEach((panel) => {
          const media = panel.querySelector('[data-media]');
          gsap.fromTo(
            media,
            { clipPath: 'inset(10% 8% 10% 8% round 24px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 16px)',
              ease: 'none',
              scrollTrigger: { trigger: panel, start: 'top 90%', end: 'top 40%', scrub: true },
            },
          );
          const info = panel.querySelectorAll(`.${styles.info} > *`);
          if (!info.length) return;
          gsap.from(info, {
            opacity: 0,
            y: 24,
            stagger: 0.07,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: panel, start: 'top 70%', once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} className={`section ${styles.work}`} data-theme="dark" aria-labelledby="work-title">
      <div className={styles.frameFx} aria-hidden="true">
        <div className={styles.frameWin}>
          <i data-b="top" />
          <i data-b="left" />
          <i data-b="bottom" />
          <i data-b="right" />
        </div>
      </div>

      <div className={styles.head}>
        <p className={`${styles.band} en`} aria-hidden="true">
          SELECTED WORK — SELECTED WORK — SELECTED WORK —
        </p>
        <div className="container">
          <SectionHeading
            id="work-title"
            index="04"
            kicker={workIntro.kicker}
            titleLines={[workIntro.title]}
            lead={workIntro.lead}
            reveal="skew"
            size="xl"
            mark
          />
        </div>
      </div>

      <div className={styles.pin}>
        <div className={styles.track}>
          {items.map((p, i) => (
            <ProjectPanel key={p.slug} project={p} index={i} />
          ))}

          <aside className={`${styles.panel} ${styles.nextPanel}`} data-panel data-accent="cobalt" aria-labelledby="work-next">
            <span className={`${styles.bigIndex} en`} aria-hidden="true" data-bigindex>
              {String(items.length + 1).padStart(2, '0')}
            </span>
            <div className={styles.nextInner} data-media>
              <div data-media-inner className={styles.nextFrame} aria-hidden="true">
                <span className={styles.nextSquare} />
              </div>
              <p className="kicker">
                <span className="mark" aria-hidden="true" />
                <span className="en">{workIntro.next.kicker}</span>
              </p>
              <h3 id="work-next" className={styles.nextTitle} data-name>
                {workIntro.next.title}
              </h3>
              <p className={styles.nextBody}>{workIntro.next.body}</p>
              <Button href="#contact" size="lg" magnetic>
                {workIntro.next.button}
              </Button>
            </div>
          </aside>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span className={`${styles.counter} en`}>
            <span data-work-counter>01</span> / {String(items.length).padStart(2, '0')}
          </span>
          <span className={styles.progressTrack}>
            <span className={styles.progressFill} />
          </span>
          <span className={styles.hint}>{workIntro.dragHint}</span>
        </div>
      </div>
    </section>
  );
}
