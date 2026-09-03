import { LogoTicker } from '@/components/primitives/logo-ticker'
import { ticker } from '@/content/homepage'
import { tickerRowOne, tickerRowTwo } from '@/content/partners'
import { Scribble } from '@/components/primitives/doodles'

/**
 * Band 2 — the partner wall.
 *
 * Full-bleed on purpose: the break out of the content grid is what makes it
 * read as a machine running underneath the page rather than another content
 * block. The heading is centred and reduced to one line per the feedback
 * ("Change top text only to: Partners who trust us (centred)"), and the marks
 * now run at full colour and a third larger.
 */
export function Credibility() {
  return (
    <section
      className="ground-cream-deep band accent-blue relative border-y-2 border-[var(--gk-ink)]"
      aria-labelledby="credibility-heading"
    >
      <div className="shell mb-10 flex flex-col items-center gap-1">
        <h2
          id="credibility-heading"
          className="h3 text-center text-[length:clamp(1.5rem,2.6vw,2rem)]"
        >
          {ticker.heading}
        </h2>
        <Scribble
          name="underline"
          color="var(--gk-yellow)"
          className="h-3 w-[13rem]"
          delay={0.2}
        />
      </div>

      <div className="ticker-mask">
        <LogoTicker rowOne={tickerRowOne} rowTwo={tickerRowTwo} />
      </div>
    </section>
  )
}
