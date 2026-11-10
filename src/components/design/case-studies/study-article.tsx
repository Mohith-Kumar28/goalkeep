import { ClampText } from '@/components/primitives/clamp-text'
import { Reveal } from '@/components/primitives/reveal'
import { tones } from '../tones'
import type { ApproachStep, Bullet, CaseStudy, Testimonial } from '@/content/design/case-studies'

export function StudyArticle({ study }: { study: CaseStudy }) {
  const { background, outcomes } = study
  return (
    <div style={{ background: '#FFFFFF', paddingBottom: 40 }}>
      <article className="dc-shell dc-cs-art">
        <section id="background" className="dc-cs-row" style={{ alignItems: 'center' }}>
          <div>
            <Reveal>
              <Aside aside={background.aside} />
            </Reveal>
          </div>
          <div>
            <span className="dc-cs-label">Background</span>
            {background.paragraphs.map((text) => (
              <ClampText key={text}>{text}</ClampText>
            ))}
            <Points points={background.points} />
          </div>
        </section>

        <section id="approach" className="dc-cs-approach">
          <span className="dc-cs-label" style={{ marginBottom: 22 }}>
            Our approach
          </span>
          <div className="dc-cs-steps">
            {study.steps.map((step, i) => (
              <Reveal key={step.title}>
                <Step step={step} flip={i % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="outcomes">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              gap: '6px 20px',
              marginBottom: 16,
            }}
          >
            <span className="dc-cs-label" style={{ marginBottom: 0 }}>
              Outcomes
            </span>
            <span style={{ fontSize: 18, color: '#14131A' }}>{outcomes.lead}</span>
          </div>
          <div className="dc-cs-outcome-grid">
            {outcomes.cards.map((card, i) => (
              <Reveal
                key={card.title}
                delay={i * 0.07}
              >
              <div
                className="dc-cs-outcome"
                style={{ background: tones[card.tone].bg, borderRadius: 14, padding: '18px 18px 16px' }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 800,
                    lineHeight: 1.42,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: tones[card.tone].ink,
                  }}
                >
                  {card.title}
                </span>
                <Points points={card.items.map((text) => ({ text }))} />
              </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="reinforced" className="dc-cs-row" style={{ rowGap: 8 }}>
          <div>
            <span className="dc-cs-label">What this reinforced for us</span>
          </div>
          <div>
            {study.reinforced.map((text) => (
              <ClampText key={text}>{text}</ClampText>
            ))}
          </div>
          {study.testimonial && (
            <div style={{ gridColumn: '1 / -1' }}>
              <Reveal>
                <TestimonialCard testimonial={study.testimonial} />
              </Reveal>
            </div>
          )}
        </section>
      </article>
    </div>
  )
}

function Aside({ aside }: { aside: CaseStudy['background']['aside'] }) {
  if (aside.kind === 'panel') {
    return (
      <figure className="dc-cs-pq-panel">
        <span className="dc-cs-ring" aria-hidden="true" />
        <blockquote>{aside.quote}</blockquote>
      </figure>
    )
  }
  return (
    <figure className={`dc-cs-pq-photo${aside.darker ? ' dc-cs-darker' : ''}`}>
      <img src={aside.src} alt={aside.alt} style={{ objectPosition: aside.position }} />
      <blockquote>{aside.quote}</blockquote>
    </figure>
  )
}

function Points({ points }: { points: Array<Bullet> }) {
  return (
    <ul className="dc-cs-dots">
      {points.map((point) => (
        <li key={point.text}>
          {point.lead && <strong>{point.lead}</strong>} {point.text}
        </li>
      ))}
    </ul>
  )
}

function Step({ step, flip }: { step: ApproachStep; flip: boolean }) {
  const { image } = step
  const text = (
    <div>
      <h3>{step.title}</h3>
      <ClampText className="dc-cs-step-body">{step.body}</ClampText>
    </div>
  )
  if (image.kind === 'placeholder') return <div className="dc-cs-step dc-cs-step-text">{text}</div>
  return (
    <div className={`dc-cs-step${flip ? ' dc-cs-flip' : ''}`}>
      <img src={image.src} alt={image.alt} style={{ objectPosition: image.position }} />
      {text}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className={`dc-cs-testi${testimonial.wide ? ' dc-cs-wide-photo' : ''}`}>
      <img
        src={testimonial.photo.src}
        alt={testimonial.photo.alt}
        style={{ objectPosition: testimonial.photo.position }}
      />
      <div className="dc-cs-testi-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 48px' }}>
        <svg aria-hidden="true" width="44" height="34" viewBox="0 0 44 34" fill="#3F63C8">
          <path d="M0 34V20C0 8 6 1.5 18 0l2 5C13 7 10 11 10 17h8v17H0zm24 0V20C24 8 30 1.5 42 0l2 5c-7 2-10 6-10 12h8v17H24z" />
        </svg>
        <blockquote
          style={{
            margin: '18px 0 0',
            fontSize: testimonial.size,
            lineHeight: 1.42,
            fontWeight: 500,
            letterSpacing: '-0.015em',
            color: '#1E3266',
          }}
        >
          {testimonial.quote}
        </blockquote>
        <figcaption style={{ marginTop: 18, fontSize: 16, lineHeight: 1.5, color: 'rgba(20,19,26,0.75)' }}>
          <span style={{ fontWeight: 800, color: '#14131A' }}>{testimonial.name}</span>, {testimonial.role}
        </figcaption>
      </div>
    </figure>
  )
}
