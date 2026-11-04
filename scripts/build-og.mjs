/**
 * Builds the Open Graph share card at public/og.jpg.
 *
 *   pnpm og
 *
 * Rendered rather than drawn by hand so it stays honest: the fonts, the hues,
 * the photo panel and the proof card are all the page's own, inlined here as
 * data URIs and shot with Playwright.
 *
 * Kept in step with the site by hand: the highlighter swipe, the type, the
 * palette and the card treatment here are the same ones in styles.css. If you
 * change a marker or a surface there, change it here too — this card is the
 * only place the design exists twice.
 *
 * 23 Oct: redrawn on the 21 Oct hero - flat navy, the new headline and line
 * (matching the meta title and description Rumit sent) and the white case
 * card in place of the angled photo panel.
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
const photo = b64(process.env.PHOTO || 'public/photos/case-apni-shala.webp', 'image/webp')

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Nunito;src:url(${nunito}) format('woff2');font-weight:200 1000;font-display:block}
@font-face{font-family:Caveat;src:url(${caveat}) format('woff2');font-weight:400 700;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
:root{--swipe:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 60' preserveAspectRatio='none'%3E%3Cpath d='M0 50C2 36 1 21 1 6C40 2 78 9 118 5C158 1 200 8 239 4C240 19 239 37 238 52C200 57 160 49 120 54C80 59 40 51 0 50Z' fill='%23fff'/%3E%3C/svg%3E")}
body{width:1200px;height:630px;overflow:hidden;background:#2f4a92;font-family:Nunito,sans-serif;color:#fff;position:relative}

/* Two tonal rings bleeding off the corners - the hero's ShapeField, quiet. */
.ring{position:absolute;border-radius:50%;border:13px solid #3d5aa8}
.ring.a{width:380px;height:380px;top:-170px;right:-120px}
.ring.b{width:220px;height:220px;bottom:-120px;left:-60px}

/* The hero's case card: white, photo on top, chip and org, the line. */
.card{position:absolute;right:56px;top:50%;transform:translateY(-50%);width:400px;background:#fff;
  color:#14131a;border-radius:16px;overflow:hidden;box-shadow:0 16px 36px rgb(12 20 44 / .3)}
.card img{display:block;width:100%;aspect-ratio:2/1;object-fit:cover}
.card .meta{padding:18px 22px 22px}
.card .row{display:flex;align-items:center;gap:10px}
.card .chip{background:#fbf3df;font-size:13px;font-weight:700;padding:4px 9px;border-radius:6px}
.card .org{font-size:12px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#2f4a92}
.card .line{margin-top:10px;font-size:17px;line-height:1.42;font-weight:600;color:#1f2f63}

.content{position:relative;padding:48px 56px 52px;height:100%;width:62%;display:flex;flex-direction:column}
/* The wordmark anchors the top; everything else centres in what is left, so
   the block does not sit high with a pool of empty navy under it. */
.body{margin:auto 0}
.mark{align-self:flex-start;display:block;height:42px;width:auto}
.eyebrow{align-self:flex-start;display:flex;align-items:center;gap:12px;font-size:15px;font-weight:700;
  letter-spacing:.09em;text-transform:uppercase;color:#eac452;margin:30px 0 14px}
.eyebrow::before{content:"";display:block;width:26px;height:2px;background:currentColor}

h1{font-weight:500;font-size:50px;line-height:1.06;letter-spacing:-.02em;text-wrap:balance}
/* 21 Oct headline, set like the hero: light, with the phrase that carries it
   in bold italic. */
h1 em{font-style:italic;font-weight:800}

.sub{margin-top:30px;font-size:21px;font-weight:400;line-height:1.5;max-width:33ch;color:rgb(255 255 255 / .9)}
/* One mark, not three. On the page the typewriter only ever highlights one
   phrase at a time; a card lighting all three at once is the old louder
   version of the same line.

   The same highlighter as the site: chisel ends from a skew, wobbling edges
   from a mask, uneven ink. See the .marker block in styles.css. */
.sub .m{position:relative;isolation:isolate;display:inline-block;
  padding:0 .1em;margin:0 .1em 0 .16em;font-weight:700;color:#2f4a92}
.sub .m::before{content:"";position:absolute;z-index:-1;
  inset:-.18em -.3em -.14em -.24em;background:#fff;
  background-image:
    linear-gradient(103deg,rgb(47 74 146 / .16) 0 3%,rgb(47 74 146 / 0) 13%),
    linear-gradient(283deg,rgb(47 74 146 / .12) 0 3%,rgb(47 74 146 / 0) 11%),
    linear-gradient(to top,rgb(47 74 146 / .14) 0,rgb(47 74 146 / 0) 42%),
    linear-gradient(97deg,rgb(255 255 255 / 0) 28%,rgb(255 255 255 / .22) 36%,rgb(255 255 255 / 0) 46%);
  transform:rotate(-.9deg) skewX(-8deg);
  -webkit-mask-image:var(--swipe);mask-image:var(--swipe);
  -webkit-mask-size:100% 100%;mask-size:100% 100%;
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}

</style></head><body>

<div class="ring a"></div><div class="ring b"></div>

<div class="content">
  <img class="mark" src="${wordmark}" alt="Goalkeep">
  <div class="body">
  <span class="eyebrow">Data work for the social sector</span>

  <h1>Enabling social sector organisations to use data to <em>scale impact.</em></h1>

  <p class="sub">We work with nonprofits, funders, and ecosystem partners to <span class="m">turn data into decisions.</span></p>
  </div>
</div>

<div class="card">
  <img src="${photo}" alt="">
  <div class="meta">
    <div class="row"><span class="chip">Identifying key metrics</span><span class="org">Apni Shala Foundation</span></div>
    <p class="line">A handful of hero metrics on the weekly dashboard helped Apni Shala quickly identify student learning gaps.</p>
  </div>
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
