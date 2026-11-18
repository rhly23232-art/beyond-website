/**
 * Motion preferences, breakpoints and the intro → page hand-off.
 *
 * The inline head script (see app/layout.tsx) decides before first paint:
 *   html[data-motion]  'full' | 'reduced'  (OS setting, overridable on-site)
 *   html[data-intro]   'pending' | 'reveal' | 'done'
 */

export const MQ_DESKTOP = '(min-width: 1024px)';
export const MQ_MOBILE = '(max-width: 1023.98px)';
export const MQ_FINE_POINTER = '(hover: hover) and (pointer: fine)';

export const MOTION_STORAGE_KEY = 'beyond-motion';
export const INTRO_STORAGE_KEY = 'beyond-intro-seen';

export const INTRO_REVEAL_EVENT = 'beyond:intro-reveal';
export const INTRO_DONE_EVENT = 'beyond:intro-done';

export function isMotionReduced(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dataset.motion === 'reduced';
}

export function isFinePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(MQ_FINE_POINTER).matches;
}

type IntroPhase = 'pending' | 'reveal' | 'done';

export function getIntroPhase(): IntroPhase {
  const v = document.documentElement.dataset.intro;
  return v === 'reveal' || v === 'done' ? v : 'pending';
}

export function setIntroPhase(phase: Exclude<IntroPhase, 'pending'>) {
  const root = document.documentElement;
  if (phase === 'reveal' && root.dataset.intro === 'done') return;
  root.dataset.intro = phase;
  window.dispatchEvent(new Event(phase === 'reveal' ? INTRO_REVEAL_EVENT : INTRO_DONE_EVENT));
  if (phase === 'done') (window as Window & { __beyondReady?: boolean }).__beyondReady = true;
}

/** Runs `cb` once the intro starts revealing the page (immediately if it already has). */
export function onIntroReveal(cb: () => void): () => void {
  if (getIntroPhase() !== 'pending') {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_REVEAL_EVENT, handler, { once: true });
  window.addEventListener(INTRO_DONE_EVENT, handler, { once: true });
  return () => {
    window.removeEventListener(INTRO_REVEAL_EVENT, handler);
    window.removeEventListener(INTRO_DONE_EVENT, handler);
  };
}

/** Runs `cb` once the intro has fully finished. */
export function onIntroDone(cb: () => void): () => void {
  if (getIntroPhase() === 'done') {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_DONE_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, handler);
}

/**
 * Inline script executed in <head> before first paint (kept tiny on purpose).
 * The intro is armed on every page and released at DOMContentLoaded on pages
 * that have no intro overlay — so it never depends on the URL path.
 */
export const headScript = `(function(){var d=document.documentElement;d.classList.add('js');var r=false;try{var m=localStorage.getItem('${MOTION_STORAGE_KEY}');r=m==='reduced'||(m!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){r=matchMedia('(prefers-reduced-motion: reduce)').matches;}d.dataset.motion=r?'reduced':'full';var s=false,k=false;try{s=!!sessionStorage.getItem('${INTRO_STORAGE_KEY}');k=!!sessionStorage.getItem('beyond-skip-intro');sessionStorage.removeItem('beyond-skip-intro');}catch(e){}var p=!r&&!k;d.dataset.intro=p?'pending':'done';d.dataset.introMode=s?'short':'full';var h='scrollRestoration' in history;if(p&&h){history.scrollRestoration='manual';}document.addEventListener('DOMContentLoaded',function(){if(d.dataset.intro==='pending'&&!document.querySelector('[data-intro-root]')){d.dataset.intro='done';if(h){history.scrollRestoration='auto';}}});setTimeout(function(){if(!window.__beyondReady&&d.dataset.intro!=='done'){d.dataset.intro='done';}},7000);})();`;
