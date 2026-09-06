import { useState } from 'react'
import { Reveal } from '@/components/primitives/reveal'
import { faqSection, faqs } from '@/content/homepage'
import { cn } from '@/lib/utils'

/**
 * Five questions, cut from seven, with answers a third of their old length.
 *
 * Hairlines only — no cards, no fills. This is the one band on the page with
 * no surface of its own, which is what stops a page of stickers and photo
 * panels from becoming exhausting right before the close.
 *
 * Multiple items may be open at once. Auto-closing one to open another is a
 * small hostility, and this is the section where someone is trying to answer a
 * real question before they email.
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
      className="ground-cream-deep band accent-blue relative"
      aria-labelledby="faqs-heading"
    >
      <div className="shell grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4 md:sticky md:top-32 md:self-start">
          <Reveal>
            <p className="eyebrow mb-3">{faqSection.eyebrow}</p>
            <h2 id="faqs-heading" className="h2">
              {faqSection.headline}
            </h2>
            <p className="lead mt-4 max-w-[32ch]">{faqSection.lead}</p>
            <p className="hand mt-8 max-w-[24ch] text-[var(--gk-coral-ink)]">
              {faqSection.aside}
            </p>
          </Reveal>
        </div>

        <dl className="md:col-span-7 md:col-start-6">
          {faqs.map((faq, index) => {
            const isOpen = open.includes(index)
            return (
              <div
                key={faq.value.question}
                className="border-b border-[var(--hairline-strong)] first:border-t"
              >
                <dt>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="h3 text-[length:clamp(1.0625rem,1.6vw,1.25rem)]">
                      {faq.value.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'relative grid size-8 shrink-0 place-items-center rounded-[var(--r-sm)] border',
                        'transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
                        isOpen
                          ? 'border-[var(--gk-navy)] bg-[var(--gk-navy)] text-white'
                          : 'border-[var(--hairline-strong)] bg-[var(--gk-white)] text-[var(--gk-navy)] group-hover:border-[var(--gk-navy)]',
                      )}
                    >
                      <span className="absolute h-[1.5px] w-3.5 bg-current" />
                      <span
                        className={cn(
                          'absolute h-3.5 w-[1.5px] bg-current transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]',
                          isOpen && 'scale-y-0',
                        )}
                      />
                    </span>
                  </button>
                </dt>
                <dd
                  id={`faq-answer-${index}`}
                  className="grid transition-[grid-template-rows] duration-[var(--dur-base)] ease-[var(--ease-out)]"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-7 text-[length:var(--fs-base)] text-[var(--fg-2)]">
                      {faq.value.answer}
                    </p>
                  </div>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
