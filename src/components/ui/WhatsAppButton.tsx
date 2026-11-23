'use client';

import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { site, whatsappLink } from '@/content/site';
import { contact } from '@/content/about';
import styles from './WhatsAppButton.module.css';

/** Floating WhatsApp shortcut — rendered only when a number is configured. */
export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!site.whatsapp) return;
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!site.whatsapp) return null;

  return (
    <a
      className={styles.button}
      data-visible={visible}
      href={whatsappLink(contact.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click')}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path
          d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M9 9.5c.3 2.4 2.1 4.3 4.5 4.8l1-1.2 1.6.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>{contact.whatsappLabel}</span>
    </a>
  );
}
