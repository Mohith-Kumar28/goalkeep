import { ClampText } from '@/components/primitives/clamp-text'
import { Reveal } from '@/components/primitives/reveal'
import { literacyContent } from '@/content/design/literacy'
import { AiGlyph } from './icons'
import { Rich } from './rich'

const { ai } = literacyContent

export function AiSection() {
  return (
    <section className="dc-band ps-band" style={{ background: '#EAEFF9', paddingTop: 48, paddingBottom: 52 }}>
      <div
        className="dc-shell dc-ai-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
          gap: 48,
          alignItems: 'center',
        }}
      >
        <div>
          <Reveal>
            <p className="dc-eyebrow">{ai.eyebrow}</p>
            <h2 className="dc-h2" style={{ maxWidth: '24ch' }}>
              <Rich html={ai.heading} />
            </h2>
            <ClampText className="ps-ai-body">{ai.body}</ClampText>
          </Reveal>
          <Reveal>
            <div
              className="dc-ai-steps ps-ai-steps"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 28,
                marginTop: 28,
              }}
            >
              {ai.steps.map((step) => (
                <div
                  key={step.title}
                  className="ps-ai-step"
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: '#FFFFFF',
                      color: step.ink,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AiGlyph icon={step.icon} />
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{step.title}</span>
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: 'rgba(20,19,26,0.75)',
                    }}
                  >
                    {step.body}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="ps-ai-pics" style={{ position: 'relative' }}>
          <img
            src={ai.main.src}
            alt={ai.main.alt}
            style={{
              width: '100%',
              height: 230,
              objectFit: 'cover',
              objectPosition: ai.main.position,
              display: 'block',
              borderRadius: 18,
              boxShadow: '0 14px 34px rgba(20,19,26,0.14)',
            }}
          />
          <img
            className="ps-ai-inset"
            src={ai.inset.src}
            alt={ai.inset.alt}
            style={{
              width: '64%',
              height: 190,
              objectFit: 'cover',
              objectPosition: ai.inset.position,
              display: 'block',
              borderRadius: 16,
              border: '5px solid #EAEFF9',
              boxShadow: '0 14px 32px rgba(20,19,26,0.18)',
              margin: '-56px 0 0 auto',
              position: 'relative',
            }}
          />
        </div>
      </div>
    </section>
  )
}
