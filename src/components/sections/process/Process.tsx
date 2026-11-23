'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MQ_DESKTOP, MQ_MOBILE, isMotionReduced } from '@/lib/motion';
import { process } from '@/content/about';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CtaStrip } from '@/components/ui/CtaStrip';
import { useScrollTo } from '@/components/motion/SmoothScroll';
import styles from './Process.module.css';

const STEPS = process.steps.length;

/**
 * G. Process — a five-step timeline. On desktop the scene pins while the
 * line fills and each step lights up; every step is also clickable.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [reached, setReached] = useState(-1);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const rail = q(`.${styles.rail}`)[0] as HTMLElement;
      const fill = q(`.${styles.railFill}`)[0];
      const runner = q(`.${styles.runner}`)[0];
      const nodes = q(`.${styles.node}`);

      if (isMotionReduced()) {
        setReached(STEPS - 1);
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MQ_DESKTOP, () => {
        // Node positions as fractions of the rail, measured from its start (right, RTL).
        let stops: number[] = [];
        const measure = () => {
          const r = rail.getBoundingClientRect();
          stops = nodes.map((n) => {
            const b = n.getBoundingClientRect();
            return (r.right - (b.left + b.width / 2)) / r.width;
          });
        };
        measure();
        const render = (progress: number) => {
          const first = stops[0] ?? 0;
          const last = stops[stops.length - 1] ?? 1;
          const pos = first + (last - first) * progress;
          gsap.set(fill, { scaleX: pos });
          gsap.set(runner, { left: `${(1 - pos) * 100}%` });
          const idx = stops.filter((f) => pos >= f - 0.004).length - 1;
          setReached(progress < 0.015 ? -1 : Math.max(0, idx));
        };
        // No pinning: the line fills as the steps pass through the viewport.
        const st = ScrollTrigger.create({
          trigger: q(`.${styles.steps}`)[0],
          start: 'top 72%',
          end: 'bottom 62%',
          onRefresh: (self) => {
            measure();
            render(self.progress);
          },
          onUpdate: (self) => render(self.progress),
        });
        stRef.current = st;
        return () => {
          stRef.current = null;
        };
      });

      mm.add(MQ_MOBILE, () => {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: q(`.${styles.steps}`)[0],
              start: 'top 60%',
              end: 'bottom 60%',
              scrub: 0.4,
              onUpdate: (self) => {
                const idx = Math.min(STEPS - 1, Math.floor(self.progress * STEPS));
                setReached(self.progress < 0.02 ? -1 : idx);
              },
            },
          },
        );
      });
    },
    { scope: root },
  );

  const jump = (i: number) => {
    const st = stRef.current;
    if (!st) {
      const step = root.current?.querySelector<HTMLElement>(`[data-step="${i}"]`);
      if (step) scrollTo(step, { offset: -window.innerHeight * 0.3, focus: false });
      return;
    }
    scrollTo(st.start + ((st.end - st.start) * (i + 0.05)) / (STEPS - 1), { focus: false });
  };

  return (
    <section id="process" ref={root} className={`section ${styles.process}`} data-theme="graphite" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading
          id="process-title"
         
          kicker={process.kicker}
          titleLines={process.titleLines}
          lead={process.lead}
          reveal="rise"
          mark
        />
      </div>

      <div className={styles.pin}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} />
            <span className={styles.runner} />
          </div>

          <ol role="list" className={styles.steps}>
            {process.steps.map((s, i) => {
              const state = i < reached ? 'done' : i === reached ? 'active' : 'idle';
              return (
                <li key={s.en} className={styles.step} data-step={i} data-state={state}>
                  <button type="button" className={styles.stepHead} onClick={() => jump(i)}>
                    <span className={styles.node} aria-hidden="true" />
                    <span className={`${styles.num} en`} aria-hidden="true">
                      {s.index}
                    </span>
                    <span className={`${styles.enName} en`}>{s.en}</span>
                    <span className={styles.title}>
                      <span className="visually-hidden">שלב {s.index}: </span>
                      {s.title}
                    </span>
                  </button>
                  <p className={styles.summary}>{s.summary}</p>
                  <p className={styles.body}>{s.body}</p>
                  <div className={styles.deliverables}>
                    <p className={styles.delLabel}>{process.deliverablesLabel}</p>
                    <ul role="list">
                      {s.deliverables.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>

          <CtaStrip text={process.cta.text} button={process.cta.button} note={process.cta.note} />
        </div>
      </div>
    </section>
  );
}
