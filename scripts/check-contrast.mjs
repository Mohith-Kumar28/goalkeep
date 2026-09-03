import { chromium } from 'playwright'

const URL = process.argv[2] || process.env.SITE_URL || 'http://localhost:3000/'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const findings = await page.evaluate(() => {
  /*
   * Colours must be rasterised, not regex-parsed. Tailwind v4 emits
   * `oklab(0.99 0.00004 0.00002 / 0.8)` for `text-white/80`, and pulling the
   * first three numbers out of that string yields [0.99, 0.00004, 0.00002] —
   * read as near-black RGB, which reported white-on-navy as a 2.5:1 failure.
   * A canvas resolves any colour syntax the browser understands, and returns
   * the alpha so translucent text can be composited properly.
   */
  const px = (c) => {
    const ctx = (window.__gkCtx ||= document
      .createElement('canvas')
      .getContext('2d', { willReadFrequently: true }))
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = c
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }
  /** Composite a translucent foreground over its ground — what the eye sees. */
  const over = ([r, g, b, a], bg) =>
    a >= 1 ? [r, g, b] : [0, 1, 2].map((i) => Math.round([r, g, b][i] * a + bg[i] * (1 - a)))
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (l1 + 0.05) / (l2 + 0.05)
  }
  /* A band declares its own surface with data-ground. The sticky header is
   * transparent while it floats over the navy hero, so walking its ancestors
   * lands on the cream body and reports white-on-cream — a failure that is not
   * real. Where an element has no ground of its own, its declared one wins. */
  const GROUNDS = {
    navy: [47, 74, 146],
    cream: [250, 247, 240],
    'cream-deep': [242, 237, 224],
  }
  const bgOf = (el) => {
    let n = el
    while (n) {
      const [r, g, b, a] = px(getComputedStyle(n).backgroundColor)
      if (a >= 0.99) return [r, g, b]
      const declared = n.dataset && n.dataset.ground && GROUNDS[n.dataset.ground]
      if (declared) return declared
      n = n.parentElement
    }
    return [255, 255, 255]
  }

  const isDevtools = (n) =>
    !!n.closest('#tanstack_devtools, [data-tanstack-devtools], .tsqd-parent-container') ||
    // The devtools trigger is a goober-classed button outside that root.
    !!n.closest('[class*="go2"], [class*="go3"], [class*="go5"], [class*="go9"]')

  const out = []
  const YELLOW = '233, 223, 34'

  for (const el of document.querySelectorAll('h1,h2,h3,p,a,span,button,li,dt,dd,blockquote,figcaption')) {
    // The dev-only devtools panel is not our markup.
    if (isDevtools(el)) continue
    const txt = (el.textContent || '').trim()
    if (!txt || el.children.length > 0) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue

    const cs = getComputedStyle(el)
    const bg = bgOf(el)
    const fg = over(px(cs.color), bg)

    // Yellow is a marker, not an ink. On navy it clears 5.9:1 and carries the
    // stat figures and the closing line; on anything light it is unreadable.
    // The hand-drawn strokes are yellow on navy too, but those are SVG and
    // never come through this text sweep.
    if (cs.color.includes(YELLOW)) {
      if (lum(bg) > 0.4) {
        out.push({
          level: 'BANNED',
          why: 'yellow text on a light ground',
          txt: txt.slice(0, 40),
        })
        continue
      }
    }
    // Hard ban: the pop teal and the pop coral may never carry small text.
    // Both clear 3:1 on cream and neither clears 4.5:1, so they are display
    // colours only — --gk-teal-ink and --gk-coral-ink exist for running text.
    const size = parseFloat(cs.fontSize)
    const POP_TEAL = '23, 191, 172'
    const POP_CORAL = '255, 106, 82'
    if (cs.color.includes(POP_TEAL) && size < 24) {
      out.push({ level: 'BANNED', why: `teal #17BFAC on text at ${size}px (<24px)`, txt: txt.slice(0, 40) })
      continue
    }
    if (cs.color.includes(POP_CORAL) && size < 24) {
      out.push({ level: 'BANNED', why: `coral #FF6A52 on text at ${size}px (<24px)`, txt: txt.slice(0, 40) })
      continue
    }

    const cr = ratio(fg, bg)
    const weight = parseInt(cs.fontWeight, 10) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const min = large ? 3 : 4.5
    if (cr < min) {
      out.push({
        level: 'FAIL',
        why: `${cr.toFixed(2)}:1 (needs ${min}:1) — ${size}px/${weight}`,
        txt: txt.slice(0, 40),
      })
    }
  }
  return out
})

if (!findings.length) console.log('Contrast audit: PASS — no failures, no banned pairings')
findings.forEach((f) => console.log(`${f.level}  ${f.why}  "${f.txt}"`))
await browser.close()
process.exit(findings.length ? 1 : 0)
