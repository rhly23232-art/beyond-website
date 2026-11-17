'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';

type Options = {
  active: boolean;
  /** Autonomous path (0..1 coords) used while the pointer is elsewhere. */
  idle?: (t: number) => { x: number; y: number };
  /** Called every frame with the smoothed position. Keep it cheap. */
  onUpdate?: (x: number, y: number, inside: boolean) => void;
  ease?: number;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Tracks the pointer inside an element as normalised coordinates, smooths it,
 * and exposes it as CSS variables (--px / --py). When the pointer is not
 * inside, an optional idle path keeps the graphic alive (unless motion is
 * reduced). Runs only while `active`.
 */
export function usePointerField(ref: RefObject<HTMLElement | null>, { active, idle, onUpdate, ease = 0.12 }: Options) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const reduced = isMotionReduced();
    const start = idle ? idle(0) : { x: 0.5, y: 0.5 };
    const state = { ...start };
    const target = { ...start };
    let inside = false;
    let clock = 0;

    const tick = (_time: number, delta: number) => {
      if (!inside && idle && !reduced) {
        clock += delta / 1000;
        const p = idle(clock);
        target.x = p.x;
        target.y = p.y;
      }
      state.x += (target.x - state.x) * ease;
      state.y += (target.y - state.y) * ease;
      el.style.setProperty('--px', state.x.toFixed(4));
      el.style.setProperty('--py', state.y.toFixed(4));
      onUpdate?.(state.x, state.y, inside);
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = clamp01((e.clientX - r.left) / r.width);
      target.y = clamp01((e.clientY - r.top) / r.height);
      inside = true;
    };
    const leave = () => {
      inside = false;
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerdown', move);
    el.addEventListener('pointerleave', leave);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerdown', move);
      el.removeEventListener('pointerleave', leave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callbacks are stable per graphic
  }, [active]);
}
