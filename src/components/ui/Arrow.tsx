import styles from './Arrow.module.css';

export type ArrowDirection = 'out' | 'up-right' | 'down' | 'left' | 'right' | 'up';

const ROTATION: Record<ArrowDirection, number> = {
  'up-right': 0,
  right: 45,
  down: 135,
  left: 225,
  out: 270, // ↖ — the RTL mirror of the brand arrow
  up: 315,
};

/** Geometric brand arrow: straight shaft + square chevron. */
export function Arrow({ direction = 'out', className }: { direction?: ArrowDirection; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={[styles.arrow, className].filter(Boolean).join(' ')}
      style={{ rotate: `${ROTATION[direction]}deg` }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 13L12.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M5.5 3H13V10.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );
}
