import { ClampText } from '@/components/primitives/clamp-text'
import { Reveal } from '@/components/primitives/reveal'
import { literacyContent } from '@/content/design/literacy'
import { Rich } from './rich'

const { why } = literacyContent

export function WhySection() {
  return (
    <section className="dc-band ps-band" style={{ background: '#F7F5EF', paddingTop: 56, paddingBottom: 60 }}>
      <div className="dc-shell dc-split ps-why">
        <div className="ps-why-text">
          <Reveal className="ps-why-head">
            <p className="dc-eyebrow" style={{ color: '#176059' }}>
              {why.eyebrow}
            </p>
            <h2 className="dc-h2">
              <Rich html={why.heading} />
            </h2>
            <ClampText className="ps-why-p" lines={4}>
              {why.body}
            </ClampText>
          </Reveal>
          <div className="ps-why-more">
            <p
              style={{
                margin: '12px 0 10px',
                fontSize: 15,
                fontWeight: 700,
                color: 'rgba(20,19,26,0.72)',
              }}
            >
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
        </div>
        <Reveal className="dc-pair ps-pair" delay={0.08}>
          <div className="ps-pair-large">
            <img
              src={why.main.src}
              alt={why.main.alt}
              style={{
                width: '100%',
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
          <div className="ps-pair-small">
            <img
              src={why.inset.src}
              alt={why.inset.alt}
              style={{
                width: '100%',
                objectFit: 'cover',
                objectPosition: why.inset.position,
                display: 'block',
                borderRadius: 14,
                border: '6px solid #F7F5EF',
                boxShadow: '0 18px 40px rgba(20,19,26,0.20)',
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
