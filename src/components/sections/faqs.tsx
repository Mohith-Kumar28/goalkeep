import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from '@/components/primitives/reveal'
import { faqSection, faqs } from '@/content/homepage'

/**
 * Band 6 — no accent.
 *
 * This band's neutrality is load-bearing: it is the buffer between the teal
 * band above and the charcoal close below.
 *
 * Multiple items may be open at once. Auto-closing one to open another is a
 * small hostility, and this is the section where someone is trying to answer
 * a real question before they email.
 */
export function Faqs() {
  const [open, setOpen] = useState<Array<number>>([0])

  const toggle = (index: number) =>
    setOpen((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index],
    )

  return (
    <section
      className="band band-yellow relative overflow-hidden"
      style={{ backgroundColor: 'var(--gk-yellow-tint)' }}
      aria-labelledby="faqs-heading"
    >
      <div className="shell relative grid gap-10 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-4 lg:col-span-3">
          <div className="flex flex-col gap-5 md:sticky md:top-32">
            <p className="eyebrow">
              {faqSection.eyebrow}
            </p>
            <h2 id="faqs-heading" className="h2 text-[var(--fg-1)]">
              {faqSection.headline}
            </h2>
            <p className="lead text-[var(--fg-2)]">{faqSection.lead}</p>
            <p
              className="text-[length:var(--fs-sm)] text-[var(--fg-2)]"
              data-mono
            >
              {faqSection.aside}
            </p>
          </div>
        </Reveal>

        {/* Hairlines only — no cards, no boxes, no fills. */}
        <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
          <dl>
            {faqs.map((faq, index) => {
              const isOpen = open.includes(index)
              return (
                <div key={index} className="border-t border-[var(--hairline)]">
                  <dt>
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="h3 text-[var(--fg-1)]">
                        {faq.value.question}
                      </span>
                      {/* Swapped, not rotated. */}
                      <span className="mt-1 shrink-0 text-[var(--fg-2)]">
                        {isOpen ? (
                          <Minus aria-hidden="true" strokeWidth={1.75} className="size-5" />
                        ) : (
                          <Plus aria-hidden="true" strokeWidth={1.75} className="size-5" />
                        )}
                      </span>
                    </button>
                  </dt>
                  <dd
                    id={`faq-answer-${index}`}
                    hidden={!isOpen}
                    className="pb-6"
                  >
                    <p className="max-w-[64ch] text-[var(--fg-2)]">
                      {faq.value.answer}
                    </p>
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
