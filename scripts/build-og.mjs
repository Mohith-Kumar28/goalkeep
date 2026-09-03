/**
 * Builds the Open Graph share card at public/og.jpg.
 *
 *   pnpm og
 *
 * Rendered rather than drawn by hand so it stays honest: the fonts, the hues,
 * the arc lattice, the diagonal photo cut and the sticker card are all the
 * page's own, inlined here as data URIs and shot with Playwright.
 *
 * Rendered at 2x and downsampled, because Outfit at 900 aliases badly at 1x.
 *
 * JPEG, not PNG. The card is mostly photograph, so PNG lands around 430 KB
 * where JPEG at q90 is 170 KB and visually identical — and WhatsApp silently
 * drops link previews whose image is over ~300 KB.
 *
 * Re-run this whenever the headline, the palette or the hero photography
 * changes. Sharing platforms cache aggressively, so a changed card usually
 * needs the scraper re-run too (Facebook: Sharing Debugger, LinkedIn: Post
 * Inspector). Twitter/X and Slack pick it up on their own within a day.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const b64 = (p, mime) => `data:${mime};base64,${readFileSync(p).toString('base64')}`

const outfit = b64('node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2', 'font/woff2')
const jakarta = b64('node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2', 'font/woff2')
const caveat = b64('node_modules/@fontsource-variable/caveat/files/caveat-latin-wght-normal.woff2', 'font/woff2')
const wordmark = b64('public/wordmark-white.webp', 'image/webp')
const photo = b64(process.env.PHOTO || 'public/photos/hero-01-workshop.webp', 'image/webp')

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Outfit;src:url(${outfit}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:Jakarta;src:url(${jakarta}) format('woff2');font-weight:200 800;font-display:block}
@font-face{font-family:Caveat;src:url(${caveat}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#2f4a92;font-family:Jakarta,sans-serif;color:#fff;position:relative}

/* Arc lattice, straight off the mark's broken ring. */
.pattern{position:absolute;inset:0;opacity:.09}

/* The Canva device: a photo panel cut on an angle, with a hard yellow edge
   sitting a few degrees off it. clip-path can't take a border, so the edge is
   a second polygon behind the first. */
.edge{position:absolute;right:0;top:0;width:47%;height:100%;background:#e9df22;
  clip-path:polygon(20% 0,100% 0,100% 100%,7% 100%)}
.panel{position:absolute;right:0;top:0;width:46%;height:100%;overflow:hidden;
  clip-path:polygon(20% 0,100% 0,100% 100%,7% 100%)}
.panel img{width:100%;height:100%;object-fit:cover}
.panel::after{content:"";position:absolute;inset:0;background:rgb(31 50 104 / .3)}

.content{position:relative;padding:52px 56px;height:100%;width:64%;display:flex;flex-direction:column}
.mark{align-self:flex-start;display:block;height:42px;width:auto}
.eyebrow{align-self:flex-start;font-family:Caveat;font-size:31px;font-weight:700;color:#e9df22;
  transform:rotate(-2.5deg);margin:26px 0 8px}

h1{font-family:Outfit;font-weight:900;font-size:60px;line-height:1;letter-spacing:-.04em;text-wrap:balance}
.mark-yellow{position:relative;display:inline-block;white-space:nowrap}
.squiggle{position:absolute;left:-2px;top:100%;width:calc(100% + 4px);height:16px;margin-top:-5px}

.sub{margin-top:36px;font-size:21px;font-weight:600;line-height:1.45;max-width:31ch;color:rgb(255 255 255 / .92)}
.sub .y{font-weight:800;color:#14131a;background:#e9df22;border-radius:7px;padding:0 .16em}
.sub .t{font-weight:800;color:#14131a;background:#17bfac;border-radius:7px;padding:0 .16em}
.sub .c{font-weight:800;color:#14131a;background:#ff6a52;border-radius:7px;padding:0 .16em}

/* Sits over the photo's cut edge, the way the proof card does on the site. */
.card{position:absolute;right:44px;bottom:44px;background:#faf7f0;color:#14131a;
  border:3px solid #14131a;border-radius:20px;padding:16px 24px 18px;
  box-shadow:9px 9px 0 #14131a;transform:rotate(-2deg)}
.card .org{font-family:Caveat;font-size:27px;font-weight:700;color:#b33520;line-height:1}
.card .stat{font-family:Outfit;font-size:42px;font-weight:900;letter-spacing:-.05em;line-height:1.08;
  font-variant-numeric:tabular-nums;margin-top:3px;white-space:nowrap}
.card .line{font-size:14px;font-weight:700;margin-top:1px}

.shape{position:absolute}
</style></head><body>

<div class="edge"></div>
<div class="panel"><img src="${photo}" alt=""></div>

<svg class="pattern" xmlns="http://www.w3.org/2000/svg"><defs>
<pattern id="a" width="96" height="96" patternUnits="userSpaceOnUse">
<path d="M0 96A96 96 0 0 1 96 0" fill="none" stroke="#fff" stroke-width="2"/>
</pattern></defs><rect width="100%" height="100%" fill="url(#a)"/></svg>

<!-- the four-segment ring, bleeding off the left edge -->
<svg class="shape" style="left:-48px;top:516px" width="152" height="152" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="43" fill="none" stroke="#e9df22" stroke-width="14" stroke-linecap="round" stroke-dasharray="58 212" transform="rotate(-84 50 50)"/>
  <circle cx="50" cy="50" r="43" fill="none" stroke="#2f5fe8" stroke-width="14" stroke-linecap="round" stroke-dasharray="58 212" transform="rotate(6 50 50)"/>
  <circle cx="50" cy="50" r="43" fill="none" stroke="#17bfac" stroke-width="14" stroke-linecap="round" stroke-dasharray="58 212" transform="rotate(96 50 50)"/>
  <circle cx="50" cy="50" r="43" fill="none" stroke="#ff6a52" stroke-width="14" stroke-linecap="round" stroke-dasharray="58 212" transform="rotate(186 50 50)"/>
</svg>
<div class="shape" style="left:664px;top:30px;width:16px;height:16px;border-radius:50%;background:#ff6a52"></div>

<div class="content">
  <img class="mark" src="${wordmark}" alt="Goalkeep">
  <span class="eyebrow">data work for the social sector</span>

  <h1>MEL systems aren&rsquo;t just meant to measure impact, but also
    <span class="mark-yellow">strengthen it.<svg class="squiggle" viewBox="0 0 220 26" preserveAspectRatio="none" fill="none">
      <path d="M5 16c18-13 34 8 52-1s30-14 48-4s34 12 52 2s38-10 58 1" stroke="#e9df22" stroke-width="7" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    </svg></span>
  </h1>

  <p class="sub">We <span class="y">design</span>, <span class="t">build</span> and <span class="c">enable the adoption</span> of data systems for the social sector.</p>
</div>

<div class="card">
  <div class="org">Baithak Foundation</div>
  <div class="stat">11 hrs &rarr; 40 min</div>
  <div class="line">monthly reporting cycle</div>
</div>
</body></html>`

const OUT = process.env.OUT || 'public/og.jpg'
const TMP = 'public/.og-2x.png'

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
})
await page.setContent(html, { waitUntil: 'load' })
// Screenshotting before the inlined faces are parsed renders the fallback.
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(600)
await page.screenshot({ path: TMP })
await browser.close()

execFileSync('magick', [
  TMP, '-resize', '1200x630', '-strip',
  '-sampling-factor', '4:4:4', '-quality', '90',
  OUT,
])
unlinkSync(TMP)

const kb = Math.round(readFileSync(OUT).length / 1024)
console.log(`${OUT} — 1200x630, ${kb} KB`)
if (kb > 300) console.warn('WARNING: over 300 KB — WhatsApp may drop the preview.')
