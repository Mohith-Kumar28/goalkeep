import { kickstarter } from '@/content/design/kickstarter'
import { Rich } from './rich'

export function WhyBand() {
  const { why } = kickstarter
  return (
    <section className="dc-band" style={{ background: '#F7F5EF', paddingTop: 72, paddingBottom: 80 }}>
      <div
        className="dc-shell dc-split"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,5fr) minmax(0,6fr)',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div>
          <p className="dc-eyebrow" style={{ color: '#7D5E0C' }}>
            {why.eyebrow}
          </p>
          <h2 className="dc-h2">
            <Rich html={why.heading} />
          </h2>
          <p style={{ margin: '24px 0 0', maxWidth: '50ch' }}>{why.paragraphs[0]}</p>
          <p style={{ margin: '16px 0 0', maxWidth: '50ch' }}>{why.paragraphs[1]}</p>
        </div>
        <div className="dc-pair" style={{ position: 'relative', paddingBottom: 120 }}>
          <div style={{ position: 'relative', marginLeft: '12%' }}>
            <img
              src={why.large.src}
              alt={why.large.alt}
              style={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                display: 'block',
                borderRadius: 16,
                boxShadow: '0 18px 44px rgba(20,19,26,0.14)',
              }}
            />
            <span className="dc-pair-cap" style={{ top: 18, right: 18 }}>
              {why.large.caption}
            </span>
          </div>
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: '52%', zIndex: 2 }}>
            <img
              src={why.small.src}
              alt={why.small.alt}
              style={{
                width: '100%',
                height: 230,
                objectFit: 'cover',
                display: 'block',
                borderRadius: 14,
                border: '6px solid #F7F5EF',
                boxShadow: '0 18px 40px rgba(20,19,26,0.20)',
              }}
            />
            <span className="dc-pair-cap" style={{ left: 18, bottom: -14 }}>
              {why.small.caption}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
