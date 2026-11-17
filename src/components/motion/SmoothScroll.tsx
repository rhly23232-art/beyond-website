'use client';

import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';

const LenisContext = createContext<Lenis | null>(null);

/**
 * Lenis smooth wheel scrolling, synced with GSAP's ticker and ScrollTrigger.
 * Native scrolling stays intact: keyboard, touch, scrollbar and find-in-page
 * all keep working. Disabled entirely when reduced motion is requested.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (isMotionReduced()) return;
    const instance = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      wheelMultiplier: 1,
      autoRaf: false,
    });
    instance.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the instance only exists on the client
    setLenis(instance);
    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

type ScrollOptions = { offset?: number; immediate?: boolean; focus?: boolean };

function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/**
 * Scrolls to a section (selector, element or y position) and moves focus to it,
 * so keyboard and screen-reader users land where sighted users do.
 */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (target: string | HTMLElement | number, opts: ScrollOptions = {}) => {
      const { offset = 0, immediate = false, focus = true } = opts;
      if (typeof target === 'number') {
        if (lenis) lenis.scrollTo(target, { immediate, duration: 1.4 });
        else window.scrollTo({ top: target, behavior: isMotionReduced() || immediate ? 'auto' : 'smooth' });
        return;
      }
      const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, {
          offset,
          immediate,
          duration: 1.5,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
          onComplete: () => focus && focusTarget(el),
        });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: isMotionReduced() || immediate ? 'auto' : 'smooth' });
        if (focus) focusTarget(el);
      }
    },
    [lenis],
  );
}
