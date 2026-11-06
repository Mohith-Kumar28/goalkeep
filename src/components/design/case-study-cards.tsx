import type { ReactNode } from 'react'
import { ArrowIcon } from './icons'
import { SiteLink } from './site-link'
import { tones } from './tones'
import type { Tone } from './tones'

export type CaseTag = { label: string; tone: Tone }

type CaseCardBase = { title: string; body: string; tags: Array<CaseTag> }

export type CaseCard =
  | (CaseCardBase & {
      kind: 'live'
      href: string
      photo: { src: string; alt: string }
      /** Defaults to "Read the case study". */
      cta?: string
    })
  | (CaseCardBase & {
      kind: 'soon'
      /** Tint behind "photo awaiting approval". */
      tone: Tone
      /** Defaults to "Full case study coming soon". */
      note?: string
    })

const eyebrowStyle = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
} as const

export function CaseStudyCards({
  heading,
  cards,
  id = 'case',
}: {
  /** Use <em> for the italic run. */
  heading: ReactNode
  cards: Array<CaseCard>
  id?: string
}) {
  return (
    <section id={id} className="dc-band" style={{ background: '#FFFFFF', paddingTop: 56, paddingBottom: 64 }}>
      <div className="dc-shell">
        <h2 className="dc-h2" style={{ maxWidth: 'none' }}>
          {heading}
        </h2>
        <div
          className="dc-grid3 dc-stories"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 24,
            marginTop: 36,
          }}
        >
          {cards.map((card) => (
            <CaseCardView key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseCardView({ card }: { card: CaseCard }) {
  const body = (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '24px 26px 26px', flex: 1 }}>
      <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {card.tags.map((tag) => (
          <span
            key={tag.label}
            style={{
              fontSize: 13,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 4,
              background: tones[tag.tone].bg,
              color: tones[tag.tone].ink,
            }}
          >
            {tag.label}
          </span>
        ))}
      </span>
      <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.28 }}>{card.title}</span>
      <span style={{ fontSize: 16, lineHeight: 1.55 }}>{card.body}</span>
      {card.kind === 'live' ? (
        <span className="dc-tlink" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
          {card.cta ?? 'Read the case study'} <ArrowIcon />
        </span>
      ) : (
        <span style={{ marginTop: 'auto', fontSize: 15, fontWeight: 700, color: tones.gold.ink }}>
          {card.note ?? 'Full case study coming soon'}
        </span>
      )}
    </span>
  )

  if (card.kind === 'live') {
    return (
      <SiteLink href={card.href} className="dc-surface dc-lift dc-story">
        <img
          src={card.photo.src}
          alt={card.photo.alt}
          style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
        />
        {body}
      </SiteLink>
    )
  }
  return (
    <div className="dc-surface dc-story">
      <div
        role="img"
        aria-label="Photo placeholder"
        style={{
          height: 220,
          background: tones[card.tone].bg,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 16,
        }}
      >
        <span style={{ ...eyebrowStyle, color: tones[card.tone].ink }}>photo awaiting approval</span>
      </div>
      {body}
    </div>
  )
}
