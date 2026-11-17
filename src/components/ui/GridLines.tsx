import styles from './GridLines.module.css';

type Props = {
  className?: string;
  /** data attribute placed on every line, used as an animation hook */
  hook?: string;
};

/** The visible layout grid (12 / 8 / 4 columns) — part of the brand language. */
export function GridLines({ className, hook = 'gridline' }: Props) {
  return (
    <div className={[styles.grid, className].filter(Boolean).join(' ')} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className={styles.cell} {...{ [`data-${hook}`]: '' }} />
      ))}
    </div>
  );
}
