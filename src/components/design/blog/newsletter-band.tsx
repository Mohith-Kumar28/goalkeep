import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Rich } from '@/components/design/kickstarter/rich'
import { newsletterBand } from '@/content/design/blog'
import { subscribeNewsletter } from '@/server/forms'

type Status = 'idle' | 'sending' | 'done' | 'error'

export function NewsletterBand() {
  const id = useId()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setStatus('sending')
    setError('')
    try {
      const result = await subscribeNewsletter({
        data: { email: String(form.get('email') ?? ''), website: String(form.get('website') ?? '') },
      })
      if (result.ok) {
        setStatus('done')
      } else {
        setStatus('error')
        setError(result.error)
      }
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="dc-band dc-blog-sub">
      <div className="dc-shell dc-blog-sub-grid">
        <div>
          <p className="dc-eyebrow dc-gold-ink" style={{ marginBottom: 10 }}>
            {newsletterBand.eyebrow}
          </p>
          <h2 className="dc-h2 dc-blog-sub-h">
            <Rich html={newsletterBand.heading} />
          </h2>
          <p className="dc-blog-sub-body">{newsletterBand.body}</p>
        </div>
        <form className="dc-blog-sub-form" onSubmit={submit}>
          <label htmlFor={id} className="dc-blog-sr">
            Email address
          </label>
          <input
            id={id}
            name="email"
            type="email"
            required
            className="dc-blog-sub-field"
            placeholder={newsletterBand.placeholder}
            autoComplete="email"
            disabled={status === 'done'}
          />
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="dc-blog-hp" />
          <button type="submit" className="dc-btn dc-btn-primary" disabled={status === 'sending' || status === 'done'}>
            {status === 'done' ? 'Subscribed' : status === 'sending' ? 'Subscribing…' : 'Subscribe'}
          </button>
          <p role="status" className="dc-blog-sub-msg" data-error={status === 'error'}>
            {status === 'error' ? error : ''}
          </p>
        </form>
      </div>
    </section>
  )
}
