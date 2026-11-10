import { useId, useState } from 'react'
import { Reveal } from '@/components/primitives/reveal'
import { literacyContent } from '@/content/design/literacy'
import { Rich } from './rich'

const { faq } = literacyContent

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section className="dc-band ps-band" style={{ background: '#F7F5EF', paddingTop: 48, paddingBottom: 56 }}>
      <div
        className="dc-shell dc-faq-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
          gap: 64,
          alignItems: 'start',
        }}
      >
        <Reveal>
          <p className="dc-eyebrow" style={{ color: '#176059' }}>
            {faq.eyebrow}
          </p>
          <h2 className="dc-h2">
            <Rich html={faq.heading} />
          </h2>
          <img
            className="ps-faq-photo"
            src={faq.photo.src}
            alt={faq.photo.alt}
            style={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              objectPosition: faq.photo.position,
              display: 'block',
              borderRadius: 16,
              marginTop: 32,
            }}
          />
        </Reveal>
        <div style={{ borderTop: '1px solid #E5E7EE' }}>
          {faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.question} style={{ borderBottom: '1px solid #E5E7EE' }}>
                <button
                  type="button"
                  className="dc-faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`${baseId}-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.question}
                  <span className="dc-faq-icon" aria-hidden="true">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <p
                    id={`${baseId}-${i}`}
                    className="dc-slide-in"
                    style={{
                      margin: '0 0 22px',
                      maxWidth: '60ch',
                      color: 'rgba(20,19,26,0.82)',
                    }}
                  >
                    {item.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
