import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { CaseStudy as CaseData } from '@/content/cases';
import { cases } from '@/content/cases';
import { Button } from '@/components/ui/Button';
import { Arrow } from '@/components/ui/Arrow';
import { Footer } from '@/components/layout/Footer';
import { LiveFrame } from './LiveFrame';
import { ChapterNav, RevealObserver } from './CaseClient';
import { Flow, Journey, Matrix, Sitemap, Wireframe } from './Diagrams';
import styles from './Case.module.css';

const SPECIMEN: Record<string, string> = {
  kav: '"Case Frank", Georgia, serif',
  moked: '"Case Plex", var(--font-he)',
  gemachy: '"Case Rubik", var(--font-he)',
};

const CHAPTERS = [
  { id: 'overview', label: 'סקירה' },
  { id: 'research', label: 'מחקר' },
  { id: 'define', label: 'הגדרה' },
  { id: 'structure', label: 'אפיון' },
  { id: 'design', label: 'שפה עיצובית' },
  { id: 'screens', label: 'המוצר' },
  { id: 'build', label: 'פיתוח' },
  { id: 'validate', label: 'ולידציה' },
  { id: 'reflect', label: 'סיכום' },
].map((c, i) => ({ ...c, num: String(i + 1).padStart(2, '0') }));

function Chapter({
  id,
  theme,
  kicker,
  title,
  lead,
  children,
}: {
  id: string;
  theme: 'dark' | 'light' | 'mist' | 'wash' | 'graphite';
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
}) {
  const num = CHAPTERS.find((c) => c.id === id)?.num;
  return (
    <section id={id} className={`section ${styles.chapter}`} data-theme={theme} aria-labelledby={`${id}-t`}>
      <div className="container">
        <header className={styles.chHead} data-reveal>
          <p className={styles.chNum}>
            <span className="en">{num}</span>
            <span className={styles.chLine} aria-hidden="true" />
            <span>{kicker}</span>
          </p>
          <h2 id={`${id}-t`} className={styles.chTitle}>
            {title}
          </h2>
          {lead && <p className={styles.chLead}>{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

function Sub({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className={styles.sub} data-reveal>
      <div className={styles.subHead}>
        <h3>{title}</h3>
        {note && <p>{note}</p>}
      </div>
      {children}
    </div>
  );
}

const openHref = (src: string) =>
  src
    .replace(/([?&])(embed|bare)=1&?/g, '$1')
    .replace(/[?&]$/, '');

export function CaseStudy({ c }: { c: CaseData }) {
  const i = cases.findIndex((x) => x.slug === c.slug);
  const next = cases[(i + 1) % cases.length];
  const vars = { '--case-accent': c.accent, '--case-soft': c.accentSoft } as CSSProperties;
  const desktopScreens = c.screens.filter((s) => s.kind === 'desktop');
  const mobileScreens = c.screens.filter((s) => s.kind === 'mobile');

  return (
    <>
      <main id="main" tabIndex={-1} className={styles.page} style={vars}>
        <RevealObserver />

        {/* ---------------------------------------------------------- HERO */}
        <section className={`section ${styles.hero}`} data-theme="dark" aria-labelledby="case-title">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroText}>
              <Link href="/#work" className={styles.back}>
                <Arrow direction="right" className={styles.backArrow} />
                תיק עבודות
              </Link>
              <p className={styles.heroKicker}>
                <span className="en">Case Study {c.index} / 0{cases.length}</span>
                <span className={styles.conceptBadge}>פרויקט קונספט</span>
              </p>
              <h1 id="case-title" className={styles.heroTitle}>
                {c.name}
                <span className={styles.heroMark} aria-hidden="true" />
              </h1>
              <p className={styles.heroType}>
                {c.type} <span aria-hidden="true">·</span> {c.sector}
              </p>
              <p className={styles.heroTagline}>{c.tagline}</p>
              <div className={styles.heroCtas}>
                <Button href={c.prototype.src} size="lg" external arrow="out" magnetic>
                  פתיחת אב הטיפוס במסך מלא
                </Button>
                <Button href="#overview" size="lg" variant="ghost" arrow="down">
                  לתהליך העבודה
                </Button>
              </div>
            </div>
            <div className={styles.heroMedia} data-kind={c.prototype.kind}>
              <LiveFrame
                src={c.prototype.preview}
                kind={c.prototype.kind}
                title={`${c.name}: ${c.prototype.label}`}
                interactive
                eager
                address={`${c.nameLatin.toLowerCase().split(' ')[0]}.concept`}
              />
              <p className={styles.heroMediaNote}>
                <span className={styles.liveDot} aria-hidden="true" />
                {c.prototype.label}: זה לא צילום מסך. אפשר ללחוץ ולהתנסות.
              </p>
            </div>
          </div>
          <div className="container">
            <dl className={styles.meta}>
              {c.meta.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <ChapterNav items={CHAPTERS} />

        {/* ------------------------------------------------------ OVERVIEW */}
        <Chapter id="overview" theme="light" kicker="סקירה ואתגר" title={<>הבריף</>}>
          <p className={styles.brief} data-reveal>
            {c.overview.brief}
          </p>
          <div className={styles.overGrid}>
            <article className={styles.overCard} data-reveal>
              <h3>האתגר</h3>
              <p>{c.overview.challenge}</p>
            </article>
            <article className={styles.overCard} data-reveal data-accent>
              <h3>המטרה</h3>
              <p>{c.overview.goal}</p>
            </article>
            <article className={styles.overCard} data-reveal>
              <h3>האילוצים</h3>
              <ul role="list" className={styles.ticks}>
                {c.overview.constraints.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </article>
            <article className={styles.overCard} data-reveal>
              <h3>התפקיד שלי</h3>
              <p>{c.overview.role}</p>
              <ul role="list" className={styles.tags}>
                {c.disciplines.map((d) => (
                  <li key={d} className="en">
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <div className={styles.process} data-reveal aria-label="שלבי התהליך">
            {['מחקר', 'הגדרה', 'אפיון', 'עיצוב', 'פיתוח', 'ולידציה'].map((s, k) => (
              <span key={s}>
                <b className="en">{String(k + 1).padStart(2, '0')}</b>
                {s}
              </span>
            ))}
          </div>
        </Chapter>

        {/* ------------------------------------------------------ RESEARCH */}
        <Chapter id="research" theme="mist" kicker="גילוי" title="מה למדנו לפני שציירנו קו" lead={c.research.intro}>
          <Sub title="שיטות מחקר">
            <ol role="list" className={styles.methods}>
              {c.research.methods.map((m, k) => (
                <li key={m.t}>
                  <span className="en">{String(k + 1).padStart(2, '0')}</span>
                  <b>{m.t}</b>
                  <p>{m.d}</p>
                </li>
              ))}
            </ol>
          </Sub>
          <Sub title="ניתוח תחרותי" note="איפה הקטגוריה חזקה, איפה היא חלשה, ואיפה נמצאת ההזדמנות.">
            <Matrix m={c.research.matrix} />
          </Sub>
          <Sub title="תובנות מפתח">
            <ol role="list" className={styles.insights}>
              {c.research.insights.map((x, k) => (
                <li key={x.t}>
                  <span className={`${styles.insightNum} en`}>{k + 1}</span>
                  <h4>{x.t}</h4>
                  <p>{x.d}</p>
                </li>
              ))}
            </ol>
          </Sub>
        </Chapter>

        {/* -------------------------------------------------------- DEFINE */}
        <Chapter id="define" theme="dark" kicker="הגדרה" title="בשביל מי, ומה הבעיה האמיתית" lead="הפרסונות מבוססות על המחקר השולחני ומסומנות כהשערות. הן מייצגות דפוסים, לא אנשים אמיתיים.">
          <Sub title="פרסונות">
            <div className={styles.personas}>
              {c.personas.map((p) => (
                <article key={p.name} className={styles.persona}>
                  <header>
                    <span className={styles.avatar} aria-hidden="true">
                      {p.initials}
                    </span>
                    <div>
                      <h4>{p.name}</h4>
                      <p>{p.role}</p>
                    </div>
                    <span className={styles.pTag}>{p.tag}</span>
                  </header>
                  <blockquote>{p.quote}</blockquote>
                  <div className={styles.pCols}>
                    <div>
                      <h5>מטרות</h5>
                      <ul role="list">
                        {p.goals.map((g) => (
                          <li key={g}>{g}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>תסכולים</h5>
                      <ul role="list">
                        {p.pains.map((g) => (
                          <li key={g}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Sub>
          <Sub title={c.journey.title} note="העקומה מציגה את הרגש לאורך המסע, מ־2− (תסכול) ועד 2+ (הנאה). השורה התחתונה מסמנת את ההזדמנויות.">
            <Journey j={c.journey} />
          </Sub>
          <div className={styles.defineGrid}>
            <Sub title="איך נוכל…? (HMW)">
              <ol role="list" className={styles.hmw}>
                {c.hmw.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            </Sub>
            <Sub title="מדדי הצלחה" note="יעדים להצבה בהשקה, לא תוצאות.">
              <ul role="list" className={styles.metrics}>
                {c.metrics.map((m) => (
                  <li key={m.label}>
                    <b className="en">{m.value}</b>
                    <span>{m.label}</span>
                    <small>{m.note}</small>
                  </li>
                ))}
              </ul>
            </Sub>
          </div>
        </Chapter>

        {/* ----------------------------------------------------- STRUCTURE */}
        <Chapter id="structure" theme="light" kicker="אפיון" title="מבנה, זרימה וסקיצות" lead="קודם המבנה ואחר כך המראה. מבנה המידע והזרימות נבנו לפני הפיקסל הראשון, והסקיצות נבחנו מול שאלות ה-HMW.">
          <Sub title="ארכיטקטורת מידע">
            <Sitemap ia={c.ia} />
          </Sub>
          <Sub title={c.flow.title}>
            <Flow f={c.flow} />
          </Sub>
          <Sub title="סקיצות Low-fi" note="שלד ההיררכיה, בלי צבע ובלי טיפוגרפיה.">
            <div className={styles.wires}>
              {c.wireframes.map((w) => (
                <Wireframe key={w.title} w={w} />
              ))}
            </div>
          </Sub>
          <Sub title="איטרציות: מה השתנה ולמה">
            <ol role="list" className={styles.decisions}>
              {c.decisions.map((d, k) => (
                <li key={d.title}>
                  <h4>
                    <span className="en">{String(k + 1).padStart(2, '0')}</span>
                    {d.title}
                  </h4>
                  <div className={styles.beforeAfter}>
                    <div data-k="before">
                      <span>לפני</span>
                      <p>{d.before}</p>
                    </div>
                    <Arrow direction="left" className={styles.baArrow} />
                    <div data-k="after">
                      <span>אחרי</span>
                      <p>{d.after}</p>
                    </div>
                  </div>
                  <p className={styles.why}>
                    <b>למה: </b>
                    {d.why}
                  </p>
                </li>
              ))}
            </ol>
          </Sub>
        </Chapter>

        {/* -------------------------------------------------------- DESIGN */}
        <Chapter id="design" theme="graphite" kicker="שפה עיצובית" title="מערכת העיצוב" lead={`כל מסך בנוי מאותם אסימונים (Design Tokens): צבע, טיפוגרפיה, ריווח ותנועה.`}>
          <Sub title="צבע">
            <ul role="list" className={styles.palette}>
              {c.system.colors.map((col) => (
                <li key={col.name}>
                  <span className={styles.swatch} style={{ background: col.hex }} data-dark={col.dark ? 'true' : undefined} />
                  <b>{col.name}</b>
                  <span className="en">{col.hex}</span>
                  <small>{col.use}</small>
                </li>
              ))}
            </ul>
          </Sub>
          <Sub title="טיפוגרפיה">
            <div className={styles.typeGrid}>
              <div className={styles.specimen} style={{ fontFamily: SPECIMEN[c.slug] }}>
                <span className={styles.specAa}>אב</span>
                <p>{c.system.type.sample}</p>
                <small className="en">{c.system.type.display}</small>
              </div>
              <table className={styles.scale}>
                <caption className="visually-hidden">סולם טיפוגרפי</caption>
                <tbody>
                  {c.system.type.scale.map((s) => (
                    <tr key={s.name}>
                      <th scope="row" className="en">
                        {s.name}
                      </th>
                      <td className="en">{s.size}</td>
                      <td className="en">{s.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Sub>
          <div className={styles.defineGrid}>
            <Sub title="עקרונות">
              <ul role="list" className={styles.principles}>
                {c.system.principles.map((p) => (
                  <li key={p.t}>
                    <b>{p.t}</b>
                    <p>{p.d}</p>
                  </li>
                ))}
              </ul>
            </Sub>
            <Sub title="רכיבים ותנועה">
              <ul role="list" className={styles.components}>
                {c.system.components.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className={styles.motion}>
                <b>תנועה:</b> <span>{c.system.motion}</span>
              </p>
            </Sub>
          </div>
        </Chapter>

        {/* ------------------------------------------------------- SCREENS */}
        <Chapter id="screens" theme="dark" kicker="המוצר" title="המסכים הסופיים" lead="כל מסך כאן הוא אב הטיפוס עצמו, חי ומוקטן, ולא תמונה. אפשר לפתוח כל אחד במסך מלא.">
          {desktopScreens.length > 0 && (
            <div className={styles.screensDesk}>
              {desktopScreens.map((s, k) => (
                <figure key={s.title} className={styles.screen} data-reveal data-wide={k === 0 ? 'true' : undefined}>
                  <LiveFrame src={s.src} kind="desktop" title={`${c.name}: ${s.title}`} address={`${c.nameLatin.toLowerCase().split(' ')[0]}.concept`} />
                  <figcaption>
                    <div>
                      <b>{s.title}</b>
                      <span>{s.desc}</span>
                    </div>
                    <a href={openHref(s.src)} target="_blank" rel="noopener noreferrer" className={styles.openLink}>
                      פתיחה <Arrow direction="out" className={styles.openArrow} />
                      <span className="visually-hidden">(נפתח בלשונית חדשה)</span>
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          {mobileScreens.length > 0 && (
            <div className={styles.screensMobile} data-count={mobileScreens.length}>
              {mobileScreens.map((s) => (
                <figure key={s.title} className={styles.screen} data-reveal>
                  <LiveFrame src={s.src} kind="mobile" title={`${c.name}: ${s.title}`} />
                  <figcaption>
                    <div>
                      <b>{s.title}</b>
                      <span>{s.desc}</span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          <div className={styles.tryBar} data-reveal>
            <p>
              <b>רוצים לנסות בעצמכם?</b> אב הטיפוס עובד בדפדפן, במחשב ובנייד.
            </p>
            <Button href={c.prototype.src} size="lg" external arrow="out">
              פתיחת אב הטיפוס
            </Button>
          </div>
        </Chapter>

        {/* --------------------------------------------------------- BUILD */}
        <Chapter id="build" theme="light" kicker="פיתוח" title="מהעיצוב לקוד" lead="אב הטיפוס נבנה בקוד ולא בכלי עיצוב, כדי לבדוק תנועה, ביצועים ונגישות בתנאים אמיתיים. בפיתוח נעזרתי ב-AI (Claude) לניסוח חלופות ולבדיקת קוד.">
          <div className={styles.buildGrid}>
            {[
              ['טכנולוגיה', c.build.stack],
              ['נגישות', c.build.a11y],
              ['ביצועים', c.build.perf],
            ].map(([t, list]) => (
              <article key={t as string} className={styles.buildCard} data-reveal>
                <h3>{t as string}</h3>
                <ul role="list" className={styles.ticks}>
                  {(list as string[]).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className={styles.production} data-reveal>
            <b>בגרסת הפרודקשן: </b>
            {c.build.production}
          </p>
          {c.business && (
            <Sub title="מודל עסקי">
              <ul role="list" className={styles.business}>
                {c.business.map((b) => (
                  <li key={b.t}>
                    <b>{b.t}</b>
                    <p>{b.d}</p>
                  </li>
                ))}
              </ul>
            </Sub>
          )}
        </Chapter>

        {/* ------------------------------------------------------ VALIDATE */}
        <Chapter id="validate" theme="wash" kicker="ולידציה" title="איך נדע שזה עובד" lead={c.validation.method}>
          <div className={styles.valGrid}>
            <Sub title="משימות לבדיקה">
              <ol role="list" className={styles.tasks}>
                {c.validation.tasks.map((t, k) => (
                  <li key={t.t}>
                    <span className="en">T{k + 1}</span>
                    <b>{t.t}</b>
                    <small>{t.metric}</small>
                  </li>
                ))}
              </ol>
            </Sub>
            <Sub title="קריטריונים להצלחה">
              <ul role="list" className={styles.ticks}>
                {c.validation.criteria.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Sub>
          </div>
        </Chapter>

        {/* ------------------------------------------------------- REFLECT */}
        <Chapter id="reflect" theme="dark" kicker="סיכום" title="מה לקחתי מהפרויקט">
          <div className={styles.reflect}>
            <ol role="list" className={styles.learned}>
              {c.reflection.learned.map((x) => (
                <li key={x} data-reveal>
                  {x}
                </li>
              ))}
            </ol>
            <div className={styles.nextSteps} data-reveal>
              <h3>הצעדים הבאים</h3>
              <ul role="list">
                {c.reflection.next.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </Chapter>

        {/* ---------------------------------------------------- NEXT CASE */}
        <section className={`section ${styles.nextCase}`} data-theme="dark" aria-label="הפרויקט הבא" style={{ ['--next-accent' as string]: next.accent }}>
          <a href={`/work/${next.slug}`} className={styles.nextLink}>
            <span className="container">
              <span className={styles.nextKicker}>
                <span className="en">Next · {next.index}</span> הפרויקט הבא
              </span>
              <span className={styles.nextName}>
                {next.name}
                <Arrow direction="left" className={styles.nextArrow} />
              </span>
              <span className={styles.nextType}>
                {next.type} · {next.sector}
              </span>
            </span>
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
