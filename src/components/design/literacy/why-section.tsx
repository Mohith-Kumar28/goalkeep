import { literacyContent } from '@/content/design/literacy'
import { Rich } from './rich'

const { why } = literacyContent

export function WhySection() {
  return (
    <section className="dc-band" style={{ background: '#F7F5EF', paddingTop: 56, paddingBottom: 60 }}>
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
          <p className="dc-eyebrow" style={{ color: '#176059' }}>
            {why.eyebrow}
          </p>
          <h2 className="dc-h2">
            <Rich html={why.heading} />
          </h2>
          <p style={{ margin: '24px 0 0', maxWidth: '50ch' }}>{why.body}</p>
          <p style={{ margin: '28px 0 10px', fontSize: 15, fontWeight: 700, color: 'rgba(20,19,26,0.72)' }}>
            {why.leadIn}
          </p>
          <p style={{ margin: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {why.qualities.map((quality) => (
              <span key={quality} className="dc-yes">
                {quality}
              </span>
            ))}
          </p>
        </div>
        <div className="dc-pair" style={{ position: 'relative', paddingBottom: 100 }}>
          <div style={{ position: 'relative', marginLeft: '12%' }}>
            <img
              src={why.main.src}
              alt={why.main.alt}
              style={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                objectPosition: why.main.position,
                display: 'block',
                borderRadius: 16,
                boxShadow: '0 18px 44px rgba(20,19,26,0.14)',
              }}
            />
            <span className="dc-pair-cap" style={{ top: 18, right: 18 }}>
              {why.caption}
            </span>
          </div>
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: '52%', zIndex: 2 }}>
            <img
              src={why.inset.src}
              alt={why.inset.alt}
              style={{
                width: '100%',
                height: 230,
                objectFit: 'cover',
                objectPosition: why.inset.position,
                display: 'block',
                borderRadius: 14,
                border: '6px solid #F7F5EF',
                boxShadow: '0 18px 40px rgba(20,19,26,0.20)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
