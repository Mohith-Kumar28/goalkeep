import { useState } from 'react'
import { ArrowIcon } from '../icons'
import { SiteLink } from '../site-link'
import { quizPage } from '@/content/design/quiz'
import { contactHref } from '@/content/site'

export type Submission = { status: 'sending' } | { status: 'sent' } | { status: 'saved' } | { status: 'error'; error: string }

export function ThanksStep({ submission, onRetry }: { submission: Submission; onRetry: () => void }) {
  const [note, setNote] = useState('')
  const { thanks } = quizPage

  const share = async () => {
    const url = location.href.split('#')[0]
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: thanks.shareTitle, text: thanks.shareText, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setNote(thanks.copied)
    } catch {
      setNote(`Share this link with your team: ${url}`)
    }
  }

  const body =
    submission.status === 'sent'
      ? thanks.body
      : submission.status === 'saved'
        ? thanks.saved
        : submission.status === 'sending'
          ? thanks.sending
          : submission.error

  return (
    <div className="dc-q-pane">
      <div className="dc-q-thanks">
        <div className={submission.status === 'error' ? 'dc-q-tick is-error' : 'dc-q-tick'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2>{thanks.title}</h2>
        <p role="status">{body}</p>
        <div className="dc-q-row">
          {submission.status === 'error' ? (
            <button type="button" className="dc-q-btn dc-q-btn-navy" onClick={onRetry}>
              Try again
              <ArrowIcon />
            </button>
          ) : (
            <SiteLink href={contactHref} className="dc-q-btn dc-q-btn-navy">
              {thanks.talk}
              <ArrowIcon />
            </SiteLink>
          )}
          <button type="button" className="dc-q-btn dc-q-btn-outline" onClick={share}>
            {thanks.share}
          </button>
        </div>
        <div className="dc-q-copied" aria-live="polite">
          {note}
        </div>
      </div>
    </div>
  )
}
