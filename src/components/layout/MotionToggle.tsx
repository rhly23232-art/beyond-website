'use client';

import { useEffect, useState } from 'react';
import { MOTION_STORAGE_KEY, isMotionReduced } from '@/lib/motion';

/**
 * On-site motion switch — lets anyone reduce motion without touching OS
 * settings. The page reloads so every scene is rebuilt in the right mode.
 * `icon` is the compact header version; `text` is used in menus and footer.
 */
export function MotionToggle({ className, variant = 'text' }: { className?: string; variant?: 'text' | 'icon' }) {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads a value set before hydration
    setReduced(isMotionReduced());
  }, []);

  const toggle = () => {
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, reduced ? 'full' : 'reduced');
      sessionStorage.setItem('beyond-skip-intro', '1');
    } catch {
      /* storage unavailable — the reload still applies the OS preference */
    }
    window.location.reload();
  };

  const label = `הפחתת תנועה: ${reduced === null ? '…' : reduced ? 'פעילה' : 'כבויה'}`;

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={className}
        aria-pressed={reduced ?? false}
        aria-label={label}
        title={label}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          {reduced ? (
            <path d="M4 12H20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          ) : (
            <path
              d="M3 12c2.2-4 4.4-4 6.6 0s4.4 4 6.6 0 3.3-2.6 4.8-1.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    );
  }

  return (
    <button type="button" className={className} aria-pressed={reduced ?? false} onClick={toggle}>
      {label}
    </button>
  );
}
