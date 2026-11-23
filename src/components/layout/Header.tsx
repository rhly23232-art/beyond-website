'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';
import { mainNav, site } from '@/content/site';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { useLenis, useScrollTo } from '@/components/motion/SmoothScroll';
import { MotionToggle } from './MotionToggle';
import styles from './Header.module.css';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const scrollTo = useScrollTo();
  const lenis = useLenis();

  /* Hide on scroll down, reveal on scroll up; capsule state after leaving the top. */
  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      refreshPriority: -10,
      onUpdate: (self) => {
        const y = self.scroll();
        header.dataset.scrolled = y > 24 ? 'true' : 'false';
        if (header.dataset.menu === 'open') return;
        if (y > window.innerHeight * 0.8 && self.direction === 1) header.dataset.hidden = 'true';
        else if (self.direction === -1 || y < 80) header.dataset.hidden = 'false';
      },
    });

    // Tone: a light header over light sections, a dark one over dark sections.
    document.querySelectorAll<HTMLElement>('main section[data-theme], footer[data-theme]').forEach((section) => {
      const light = ['light', 'mist', 'wash'].includes(section.dataset.theme ?? '');
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40px',
        end: 'bottom 40px',
        refreshPriority: -10,
        onToggle: (self) => {
          if (self.isActive) header.dataset.tone = light ? 'light' : 'dark';
        },
      });
    });

    // Scroll-spy for the main navigation.
    mainNav.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        refreshPriority: -10,
        onToggle: (self) => {
          if (self.isActive) setActive(id);
          else setActive((curr) => (curr === id ? null : curr));
        },
      });
    });
  });

  /* Mobile menu timeline */
  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;
      const q = gsap.utils.selector(menu);
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
      tl.set(menu, { visibility: 'visible' })
        .fromTo(
          menu,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' },
        )
        .from(q('[data-menu-line]'), { scaleX: 0, transformOrigin: '100% 50%', stagger: 0.04, duration: 0.9 }, 0.3)
        .from(q('[data-menu-item]'), { yPercent: 110, stagger: 0.06, duration: 1 }, 0.35)
        .from(q('[data-menu-foot]'), { opacity: 0, y: 20, duration: 0.8 }, 0.6);
      menuTl.current = tl;
    },
    { scope: menuRef },
  );

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const tl = menuTl.current;
    if (!header) return;
    header.dataset.menu = open ? 'open' : 'closed';
    if (open) {
      header.dataset.hidden = 'false';
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      if (tl) {
        if (isMotionReduced()) tl.progress(1);
        else tl.timeScale(1).play();
      }
      const first = menuRef.current?.querySelector<HTMLElement>('a, button');
      first?.focus({ preventScroll: true });
    } else {
      lenis?.start();
      document.body.style.overflow = '';
      if (tl && tl.progress() > 0) {
        if (isMotionReduced()) tl.progress(0);
        else tl.timeScale(1.8).reverse();
      }
    }
  }, [open, lenis]);

  /* Escape closes; Tab stays inside the open menu. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== 'Tab' || !menuRef.current) return;
      const focusables = [
        toggleRef.current,
        ...Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button')),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeMenu]);

  /* Close the menu when growing past the mobile breakpoint */
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // On other pages (legal, 404) let the browser navigate to /#id.
    if (!document.getElementById(id)) return;
    e.preventDefault();
    const wasOpen = open;
    if (wasOpen) closeMenu(false);
    // Let the menu start closing before travelling.
    window.setTimeout(() => scrollTo(`#${id}`), wasOpen ? 260 : 0);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled="false"
      data-hidden="false"
      data-menu="closed"
      data-tone="dark"
    >
      <div className={styles.bar}>
        <Link
          href="/#top"
          className={styles.brand}
          aria-label={`${site.name} — חזרה לראש העמוד`}
          onClick={(e) => go(e, 'top')}
        >
          <Logo className={styles.logo} title={site.name} />
        </Link>

        <nav className={styles.nav} aria-label="ניווט ראשי">
          <ul role="list">
            {mainNav.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  className={styles.link}
                  aria-current={active === item.id ? 'true' : undefined}
                  onClick={(e) => go(e, item.id)}
                >
                  <span className={styles.linkRoll} data-text={item.label}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <MotionToggle variant="icon" className={styles.motion} />
          <Button href="/#contact" size="md" className={styles.cta} arrow="out" onClick={(e) => go(e, 'contact')}>
            בואו נדבר
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.toggleLabel}>{open ? 'סגירה' : 'תפריט'}</span>
            <span className={styles.toggleIcon} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        id="mobile-menu"
        className={styles.menu}
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
        inert={!open}
        data-theme="dark"
      >
        <nav aria-label="ניווט במובייל">
          <ol role="list" className={styles.menuList}>
            {mainNav.map((item) => (
              <li key={item.id} className={styles.menuItem}>
                <span className={styles.menuLine} data-menu-line aria-hidden="true" />
                <Link href={`/#${item.id}`} className={styles.menuLink} onClick={(e) => go(e, item.id)}>
                  <span className={styles.menuMask}>
                    <span data-menu-item className={styles.menuText}>
                      {item.label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.menuFoot} data-menu-foot>
          <Button href="/#contact" size="lg" onClick={(e) => go(e, 'contact')}>
            בואו נדבר על הפרויקט
          </Button>
          <MotionToggle className={styles.menuMotion} />
          <p className={`${styles.menuSlogan} en`}>{site.slogan}</p>
        </div>
      </div>
    </header>
  );
}
