'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollTo } from '@/components/motion/SmoothScroll';
import styles from './Case.module.css';

/** Reveals every [data-reveal] element once it enters the viewport. */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.reveal = 'in';
          io.unobserve(e.target);
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/** Sticky chapter navigation with scroll-spy and a reading-progress line. */
export function ChapterNav({ items }: { items: { id: string; label: string; num: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const fill = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const mid = window.innerHeight * 0.35;
      let cur = items[0]?.id;
      for (const s of sections) if (s.getBoundingClientRect().top < mid) cur = s.id;
      setActive(cur);
      const first = sections[0];
      const last = sections[sections.length - 1];
      if (first && last && fill.current) {
        const start = first.getBoundingClientRect().top + window.scrollY - mid;
        const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        const p = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
        fill.current.style.transform = `scaleX(${p})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  // Keep the active chip visible on small screens.
  useEffect(() => {
    const el = list.current?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!el || !list.current) return;
    const l = list.current;
    const target = el.offsetLeft - l.clientWidth / 2 + el.clientWidth / 2;
    l.scrollTo({ left: target, behavior: 'smooth' });
  }, [active]);

  return (
    <nav className={styles.chapters} aria-label="פרקי הפרויקט" data-theme="dark">
      <div className={`container ${styles.chaptersIn}`}>
        <ol ref={list} role="list" className={styles.chapterList}>
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? 'step' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(`#${i.id}`, { offset: -64 });
                  history.replaceState(null, '', `#${i.id}`);
                }}
              >
                <span className="en">{i.num}</span>
                {i.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
      <span className={styles.chapterProgress} aria-hidden="true">
        <span ref={fill} />
      </span>
    </nav>
  );
}
