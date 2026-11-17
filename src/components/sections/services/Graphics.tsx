'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';
import type { ServiceGraphic } from '@/content/services';
import { usePointerField } from './usePointerField';
import styles from './Graphics.module.css';

type GraphicProps = { active: boolean };

/* ==================================================================== */
/* 01 · Strategy — positioning matrix                                    */
/* ==================================================================== */

const QUADRANTS = [
  { id: 'tl', label: 'לשפר' },
  { id: 'tr', label: 'כאן בונים' },
  { id: 'bl', label: 'לוותר' },
  { id: 'br', label: 'לבדוק' },
];

function MatrixGraphic({ active }: GraphicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const last = useRef('');

  usePointerField(ref, {
    active,
    idle: (t) => ({ x: 0.55 + Math.sin(t * 0.7) * 0.3, y: 0.45 + Math.sin(t * 1.1 + 1) * 0.3 }),
    onUpdate: (x, y) => {
      const q = `${y < 0.5 ? 't' : 'b'}${x < 0.5 ? 'l' : 'r'}`;
      if (q !== last.current && ref.current) {
        last.current = q;
        ref.current.dataset.q = q;
      }
      if (readout.current) {
        readout.current.textContent = `ערך ${Math.round(x * 100)} · צורך ${Math.round((1 - y) * 100)}`;
      }
    },
  });

  return (
    <div ref={ref} className={`${styles.g} ${styles.matrix}`} data-q="tr" data-cursor="">
      <div className={styles.plot}>
        {QUADRANTS.map((q) => (
          <span key={q.id} className={styles.quad} data-quad={q.id}>
            {q.label}
          </span>
        ))}
        <span className={styles.crossX} />
        <span className={styles.crossY} />
        <span className={styles.marker} />
      </div>
      <span className={styles.axisY}>צורך משתמש</span>
      <span className={styles.axisX}>ערך עסקי</span>
      <span ref={readout} className={styles.readout} />
    </div>
  );
}

/* ==================================================================== */
/* 02 · UX — user journey                                                */
/* ==================================================================== */

const JOURNEY_PATH = 'M372 70 C 320 70, 312 150, 258 150 S 196 62, 142 78 S 84 186, 28 176';
const STOPS = [
  { at: 0.02, label: 'נחיתה' },
  { at: 0.27, label: 'הבנה' },
  { at: 0.5, label: 'אמון' },
  { at: 0.74, label: 'החלטה' },
  { at: 0.98, label: 'פעולה' },
];

function JourneyGraphic({ active }: GraphicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const traveler = useRef<SVGRectElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const passed = useRef(-1);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    setPoints(STOPS.map((s) => p.getPointAtLength(len * s.at)));
  }, []);

  usePointerField(ref, {
    active,
    idle: (t) => ({ x: 1 - ((t * 0.12) % 1.15), y: 0.5 }),
    onUpdate: (x) => {
      const p = pathRef.current;
      if (!p || !traveler.current || !progressRef.current) return;
      const prog = Math.min(1, Math.max(0, 1 - x));
      const len = p.getTotalLength();
      const pt = p.getPointAtLength(len * prog);
      traveler.current.setAttribute('x', String(pt.x - 7));
      traveler.current.setAttribute('y', String(pt.y - 7));
      progressRef.current.style.strokeDashoffset = String(1 - prog);
      const idx = STOPS.filter((s) => s.at <= prog + 0.001).length - 1;
      if (idx !== passed.current && ref.current) {
        passed.current = idx;
        ref.current.dataset.passed = String(idx);
      }
    },
  });

  return (
    <div ref={ref} className={`${styles.g} ${styles.journey}`} data-passed="-1" data-cursor="">
      <svg viewBox="0 0 400 240" className={styles.journeySvg}>
        <path ref={pathRef} d={JOURNEY_PATH} className={styles.pathGhost} />
        <path ref={progressRef} d={JOURNEY_PATH} className={styles.pathLive} pathLength={1} />
        {points.map((pt, i) => (
          <g key={i} className={styles.stop} data-stop={i}>
            <rect x={pt.x - 6} y={pt.y - 6} width={12} height={12} />
            <text x={pt.x} y={pt.y + (i % 2 === 0 ? -16 : 28)} textAnchor="middle">
              {STOPS[i].label}
            </text>
          </g>
        ))}
        <rect ref={traveler} width={14} height={14} className={styles.traveler} x={365} y={63} />
      </svg>
    </div>
  );
}

/* ==================================================================== */
/* 03 · UI — design system that updates from one token                   */
/* ==================================================================== */

function SystemGraphic({ active }: GraphicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  usePointerField(ref, {
    active,
    idle: (t) => ({ x: 0.5 + Math.sin(t * 0.8) * 0.45, y: 0.5 }),
    onUpdate: (x) => {
      const r = Math.round(x * 24);
      ref.current?.style.setProperty('--r', `${r}px`);
      if (readout.current) readout.current.textContent = `radius: ${r}px`;
    },
  });

  return (
    <div
      ref={ref}
      className={`${styles.g} ${styles.system}`}
      data-mode={mode}
      data-cursor="לחצו להחלפת מצב"
      onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
    >
      <div className={styles.tokens}>
        {['#10131A', '#355CFF', '#C7F34A', '#E8EDFF'].map((c) => (
          <span key={c} className={styles.swatch} style={{ background: c }}>
            <i className="en">{c}</i>
          </span>
        ))}
      </div>
      <div className={styles.typeRow}>
        <span className={`${styles.aa} en`}>Aa</span>
        <span className={styles.scale}>
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className={styles.components}>
        <span className={styles.sBtn}>
          פעולה <i />
        </span>
        <span className={styles.sToggle}>
          <i />
        </span>
        <span className={styles.sInput}>
          <i />
        </span>
        <span className={styles.sChip}>תווית</span>
        <span className={styles.sCard}>
          <i />
          <b />
          <b />
        </span>
      </div>
      <span ref={readout} className={`${styles.readout} en`} />
    </div>
  );
}

/* ==================================================================== */
/* 04 · Web design — compositions                                        */
/* ==================================================================== */

type Rect = [number, number, number, number]; // x, y, w, h (%)
const LAYOUTS: { name: string; blocks: Record<string, Rect> }[] = [
  {
    name: 'A · קלאסי',
    blocks: {
      nav: [6, 6, 88, 7],
      h1: [30, 20, 64, 10],
      h2: [48, 33, 46, 6],
      img: [6, 47, 88, 26],
      c1: [6, 78, 28, 16],
      c2: [36, 78, 28, 16],
      c3: [66, 78, 28, 16],
    },
  },
  {
    name: 'B · א-סימטרי',
    blocks: {
      nav: [6, 6, 88, 7],
      h1: [46, 20, 48, 22],
      h2: [46, 46, 38, 6],
      img: [6, 20, 36, 74],
      c1: [46, 58, 48, 10],
      c2: [46, 71, 48, 10],
      c3: [46, 84, 30, 10],
    },
  },
  {
    name: 'C · מגזיני',
    blocks: {
      nav: [6, 6, 88, 7],
      h1: [6, 18, 88, 18],
      h2: [56, 40, 38, 6],
      img: [6, 52, 56, 42],
      c1: [66, 52, 28, 12],
      c2: [66, 67, 28, 12],
      c3: [66, 82, 28, 12],
    },
  },
];

function LayoutGraphic({ active }: GraphicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState(0);
  const hovering = useRef(false);

  useEffect(() => {
    if (!active || isMotionReduced()) return;
    const id = window.setInterval(() => {
      if (!hovering.current) setLayout((l) => (l + 1) % LAYOUTS.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [active]);

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const fromRight = 1 - (e.clientX - r.left) / r.width; // RTL: first composition on the right
    setLayout(Math.min(LAYOUTS.length - 1, Math.floor(fromRight * LAYOUTS.length)));
  };

  const current = LAYOUTS[layout];
  return (
    <div
      ref={ref}
      className={`${styles.g} ${styles.layout}`}
      data-cursor=""
      onPointerMove={onMove}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
    >
      <div className={styles.browser}>
        <div className={styles.browserBar}>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.page}>
          {Object.entries(current.blocks).map(([id, [x, y, w, h]]) => (
            <span
              key={id}
              className={styles.lBlock}
              data-b={id}
              style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className={styles.layoutTabs}>
        {LAYOUTS.map((l, i) => (
          <span key={l.name} data-on={i === layout}>
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ==================================================================== */
/* 05 · Development — code ↔ preview mapping                             */
/* ==================================================================== */

const CODE_LINES: { code: [string, string, string]; region?: string; indent: number }[] = [
  { code: ['<', 'Layout', '>'], indent: 0 },
  { code: ['<', 'Header', ' sticky />'], region: 'header', indent: 1 },
  { code: ['<', 'Hero', ' priority />'], region: 'hero', indent: 1 },
  { code: ['<', 'Grid', ' cols={3}>'], region: 'grid', indent: 1 },
  { code: ['<', 'Card', ' lazy />'], region: 'grid', indent: 2 },
  { code: ['</', 'Grid', '>'], region: 'grid', indent: 1 },
  { code: ['<', 'Footer', ' />'], region: 'footer', indent: 1 },
  { code: ['</', 'Layout', '>'], indent: 0 },
];
const REGIONS = ['header', 'hero', 'grid', 'footer'];

function CodeGraphic({ active }: GraphicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hl, setHl] = useState<string | null>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    const reduced = isMotionReduced();
    if (el && !reduced) {
      gsap.fromTo(
        el.querySelectorAll('[data-codeline]'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.09, duration: 0.45, ease: 'steps(12)', delay: 0.35 },
      );
    }
    if (reduced) return;
    let i = 0;
    const id = window.setInterval(() => {
      if (hoveringRef.current) return;
      setHl(REGIONS[i % REGIONS.length]);
      i++;
    }, 1500);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div
      ref={ref}
      className={`${styles.g} ${styles.code}`}
      data-hl={hl ?? ''}
      data-cursor=""
      onPointerEnter={() => (hoveringRef.current = true)}
      onPointerLeave={() => (hoveringRef.current = false)}
    >
      <div className={styles.editor}>
        <div className={styles.editorBar}>
          <i />
          <span className="en">page.tsx</span>
        </div>
        {CODE_LINES.map((l, i) => (
          <p
            key={i}
            data-codeline
            data-region={l.region}
            data-on={l.region !== undefined && l.region === hl}
            style={{ paddingInlineStart: `${l.indent * 1.1 + 0.6}em` }}
            onPointerEnter={() => l.region && setHl(l.region)}
          >
            <span className={styles.ln}>{i + 1}</span>
            <span className={styles.punct}>{l.code[0]}</span>
            <span className={styles.tag}>{l.code[1]}</span>
            <span className={styles.attr}>{l.code[2]}</span>
          </p>
        ))}
      </div>
      <div className={styles.preview}>
        {REGIONS.map((r) => (
          <span key={r} className={styles.region} data-region={r} data-on={r === hl} onPointerEnter={() => setHl(r)}>
            {r === 'grid' && (
              <>
                <i />
                <i />
                <i />
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ==================================================================== */
/* 06 · Technology — connected systems                                   */
/* ==================================================================== */

const NET_NODES = [
  { id: 'cms', label: 'CMS', x: 200, y: 34 },
  { id: 'api', label: 'API', x: 332, y: 84 },
  { id: 'crm', label: 'CRM', x: 332, y: 176 },
  { id: 'ai', label: 'AI', x: 200, y: 226 },
  { id: 'auto', label: 'אוטומציה', x: 68, y: 176 },
  { id: 'data', label: 'אנליטיקס', x: 68, y: 84 },
];
const CENTER = { x: 200, y: 130 };
const EXTRA_LINKS: [string, string][] = [
  ['cms', 'api'],
  ['crm', 'auto'],
  ['data', 'ai'],
];

function NetworkGraphic({ active }: GraphicProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const links = useMemo(
    () => [
      ...NET_NODES.map((n) => ({ a: n.id, b: 'core', x1: n.x, y1: n.y, x2: CENTER.x, y2: CENTER.y })),
      ...EXTRA_LINKS.map(([a, b]) => {
        const na = NET_NODES.find((n) => n.id === a)!;
        const nb = NET_NODES.find((n) => n.id === b)!;
        return { a, b, x1: na.x, y1: na.y, x2: nb.x, y2: nb.y };
      }),
    ],
    [],
  );

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !active || isMotionReduced()) return;
    const pulses = Array.from(svg.querySelectorAll<SVGRectElement>('[data-pulse]'));
    const state = pulses.map((_, i) => ({ link: i % links.length, t: Math.random() }));
    const tick = (_: number, delta: number) => {
      const f = svg.dataset.focus;
      state.forEach((s, i) => {
        const l = links[s.link];
        const boosted = f && (l.a === f || l.b === f);
        s.t += (delta / 1000) * (boosted ? 0.9 : 0.32);
        if (s.t > 1) {
          s.t = 0;
          s.link = Math.floor(Math.random() * links.length);
        }
        const x = l.x1 + (l.x2 - l.x1) * s.t;
        const y = l.y1 + (l.y2 - l.y1) * s.t;
        pulses[i].setAttribute('x', String(x - 3));
        pulses[i].setAttribute('y', String(y - 3));
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [active, links]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 260"
      className={`${styles.g} ${styles.network}`}
      data-focus={focus ?? ''}
      data-cursor=""
      onPointerLeave={() => setFocus(null)}
    >
      {links.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          className={styles.netLink}
          data-on={focus !== null && (l.a === focus || l.b === focus)}
        />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} data-pulse width={6} height={6} className={styles.pulse} x={-10} y={-10} />
      ))}
      {NET_NODES.map((n) => (
        <g
          key={n.id}
          className={styles.netNode}
          data-on={focus === n.id}
          onPointerEnter={() => setFocus(n.id)}
        >
          <rect x={n.x - 30} y={n.y - 15} width={60} height={30} rx={7} />
          <text x={n.x} y={n.y + 5} textAnchor="middle">
            {n.label}
          </text>
        </g>
      ))}
      <g className={styles.core}>
        <rect x={CENTER.x - 46} y={CENTER.y - 22} width={92} height={44} rx={9} />
        <rect x={CENTER.x - 36} y={CENTER.y - 6} width={12} height={12} className={styles.coreMark} />
        <text x={CENTER.x + 8} y={CENTER.y + 5} textAnchor="middle">
          המוצר
        </text>
      </g>
    </svg>
  );
}

/* ==================================================================== */

const MAP: Record<ServiceGraphic, (p: GraphicProps) => React.JSX.Element> = {
  matrix: MatrixGraphic,
  journey: JourneyGraphic,
  system: SystemGraphic,
  layout: LayoutGraphic,
  code: CodeGraphic,
  network: NetworkGraphic,
};

export function ServiceGraphicView({ type, active }: { type: ServiceGraphic; active: boolean }) {
  const Comp = MAP[type];
  return <Comp active={active} />;
}

/** Small static glyphs shown on collapsed columns. */
export function ServiceGlyph({ type }: { type: ServiceGraphic }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 };
  return (
    <svg viewBox="0 0 40 40" className={styles.glyph} aria-hidden="true">
      {type === 'matrix' && (
        <>
          <path d="M4 20H36M20 4V36" {...common} />
          <rect x="25" y="9" width="6" height="6" fill="currentColor" />
        </>
      )}
      {type === 'journey' && (
        <>
          <path d="M36 10C26 10 26 30 4 30" {...common} />
          <rect x="15" y="17" width="6" height="6" fill="currentColor" />
        </>
      )}
      {type === 'system' && (
        <>
          <rect x="4" y="4" width="14" height="14" {...common} />
          <rect x="22" y="4" width="14" height="14" rx="5" {...common} />
          <rect x="4" y="22" width="32" height="14" rx="3" {...common} />
        </>
      )}
      {type === 'layout' && (
        <>
          <rect x="4" y="4" width="32" height="32" {...common} />
          <path d="M4 14H36M22 14V36" {...common} />
        </>
      )}
      {type === 'code' && <path d="M15 11L6 20L15 29M25 11L34 20L25 29" {...common} />}
      {type === 'network' && (
        <>
          <path d="M20 20L7 8M20 20L33 8M20 20L20 35" {...common} />
          <rect x="16" y="16" width="8" height="8" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
