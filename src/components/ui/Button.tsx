'use client';

import { forwardRef, useRef, type MouseEvent, type ReactNode, type Ref } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { isFinePointer, isMotionReduced } from '@/lib/motion';
import { useScrollTo } from '@/components/motion/SmoothScroll';
import { Arrow, type ArrowDirection } from './Arrow';
import styles from './Button.module.css';

type CommonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg' | 'xl';
  arrow?: ArrowDirection | false;
  magnetic?: boolean;
  className?: string;
  cursor?: string;
};

type LinkProps = CommonProps & {
  href: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  type?: never;
  disabled?: never;
  external?: boolean;
};

type NativeButtonProps = CommonProps & {
  href?: undefined;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  'aria-describedby'?: string;
};

export type ButtonProps = LinkProps | NativeButtonProps;

/**
 * Brand button. Primary = Electric Cobalt with the Signal Lime arrow tile.
 * In-page anchors scroll smoothly (and move focus); magnetic pull on desktop.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(props, forwardedRef) {
  const { children, variant = 'primary', size = 'md', arrow = 'out', magnetic = false, className, cursor } = props;
  const localRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const scrollTo = useScrollTo();

  const setRef = (node: HTMLElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  useGSAP(
    () => {
      const el = localRef.current;
      if (!magnetic || !el || !isFinePointer() || isMotionReduced()) return;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      const lx = gsap.quickTo(labelRef.current, 'x', { duration: 0.6, ease: 'power3.out' });
      const ly = gsap.quickTo(labelRef.current, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.22);
        yTo(dy * 0.32);
        lx(dx * 0.08);
        ly(dy * 0.1);
      };
      const leave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
        gsap.to(labelRef.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    },
    { dependencies: [magnetic] },
  );

  const classes = [styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ');

  const inner = (
    <>
      <span ref={labelRef} className={styles.label}>
        {children}
      </span>
      {arrow && (
        <span className={styles.icon} aria-hidden="true">
          <span className={styles.arrows} data-dir={arrow}>
            <Arrow direction={arrow} className={styles.arrowA} />
            <Arrow direction={arrow} className={styles.arrowB} />
          </span>
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, onClick, external } = props;
    // "#id" or "/#id" → smooth in-page scroll when the target exists here.
    const hashTarget = href.startsWith('#') ? href : href.startsWith('/#') ? href.slice(1) : null;
    return (
      <a
        ref={setRef as Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        data-cursor={cursor}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || !hashTarget || hashTarget.length < 2) return;
          if (!document.querySelector(hashTarget)) return;
          e.preventDefault();
          scrollTo(hashTarget);
          history.replaceState(null, '', hashTarget);
        }}
      >
        {inner}
      </a>
    );
  }

  const { onClick, type = 'button', disabled } = props;
  return (
    <button
      ref={setRef as Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-describedby={props['aria-describedby']}
      data-cursor={cursor}
    >
      {inner}
    </button>
  );
});
