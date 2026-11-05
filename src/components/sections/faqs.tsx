import { useState } from 'react'
import { Reveal } from '@/components/primitives/reveal'
import { faqSection, faqs } from '@/content/homepage'
import { cn } from '@/lib/utils'

/**
 * Five questions since the 21 Oct doc, drafted for nonprofits with limited data maturity, tight
 * budgets and a real need to show the impact of their programmes.
 *
 * Hairlines only — no cards, no fills. This is the one band on the page with
 * no surface of its own, which is what stops a page of stickers and photo
 * panels from becoming exhausting right before the close.
 *
 * 23 Sep: the band is a mid-dark yellow with black text - "I want section
 * breaks to have more contrast… a good break from all the blue backgrounds."
 *
 * Multiple items may be open at once. Auto-closing one to open another is a
 * small hostility, and this is the section where someone is trying to answer a
 * real question before they email.
 */
export function Faqs({
  headline = faqSection.headline,
  headlineEm = faqSection.headlineEm,
  items = faqs.map((faq) => faq.value),
}: {
  headline?: string
  headlineEm?: string
  items?: Array<{ question: string; answer: string }>
}) {
  const [open, setOpen] = useState<Array<number>>([0])

  /* 28 Sep: one answer open at a time - opening a question folds the last. */
  const toggle = (index: number) =>
    setOpen((current) => (current.includes(index) ? [] : [index]))

  return (
    <section
      id="faqs"
      className="band relative scroll-mt-24"
      /* 28 Sep: the lighter yellow of the early-stage NGO band. */
      style={{ background: 'var(--gk-yellow-tint)', color: 'var(--gk-ink)' }}
      aria-labelledby="faqs-heading"
    >
      <div className="shell grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4 md:sticky md:top-32 md:self-start">
          <Reveal>
            {/* The eyebrow, the "Including the ones that cost us the work"
                line and the handwritten "Still stuck?" aside all went in the
                copy replacement. The doc gives this column one sentence, so
                that is what it holds. */}
            <h2 id="faqs-heading" className="h2">
              {headline} <em>{headlineEm}</em>
            </h2>
          </Reveal>
        </div>

        <dl className="md:col-span-7 md:col-start-6">
          {items.map((faq, index) => {
            const isOpen = open.includes(index)
            return (
              <div
                key={faq.question}
                className="border-b border-[rgb(20_19_26_/_0.22)] first:border-t"
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
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'relative grid size-8 shrink-0 place-items-center rounded-[var(--r-sm)] border',
                        'transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
                        isOpen
                          ? 'border-[var(--gk-ink)] bg-[var(--gk-ink)] text-[var(--gk-yellow)]'
                          : 'border-[rgb(20_19_26_/_0.3)] bg-transparent text-[var(--gk-ink)] group-hover:border-[var(--gk-ink)] group-hover:bg-[rgb(255_255_255_/_0.3)]',
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
                  {/* A blank line in the answer starts a new paragraph. */}
                  <div className="flex flex-col gap-4 overflow-hidden">
                    {faq.answer.split('\n\n').map((paragraph, i, all) => (
                      <p
                        key={i}
                        className={cn(
                          'max-w-[62ch] text-[length:var(--fs-base)] text-[var(--gk-ink)]',
                          i === all.length - 1 && 'pb-7',
                        )}
                      >
                        {paragraph}
                      </p>
                    ))}
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
