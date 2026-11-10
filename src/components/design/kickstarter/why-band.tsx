import { Reveal } from '@/components/primitives/reveal'
import { ClampText } from '@/components/primitives/clamp-text'
import { kickstarter } from '@/content/design/kickstarter'
import { Rich } from './rich'

export function WhyBand() {
  const { why } = kickstarter
  return (
    <section className="dc-band ps-band" style={{ background: '#F7F5EF', paddingTop: 72, paddingBottom: 80 }}>
      <div className="dc-shell dc-split ps-why">
        <div className="ps-why-text">
          <Reveal className="ps-why-head">
            <p className="dc-eyebrow" style={{ color: '#7D5E0C' }}>
              {why.eyebrow}
            </p>
            <h2 className="dc-h2">
              <Rich html={why.heading} />
            </h2>
            <ClampText className="ps-why-p" lines={4}>
              {why.paragraphs[0]}
            </ClampText>
          </Reveal>
          <div className="ps-why-more">
            <ClampText className="ps-why-p" lines={3}>
              {why.paragraphs[1]}
            </ClampText>
          </div>
        </div>
        <Reveal className="dc-pair ps-pair" delay={0.08}>
          <div className="ps-pair-large">
            <img
              src={why.large.src}
              alt={why.large.alt}
              style={{
                width: '100%',
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
          <div className="ps-pair-small">
            <img
              src={why.small.src}
              alt={why.small.alt}
              style={{
                width: '100%',
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
        </Reveal>
      </div>
    </section>
  )
}
