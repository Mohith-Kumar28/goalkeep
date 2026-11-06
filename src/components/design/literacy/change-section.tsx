import { literacyContent } from '@/content/design/literacy'
import { Tick } from './icons'
import { Rich } from './rich'

const { change } = literacyContent

export function ChangeSection() {
  return (
    <section
      className="dc-on-navy dc-band"
      style={{
        background: '#2F4A92',
        color: '#FFFFFF',
        paddingTop: 48,
        paddingBottom: 56,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="dc-shell">
        <p className="dc-eyebrow">{change.eyebrow}</p>
        <h2 className="dc-h2" style={{ maxWidth: '26ch' }}>
          <Rich html={change.heading} />
        </h2>
        <div
          className="dc-strip"
          style={{ display: 'grid', gridTemplateColumns: '5fr 4fr 4fr', gap: 16, marginTop: 36 }}
        >
          {change.strip.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              style={{
                width: '100%',
                height: 240,
                objectFit: 'cover',
                objectPosition: photo.position,
                display: 'block',
                borderRadius: 14,
              }}
            />
          ))}
        </div>
        <div
          className="dc-chg"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '32px 56px', marginTop: 44 }}
        >
          {change.outcomes.map((outcome) => (
            <div key={outcome.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <Tick style={{ flex: 'none', marginTop: 2 }} />
              <span>
                <span style={{ display: 'block', fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>
                  {outcome.title}
                </span>
                <span
                  style={{
                    display: 'block',
                    marginTop: 6,
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: 'rgba(255,255,255,0.84)',
                  }}
                >
                  {outcome.body}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
