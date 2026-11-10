import { useEffect, useRef } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { MarkAssembly } from '@/components/primitives/logo-shapes'
import { useContactForm } from './contact-form'
import { ctaClass } from './cta'
import type { CtaVariant } from './cta'
import { ArrowIcon, CloseIcon } from './icons'
import { SiteLink } from './site-link'

export type ContactBandCta = {
  label: string
  variant?: CtaVariant
  /** Makes the button a plain link instead of opening the form. */
  href?: string
}

type ContactBandProps = {
  /** Use <em> for the italic run. */
  heading: ReactNode
  body: ReactNode
  /** Above the heading, for pages that switch audience. */
  eyebrow?: ReactNode
  /** One or two buttons. Each opens the form with its label as the intent. */
  ctas: Array<ContactBandCta>
  headingMaxWidth?: string
  paddingY?: number
  /** A shorter band with a smaller heading, for the end of an article. */
  compact?: boolean
  /** The animated mark beside the form. Off where the design leaves that column empty until the form opens. */
  mark?: boolean
}

export function ContactBand({
  heading,
  body,
  eyebrow,
  ctas,
  headingMaxWidth = '20ch',
  paddingY = 64,
  compact = false,
  mark = true,
}: ContactBandProps) {
  const form = useContactForm()
  const formShown = form.state.status !== 'closed'

  return (
    <section
      id="contact"
      className="dc-on-navy dc-band"
      style={{
        background: '#2F4A92',
        color: '#FFFFFF',
        paddingTop: paddingY,
        paddingBottom: paddingY,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="dc-shell dc-split"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,6fr) minmax(0,5fr)',
          gap: 64,
          alignItems: 'center',
          minHeight: compact ? undefined : 340,
        }}
      >
        <div>
          {eyebrow}
          <h2 className="dc-h2" style={{ maxWidth: headingMaxWidth, fontSize: compact ? 32 : undefined }}>
            {heading}
          </h2>
          <p
            className="dc-contact-body"
            style={compact ? { margin: '10px 0 0', fontSize: 17, maxWidth: '48ch' } : undefined}
          >
            {body}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: compact ? 18 : 36 }}>
            {ctas.map((cta, i) => {
              const className = ctaClass(cta.variant ?? (i === 0 ? 'accent' : 'secondary'))
              if (cta.href !== undefined) {
                return (
                  <SiteLink key={cta.label} href={cta.href} className={className}>
                    {cta.label}
                  </SiteLink>
                )
              }
              return (
                <button
                  key={cta.label}
                  type="button"
                  className={className}
                  aria-expanded={formShown}
                  onClick={() => form.open(cta.label)}
                >
                  {cta.label}
                  {i === 0 && <ArrowIcon />}
                </button>
              )
            })}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          {mark && (
            <div className="dc-mark-slot" data-form-open={formShown}>
              <MarkAssembly size={150} className="dc-mark-lg" />
              <MarkAssembly size={120} className="dc-mark-sm" />
            </div>
          )}
          {formShown && <SlideInForm />}
        </div>
      </div>
    </section>
  )
}

function SlideInForm() {
  const form = useContactForm()
  const { state } = form
  const first = useRef<HTMLInputElement>(null)
  const thanks = useRef<HTMLDivElement>(null)

  useEffect(() => {
    first.current?.focus({ preventScroll: true })
  }, [])
  useEffect(() => {
    if (state.status === 'sent') thanks.current?.focus({ preventScroll: true })
  }, [state.status])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const field = (name: string) => String(data.get(name) ?? '')
    void form.submit({
      name: field('name'),
      email: field('email'),
      organization: field('organization'),
      website: field('website'),
    })
  }

  return (
    <div
      className="dc-surface dc-slide-in dc-contact-form-card"
      onKeyDown={(event) => event.key === 'Escape' && form.close()}
    >
      <button type="button" className="dc-form-close" aria-label="Close form" onClick={form.close}>
        <CloseIcon />
      </button>
      {state.status === 'sent' ? (
        <div ref={thanks} tabIndex={-1} role="status" style={{ padding: '24px 0', outline: 'none' }}>
          <svg aria-hidden="true" width="44" height="44" viewBox="0 0 28 28">
            <path
              d="M 5 15 Q 9 18 11.5 22 Q 16 11 24 5"
              fill="none"
              stroke="#EAC452"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p style={{ margin: '12px 0 0', fontSize: 22, fontWeight: 700 }}>Thank you.</p>
          <p style={{ margin: '8px 0 0', color: 'rgba(20,19,26,0.72)' }}>We&rsquo;ll be in touch shortly.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, margin: 0 }}>
          <p style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, lineHeight: 1.28 }}>
            Tell us a little about you.
          </p>
          <label className="dc-form-label">
            Name
            <input ref={first} type="text" name="name" autoComplete="name" required className="dc-field" />
          </label>
          <label className="dc-form-label">
            Email
            <input type="email" name="email" autoComplete="email" required className="dc-field" />
          </label>
          <label className="dc-form-label">
            Organisation name
            <input type="text" name="organization" autoComplete="organization" required className="dc-field" />
          </label>
          <div className="dc-hp" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {state.status === 'error' && (
            <p role="alert" style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#9C452A' }}>
              {state.message}
            </p>
          )}
          <button
            type="submit"
            className="dc-btn dc-btn-primary"
            disabled={state.status === 'sending'}
            style={{ alignSelf: 'flex-start', marginTop: 6 }}
          >
            {state.status === 'sending' ? 'Sending…' : 'Submit'}
            <ArrowIcon />
          </button>
        </form>
      )}
    </div>
  )
}
