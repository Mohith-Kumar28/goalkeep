import { LogoTicker } from '@/components/primitives/logo-ticker'
import { ticker } from '@/content/homepage'
import { partnerGroups } from '@/content/partners'

/**
 * Band 2 — the partner wall.
 *
 * After the 23 Sep review:
 *
 *   · "The header is not standing out" - it is a real section heading now,
 *     not a small letterspaced label, and the subline holds to one line.
 *   · Full-colour marks, in two labelled rows (10 Nov): Nonprofits, and
 *     Funders & intermediaries.
 */
export function Credibility({ ground = 'ground-cream' }: { ground?: string }) {
  return (
    <section
      className={`${ground} band accent-blue relative !py-12 md:!py-14`}
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

      <LogoTicker groups={partnerGroups} />
    </section>
  )
}
