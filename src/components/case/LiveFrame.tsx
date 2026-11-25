'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './LiveFrame.module.css';

type Props = {
  src: string;
  kind: 'desktop' | 'mobile';
  title: string;
  /** Lets the visitor click in and use the prototype inside the page. */
  interactive?: boolean;
  /** Address shown in the browser bar of a desktop frame. */
  address?: string;
  className?: string;
  /** Load as soon as mounted (hero) rather than when scrolled near. */
  eager?: boolean;
  /** Show only the screen, without device chrome (the parent provides it). */
  bare?: boolean;
};

const NATIVE = { desktop: { w: 1440, h: 900 }, mobile: { w: 390, h: 844 } } as const;

/**
 * A live, scaled-down prototype. No screenshots anywhere: the real page is
 * rendered at its native size and scaled to fit, so it is sharp at any size
 * and contains no raster images.
 */
export function LiveFrame({ src, kind, title, interactive = false, address, className, eager = false, bare = false }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [load, setLoad] = useState(eager);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const n = NATIVE[kind];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / n.w));
    ro.observe(el);
    let io: IntersectionObserver | undefined;
    if (!eager) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((x) => x.isIntersecting)) {
            setLoad(true);
            io?.disconnect();
          }
        },
        { rootMargin: '600px 0px' },
      );
      io.observe(el);
    }
    return () => {
      ro.disconnect();
      io?.disconnect();
    };
  }, [eager, n.w]);

  const screen = (
    <div
      ref={box}
      className={styles.screen}
      style={{ aspectRatio: `${n.w} / ${n.h}` }}
      data-active={active}
      {...(active ? { 'data-lenis-prevent': '' } : {})}
    >
      {load && scale > 0 && (
        <iframe
          src={src}
          title={title}
          width={n.w}
          height={n.h}
          loading={eager ? 'eager' : 'lazy'}
          className={styles.iframe}
          data-ready={ready}
          onLoad={() => setReady(true)}
          style={{ transform: `scale(${scale})` }}
          tabIndex={interactive && active ? 0 : -1}
          aria-hidden={interactive ? undefined : true}
          referrerPolicy="same-origin"
        />
      )}
      {!ready && <span className={styles.loading} aria-hidden="true" />}
      {interactive && !active && (
        <button type="button" className={styles.activate} onClick={() => setActive(true)}>
          <span className={styles.activatePill}>
            <span className={styles.dot} aria-hidden="true" />
            לחצו כדי להתנסות כאן
          </span>
        </button>
      )}
      {!interactive && <span className={styles.shield} aria-hidden="true" />}
    </div>
  );

  if (bare) return <div className={className}>{screen}</div>;

  if (kind === 'mobile') {
    return (
      <div className={[styles.phone, className].filter(Boolean).join(' ')}>
        <div className={styles.phoneIn}>{screen}</div>
      </div>
    );
  }

  return (
    <div className={[styles.desktop, className].filter(Boolean).join(' ')}>
      <div className={styles.bar} aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="en">{address ?? 'beyond.studio/prototype'}</span>
      </div>
      {screen}
    </div>
  );
}
