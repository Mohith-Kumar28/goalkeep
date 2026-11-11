import { LogoTicker } from '@/components/primitives/logo-ticker'
import { ticker } from '@/content/homepage'
import { partnerGroups } from '@/content/partners'

/**
 * Band 2 — the partner wall.
 *
 * After the 23 Sep review:
 *
 *   · "The header is not standing out" - it is a real section heading now,
 *     not a small letterspaced label. The subline under it came off on
 *     11 Nov, "looking cluttered".
 *   · Full-colour marks, in two labelled rows (10 Nov): Nonprofits, and
 *     Funders & intermediaries.
 */
export function Credibility({ ground = 'ground-cream' }: { ground?: string }) {
  return (
    <section
      className={`${ground} band accent-blue relative !py-12 md:!py-14`}
      aria-labelledby="credibility-heading"
    >
      <div className="shell mb-6 text-center md:mb-8">
        <h2 id="credibility-heading" className="h2">
          {/* The hand-drawn ring came off in the 28 Sep review - it read oddly
              without a transparent SVG behind it. */}
          {ticker.heading} <em>{ticker.headingEm}</em>
        </h2>
      </div>

      <LogoTicker groups={partnerGroups} />
    </section>
  )
}
