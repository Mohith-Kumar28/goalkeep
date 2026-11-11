import { Reveal } from '@/components/primitives/reveal'
import { literacyContent } from '@/content/design/literacy'
import { Rich } from './rich'

const { evidence } = literacyContent

export function EvidenceSection() {
  const [group, raised, notes] = evidence.mosaic
  const { quote } = evidence

  return (
    <section id="case" className="dc-band ps-band" style={{ background: '#FFFFFF', paddingTop: 48, paddingBottom: 56 }}>
      <div className="dc-shell">
        <Reveal>
          <p className="dc-eyebrow" style={{ color: '#176059' }}>
            {evidence.eyebrow}
          </p>
          <h2 className="dc-h2">
            <Rich html={evidence.heading} />
          </h2>
        </Reveal>
        <Reveal>
          <div
            className="dc-stats"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 20,
              marginTop: 32,
            }}
          >
            {evidence.stats.map((stat) => (
              <div key={stat.value} className="dc-stat" style={{ background: stat.bg, borderRadius: 16 }}>
                <span
                  style={{
                    fontSize: 56,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: stat.ink,
                  }}
                >
                  {stat.value}
                </span>
                <span style={{ fontSize: 17, lineHeight: 1.45, maxWidth: '26ch' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div
            className="dc-evid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
              gap: 40,
              alignItems: 'stretch',
              marginTop: 40,
            }}
          >
            <figure
              className="ps-quote"
              style={{
                margin: 0,
                background: '#F7F5EF',
                borderRadius: 20,
                padding: '36px 36px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 28,
              }}
            >
              <blockquote
                style={{
                  margin: 0,
                  fontSize: 22,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                <div className="ps-quote-text">
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: 56,
                      lineHeight: 0,
                      fontWeight: 800,
                      fontStyle: 'normal',
                      color: '#2F9C8F',
                      verticalAlign: -22,
                      marginRight: 4,
                    }}
                  >
                    “
                  </span>
                  {quote.text}
                </div>
              </blockquote>
              <figcaption style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img
                  src={quote.photo.src}
                  alt={quote.photo.alt}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 999,
                    objectFit: 'cover',
                    objectPosition: quote.photo.position,
                    display: 'block',
                  }}
                />
                <span>
                  <span style={{ display: 'block', fontSize: 17, fontWeight: 800 }}>{quote.name}</span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 15,
                      color: 'rgba(20,19,26,0.72)',
                    }}
                  >
                    {quote.organisation}
                  </span>
                </span>
              </figcaption>
            </figure>
            <div
              className="dc-mosaic ps-mosaic"
              style={{
                display: 'grid',
                gridTemplateColumns: '3fr 2fr',
                gridTemplateRows: '200px 200px',
                gap: 14,
              }}
            >
              <div style={{ gridRow: 'span 2' }}>
                <img src={group.src} alt={group.alt} style={{ objectPosition: group.position }} />
              </div>
              <div>
                <img src={raised.src} alt={raised.alt} style={{ objectPosition: raised.position }} />
              </div>
              <div>
                <img src={notes.src} alt={notes.alt} style={{ objectPosition: notes.position }} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
