'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ_DESKTOP, isMotionReduced } from '@/lib/motion';
import { services, servicesIntro } from '@/content/services';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Arrow } from '@/components/ui/Arrow';
import { useScrollTo } from '@/components/motion/SmoothScroll';
import { ServiceGlyph, ServiceGraphicView } from './Graphics';
import { SERVICE_EVENT } from '@/lib/contact';
import styles from './Services.module.css';

/**
 * D. What We Create — six columns that unfold into interactive modules
 * (desktop), and an accordion with the same modules on smaller screens.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const hoverTimer = useRef<number | undefined>(undefined);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const el = root.current;
      if (!el || isMotionReduced()) return;
      const q = gsap.utils.selector(el);

      // Light sheet rising over the dark manifesto and opening to full width.
      gsap.fromTo(
        el,
        { clipPath: 'inset(0% 3.5% 0% 3.5% round 32px 32px 0 0)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: true },
        },
      );

      const mm = gsap.matchMedia();
      mm.add(MQ_DESKTOP, () => {
        gsap.from(q(`.${styles.col}`), {
          yPercent: 18,
          opacity: 0,
          stagger: 0.07,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: q(`.${styles.board}`)[0], start: 'top 85%', once: true },
        });
      });
    },
    { scope: root },
  );

  const schedule = (i: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(i), 140);
  };
  const cancel = () => window.clearTimeout(hoverTimer.current);

  const talkAbout = (e: React.MouseEvent<HTMLAnchorElement>, value: string) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(SERVICE_EVENT, { detail: value }));
    scrollTo('#contact');
  };

  return (
    <section
      id="services"
      ref={root}
      className={`section ${styles.services}`}
      data-theme="light"
      aria-labelledby="services-title"
    >
      <div className="container">
        <SectionHeading
          id="services-title"
          index="03"
          kicker={servicesIntro.kicker}
          titleLines={servicesIntro.titleLines}
          lead={servicesIntro.lead}
          reveal="wipe"
          mark
        />

        <div className={styles.board}>
          {services.map((s, i) => {
            const isActive = active === i;
            return (
              <article
                key={s.id}
                className={styles.col}
                data-active={isActive}
                onPointerEnter={(e) => e.pointerType === 'mouse' && schedule(i)}
                onPointerLeave={cancel}
              >
                <h3 className={styles.head}>
                  <button
                    type="button"
                    id={`svc-tab-${s.id}`}
                    className={styles.toggle}
                    aria-expanded={isActive}
                    aria-controls={`svc-${s.id}`}
                    onClick={() => setActive(i)}
                  >
                    <span className={`${styles.num} en`}>{s.index}</span>
                    <span className={styles.category}>{s.category}</span>
                    <span className={styles.short} aria-hidden="true">
                      {s.short}
                    </span>
                    <span className={styles.plus} aria-hidden="true" />
                  </button>
                </h3>

                <span className={styles.glyphWrap} aria-hidden="true">
                  <ServiceGlyph type={s.graphic} />
                </span>

                <div
                  id={`svc-${s.id}`}
                  className={styles.body}
                  role="region"
                  aria-labelledby={`svc-tab-${s.id}`}
                  inert={!isActive}
                >
                  <div className={styles.bodyInner}>
                    <div className={styles.graphic} aria-hidden="true">
                      <ServiceGraphicView type={s.graphic} active={isActive} />
                    </div>
                    <p className={styles.hint} aria-hidden="true">
                      {s.hint}
                    </p>
                    <div className={styles.text}>
                      <p className={styles.title}>{s.title}</p>
                      <p className={styles.desc}>{s.description}</p>
                      <p className={styles.benefit}>
                        <span className={styles.benefitLabel}>
                          <span className="mark" aria-hidden="true" />
                          התועלת העסקית
                        </span>
                        {s.benefit}
                      </p>
                      <a href="#contact" className={styles.talk} onClick={(e) => talkAbout(e, s.formValue)}>
                        <span>לדבר על {s.short}</span>
                        <Arrow direction="out" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
