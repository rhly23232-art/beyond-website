'use client';

import { useState } from 'react';
import type { Project } from '@/content/projects';
import { workIntro } from '@/content/projects';
import { Button } from '@/components/ui/Button';
import { CoverFrame, DesktopFrame, PhoneFrame } from './Devices';
import styles from './Work.module.css';

const L = workIntro.labels;

function Composition({ project, view }: { project: Project; view: 'desktop' | 'mobile' }) {
  const { media, accent, layout } = project;
  if (layout === 'mobile') {
    const [a, b, c] = media.phones ?? [media.mobile, media.mobile, media.mobile];
    return (
      <div className={`${styles.comp} ${styles.compMobile}`}>
        <PhoneFrame image={a} accent={accent} className={styles.phoneA} />
        <PhoneFrame image={b} accent={accent} className={styles.phoneB} />
        <PhoneFrame image={c} accent={accent} className={styles.phoneC} />
      </div>
    );
  }
  if (layout === 'split') {
    return (
      <div className={`${styles.comp} ${styles.compSplit}`}>
        <CoverFrame image={media.cover} accent={accent} className={styles.coverImg} />
        <DesktopFrame image={media.desktop} accent={accent} className={styles.floatDesk} />
      </div>
    );
  }
  return (
    <div className={`${styles.comp} ${styles.compWide}`} data-view={view}>
      <DesktopFrame image={media.desktop} accent={accent} className={styles.wideDesk} />
      <PhoneFrame image={media.mobile} accent={accent} className={styles.widePhone} />
    </div>
  );
}

/**
 * One case study: media composition + the thinking behind it.
 * Details open on hover (desktop) or via the toggle (keyboard / touch).
 */
export function ProjectPanel({ project }: { project: Project }) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  const [open, setOpen] = useState(false);
  const detailsId = `work-details-${project.slug}`;
  const titleId = `work-title-${project.slug}`;

  return (
    <article
      className={styles.panel}
      data-layout={project.layout}
      data-accent={project.accent}
      data-panel
      aria-labelledby={titleId}
    >
      <div className={styles.stage}>
        <div className={styles.media} data-media>
          <div className={styles.mediaInner} data-media-inner>
            <Composition project={project} view={view} />
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.meta}>
          {project.concept && <span className={styles.conceptTag}>{L.concept}</span>}
          <span>{project.sector}</span>
          {project.year && <span className="en">· {project.year}</span>}
        </p>
        <h3 id={titleId} className={styles.name} data-name>
          {project.href ? (
            <a href={project.href} className={styles.nameLink}>
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
        {project.summary && <p className={styles.summary}>{project.summary}</p>}
        <ul role="list" className={styles.tags}>
          {project.disciplines.map((d) => (
            <li key={d} className="en">
              {d}
            </li>
          ))}
        </ul>

        <div className={styles.controls}>
          {project.href && (
            <Button href={project.href} size="md" arrow="out" className={styles.viewBtn}>
              {L.view}
            </Button>
          )}
          <button
            type="button"
            className={styles.thinkingBtn}
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.thinkingIcon} aria-hidden="true" />
            {open ? L.close : L.open}
          </button>

          {project.layout === 'wide' && (
            <div className={styles.viewToggle} role="group" aria-label="תצוגת מכשיר">
              {(['desktop', 'mobile'] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                  {v === 'desktop' ? L.desktop : L.mobile}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* The thinking opens beside the work — it never covers the mockup. */}
        <div id={detailsId} className={styles.details} data-open={open} role="region" aria-label={`${L.open}: ${project.name}`}>
          <dl className={styles.dl}>
            <div>
              <dt>{L.challenge}</dt>
              <dd>{project.challenge}</dd>
            </div>
            <div>
              <dt>{L.solution}</dt>
              <dd>{project.solution}</dd>
            </div>
            <div>
              <dt>{L.thinking}</dt>
              <dd>{project.thinking}</dd>
            </div>
            {project.result && (
              <div>
                <dt>{L.result}</dt>
                <dd>{project.result}</dd>
              </div>
            )}
          </dl>
        </div>

        {project.url && (
          <a className={styles.visit} href={project.url} target="_blank" rel="noopener noreferrer">
            {L.visit}
          </a>
        )}
      </div>
    </article>
  );
}
