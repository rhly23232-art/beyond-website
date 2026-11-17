/**
 * BEYOND — brand asset generator.
 *
 * Outlines the "BEYOND" logotype from Space Grotesk Bold (so the logo never
 * depends on a font being installed), then writes:
 *   - src/components/brand/logo-data.ts   (geometry consumed by React components)
 *   - public/brand/*.svg                   (full / light / mono / symbol variants)
 *   - src/app/icon.svg                     (favicon)
 *
 * Run with: npm run brand
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontFile = path.join(
  root,
  'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff',
);

const buf = fs.readFileSync(fontFile);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

/* ------------------------------------------------------------------ */
/* Symbol geometry (72 × 72 ink box)                                    */
/* Open frame · arrow advancing outward through the open corner ·       */
/* Signal Lime square (the idea that launches the movement).           */
/* ------------------------------------------------------------------ */
const STROKE = 6;
const SYMBOL = {
  size: 72,
  stroke: STROKE,
  frame: 'M35 13H3V69H59V45',
  shaft: 'M31 41L67 5',
  head: 'M49 3H69V23',
  lime: { x: 13, y: 45, size: 14 },
};

/* Favicon version: same concept, heavier strokes for 16–32px legibility. */
const FAVICON = {
  frame: 'M34 15H5V67H57V46',
  shaft: 'M29 43L64 8',
  head: 'M46 6H66V26',
  lime: { x: 12, y: 46, size: 15 },
  stroke: 8,
};

/* ------------------------------------------------------------------ */
/* Logotype                                                             */
/* ------------------------------------------------------------------ */
const CAP_HEIGHT = 42;
const capUnits = font.tables.os2.sCapHeight; // 700 / 1000
const fontSize = (CAP_HEIGHT * font.unitsPerEm) / capUnits; // → 60
const TRACKING = 0.03 * fontSize;

const round = (n) => Math.round(n * 100) / 100;
const pathToD = (p) =>
  p.commands
    .map((c) => {
      switch (c.type) {
        case 'M':
        case 'L':
          return `${c.type}${round(c.x)} ${round(c.y)}`;
        case 'Q':
          return `Q${round(c.x1)} ${round(c.y1)} ${round(c.x)} ${round(c.y)}`;
        case 'C':
          return `C${round(c.x1)} ${round(c.y1)} ${round(c.x2)} ${round(c.y2)} ${round(c.x)} ${round(c.y)}`;
        case 'Z':
          return 'Z';
        default:
          return '';
      }
    })
    .join('');

const word = 'BEYOND';
let cursor = 0;
let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
const glyphs = [];
for (let i = 0; i < word.length; i++) {
  const ch = word[i];
  const glyph = font.charToGlyph(ch);
  if (i > 0) {
    cursor += font.getKerningValue(font.charToGlyph(word[i - 1]), glyph) * (fontSize / font.unitsPerEm);
  }
  // Baseline sits at y = CAP_HEIGHT so the cap top is ~y=0.
  const p = glyph.getPath(cursor, CAP_HEIGHT, fontSize);
  const bb = p.getBoundingBox();
  minX = Math.min(minX, bb.x1);
  maxX = Math.max(maxX, bb.x2);
  minY = Math.min(minY, bb.y1);
  maxY = Math.max(maxY, bb.y2);
  glyphs.push({ char: ch, d: pathToD(p), x: round(bb.x1), w: round(bb.x2 - bb.x1) });
  cursor += glyph.advanceWidth * (fontSize / font.unitsPerEm) + TRACKING;
}

// Normalise so the logotype ink starts at x = 0.
const shiftX = minX;
const shiftD = (d) =>
  d.replace(/([MLQCZ])([^MLQCZ]*)/g, (_, cmd, args) => {
    if (cmd === 'Z') return 'Z';
    const nums = args.trim().split(/\s+/).map(Number);
    const out = nums.map((n, idx) => (idx % 2 === 0 ? round(n - shiftX) : round(n)));
    return cmd + out.join(' ');
  });
for (const g of glyphs) {
  g.d = shiftD(g.d);
  g.x = round(g.x - shiftX);
}
const LOGO_W = round(maxX - minX);
const LOGO_TOP = round(Math.min(0, minY)); // overshoot of round letters
const LOGO_BOTTOM = round(Math.max(CAP_HEIGHT, maxY));
const LOGO_H = round(LOGO_BOTTOM - LOGO_TOP);

/* ------------------------------------------------------------------ */
/* Lockup                                                               */
/* ------------------------------------------------------------------ */
const GAP = 22;
const textX = SYMBOL.size + GAP;
// Optical centre: the logotype is centred on the frame body (y 10…72).
const frameCenter = (10 + 72) / 2;
const textY = round(frameCenter - CAP_HEIGHT / 2);
const LOCKUP_W = round(textX + LOGO_W);
const LOCKUP_H = SYMBOL.size;

/* ------------------------------------------------------------------ */
/* Writers                                                              */
/* ------------------------------------------------------------------ */
const C = {
  ink: '#10131A',
  white: '#F5F6F8',
  lime: '#C7F34A',
};

const symbolMarkup = (fg, lime, s = SYMBOL) =>
  [
    `<g fill="none" stroke="${fg}" stroke-width="${s.stroke}" stroke-linejoin="miter">`,
    `<path d="${s.frame}" stroke-linecap="square"/>`,
    `<path d="${s.shaft}" stroke-linecap="butt"/>`,
    `<path d="${s.head}" stroke-linecap="square"/>`,
    `</g>`,
    `<rect x="${s.lime.x}" y="${s.lime.y}" width="${s.lime.size}" height="${s.lime.size}" fill="${lime}"/>`,
  ].join('');

const logotypeMarkup = (fg) =>
  `<g fill="${fg}" transform="translate(${textX} ${textY})">${glyphs
    .map((g) => `<path d="${g.d}"/>`)
    .join('')}</g>`;

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}" role="img" aria-labelledby="t"><title id="t">${title}</title>${body}</svg>\n`;

const out = (rel, content) => {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log('  ✓', rel);
};

console.log('BEYOND brand assets');

// Full lockups
out(
  'public/brand/beyond-logo-on-dark.svg',
  svg(LOCKUP_W, LOCKUP_H, symbolMarkup(C.white, C.lime) + logotypeMarkup(C.white), 'BEYOND'),
);
out(
  'public/brand/beyond-logo-on-light.svg',
  svg(LOCKUP_W, LOCKUP_H, symbolMarkup(C.ink, C.lime) + logotypeMarkup(C.ink), 'BEYOND'),
);
// Monochrome lockups (lime square takes the foreground colour)
out(
  'public/brand/beyond-logo-mono-ink.svg',
  svg(LOCKUP_W, LOCKUP_H, symbolMarkup(C.ink, C.ink) + logotypeMarkup(C.ink), 'BEYOND'),
);
out(
  'public/brand/beyond-logo-mono-white.svg',
  svg(LOCKUP_W, LOCKUP_H, symbolMarkup('#FFFFFF', '#FFFFFF') + logotypeMarkup('#FFFFFF'), 'BEYOND'),
);
// Symbol only
out('public/brand/beyond-symbol-on-dark.svg', svg(72, 72, symbolMarkup(C.white, C.lime), 'BEYOND'));
out('public/brand/beyond-symbol-on-light.svg', svg(72, 72, symbolMarkup(C.ink, C.lime), 'BEYOND'));
out('public/brand/beyond-symbol-mono.svg', svg(72, 72, symbolMarkup(C.ink, C.ink), 'BEYOND'));

// Favicon: symbol on a Midnight Ink tile so it reads on light and dark tabs.
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><rect width="72" height="72" rx="14" fill="${C.ink}"/><g transform="translate(9 9) scale(0.75)">${symbolMarkup(
  C.white,
  C.lime,
  FAVICON,
)}</g></svg>\n`;
out('src/app/icon.svg', fav);
out('public/brand/beyond-favicon.svg', fav);

// Geometry for React components
const ts = `/* Auto-generated by scripts/build-brand.mjs — do not edit by hand. */

/** Symbol geometry on a 72 × 72 ink box. */
export const SYMBOL = ${JSON.stringify(SYMBOL, null, 2)} as const;

/** Logotype glyph outlines (Space Grotesk Bold), cap top at y≈0, baseline at y=${CAP_HEIGHT}. */
export const LOGOTYPE = {
  width: ${LOGO_W},
  top: ${LOGO_TOP},
  height: ${LOGO_H},
  capHeight: ${CAP_HEIGHT},
  glyphs: ${JSON.stringify(glyphs, null, 2)},
} as const;

/** Horizontal lockup metrics. */
export const LOCKUP = {
  width: ${LOCKUP_W},
  height: ${LOCKUP_H},
  textX: ${textX},
  textY: ${textY},
} as const;
`;
out('src/components/brand/logo-data.ts', ts);
console.log(`  lockup ${LOCKUP_W}×${LOCKUP_H}, logotype ${LOGO_W}×${LOGO_H}`);
