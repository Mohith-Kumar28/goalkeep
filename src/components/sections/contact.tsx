import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { contact } from '@/content/homepage'
import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { submitContact } from '@/server/forms'

/**
 * The contact form. New on 21 Oct, when the homepage became a one-pager:
 * every "Talk to us" and "Partner with us" on the page lands here.
 *
 * "Let's just keep a normal form for now… crisp and modern in look and
 * feel." Fields and labels are goalkeep.net's own contact form; the options
 * are the four services from "what we do". Submissions go to D1 - see
 * src/server/forms.ts.
 */

type Status = 'idle' | 'sending' | 'done' | 'error'

export const inputClass =
  'w-full rounded-[var(--r-btn)] border border-[var(--hairline-strong)] bg-[var(--gk-white)] px-4 py-3.5 text-[length:var(--fs-base)] text-[var(--gk-ink)] ' +
  'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] placeholder:text-[var(--fg-2)] ' +
  'hover:border-[var(--gk-navy)] focus:border-[var(--gk-navy)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--gk-navy)] ' +
  'disabled:opacity-60 aria-[invalid=true]:border-[var(--gk-coral-ink)]'

export function Contact({
  defaultService = contact.serviceOptions[0],
  aside,
}: {
  defaultService?: string
  /** Under the heading, so the column beside the form is not left empty. */
  aside?: ReactNode
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [service, setService] = useState(defaultService)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const field = (name: string) => String(form.get(name) ?? '')
    setStatus('sending')
    setError('')
    try {
      const result = await submitContact({
        data: {
          name: field('name'),
          email: field('email'),
          organization: field('organization'),
          service: field('service'),
          message: field('message'),
          website: field('website'),
        },
      })
      if (result.ok) {
        setStatus('done')
      } else {
        setStatus('error')
        setError(result.error)
      }
    } catch {
      setStatus('error')
      setError('Something went wrong sending your message. Please try again.')
    }
  }

  const sending = status === 'sending'

  return (
    <section
      id="contact"
      className="ground-cream band accent-blue relative scroll-mt-24"
      aria-labelledby="contact-heading"
    >
      <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-4">{contact.eyebrow}</p>
          <h2 id="contact-heading" className="h2">
            {contact.headline} <em>{contact.headlineEm}</em>
          </h2>
          <p className="lead mt-4 max-w-[40ch] md:mt-5">{contact.lead}</p>
          {aside}
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <div className="rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-5 shadow-[var(--shadow-sm)] md:p-10">
            {status === 'done' ? (
              <div role="status" className="flex min-h-[20rem] flex-col justify-center">
                <p className="h3">{contact.done.title}</p>
                <p className="mt-3 text-[length:var(--fs-base)] text-[var(--fg-2)]">{contact.done.body}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="relative grid gap-5 md:grid-cols-2">
                <Field label={contact.fields.name} htmlFor="contact-name">
                  <input
                    id="contact-name"
                    name="name"
                    required
                    maxLength={120}
                    autoComplete="name"
                    disabled={sending}
                    className={inputClass}
                  />
                </Field>

                <Field label={contact.fields.email} htmlFor="contact-email">
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    disabled={sending}
                    className={inputClass}
                  />
                </Field>

                <Field label={contact.fields.organization} htmlFor="contact-organization" wide>
                  <input
                    id="contact-organization"
                    name="organization"
                    required
                    maxLength={200}
                    autoComplete="organization"
                    disabled={sending}
                    className={inputClass}
                  />
                </Field>

                <Field label={contact.fields.service} htmlFor="contact-service" wide>
                  {/* The native select does the picking (on a phone that is the
                      system's own option list), but it can't wrap: on a narrow
                      screen "Identifying the Right Data to Track" was cut off.
                      So it sits invisibly over a box that shows the choice
                      and can run to two lines. */}
                  <div
                    className={`${inputClass} relative flex items-center pr-11 focus-within:border-[var(--gk-navy)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--gk-navy)] ${sending ? 'opacity-60' : ''}`}
                  >
                    <span aria-hidden="true" className="leading-snug">
                      {service}
                    </span>
                    <select
                      id="contact-service"
                      name="service"
                      required
                      value={service}
                      onChange={(event) => setService(event.target.value)}
                      disabled={sending}
                      className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
                    >
                      {contact.serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      strokeWidth={2}
                      className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[var(--gk-ink)]"
                    />
                  </div>
                </Field>

                <Field label={contact.fields.message} htmlFor="contact-message" wide>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    maxLength={4000}
                    disabled={sending}
                    placeholder={contact.fields.messagePlaceholder}
                    className={`${inputClass} resize-y`}
                  />
                </Field>

                {/* The honeypot: off screen, out of the tab order. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />

                <div className="flex flex-col items-start gap-3 md:col-span-2">
                  <GkButton type="submit" variant="primary" withArrow disabled={sending}>
                    {sending ? 'Sending…' : contact.submit}
                  </GkButton>
                  {error && (
                    <p role="alert" className="text-[length:var(--fs-sm)] font-semibold text-[var(--gk-coral-ink)]">
                      {error}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Field({
  label,
  htmlFor,
  wide = false,
  children,
}: {
  label: string
  htmlFor: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <div className={wide ? 'flex flex-col gap-2 md:col-span-2' : 'flex flex-col gap-2'}>
      <label htmlFor={htmlFor} className="text-[length:var(--fs-sm)] font-bold text-[var(--fg-1)]">
        {label}
      </label>
      {children}
    </div>
  )
}
