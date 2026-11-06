import type { CaseCard } from '../case-study-cards'
import type { CaseQuote } from '@/content/design/service-page'
import { tones } from '../tones'
import type { Tone } from '../tones'
import { ArrowIcon } from '../icons'
import { SiteLink } from '../site-link'
import { AudienceTag } from './audience-tag'
import { toneAccents } from './service-tones'

export function CaseStudySection({
  card,
  quote,
  tone,
  audienceTag,
}: {
  card: CaseCard
  quote?: CaseQuote
  tone: Tone
  audienceTag?: string
}) {
  const content = (
    <div style={{ padding: 40, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
      </div>
      <h3 style={{ margin: '22px 0 0', fontSize: 36, fontWeight: 700, lineHeight: 1.16, letterSpacing: '-0.012em' }}>
        {card.title}
      </h3>
      <p style={{ margin: '14px 0 0', fontSize: 19, lineHeight: 1.6 }}>{card.body}</p>
      {quote && (
        <figure style={{ margin: '24px 0 0', padding: 0 }}>
          <blockquote style={{ margin: 0, fontSize: 17, lineHeight: 1.6, fontStyle: 'italic' }}>
            <span
              aria-hidden="true"
              style={{
                fontSize: 40,
                lineHeight: 0,
                fontWeight: 800,
                fontStyle: 'normal',
                color: toneAccents[tone].base,
                verticalAlign: -14,
                marginRight: 4,
              }}
            >
              &ldquo;
            </span>
            {quote.text}
          </blockquote>
          <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <img
              src={quote.avatar.src}
              alt={quote.avatar.alt}
              style={{ width: 44, height: 44, borderRadius: 999, objectFit: 'cover', display: 'block' }}
            />
            <span style={{ fontSize: 15 }}>
              <strong>{quote.name}</strong> · {quote.org}
            </span>
          </figcaption>
        </figure>
      )}
      <p
        style={
          card.kind === 'live'
            ? { margin: 'auto 0 0', paddingTop: 28 }
            : { margin: 'auto 0 0', paddingTop: 28, fontSize: 15, fontWeight: 700, color: tones[card.tone].ink }
        }
      >
        {card.kind === 'live' ? (
          <SiteLink href={card.href} className="dc-tlink">
            {card.cta ?? 'Read the case study'} <ArrowIcon />
          </SiteLink>
        ) : (
          (card.note ?? 'Full case study coming soon')
        )}
      </p>
    </div>
  )

  return (
    <section id="case" className="dc-band" style={{ background: '#FFFFFF', paddingTop: 56, paddingBottom: 56 }}>
      <div className="dc-shell">
        {audienceTag && (
          <p style={{ margin: '0 0 18px' }}>
            <AudienceTag tone={tone}>{audienceTag}</AudienceTag>
          </p>
        )}
        <article
          className="dc-surface dc-lift dc-case-split"
          style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)' }}
        >
          {card.kind === 'live' ? (
            <img
              src={card.photo.src}
              alt={card.photo.alt}
              style={{ width: '100%', height: '100%', minHeight: 380, objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div
              role="img"
              aria-label="Photo placeholder"
              style={{
                minHeight: 380,
                height: '100%',
                background: tones[card.tone].bg,
                display: 'flex',
                alignItems: 'flex-end',
                padding: 20,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: tones[card.tone].ink,
                }}
              >
                photo awaiting approval
              </span>
            </div>
          )}
          {content}
        </article>
      </div>
    </section>
  )
}
