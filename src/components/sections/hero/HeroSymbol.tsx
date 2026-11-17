import { SYMBOL } from '@/components/brand/logo-data';
import styles from './HeroSymbol.module.css';

const FRAME_DEPTH = 9; // extrusion slices for the metal frame
const ARROW_DEPTH = 5;

/**
 * Abstract 3D BEYOND symbol built from real CSS 3D layers (no WebGL):
 * matte glass plate · grid plate · extruded metal frame · floating arrow ·
 * Signal Lime square with its own light. The parent rotates `.rig`.
 */
export function HeroSymbol() {
  const s = SYMBOL;
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.entrance} data-hero-rig-entrance>
        <div className={styles.rig} data-hero-rig>
          <div className={styles.flare} />
          <div className={styles.ghost} />
          <div className={styles.gridPlate} />
          <div className={styles.glass}>
            <span className={styles.glassSheen} />
          </div>

          {Array.from({ length: FRAME_DEPTH }, (_, i) => {
            const front = i === FRAME_DEPTH - 1;
            return (
              <svg
                key={`f${i}`}
                viewBox="0 0 72 72"
                className={styles.slice}
                style={{ '--z': `${(i - FRAME_DEPTH + 1) * 2.2}px` } as React.CSSProperties}
              >
                {front && (
                  <defs>
                    <linearGradient id="hero-metal" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#FFFFFF" />
                      <stop offset="0.38" stopColor="#AEB6C6" />
                      <stop offset="0.62" stopColor="#F2F4F8" />
                      <stop offset="1" stopColor="#7E889C" />
                    </linearGradient>
                  </defs>
                )}
                <path
                  d={s.frame}
                  fill="none"
                  strokeWidth={s.stroke}
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  stroke={front ? 'url(#hero-metal)' : i > FRAME_DEPTH - 4 ? '#5d667a' : '#2c3445'}
                />
              </svg>
            );
          })}

          {Array.from({ length: ARROW_DEPTH }, (_, i) => {
            const front = i === ARROW_DEPTH - 1;
            return (
              <svg
                key={`a${i}`}
                viewBox="0 0 72 72"
                className={`${styles.slice} ${front ? styles.arrowFront : ''}`}
                style={{ '--z': `${46 + i * 2.2}px` } as React.CSSProperties}
              >
                <g fill="none" strokeWidth={s.stroke} strokeLinejoin="miter" stroke={front ? '#F5F6F8' : '#3a4356'}>
                  <path d={s.shaft} strokeLinecap="butt" />
                  <path d={s.head} strokeLinecap="square" />
                </g>
              </svg>
            );
          })}

          <span
            className={styles.lime}
            style={
              {
                '--x': `${(s.lime.x / 72) * 100}%`,
                '--y': `${(s.lime.y / 72) * 100}%`,
                '--s': `${(s.lime.size / 72) * 100}%`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>
    </div>
  );
}
