import { useState } from 'react'
import type { FormEvent } from 'react'
import { Rich } from '@/components/design/kickstarter/rich'
import { audiences, newsletter } from '@/content/design/newsletter'
import type { Edition } from '@/content/design/newsletter'
import '@/styles/design-newsletter.css'
import { useSubscribe } from './use-subscribe'
import type { FormId, Signup, SubscribeState } from './use-subscribe'

type FormProps = {
  state: SubscribeState
  form: FormId
  /** The past edition whose "Subscribe to keep reading" button brought them here. */
  edition: Edition | null
  onSubmit: (form: FormId, signup: Signup) => void
}

function readSubmit(event: FormEvent<HTMLFormElement>, { form, edition, onSubmit }: FormProps) {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  const field = (name: string) => String(data.get(name) ?? '')
  onSubmit(form, {
    email: field('EMAIL'),
    name: field('FNAME'),
    organization: field('ORG'),
    audience: field('AUDIENCE'),
    edition: edition?.id ?? '',
    website: field('website'),
  })
}

const forMonth = (template: string, edition: Edition) => template.replace('{month}', edition.month)

function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="dc-nl-hp" />
}

function FormError({ state, form }: { state: SubscribeState; form: FormId }) {
  if (state.status !== 'error' || state.form !== form) return null
  return (
    <p role="alert" className="dc-nl-error">
      {state.message}
    </p>
  )
}

function SubscribeCard({ onReset, ...props }: FormProps & { onReset: () => void }) {
  const { state, edition } = props
  const { card } = newsletter
  const sending = state.status === 'sending'
  return (
    <div id="subscribe" className="dc-nl-card">
      {state.status === 'done' ? (
        <div className="dc-nl-card-body" role="status">
          <h2 className="dc-nl-thanks">
            <Rich html={card.thanksHeading} />
          </h2>
          <p className="dc-nl-thanks-text">{edition ? forMonth(card.editionThanks, edition) : card.thanks}</p>
          <button type="button" className="dc-nl-btn dc-nl-btn-ghost" onClick={onReset}>
            {card.another}
          </button>
        </div>
      ) : (
        <form className="dc-nl-card-body" onSubmit={(event) => readSubmit(event, props)} aria-busy={sending}>
          <h2 className="dc-nl-card-title">
            <Rich html={card.heading} />
          </h2>
          {edition && <p className="dc-nl-edition-note">{forMonth(card.edition, edition)}</p>}
          <div className="dc-nl-pair">
            <div className="dc-nl-field">
              <label htmlFor="ku-name">Name</label>
              <input id="ku-name" name="FNAME" type="text" autoComplete="name" disabled={sending} />
            </div>
            <div className="dc-nl-field">
              <label htmlFor="ku-email">Email</label>
              <input id="ku-email" name="EMAIL" type="email" required autoComplete="email" disabled={sending} />
            </div>
          </div>
          <div className="dc-nl-field">
            <label htmlFor="ku-org">Organization</label>
            <input id="ku-org" name="ORG" type="text" autoComplete="organization" disabled={sending} />
          </div>
          <fieldset className="dc-nl-audience" disabled={sending}>
            <legend>{card.audience}</legend>
            {audiences.map((audience) => (
              <label key={audience.id}>
                <input type="radio" name="AUDIENCE" value={audience.id} required />
                {audience.label}
              </label>
            ))}
          </fieldset>
          <Honeypot />
          <FormError state={state} form={props.form} />
          <button type="submit" className="dc-nl-btn dc-nl-btn-navy" disabled={sending}>
            {sending ? 'Subscribing…' : 'Subscribe'} <span aria-hidden="true">→</span>
          </button>
          <p className="dc-nl-card-note">{card.note}</p>
        </form>
      )}
    </div>
  )
}

function EditionRow({ edition, onSubscribe }: { edition: Edition; onSubscribe: (edition: Edition) => void }) {
  const { image, button } = edition
  const cover = (
    <div className="dc-nl-cover">
      <img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" />
    </div>
  )
  return (
    <section className="dc-nl-edition">
      <div className="dc-nl-wrap dc-nl-row" data-image-side={edition.imageSide}>
        {edition.imageSide === 'left' && cover}
        <div className="dc-nl-copy">
          <p className="dc-nl-kicker">{edition.month} edition</p>
          <h3 className="dc-nl-edition-title">
            <Rich html={edition.headline} />
          </h3>
          <p className="dc-nl-lead">{edition.lead}</p>
          <div className="dc-nl-fade">
            <p>{edition.excerpt}</p>
          </div>
          <a
            href="#subscribe"
            className="dc-nl-btn dc-nl-edition-btn"
            style={{ background: button.bg, borderColor: button.bg, color: button.fg }}
            onClick={() => onSubscribe(edition)}
          >
            Subscribe to keep reading <span aria-hidden="true">→</span>
          </a>
        </div>
        {edition.imageSide === 'right' && cover}
      </div>
    </section>
  )
}

function ClosingMark() {
  return (
    <div className="dc-nl-mark" aria-hidden="true">
      <svg viewBox="0 0 282 428" width="100%" height="100%" style={{ overflow: 'visible' }} fill="none" strokeWidth="39" strokeLinecap="round">
        <circle cx="141" cy="141" r="121.5" stroke="#E8E724" strokeDasharray="123.224 763.407" transform="rotate(241.1956 141 141)" />
        <circle cx="141" cy="141" r="121.5" stroke="#3F3D3E" strokeDasharray="115.802 763.407" transform="rotate(-47.3044 141 141)" />
        <circle cx="141" cy="141" r="121.5" stroke="#526EB5" strokeDasharray="122.164 763.407" transform="rotate(20.6956 141 141)" />
        <circle cx="141" cy="141" r="121.5" stroke="#79C2B4" strokeDasharray="135.947 763.407" transform="rotate(91.6956 141 141)" />
        <circle cx="141" cy="141" r="121.5" stroke="#EE9D90" strokeDasharray="124.284 763.407" transform="rotate(169.1956 141 141)" />
        <circle cx="142" cy="283.8" r="124.2" stroke="#3F3D3E" strokeDasharray="221.991 780.372" transform="rotate(38.7957 142 283.8)" />
      </svg>
    </div>
  )
}

function ClosingBand(props: FormProps) {
  const { state, form } = props
  const { closing } = newsletter
  const sending = state.status === 'sending'
  return (
    <section className="dc-nl-closing">
      <ClosingMark />
      <div className="dc-nl-wrap dc-nl-closing-inner">
        <h2 className="dc-nl-closing-title">
          <Rich html={closing.heading} />
        </h2>
        {state.status === 'done' ? (
          <p className="dc-nl-closing-thanks" role="status">
            {closing.thanks}
          </p>
        ) : (
          <form className="dc-nl-inline" onSubmit={(event) => readSubmit(event, props)} aria-busy={sending}>
            <label htmlFor="ku-email-2" className="dc-nl-sr">
              Your email address
            </label>
            <input id="ku-email-2" name="EMAIL" type="email" required autoComplete="email" placeholder="Your email address" disabled={sending} />
            <Honeypot />
            <button type="submit" className="dc-nl-btn dc-nl-btn-navy" disabled={sending}>
              {sending ? 'Subscribing…' : 'Subscribe'} <span aria-hidden="true">→</span>
            </button>
            <FormError state={state} form={form} />
          </form>
        )}
      </div>
    </section>
  )
}

export function NewsletterPage() {
  const { hero, editions } = newsletter
  const { state, subscribe, reset } = useSubscribe()
  const [edition, setEdition] = useState<Edition | null>(null)
  const startOver = () => {
    setEdition(null)
    reset()
  }
  const keepReading = (item: Edition) => {
    setEdition(item)
    if (state.status === 'done') reset()
    requestAnimationFrame(() => document.getElementById('ku-name')?.focus({ preventScroll: true }))
  }
  return (
    <div className="dc dc-nl">
      <section className="dc-nl-hero">
        <div aria-hidden="true" className="dc-nl-ring dc-nl-ring-a">
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <circle cx="50" cy="50" r="43.5" fill="none" stroke="#3D5AA8" strokeWidth="13" strokeLinecap="round" strokeDasharray="125.27 273.32" transform="rotate(55 50 50)" />
          </svg>
        </div>
        <div aria-hidden="true" className="dc-nl-ring dc-nl-ring-b">
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <circle cx="50" cy="50" r="39" fill="none" stroke="#3D5AA8" strokeWidth="22" strokeDasharray="244.9762 245.0442" transform="rotate(-90 50 50)" />
          </svg>
        </div>
        <div className="dc-nl-wrap dc-nl-hero-inner">
          <div className="dc-nl-hero-copy">
            <h1 className="dc-nl-h1">
              <Rich html={hero.headline} />
            </h1>
            <p className="dc-nl-hero-lead">{hero.lead}</p>
          </div>
          <SubscribeCard form="card" state={state} edition={edition} onSubmit={subscribe} onReset={startOver} />
        </div>
      </section>
      {editions.map((item) => (
        <EditionRow key={item.id} edition={item} onSubscribe={keepReading} />
      ))}
      <ClosingBand form="closing" state={state} edition={edition} onSubmit={subscribe} />
    </div>
  )
}
