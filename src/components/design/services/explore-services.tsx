import type { ExploreCard } from '../explore-more'
import type { Html } from '@/content/design/service-page'
import { Reveal } from '../../primitives/reveal'
import { ArrowIcon } from '../icons'
import { SiteLink } from '../site-link'
import { tones } from '../tones'
import { Rich } from './rich'

/** ExploreMore draws two columns; the services pages offer three siblings. On a phone the
 *  cards swipe sideways instead of stacking, and the whole card is the link, so long text
 *  clamps instead of taking a read-more toggle. */
export function ExploreServices({ heading, cards }: { heading: Html; cards: Array<ExploreCard> }) {
  return (
    <section className="dc-band dc-svc-band" style={{ background: '#FFFFFF' }}>
      <Reveal className="dc-shell">
        <Rich as="h2" className="dc-h2" html={heading} />
        <div className="dc-grid3 dc-explore-row">
          {cards.map((card) => (
            <div
              key={card.href}
              className="dc-lift dc-explore-card"
              style={{ background: tones[card.tone].bg }}
            >
              <span className="dc-explore-title">{card.title}</span>
              <p className="dc-explore-body">{card.body}</p>
              <SiteLink href={card.href} className="dc-tlink dc-explore-cta" style={{ color: tones[card.tone].ink }}>
                {card.cta} <ArrowIcon />
              </SiteLink>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
