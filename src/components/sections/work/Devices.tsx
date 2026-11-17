import Image from 'next/image';
import type { ProjectAccent, ProjectImage } from '@/content/projects';
import styles from './Devices.module.css';

/* ------------------------------------------------------------------ */
/* Abstract placeholder screens — clearly generic compositions in the  */
/* brand language, shown only until real project media is added.       */
/* ------------------------------------------------------------------ */

export function AbstractScreen({ kind, accent }: { kind: 'desktop' | 'mobile' | 'cover'; accent: ProjectAccent }) {
  return (
    <div className={styles.abstract} data-kind={kind} data-accent={accent} aria-hidden="true">
      <div className={styles.aNav}>
        <i className={styles.aLogo} />
        <span className={styles.aLinks}>
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className={styles.aHero}>
        <div className={styles.aType}>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.aVisual}>
          <span className={styles.aFrame} />
          <span className={styles.aSquare} />
        </div>
      </div>
      <div className={styles.aCards}>
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function Screen({ image, kind, accent, sizes }: { image?: ProjectImage; kind: 'desktop' | 'mobile' | 'cover'; accent: ProjectAccent; sizes: string }) {
  if (image) {
    return <Image src={image.src} alt={image.alt} fill sizes={sizes} className={styles.img} />;
  }
  return <AbstractScreen kind={kind} accent={accent} />;
}

export function DesktopFrame({ image, accent, className }: { image?: ProjectImage; accent: ProjectAccent; className?: string }) {
  return (
    <div className={[styles.desktop, className].filter(Boolean).join(' ')}>
      <div className={styles.desktopBar} aria-hidden="true">
        <i />
        <i />
        <i />
        <span />
      </div>
      <div className={styles.desktopScreen}>
        <Screen image={image} kind="desktop" accent={accent} sizes="(min-width: 1024px) 60vw, 90vw" />
      </div>
    </div>
  );
}

export function PhoneFrame({ image, accent, className }: { image?: ProjectImage; accent: ProjectAccent; className?: string }) {
  return (
    <div className={[styles.phone, className].filter(Boolean).join(' ')}>
      <div className={styles.phoneScreen}>
        <Screen image={image} kind="mobile" accent={accent} sizes="(min-width: 1024px) 20vw, 45vw" />
      </div>
    </div>
  );
}

export function CoverFrame({ image, accent, className }: { image?: ProjectImage; accent: ProjectAccent; className?: string }) {
  return (
    <div className={[styles.cover, className].filter(Boolean).join(' ')}>
      <Screen image={image} kind="cover" accent={accent} sizes="(min-width: 1024px) 45vw, 90vw" />
    </div>
  );
}
