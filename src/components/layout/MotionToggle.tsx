'use client';

import { useEffect, useState } from 'react';
import { MOTION_STORAGE_KEY, isMotionReduced } from '@/lib/motion';

/**
 * On-site motion switch — lets anyone reduce motion without touching OS
 * settings. The page reloads so every scene is rebuilt in the right mode.
 */
export function MotionToggle({ className }: { className?: string }) {
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

  return (
    <button type="button" className={className} aria-pressed={reduced ?? false} onClick={toggle}>
      הפחתת תנועה: {reduced === null ? '…' : reduced ? 'פעילה' : 'כבויה'}
    </button>
  );
}
