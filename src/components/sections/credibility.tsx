import { Annotate } from '@/components/primitives/doodles'
import { LogoTicker } from '@/components/primitives/logo-ticker'
import type { TickerTone } from '@/components/primitives/logo-ticker'
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
 *     greyscale. Both are on the page, one above the other, so the two can be
 *     compared on the same screen; delete the variant that loses and its
 *     label. See TickerTone.
 */
const VARIANTS: Array<{ tone: TickerTone; label: string }> = [
  { tone: 'color', label: 'Option A · full colour' },
  { tone: 'mono', label: 'Option B · greyscale, colour on hover' },
  { tone: 'reveal', label: 'Option C · greyscale, turns colour as it scrolls in' },
]

export function Credibility() {
  return (
    <section
      className="ground-cream band accent-blue relative !py-12 md:!py-14"
      aria-labelledby="credibility-heading"
    >
      <div className="shell mb-8 flex flex-col items-center gap-3 text-center">
        <h2 id="credibility-heading" className="h2">
          {ticker.heading}{' '}
          {/* The guide's circle: one or two words, never a phrase. */}
          <Annotate mark="ring" inset="-13%" delay={0.3} className="ml-[0.2em]">
            <em>{ticker.headingEm}</em>
          </Annotate>
        </h2>
        <p className="text-[length:var(--fs-lg)] text-[var(--fg-1)] md:whitespace-nowrap">
          {ticker.subline}
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {VARIANTS.map((variant) => (
          <div key={variant.tone}>
            <p className="shell mb-3 text-center text-[length:var(--fs-xs)] font-bold tracking-[var(--tracking-label)] text-[var(--gk-coral-ink)] uppercase">
              {variant.label}
            </p>
            <div className="ticker-mask">
              <LogoTicker rowOne={tickerRowOne} rowTwo={tickerRowTwo} tone={variant.tone} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
