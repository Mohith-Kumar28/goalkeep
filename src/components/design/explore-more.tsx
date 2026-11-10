import type { ReactNode } from 'react'
import { Reveal } from '@/components/primitives/reveal'
import '@/styles/design-case-studies.css'
import { ArrowIcon } from './icons'
import { SiteLink } from './site-link'
import { tones } from './tones'
import type { Tone } from './tones'

export type ExploreCard = {
  title: string
  body: string
  href: string
  /** The link text, e.g. "Explore the program". */
  cta: string
  tone: Tone
}

export function ExploreMore({
  cards,
  heading = (
    <>
      Not quite the right fit? <em>Explore more.</em>
    </>
  ),
}: {
  cards: Array<ExploreCard>
  heading?: ReactNode
}) {
  return (
    <section className="dc-band" style={{ background: '#FFFFFF', paddingTop: 56, paddingBottom: 56 }}>
      <div className="dc-shell">
        <h2 className="dc-h2">{heading}</h2>
        <div
          className="dc-grid2 dc-swipe"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 24,
            marginTop: 32,
          }}
        >
          {cards.map((card, i) => (
            <Reveal key={card.href} delay={i * 0.07} className="dc-explore-slot">
            <SiteLink
              href={card.href}
              className="dc-lift dc-explore-card"
              style={{
                background: tones[card.tone].bg,
                borderRadius: 12,
                padding: 32,
                height: '100%',
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
              <span
                className="dc-tlink"
                style={{ marginTop: 8, alignSelf: 'flex-start', color: tones[card.tone].ink }}
              >
                {card.cta} <ArrowIcon />
              </span>
            </SiteLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
