import { LogoTicker } from '@/components/primitives/logo-ticker'
import { ticker } from '@/content/homepage'
import { tickerRowOne, tickerRowTwo } from '@/content/partners'

/**
 * Band 2 — the partner wall.
 *
 * After the 23 Sep review:
 *
 *   · "The header is not standing out" - it is a real section heading now,
 *     not a small letterspaced label, and the subline holds to one line.
 *   · Aditya asked to see the marks in their own colours rather than
 *     greyscale. After 28 Sep only the full-colour rail remains.
 */
export function Credibility() {
  return (
    <section
      className="ground-cream band accent-blue relative !py-12 md:!py-14"
      aria-labelledby="credibility-heading"
    >
      <div className="shell mb-8 flex flex-col items-center gap-3 text-center">
        <h2 id="credibility-heading" className="h2">
          {/* The hand-drawn ring came off in the 28 Sep review - it read oddly
              without a transparent SVG behind it. */}
          {ticker.heading} <em>{ticker.headingEm}</em>
        </h2>
        <p className="text-[length:var(--fs-lg)] text-[var(--fg-1)] md:whitespace-nowrap">
          {ticker.subline}
        </p>
      </div>

      {/* 28 Sep: Option A won - full colour, always running, no pause on
          hover. The greyscale and scroll-reveal variants are gone. */}
      <div className="ticker-mask">
        <LogoTicker rowOne={tickerRowOne} rowTwo={tickerRowTwo} tone="color" />
      </div>
    </section>
  )
}
