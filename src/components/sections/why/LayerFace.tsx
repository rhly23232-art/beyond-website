/** Distinct surface for each of the seven layers (decorative). */
export function LayerFace({ id }: { id: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, vectorEffect: 'non-scaling-stroke' as const };
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {id === 'vision' && (
        <>
          {[14, 26, 38].map((d) => (
            <rect key={d} x={50 - d} y={50 - d} width={d * 2} height={d * 2} {...s} strokeDasharray="2 3" />
          ))}
          <path d="M50 4V96M4 50H96" {...s} opacity={0.5} />
        </>
      )}
      {id === 'users' && (
        <>
          <path d="M8 80C30 80 28 30 52 34S70 72 92 20" {...s} strokeWidth={2} />
          {[
            [8, 80],
            [52, 34],
            [92, 20],
          ].map(([x, y]) => (
            <rect key={x} x={x - 3.5} y={y - 3.5} width={7} height={7} fill="currentColor" />
          ))}
        </>
      )}
      {id === 'bridge' && (
        <>
          <path d="M20 50H80" {...s} strokeWidth={2} />
          {[20, 50, 80].map((x) => (
            <rect key={x} x={x - 9} y={41} width={18} height={18} {...s} fill="var(--layer-bg)" strokeWidth={2} />
          ))}
        </>
      )}
      {id === 'initiative' && (
        <>
          <path d="M22 78L74 26" {...s} strokeWidth={5} />
          <path d="M44 24H76V56" {...s} strokeWidth={5} />
        </>
      )}
      {id === 'craft' && (
        <>
          <rect x="0" y="0" width="100" height="100" fill="var(--c-cobalt)" />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M${i * 10 - 20} 100L${i * 10 + 20} 0`} stroke="rgb(255 255 255 / 0.18)" strokeWidth={0.8} />
          ))}
        </>
      )}
      {id === 'details' &&
        Array.from({ length: 64 }, (_, i) => {
          const x = (i % 8) * 11 + 7;
          const y = Math.floor(i / 8) * 11 + 7;
          return <rect key={i} x={x} y={y} width={4} height={4} fill="currentColor" opacity={(i * 7) % 5 === 0 ? 1 : 0.3} />;
        })}
      {id === 'service' && (
        <>
          <rect x="10" y="10" width="80" height="80" {...s} />
          <rect x="66" y="16" width="18" height="18" fill="var(--c-lime)" />
        </>
      )}
    </svg>
  );
}
