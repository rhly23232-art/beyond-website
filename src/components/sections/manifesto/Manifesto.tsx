'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MQ_DESKTOP, MQ_MOBILE, isMotionReduced } from '@/lib/motion';
import { manifesto } from '@/content/home';
import { useScrollTo } from '@/components/motion/SmoothScroll';
import { TdbCanvas, buildTdbTimeline } from './TdbCanvas';
import styles from './Manifesto.module.css';

const PHASE_END = [0.92, 1.92, 3];

/**
 * C. Manifesto — "a website is only the beginning" (scroll-filled statement),
 * then the pinned THINK → DESIGN → BUILD sequence (signature moment #2).
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const reduced = isMotionReduced();

      /* Statement: words fill in as you read */
      if (!reduced) {
        const words = q(`.${styles.word}`);
        gsap.fromTo(
          words,
          { opacity: 0.13 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: { trigger: q(`.${styles.statement}`)[0], start: 'top 82%', end: 'bottom 48%', scrub: 0.4 },
          },
        );
        gsap.from(q(`.${styles.highlight}`), {
          scaleX: 0,
          transformOrigin: '100% 50%',
          ease: 'none',
          scrollTrigger: { trigger: q(`.${styles.statement}`)[0], start: 'center 62%', end: 'bottom 48%', scrub: 0.4 },
        });
        gsap.from(q(`.${styles.statementBody}, .${styles.statementMeta} > *`), {
          opacity: 0,
          y: 24,
          stagger: 0.08,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: q(`.${styles.statementBody}`)[0], start: 'top 88%', once: true },
        });
      }

      const mm = gsap.matchMedia();

      /* Desktop: pinned, scrubbed scene */
      mm.add(MQ_DESKTOP, () => {
        const scene = sceneRef.current;
        const canvas = scene?.querySelector<HTMLElement>('[data-tdb-canvas]');
        if (!scene || !canvas) return;
        const canvasTl = buildTdbTimeline(canvas);
        const sq = gsap.utils.selector(scene);
        const wordsEls = sq(`.${styles.bigWord}`);
        const steps = sq(`.${styles.step}`);
        const fills = sq(`.${styles.segFill}`);
        const counter = sq('[data-counter]')[0];

        if (reduced) {
          // Final state, readable without motion.
          canvasTl.progress(1);
          gsap.set(steps, { position: 'relative', opacity: 1 });
          return;
        }

        gsap.set(steps.slice(1), { opacity: 0, y: 40 });
        wordsEls.forEach((w, i) => {
          gsap.set(w.querySelectorAll('span'), { yPercent: i === 0 ? 0 : 110 });
        });

        const master = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              const t = self.progress * 3;
              fills.forEach((f, i) => gsap.set(f, { scaleX: gsap.utils.clamp(0, 1, t - i) }));
              const phase = Math.min(2, Math.floor(t + 0.02));
              if (counter) counter.textContent = `0${phase + 1}`;
              scene.dataset.phase = String(phase);
            },
          },
        });
        stRef.current = master.scrollTrigger ?? null;

        master.add(canvasTl.tweenFromTo(0, 3, { ease: 'none' }), 0);

        // Text & word swaps between phases
        [1, 2].forEach((phase) => {
          const at = phase - 0.12;
          const prevLetters = wordsEls[phase - 1].querySelectorAll('span');
          const nextLetters = wordsEls[phase].querySelectorAll('span');
          master
            .to(prevLetters, { yPercent: -110, stagger: 0.012, duration: 0.14, ease: 'power2.in' }, at)
            .to(nextLetters, { yPercent: 0, stagger: 0.012, duration: 0.16, ease: 'power3.out' }, at + 0.1)
            .to(steps[phase - 1], { opacity: 0, y: -40, duration: 0.12, ease: 'power2.in' }, at)
            .to(steps[phase], { opacity: 1, y: 0, duration: 0.16, ease: 'power3.out' }, at + 0.12);
        });
        master.to({}, { duration: 0.001 }, 3);

        // Each phase colours the scene a little differently
        master
          .to(scene, { '--scene-bg': '#171C27', duration: 0.3 }, 0.9)
          .to(scene, { '--scene-bg': '#1b2130', duration: 0.3 }, 1.9);

        return () => {
          stRef.current = null;
        };
      });

      /* Mobile / tablet: three stacked steps, each canvas plays its own phase */
      mm.add(MQ_MOBILE, () => {
        const canvases = q(`.${styles.mobileList} [data-tdb-canvas]`);
        canvases.forEach((canvas, i) => {
          const tl = buildTdbTimeline(canvas);
          const from = i === 0 ? 0 : PHASE_END[i - 1];
          if (reduced) {
            tl.progress(PHASE_END[i] / 3);
            return;
          }
          tl.progress(from / 3);
          gsap.to(tl, {
            progress: PHASE_END[i] / 3,
            duration: 2.2,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: canvas, start: 'top 78%', once: true },
          });
        });
        if (!reduced) {
          q(`.${styles.mobileStep}`).forEach((stepEl) => {
            gsap.from(stepEl.querySelectorAll('[data-m-reveal]'), {
              opacity: 0,
              y: 30,
              stagger: 0.08,
              duration: 1,
              ease: 'expo.out',
              scrollTrigger: { trigger: stepEl, start: 'top 80%', once: true },
            });
          });
        }
      });
    },
    { scope: root },
  );

  const jumpToPhase = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * ((i + 0.55) / 3);
    scrollTo(y);
  };

  return (
    <section id="approach" ref={root} className={`section ${styles.manifesto}`} data-theme="dark" aria-labelledby="approach-title">
      {/* ---- Statement ---- */}
      <div className={`container ${styles.statementWrap}`}>
        <div className={styles.statementMeta}>
          <span className="kicker">
            <span className="mark" aria-hidden="true" />
            <span>{manifesto.kicker}</span>
          </span>
        </div>
        <h2 id="approach-title" className={styles.statement}>
          {manifesto.statement.map((w, i) => (
            <span key={i} className={styles.wordWrap} data-tone={'tone' in w ? w.tone : undefined}>
              {'tone' in w && w.tone === 'lime' && <span className={styles.highlight} aria-hidden="true" />}
              <span className={styles.word}>{w.text}</span>{' '}
            </span>
          ))}
        </h2>
        <p className={styles.statementBody}>{manifesto.body}</p>
      </div>

      {/* ---- Desktop pinned scene ---- */}
      <div ref={sceneRef} className={styles.scene} data-phase="0">
        <div className={`container ${styles.sceneInner}`}>
          <div className={styles.sceneTop}>
            <p className="kicker">
              <span className="mark" aria-hidden="true" />
              <span className="en">{manifesto.stepsIntro}</span>
            </p>
            <p className={`${styles.counter} en`} aria-hidden="true">
              <span data-counter>01</span>
              <span className={styles.counterTotal}> / 03</span>
            </p>
          </div>

          <div className={styles.sceneGrid}>
            <div className={styles.textCol}>
              <div className={`${styles.bigWords} en`} aria-hidden="true">
                {manifesto.steps.map((s) => (
                  <span key={s.id} className={styles.bigWord}>
                    {s.word.split('').map((ch, i) => (
                      <span key={i}>{ch}</span>
                    ))}
                  </span>
                ))}
              </div>
              <div className={styles.steps}>
                {manifesto.steps.map((s) => (
                  <article key={s.id} className={styles.step}>
                    <h3 className={styles.stepTitle}>
                      <span className="visually-hidden">{s.word}: </span>
                      {s.headline}
                    </h3>
                    <p className={styles.stepBody}>{s.body}</p>
                    <ul role="list" className={styles.tags}>
                      {s.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
            <div className={styles.canvasCol}>
              <TdbCanvas />
            </div>
          </div>

          <div className={styles.progress}>
            {manifesto.steps.map((s, i) => (
              <button key={s.id} type="button" className={styles.seg} onClick={() => jumpToPhase(i)}>
                <span className={styles.segTrack}>
                  <span className={styles.segFill} />
                </span>
                <span className={`${styles.segLabel} en`}>
                  {s.index} — {s.word}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Mobile: stacked steps ---- */}
      <div className={`container ${styles.mobileList}`}>
        <p className="kicker">
          <span className="mark" aria-hidden="true" />
          <span className="en">{manifesto.stepsIntro}</span>
        </p>
        {manifesto.steps.map((s) => (
          <article key={s.id} className={styles.mobileStep}>
            <p className={`${styles.mobileWord} en`} data-m-reveal aria-hidden="true">
              <span>{s.index}</span>
              {s.word}
            </p>
            <div data-m-reveal>
              <TdbCanvas className={styles.mobileCanvas} />
            </div>
            <h3 className={styles.stepTitle} data-m-reveal>
              <span className="visually-hidden">{s.word}: </span>
              {s.headline}
            </h3>
            <p className={styles.stepBody} data-m-reveal>
              {s.body}
            </p>
            <ul role="list" className={styles.tags} data-m-reveal>
              {s.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
