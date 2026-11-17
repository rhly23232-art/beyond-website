'use client';

import { useEffect, useRef } from 'react';
import { isMotionReduced } from '@/lib/motion';

type Particle = { x: number; y: number; z: number; vx: number; vy: number; r: number; a: number; c: string };

const COLORS = ['245,246,248', '245,246,248', '245,246,248', '140,164,255', '199,243,74'];

/**
 * Subtle light particles — tiny square motes drifting upward with depth,
 * gently pushed away by the pointer. Pauses off-screen and in hidden tabs.
 */
export function Particles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = isMotionReduced();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let visible = true;

    const seed = () => {
      const count = Math.round(Math.min(90, (w * h) / 16000));
      particles = Array.from({ length: count }, () => {
        const z = 0.25 + Math.random() * 0.75;
        const colorPick = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 0.06,
          vy: -(0.05 + Math.random() * 0.22) * z,
          r: (0.6 + Math.random() * 1.3) * z,
          a: 0.12 + Math.random() * 0.5 * z,
          c: colorPick > 0.97 ? COLORS[4] : colorPick > 0.82 ? COLORS[3] : COLORS[0],
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(false);
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        if (move) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 22500) {
            const f = (1 - Math.sqrt(dist2) / 150) * 0.6 * p.z;
            p.vx += (dx / 150) * f * 0.08;
            p.vy += (dy / 150) * f * 0.08;
          }
          p.vx *= 0.96;
          p.vy = p.vy * 0.96 + -(0.05 + 0.12 * p.z) * 0.04 * p.z;
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -8) {
            p.y = h + 8;
            p.x = Math.random() * w;
          }
          if (p.x < -8) p.x = w + 8;
          if (p.x > w + 8) p.x = -8;
        }
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        const s = p.r * 2;
        ctx.fillRect(p.x - p.r, p.y - p.r, s, s);
      }
    };

    const loop = () => {
      draw(true);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    resize();
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
