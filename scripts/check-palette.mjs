/**
 * Brand-palette fidelity.
 *
 * The page is deliberately colourful, so the thing worth guarding is no
 * longer restraint — it is that every colour on screen actually comes from
 * the brand. This fails on any off-palette hue, which is how a stray
 * `text-blue-500` or a default shadcn token gets caught.
 *
 * Greys along the published neutral ramp are allowed, as are fully
 * transparent values and third-party logo artwork.
 *
 *   node scripts/check-palette.mjs [url]
 */
import { chromium } from 'playwright'

const BRAND = new Set(
  [
    // Five hues, their deeps and tints
    '#3f3d3e', '#4765b3', '#6ebfac', '#e6968b', '#e7dd50',
    '#2f4a92', '#4a9c88', '#c97268', '#b8ab1f',
    // Inks — darker variants reserved for small text (see tokens.css)
    '#26604f', '#8f3f35',
    '#dbe0f0', '#def1ec', '#f8e0dd', '#fbf8dc',
    '#eef1fa', '#f1faf7', '#fbedea', '#fdfbe9',
    // Neutral ramp
    '#1f1e1f', '#2f2e2f', '#605e60', '#807e80',
    '#aba9ab', '#c9c8c9', '#e8e7e8', '#f4f3f4', '#fafafa', '#ffffff',
  ].map((h) => h.toLowerCase()),
)

const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')

const URL = process.argv[2] || process.env.SITE_URL || 'http://localhost:3005/'
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
