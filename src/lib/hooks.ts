'use client';

import { useEffect, useLayoutEffect, useState } from 'react';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Subscribes to a media query; returns `fallback` during SSR. */
export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}
