'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';
import { Button } from './Button';
import styles from './CtaStrip.module.css';

/** Mid-page call to action: one line of copy, one action, one reassurance. */
export function CtaStrip({ text, button, note, className }: { text: string; button: string; note?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isMotionReduced()) return;
      gsap.from(ref.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={[styles.strip, className].filter(Boolean).join(' ')}>
      <p className={styles.text}>{text}</p>
      <div className={styles.action}>
        <Button href="#contact" size="lg">
          {button}
        </Button>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </div>
  );
}
