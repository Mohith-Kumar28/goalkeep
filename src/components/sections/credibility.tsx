import { LogoTicker } from '@/components/primitives/logo-ticker'
import { ticker } from '@/content/homepage'
import { tickerRowOne, tickerRowTwo } from '@/content/partners'

/**
 * Band 2 — no accent. Logo colour appears on hover only, and that's other
 * organizations' brand equity rather than Goalkeep's palette.
 *
 * Full-bleed, breaking the content grid on purpose: the break is what makes
 * it read as a machine running underneath the page rather than another
 * content block.
 */
export function Credibility() {
  return (
    <section
      className="band border-y border-[var(--hairline)]"
      style={{ backgroundColor: 'var(--bg-3)' }}
      aria-labelledby="credibility-heading"
    >
      <div className="shell mb-10 flex flex-col gap-2">
        <h2 id="credibility-heading" className="eyebrow">
          {ticker.eyebrow}
        </h2>
        <p className="text-[length:var(--fs-lg)] text-[var(--fg-1)]">
          {ticker.line.value}
        </p>
      </div>

      <div className="ticker-mask">
        <LogoTicker rowOne={tickerRowOne} rowTwo={tickerRowTwo} />
      </div>
    </section>
  )
}
