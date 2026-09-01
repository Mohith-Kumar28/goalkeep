import { chromium } from 'playwright'

const URL = process.argv[2] || process.env.SITE_URL || 'http://localhost:3005/'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const findings = await page.evaluate(() => {
  const parse = (c) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number)
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (l1 + 0.05) / (l2 + 0.05)
  }
  const bgOf = (el) => {
    let n = el
    while (n) {
      const bg = getComputedStyle(n).backgroundColor
      const p = parse(bg)
      if (p.length === 3 && !bg.includes('rgba(0, 0, 0, 0)')) return p
      n = n.parentElement
    }
    return [255, 255, 255]
  }

  const isDevtools = (n) =>
    !!n.closest('#tanstack_devtools, [data-tanstack-devtools], .tsqd-parent-container') ||
    // The devtools trigger is a goober-classed button outside that root.
    !!n.closest('[class*="go2"], [class*="go3"], [class*="go5"], [class*="go9"]')

  const out = []
  const YELLOW = '231, 221, 80'

  for (const el of document.querySelectorAll('h1,h2,h3,p,a,span,button,li,dt,dd,blockquote,figcaption')) {
    // The dev-only devtools panel is not our markup.
    if (isDevtools(el)) continue
    const txt = (el.textContent || '').trim()
    if (!txt || el.children.length > 0) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue

    const cs = getComputedStyle(el)
    const fg = parse(cs.color)
    if (fg.length !== 3) continue

    // The brand book's ban is specifically "yellow on white — never use for
    // text". Yellow on charcoal is 7.2:1 and is how the stat blocks are
    // built, so the rule is enforced by measured contrast below plus this
    // check against light grounds.
    if (cs.color.includes(YELLOW)) {
      const bg = bgOf(el)
      if (lum(bg) > 0.4) {
        out.push({
          level: 'BANNED',
          why: 'yellow text on a light ground',
          txt: txt.slice(0, 40),
        })
        continue
      }
    }
    // Hard ban: pure teal may never carry text under 24px.
    const size = parseFloat(cs.fontSize)
    if (cs.color.includes('110, 191, 172') && size < 24) {
      out.push({ level: 'BANNED', why: `teal #6EBFAC on text at ${size}px (<24px)`, txt: txt.slice(0, 40) })
      continue
    }

    const cr = ratio(fg, bgOf(el))
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
