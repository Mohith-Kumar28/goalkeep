/**
 * Builds the Open Graph share card at public/og.jpg.
 *
 *   pnpm og
 *
 * Rendered rather than drawn by hand so it stays honest: the fonts, the hues,
 * the photo panel and the proof card are all the page's own, inlined here as
 * data URIs and shot with Playwright.
 *
 * Redrawn after the 4 September review, and for the reason the review gave:
 * "since I'm managing the social media, I want to make sure the newsletter,
 * social media and website come together — a 90% match in visual language."
 * A share card still built on Outfit, the acid yellow and a hard-offset
 * sticker would be the loudest surviving instance of exactly what was cut.
 * It now carries Nunito Sans, the muted palette, hairline surfaces and the
 * angled photo edge in navy rather than yellow.
 *
 * Rendered at 2x and downsampled, because the heading aliases badly at 1x.
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

const nunito = b64('node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2', 'font/woff2')
const caveat = b64('node_modules/@fontsource-variable/caveat/files/caveat-latin-wght-normal.woff2', 'font/woff2')
const wordmark = b64('public/wordmark-white.webp', 'image/webp')
const photo = b64(process.env.PHOTO || 'public/photos/hero-01-workshop.webp', 'image/webp')

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Nunito;src:url(${nunito}) format('woff2');font-weight:200 1000;font-display:block}
@font-face{font-family:Caveat;src:url(${caveat}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#2f4a92;font-family:Nunito,sans-serif;color:#fff;position:relative}

/* The photo panel, cut on an angle. The edge behind it was the acid yellow;
   it is now a quiet gold hairline, which is all it needs to separate the
   photograph from the navy. */
.edge{position:absolute;right:0;top:0;width:47%;height:100%;background:#eac452;
  clip-path:polygon(20% 0,100% 0,100% 100%,7% 100%)}
.panel{position:absolute;right:0;top:0;width:46.6%;height:100%;overflow:hidden;
  clip-path:polygon(20% 0,100% 0,100% 100%,7% 100%)}
.panel img{width:100%;height:100%;object-fit:cover}
.panel::after{content:"";position:absolute;inset:0;
  background:linear-gradient(to right,#2f4a92 0%,rgb(47 74 146 / .55) 26%,rgb(47 74 146 / .22) 60%)}

.content{position:relative;padding:52px 56px;height:100%;width:64%;display:flex;flex-direction:column}
.mark{align-self:flex-start;display:block;height:42px;width:auto}
.eyebrow{align-self:flex-start;display:flex;align-items:center;gap:12px;font-size:15px;font-weight:700;
  letter-spacing:.09em;text-transform:uppercase;color:#eac452;margin:30px 0 14px}
.eyebrow::before{content:"";display:block;width:26px;height:2px;background:currentColor}

h1{font-weight:800;font-size:54px;line-height:1.06;letter-spacing:-.02em;text-wrap:balance}
.mark-yellow{position:relative;display:inline-block;white-space:nowrap}
.squiggle{position:absolute;left:-2px;top:100%;width:calc(100% + 4px);height:16px;margin-top:-5px}

.sub{margin-top:30px;font-size:21px;font-weight:400;line-height:1.5;max-width:33ch;color:rgb(255 255 255 / .9)}
/* One mark, not three. On the page the typewriter only ever highlights one
   phrase at a time; a card lighting all three at once is the old louder
   version of the same line. */
.sub .m{font-weight:700;color:#2f4a92;background:#fff;border-radius:2px;padding:0 .2em}

/* Sits over the photo's cut edge, the way the proof card does on the site —
   now a translucent panel with a hairline, not a rotated sticker. */
.card{position:absolute;right:44px;bottom:44px;background:rgb(255 255 255 / .1);color:#fff;
  border:1px solid rgb(255 255 255 / .28);border-radius:12px;padding:18px 26px 20px;
  backdrop-filter:blur(2px);box-shadow:0 10px 30px rgb(20 30 60 / .28)}
.card .org{font-size:13px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;
  color:#eac452;line-height:1}
.card .stat{font-size:40px;font-weight:800;letter-spacing:-.03em;line-height:1.1;
  font-variant-numeric:tabular-nums;margin-top:8px;white-space:nowrap}
.card .line{font-size:14px;font-weight:400;margin-top:4px;color:rgb(255 255 255 / .8)}
</style></head><body>

<div class="edge"></div>
<div class="panel"><img src="${photo}" alt=""></div>

<div class="content">
  <img class="mark" src="${wordmark}" alt="Goalkeep">
  <span class="eyebrow">Data work for the social sector</span>

  <h1>MEL systems aren&rsquo;t just meant to measure impact, but also
    <span class="mark-yellow">strengthen it.<svg class="squiggle" viewBox="0 0 220 26" preserveAspectRatio="none" fill="none">
      <path d="M6 15c38-7 74-9 108-8c30 1 61 5 100 11" stroke="#eac452" stroke-width="6" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    </svg></span>
  </h1>

  <p class="sub">We <span class="m">design</span> data systems that deepen the impact of your programs.</p>
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
