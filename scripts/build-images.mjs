/**
 * Renders raster brand images with Playwright (Chromium):
 *   public/og.png                1200×630  Open Graph / social card
 *   src/app/apple-icon.png       180×180
 *   public/brand/icon-192.png    192×192   (web manifest)
 *   public/brand/icon-512.png    512×512   (web manifest)
 *   src/app/favicon.ico          16 + 32 + 48 px (PNG-in-ICO)
 *
 * Run after `npm run brand`:  node scripts/build-images.mjs
 * Requires the `playwright` package (npx playwright install chromium).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const b64 = (p) => fs.readFileSync(path.join(root, p)).toString('base64');
const fonts = `
@font-face{font-family:Heebo;src:url(data:font/woff2;base64,${b64('src/app/fonts/heebo-hebrew-wght-normal.woff2')}) format('woff2');font-weight:100 900;unicode-range:U+0590-05FF,U+200C-2010,U+20AA,U+FB1D-FB4F}
@font-face{font-family:Heebo;src:url(data:font/woff2;base64,${b64('src/app/fonts/heebo-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:Grotesk;src:url(data:font/woff2;base64,${b64('src/app/fonts/space-grotesk-latin-wght-normal.woff2')}) format('woff2');font-weight:300 700}
`;

const lockup = read('public/brand/beyond-logo-on-dark.svg');
const favicon = read('src/app/icon.svg');

const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:#10131A;color:#F5F6F8;font-family:Grotesk,Heebo,sans-serif;position:relative}
.grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(12,1fr);padding:0 60px;column-gap:20px}
.grid i{border-inline:1px solid rgba(245,246,248,.05)}
.glow{position:absolute;width:900px;height:900px;left:-260px;top:-380px;background:radial-gradient(closest-side,rgba(53,92,255,.45),rgba(53,92,255,.08) 55%,transparent 72%)}
.logo{position:absolute;top:72px;right:72px;width:300px}
.logo svg{width:100%;height:auto;display:block}
.he{position:absolute;right:72px;bottom:150px;direction:rtl;text-align:right;font-family:Heebo;font-weight:800;font-size:66px;line-height:1.08;letter-spacing:-.02em}
.he span{color:rgba(245,246,248,.55);display:block;font-weight:700;-webkit-text-stroke:0}
.en{position:absolute;right:72px;bottom:72px;font-size:20px;font-weight:500;letter-spacing:.22em;color:rgba(245,246,248,.6)}
.mark{position:absolute;left:72px;bottom:72px;width:26px;height:26px;background:#C7F34A;box-shadow:0 0 40px rgba(199,243,74,.5)}
</style></head><body>
<div class="glow"></div><div class="grid">${'<i></i>'.repeat(12)}</div>
<div class="logo">${lockup}</div>
<p class="he"><span>לא עוד אתר.</span>נוכחות דיגיטלית שעובדת.</p>
<p class="en">THINK WIDER. BUILD BEYOND.</p>
<div class="mark"></div>
</body></html>`;

const iconHtml = (size) =>
  `<!doctype html><html><head><style>*{margin:0}body{width:${size}px;height:${size}px;background:transparent}svg{width:${size}px;height:${size}px;display:block}</style></head><body>${favicon}</body></html>`;

function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1200, height: 630 });
const tmp = path.join(root, '.og-render.html');
fs.writeFileSync(tmp, ogHtml);
await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
fs.unlinkSync(tmp);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, 'public/og.png') });
console.log('  ✓ public/og.png');

const render = async (size) => {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(iconHtml(size), { waitUntil: 'load' });
  return page.screenshot({ omitBackground: true });
};

fs.writeFileSync(path.join(root, 'src/app/apple-icon.png'), await render(180));
fs.writeFileSync(path.join(root, 'public/brand/icon-192.png'), await render(192));
fs.writeFileSync(path.join(root, 'public/brand/icon-512.png'), await render(512));
console.log('  ✓ apple-icon.png, icon-192.png, icon-512.png');

const ico = toIco([
  { size: 16, data: await render(16) },
  { size: 32, data: await render(32) },
  { size: 48, data: await render(48) },
]);
fs.writeFileSync(path.join(root, 'src/app/favicon.ico'), ico);
console.log('  ✓ src/app/favicon.ico');

await browser.close();
