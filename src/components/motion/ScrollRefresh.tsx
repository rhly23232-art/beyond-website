'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Mounted last in <main>: recalculates every ScrollTrigger once all sections
 * exist and again when web fonts finish loading (line breaks may change).
 */
export function ScrollRefresh() {
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (cancelled) return;
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(refresh);
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, []);
  return null;
}
