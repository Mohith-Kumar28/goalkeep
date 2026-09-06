import { LogoTicker } from '@/components/primitives/logo-ticker'
import { ticker } from '@/content/homepage'
import { tickerRowOne, tickerRowTwo } from '@/content/partners'

/**
 * Band 2 — the partner wall.
 *
 * Three changes out of the review, all of them subtractions:
 *
 *   · "Again, the boldened text is too much… just reduce the text sort of
 *     screamingness over here." The heading dropped from a 32px extrabold
 *     display line to a small letterspaced label, and the hand-drawn underline
 *     under it is gone ("or don't underline anything here, it's fine, just
 *     keep it simple").
 *   · "Jarring start and finish line." The band's 2px ink rules top and bottom
 *     were the jarring part, along with a fade mask too narrow to hide the
 *     wrap. Rules gone; the mask is now 140px a side.
 *   · "Black and white and then colour on hover" — see LogoTile.
 */
export function Credibility() {
  return (
    <section
      className="ground-cream band accent-blue relative !py-14 md:!py-16"
      aria-labelledby="credibility-heading"
    >
      <div className="shell mb-10 flex justify-center">
        {/* Centred, so the eyebrow's leading rule is suppressed here — a
            dash hanging off the left of a centred label reads as a mistake. */}
        <h2
          id="credibility-heading"
          className="eyebrow text-[var(--fg-2)] [&::before]:hidden"
        >
          {ticker.heading}
        </h2>
      </div>

      <div className="ticker-mask">
        <LogoTicker rowOne={tickerRowOne} rowTwo={tickerRowTwo} />
      </div>
    </section>
  )
}
