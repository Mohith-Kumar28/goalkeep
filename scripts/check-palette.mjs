/**
 * Brand-palette fidelity.
 *
 * The page is deliberately colourful, so the thing worth guarding is not
 * restraint — it is that every colour on screen actually comes from the mark.
 * This fails on any off-palette hue, which is how a stray `text-blue-500` or a
 * default shadcn token gets caught.
 *
 * The list below was reset after the 4 September review, which called the v2
 * values "too vibrant and popping" and "a little amateurish" and named the
 * reference creatives as the base. Every hue here is the muted value from
 * those creatives; navy and white carry the page.
 *
 * There is deliberately no neutral ramp any more. Text is ink or white; softer
 * text is an alpha of one of those, and alpha values are skipped below.
 * Third-party logo artwork inside <img> is skipped too.
 *
 *   node scripts/check-palette.mjs [url]
 */
import { chromium } from 'playwright'

const BRAND = new Set(
  [
    // Grounds — navy and white carry the page
    '#2f4a92', '#1e3266', '#3d5aa8',
    '#fcfcfd', '#f1f4fa', '#ffffff', '#14131a',
    // Pop hues, pulled back off full chroma after the 4 Sep review, plus their
    // hover-deeps and the -ink variants that survive as small text on white
    '#3f63c8', '#2f4d9f',
    '#2f9c8f', '#237a70', '#176059',
    '#e07a5f', '#c8613f', '#9c452a',
    '#eac452', '#cfa72f',
    // Lifted values, legible on the navy ground only
    '#8fa8e8', '#5fc9ba', '#f0a58c',
    // Tints
    '#eaeff9', '#e7f2f0', '#fbeee9', '#fbf3df',
    // Hairlines
    '#e5e7ee', '#d3d7e2',
    // The composited value of the hero card's translucent panel over navy,
    // used as the gradient stop the photograph dissolves into
    '#39538f',
  ].map((h) => h.toLowerCase()),)

const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')

const URL = process.argv[2] || process.env.SITE_URL || 'http://localhost:3000/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

const offPalette = await page.evaluate(() => {
  const isDevtools = (n) =>
      !!n.closest('#tanstack_devtools, [data-tanstack-devtools], .tsqd-parent-container') ||
      // The devtools trigger is a goober-classed button outside that root.
      !!n.closest('[class*="go2"], [class*="go3"], [class*="go5"], [class*="go9"]')
    const out = []
  for (const el of document.querySelectorAll('*')) {
    if (el.closest('img') || isDevtools(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const cs = getComputedStyle(el)
    const PAINTS = ['path', 'circle', 'rect', 'ellipse', 'polygon', 'line', 'polyline']
    const isSvg = PAINTS.includes(el.tagName.toLowerCase())
    const hasOwnText = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim(),
    )

    const props = []
    if (hasOwnText) props.push('color')
    props.push('backgroundColor')
    if (parseFloat(cs.borderTopWidth) > 0) props.push('borderTopColor')
    if (isSvg) props.push('fill', 'stroke')

    for (const prop of props) {
      const v = cs[prop]
      if (!v || v === 'none') continue
      const ctx = (window.__gkCtx ||= document
        .createElement('canvas')
        .getContext('2d', { willReadFrequently: true }))
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = v
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
      // Translucent values are derived (white/40 hairlines, focus halo), so
      // they are not palette violations.
      if (a < 250) continue
      out.push({
        rgb: [r, g, b],
        prop,
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').trim().slice(0, 30),
      })
    }
  }
  return out
})

const bad = []
for (const item of offPalette) {
  const hex = toHex(item.rgb)
  if (!BRAND.has(hex)) bad.push({ ...item, hex })
}

const unique = [...new Map(bad.map((b) => [b.hex + b.prop, b])).values()]

if (!unique.length) {
  console.log('Palette audit: PASS — every colour on the page is from the brand system')
} else {
  console.log(`Palette audit: ${unique.length} off-palette colour(s)`)
  unique.forEach((b) => console.log(`  ${b.hex}  ${b.prop} on <${b.tag}> "${b.text}"`))
}

await browser.close()
process.exit(unique.length ? 1 : 0)
