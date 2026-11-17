'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { isFinePointer, isMotionReduced } from '@/lib/motion';
import styles from './CursorFrame.module.css';

/**
 * Contextual cursor companion. It only appears over areas marked with
 * `data-cursor` (empty value → targeting frame, text value → label chip).
 * The native cursor is never hidden, so usability is untouched.
 */
export function CursorFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const labelEl = labelRef.current;
    if (!el || !labelEl || !isFinePointer() || isMotionReduced()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    let current: Element | null = null;
    let first = true;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (first) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        first = false;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
      if (target === current) return;
      current = target;
      const label = target?.getAttribute('data-cursor') ?? '';
      labelEl.textContent = label;
      el.dataset.state = target ? (label ? 'label' : 'frame') : 'idle';
    };
    const onDown = () => el.classList.add(styles.pressed);
    const onUp = () => el.classList.remove(styles.pressed);
    const onLeave = () => {
      current = null;
      el.dataset.state = 'idle';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={styles.cursor} data-state="idle" aria-hidden="true">
      <span className={styles.frame}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={styles.dot} />
      <span ref={labelRef} className={styles.label} />
    </div>
  );
}
