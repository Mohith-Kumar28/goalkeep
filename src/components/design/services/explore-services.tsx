import type { ExploreCard } from '../explore-more'
import type { Html } from '@/content/design/service-page'
import { ArrowIcon } from '../icons'
import { SiteLink } from '../site-link'
import { tones } from '../tones'
import { Rich } from './rich'

/** ExploreMore draws two columns; the services pages offer three siblings. */
export function ExploreServices({ heading, cards }: { heading: Html; cards: Array<ExploreCard> }) {
  return (
    <section className="dc-band" style={{ background: '#FFFFFF', paddingTop: 56, paddingBottom: 56 }}>
      <div className="dc-shell">
        <Rich as="h2" className="dc-h2" html={heading} />
        <div
          className="dc-grid3"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24, marginTop: 32 }}
        >
          {cards.map((card) => (
            <SiteLink
              key={card.href}
              href={card.href}
              className="dc-lift"
              style={{
                background: tones[card.tone].bg,
                borderRadius: 12,
                padding: 32,
                textDecoration: 'none',
                color: '#14131A',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                border: '1px solid transparent',
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.28 }}>{card.title}</span>
              <span style={{ fontSize: 15, lineHeight: 1.6 }}>{card.body}</span>
              <span className="dc-tlink" style={{ marginTop: 8, alignSelf: 'flex-start', color: tones[card.tone].ink }}>
                {card.cta} <ArrowIcon />
              </span>
            </SiteLink>
          ))}
        </div>
      </div>
    </section>
  )
}
