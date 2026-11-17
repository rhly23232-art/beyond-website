'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { isMotionReduced } from '@/lib/motion';
import { contact } from '@/content/about';
import { site } from '@/content/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from './ContactForm';
import styles from './Contact.module.css';

/** K. Contact — a clean, professional and inviting inquiry form. */
export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (isMotionReduced()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(`.${styles.card}`), {
        y: 70,
        opacity: 0,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: q(`.${styles.card}`)[0], start: 'top 88%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="contact" ref={root} className={`section ${styles.contact}`} data-theme="graphite" aria-labelledby="contact-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <SectionHeading
            id="contact-title"
            index="09"
            kicker={contact.kicker}
            titleLines={contact.titleLines}
            lead={contact.lead}
            reveal="rise"
            size="xl"
            mark
          />
          {(site.email || site.phone) && (
            <div className={styles.direct}>
              <p className={styles.directLabel}>{contact.directLabel}</p>
              {site.email && (
                <a className={`${styles.directLink} ltr`} href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              )}
              {site.phone && (
                <a className={`${styles.directLink} ltr`} href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>
                  {site.phone}
                </a>
              )}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
