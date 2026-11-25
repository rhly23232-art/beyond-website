import type { CaseStudy, Wire } from '@/content/cases';
import styles from './Diagrams.module.css';

/* ------------------------------------------------------------------ */
/* Competitive matrix                                                  */
/* ------------------------------------------------------------------ */
const LEVEL = ['לא קיים', 'חלקי', 'מלא'];
export function Matrix({ m }: { m: CaseStudy['research']['matrix'] }) {
  return (
    <div className={styles.matrixWrap}>
      <table className={styles.matrix}>
        <caption className="visually-hidden">השוואת מתחרים לפי קריטריונים</caption>
        <thead>
          <tr>
            <th scope="col">קריטריון</th>
            {m.cols.map((c, i) => (
              <th key={c} scope="col" data-ours={i === m.cols.length - 1}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {m.rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {r.vals.map((v, i) => (
                <td key={i} data-ours={i === r.vals.length - 1}>
                  <span className={styles.level} data-v={v} aria-label={LEVEL[v]} role="img" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.legend} aria-hidden="true">
        <span><span className={styles.level} data-v={2} /> מלא</span>
        <span><span className={styles.level} data-v={1} /> חלקי</span>
        <span><span className={styles.level} data-v={0} /> לא קיים</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Journey map — emotion curve over stages (RTL: first stage on right)  */
/* ------------------------------------------------------------------ */
export function Journey({ j }: { j: CaseStudy['journey'] }) {
  const n = j.stages.length;
  const W = n * 200;
  const H = 170;
  const x = (i: number) => W - (i + 0.5) * 200;
  const y = (v: number) => H / 2 - v * 32;
  const pts = j.stages.map((s, i) => [x(i), y(s.feel)] as const);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
  }
  const fmt = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : '0');
  return (
    <div className={styles.journey} style={{ ['--n' as string]: n }}>
      <div className={styles.jStages} aria-hidden="true">
        {j.stages.map((s, i) => (
          <div key={s.name} className={styles.jStage}>
            <span className="en">{String(i + 1).padStart(2, '0')}</span>
            <b>{s.name}</b>
          </div>
        ))}
      </div>
      <div className={styles.jCurve}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`עקומת רגש: ${j.stages.map((s) => `${s.name} ${s.feel > 0 ? 'חיובי' : s.feel < 0 ? 'שלילי' : 'ניטרלי'}`).join(', ')}`}>
          <line x1="0" x2={W} y1={H / 2} y2={H / 2} className={styles.jZero} />
          <path d={`${d} L${pts[pts.length - 1][0]} ${H} L${pts[0][0]} ${H} Z`} className={styles.jArea} />
          <path d={d} className={styles.jLine} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className={styles.jDots} aria-hidden="true">
          {j.stages.map((s, i) => (
            <span key={i} style={{ right: `${((i + 0.5) / n) * 100}%`, top: `${(y(s.feel) / H) * 100}%` }} data-feel={s.feel}>
              {fmt(s.feel)}
            </span>
          ))}
        </div>
      </div>
      <dl className={styles.jGrid}>
        {(['doing', 'pain', 'opp'] as const).map((row) => (
          <div key={row} className={styles.jRow} data-row={row}>
            <dt>{row === 'doing' ? 'מה קורה' : row === 'pain' ? 'נקודת כאב' : 'הזדמנות'}</dt>
            {j.stages.map((s) => (
              <dd key={s.name}>
                <span className="visually-hidden">{s.name}: </span>
                {s[row]}
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sitemap / information architecture                                  */
/* ------------------------------------------------------------------ */
export function Sitemap({ ia }: { ia: CaseStudy['ia'] }) {
  return (
    <div className={styles.sitemap} style={{ ['--n' as string]: ia.children.length }}>
      <div className={styles.smRoot}>
        <span>{ia.root}</span>
      </div>
      <ul role="list" className={styles.smChildren}>
        {ia.children.map((c) => (
          <li key={c.label}>
            <span className={styles.smNode}>{c.label}</span>
            <ul role="list" className={styles.smItems}>
              {c.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* User flow                                                           */
/* ------------------------------------------------------------------ */
function Chevron() {
  return (
    <svg className={styles.flowArrow} viewBox="0 0 32 12" aria-hidden="true">
      <path d="M31 6H3m5-5L2 6l6 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
export function Flow({ f }: { f: CaseStudy['flow'] }) {
  return (
    <div className={styles.flow}>
      <ol role="list" className={styles.flowMain} aria-label={f.title}>
        {f.main.map((s, i) => (
          <li key={s} className={styles.flowItem}>
            <span className={i === 0 ? styles.flowStart : styles.flowStep}>{s}</span>
            <Chevron />
          </li>
        ))}
        <li className={styles.flowItem}>
          <span className={styles.flowDecision}>
            <span>{f.decision}</span>
          </span>
        </li>
      </ol>
      <div className={styles.flowBranches}>
        <div className={styles.flowBranch} data-b="yes">
          <span className={styles.flowLabel}>כן</span>
          <span className={styles.flowEnd}>{f.yes}</span>
        </div>
        <div className={styles.flowBranch} data-b="no">
          <span className={styles.flowLabel}>לא</span>
          {f.no.map((s, i) => (
            <span key={s} className={styles.flowNoItem}>
              <span className={styles.flowStep}>{s}</span>
              {i < f.no.length - 1 && <Chevron />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Low-fidelity wireframes                                             */
/* ------------------------------------------------------------------ */
function Block({ b }: { b: Wire }) {
  const style = { gridColumn: `span ${b.s}`, gridRow: b.h > 1 ? `span ${b.h}` : undefined };
  return (
    <span className={styles.wb} data-k={b.k} style={style} aria-hidden="true">
      {b.k === 'text' && (
        <>
          <i />
          <i />
          <i />
        </>
      )}
      {b.k === 'list' && (
        <>
          <i />
          <i />
          <i />
          <i />
        </>
      )}
    </span>
  );
}
export function Wireframe({ w }: { w: CaseStudy['wireframes'][number] }) {
  return (
    <figure className={styles.wire} data-device={w.device}>
      <div className={styles.wireScreen}>
        {w.rows
          .flat()
          .filter((b) => !(b.k === 'space' && b.h === 0))
          .map((b, i) => (
          <Block key={i} b={b} />
        ))}
      </div>
      <figcaption>
        <b>{w.title}</b>
        <span>{w.note}</span>
      </figcaption>
    </figure>
  );
}
