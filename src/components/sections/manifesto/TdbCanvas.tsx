import { gsap } from '@/lib/gsap';
import styles from './TdbCanvas.module.css';

/* ------------------------------------------------------------------ */
/* Geometry (percent of the canvas)                                    */
/* ------------------------------------------------------------------ */

const CENTER = { x: 50, y: 47 };

const NODES = [
  { id: 'biz', label: 'עסק', x: 17, y: 19, to: 'bar' },
  { id: 'goals', label: 'מטרות', x: 79, y: 15, to: 'hero' },
  { id: 'users', label: 'משתמשים', x: 13, y: 76, to: 'c1' },
  { id: 'opps', label: 'הזדמנויות', x: 81, y: 72, to: 'c3' },
] as const;

type Block = { id: string; x: number; y: number; w: number; h: number; kind: string };

const BLOCKS: Block[] = [
  { id: 'bar', x: 11, y: 17, w: 78, h: 5, kind: 'bar' },
  { id: 'hero', x: 11, y: 25.5, w: 78, h: 31, kind: 'hero' },
  { id: 't1', x: 42, y: 31.5, w: 41, h: 4.4, kind: 'text' },
  { id: 't2', x: 54, y: 38, w: 29, h: 4.4, kind: 'text' },
  { id: 'cta', x: 16, y: 46.5, w: 19, h: 6, kind: 'cta' },
  { id: 'c1', x: 11, y: 60.5, w: 24.6, h: 21, kind: 'card' },
  { id: 'c2', x: 37.7, y: 60.5, w: 24.6, h: 21, kind: 'card' },
  { id: 'c3', x: 64.4, y: 60.5, w: 24.6, h: 21, kind: 'card' },
];

const CTA_TILE = { x: 17.6, y: 47.6 };

const CODE = [
  ['<', 'Page', ' lang="he" dir="rtl">'],
  ['  <', 'Nav', ' />'],
  ['  <', 'Hero', ' goal="leads" />'],
  ['  <', 'Services', ' items={6} />'],
  ['  <', 'Contact', ' validate />'],
  ['</', 'Page', '>'],
];

const pct = (n: number) => `${n}%`;

/** The evolving canvas of the THINK → DESIGN → BUILD sequence. */
export function TdbCanvas({ className }: { className?: string }) {
  return (
    <div className={[styles.canvas, className].filter(Boolean).join(' ')} data-tdb-canvas aria-hidden="true">
      <div className={styles.dots} data-tdb="dots" />

      {/* THINK — mapping the business */}
      <div className={styles.rings} style={{ left: pct(CENTER.x), top: pct(CENTER.y) }}>
        {[0, 1, 2].map((i) => (
          <span key={i} data-tdb="ring" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
      <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none">
        {NODES.map((n) => (
          <path
            key={n.id}
            data-tdb="link"
            d={`M${n.x} ${n.y} L${CENTER.x} ${CENTER.y}`}
            pathLength={1}
          />
        ))}
      </svg>
      {NODES.map((n) => (
        <div
          key={n.id}
          className={styles.node}
          data-tdb="node"
          data-to={n.to}
          style={{ left: pct(n.x), top: pct(n.y) }}
        >
          <i />
          <span>{n.label}</span>
        </div>
      ))}

      {/* DESIGN — structure, journey, interface */}
      <div className={styles.browser} data-tdb="browser">
        <span data-tdb="seg" data-seg="top" />
        <span data-tdb="seg" data-seg="left" />
        <span data-tdb="seg" data-seg="bottom" />
        <span data-tdb="seg" data-seg="right" />
        <div className={styles.chrome} data-tdb="chrome">
          <i />
          <i />
          <i />
          <span className={styles.url} />
        </div>
      </div>

      {BLOCKS.map((b) => (
        <div
          key={b.id}
          className={styles.block}
          data-tdb="block"
          data-block={b.id}
          data-kind={b.kind}
          style={{ left: pct(b.x), top: pct(b.y), width: pct(b.w), height: pct(b.h) }}
        >
          <span className={styles.wire} data-tdb="wire" />
          <span className={styles.solid} data-tdb="solid">
            {b.kind === 'card' && (
              <>
                <i className={styles.icon} />
                <i className={styles.lineA} />
                <i className={styles.lineB} />
              </>
            )}
            {b.kind === 'bar' && (
              <>
                <i className={styles.navLogo} />
                <i className={styles.navLinks} />
              </>
            )}
            {b.kind === 'cta' && <i className={styles.ctaLabel} />}
          </span>
        </div>
      ))}

      {/* BUILD — a working product */}
      <div className={styles.code} data-tdb="code">
        <div className={styles.codeHead}>
          <i />
          <span>page.tsx</span>
        </div>
        {CODE.map(([a, b, c], i) => (
          <p key={i} data-tdb="codeline">
            <span className={styles.punct}>{a}</span>
            <span className={styles.tag}>{b}</span>
            <span className={styles.attr}>{c}</span>
          </p>
        ))}
      </div>

      <div className={styles.live} data-tdb="live">
        <i />
        LIVE
      </div>

      <span
        className={styles.insight}
        data-tdb="insight"
        style={{ left: pct(CENTER.x), top: pct(CENTER.y) }}
      />
    </div>
  );
}

/**
 * Builds the paused 3-unit timeline for one canvas:
 *   0 → 1 THINK · 1 → 2 DESIGN · 2 → 3 BUILD.
 * Desktop scrubs it with the pinned scene; mobile plays one phase per canvas.
 */
export function buildTdbTimeline(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const get = (k: string) => q(`[data-tdb="${k}"]`);
  const block = (id: string) => q(`[data-block="${id}"]`)[0];

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.3 } });

  /* initial states */
  gsap.set(get('dots'), { opacity: 0 });
  gsap.set(get('ring'), { scale: 0, opacity: 0 });
  gsap.set(get('link'), { strokeDashoffset: 1 });
  gsap.set(get('node'), { scale: 0, opacity: 0 });
  gsap.set(get('insight'), { scale: 0, xPercent: -50, yPercent: -50 });
  gsap.set(get('seg'), { scale: 0 });
  gsap.set(get('chrome'), { opacity: 0 });
  gsap.set(get('block'), { clipPath: 'inset(0% 0% 100% 0%)' });
  gsap.set(get('solid'), { opacity: 0 });
  gsap.set(get('code'), { opacity: 0, x: -30 });
  gsap.set(get('codeline'), { clipPath: 'inset(0% 100% 0% 0%)' });
  gsap.set(get('live'), { opacity: 0, scale: 0.6 });

  /* THINK 0 → 1 */
  tl.addLabel('think', 0)
    .to(get('dots'), { opacity: 1, duration: 0.25 }, 0)
    .to(get('ring'), { scale: 1, opacity: 1, stagger: 0.07, duration: 0.3, ease: 'back.out(1.6)' }, 0.04)
    .to(get('node'), { scale: 1, opacity: 1, stagger: 0.07, duration: 0.25, ease: 'back.out(2)' }, 0.08)
    .to(get('link'), { strokeDashoffset: 0, stagger: 0.06, duration: 0.3, ease: 'power1.inOut' }, 0.24)
    .to(get('insight'), { scale: 1, duration: 0.25, ease: 'back.out(2.4)' }, 0.42)
    .to(get('ring'), { rotate: 45, stagger: 0.04, duration: 0.4, ease: 'power1.inOut' }, 0.55);

  /* DESIGN 1 → 2 */
  tl.addLabel('design', 1)
    .to(get('link'), { strokeDashoffset: -1, duration: 0.2, ease: 'power1.in' }, 1)
    .to(get('ring'), { scale: 2.4, opacity: 0, duration: 0.25, ease: 'power2.in' }, 1);
  NODES.forEach((n, i) => {
    const target = BLOCKS.find((b) => b.id === n.to)!;
    tl.to(
      q(`[data-tdb="node"][data-to="${n.to}"]`),
      { left: pct(target.x + target.w / 2), top: pct(target.y + target.h / 2), scale: 0.5, duration: 0.3, ease: 'power2.inOut' },
      1.02 + i * 0.03,
    );
  });
  tl.to(get('node'), { opacity: 0, duration: 0.12 }, 1.3)
    .to(q('[data-seg="top"]'), { scale: 1, duration: 0.22, ease: 'power2.inOut' }, 1.08)
    .to(q('[data-seg="left"]'), { scale: 1, duration: 0.22, ease: 'power2.inOut' }, 1.12)
    .to(q('[data-seg="bottom"]'), { scale: 1, duration: 0.22, ease: 'power2.inOut' }, 1.2)
    .to(q('[data-seg="right"]'), { scale: 1, duration: 0.2, ease: 'power2.inOut' }, 1.3)
    .to(get('chrome'), { opacity: 1, duration: 0.15 }, 1.3)
    .to(get('block'), { clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.045, duration: 0.25, ease: 'power2.inOut' }, 1.22)
    .to(get('insight'), { scale: 0.7, duration: 0.25 }, 1.4)
    .to(get('dots'), { opacity: 0.4, duration: 0.3 }, 1.4);

  /* BUILD 2 → 3 */
  tl.addLabel('build', 2)
    .to(q('[data-block="bar"] [data-tdb="solid"], [data-block="hero"] [data-tdb="solid"]'), { opacity: 1, stagger: 0.06 }, 2)
    .to(q('[data-kind="text"] [data-tdb="solid"]'), { opacity: 1, stagger: 0.06, duration: 0.2 }, 2.12)
    .to(q('[data-kind="card"] [data-tdb="solid"]'), { opacity: 1, stagger: 0.07, duration: 0.25 }, 2.18)
    .to(q('[data-kind="cta"] [data-tdb="solid"]'), { opacity: 1, duration: 0.2 }, 2.3)
    .to(get('wire'), { opacity: 0, duration: 0.25 }, 2.25)
    .to(get('code'), { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' }, 2.3)
    .to(get('codeline'), { clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.05, duration: 0.18, ease: 'none' }, 2.4)
    .to(
      get('insight'),
      { left: pct(CTA_TILE.x), top: pct(CTA_TILE.y), scale: 0.62, duration: 0.3, ease: 'power3.inOut' },
      2.5,
    )
    .to(block('cta'), { scale: 1.06, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 2.8)
    .to(get('live'), { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }, 2.78)
    .addLabel('end', 3);

  return tl;
}
