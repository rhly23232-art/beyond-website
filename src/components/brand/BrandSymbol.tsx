import { SYMBOL } from './logo-data';

type Props = {
  className?: string;
  /** Accessible name; omit for decorative use. */
  title?: string;
  /** Monochrome: the lime square takes the current colour. */
  mono?: boolean;
  /** Class names for the individual parts (used by animations). */
  parts?: Partial<Record<'frame' | 'shaft' | 'head' | 'lime', string>>;
  strokeWidth?: number;
};

/** The BEYOND symbol: open frame · outward arrow · Signal Lime square. */
export function BrandSymbol({ className, title, mono, parts = {}, strokeWidth = SYMBOL.stroke }: Props) {
  const a11y = title ? { role: 'img' as const, 'aria-label': title } : { 'aria-hidden': true as const };
  return (
    <svg viewBox="0 0 72 72" className={className} focusable="false" {...a11y}>
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="miter">
        <path className={parts.frame} d={SYMBOL.frame} strokeLinecap="square" pathLength={1} />
        <path className={parts.shaft} d={SYMBOL.shaft} strokeLinecap="butt" pathLength={1} />
        <path className={parts.head} d={SYMBOL.head} strokeLinecap="square" pathLength={1} />
      </g>
      <rect
        className={parts.lime}
        x={SYMBOL.lime.x}
        y={SYMBOL.lime.y}
        width={SYMBOL.lime.size}
        height={SYMBOL.lime.size}
        fill={mono ? 'currentColor' : 'var(--c-lime)'}
      />
    </svg>
  );
}
