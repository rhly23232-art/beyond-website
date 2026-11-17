import { LOCKUP, LOGOTYPE, SYMBOL } from './logo-data';
import styles from './Logo.module.css';

type Props = {
  className?: string;
  title?: string;
  mono?: boolean;
};

/** Horizontal lockup — symbol + outlined BEYOND logotype (Space Grotesk Bold). */
export function Logo({ className, title = 'BEYOND', mono }: Props) {
  return (
    <svg
      viewBox={`0 0 ${LOCKUP.width} ${LOCKUP.height}`}
      className={[styles.logo, className].filter(Boolean).join(' ')}
      role="img"
      aria-label={title}
      focusable="false"
    >
      <g className={styles.symbol}>
        <g fill="none" stroke="currentColor" strokeWidth={SYMBOL.stroke} strokeLinejoin="miter">
          <path d={SYMBOL.frame} strokeLinecap="square" />
          <g className={styles.arrow}>
            <path d={SYMBOL.shaft} strokeLinecap="butt" />
            <path d={SYMBOL.head} strokeLinecap="square" />
          </g>
        </g>
        <rect
          className={styles.lime}
          x={SYMBOL.lime.x}
          y={SYMBOL.lime.y}
          width={SYMBOL.lime.size}
          height={SYMBOL.lime.size}
          fill={mono ? 'currentColor' : 'var(--c-lime)'}
        />
      </g>
      <g fill="currentColor" transform={`translate(${LOCKUP.textX} ${LOCKUP.textY})`}>
        {LOGOTYPE.glyphs.map((g, i) => (
          <path key={i} d={g.d} />
        ))}
      </g>
    </svg>
  );
}
