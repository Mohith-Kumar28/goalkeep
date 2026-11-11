import { ArrowIcon } from '../icons'
import { quizPage } from '@/content/design/quiz'

export type Submission = { status: 'sending' } | { status: 'sent' } | { status: 'saved' } | { status: 'error'; error: string }

export function ThanksStep({ submission, onRetry }: { submission: Submission; onRetry: () => void }) {
  const { thanks } = quizPage
  const failed = submission.status === 'error'

  return (
    <div className="dc-q-pane">
      <div className="dc-q-thanks">
        <div className={failed ? 'dc-q-tick is-error' : 'dc-q-tick'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        {failed ? (
          <>
            <p role="alert">{submission.error}</p>
            <div className="dc-q-row">
              <button type="button" className="dc-q-btn dc-q-btn-navy" onClick={onRetry}>
                Try again
                <ArrowIcon />
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>{thanks.title}</h2>
            <p role="status">{thanks.body}</p>
          </>
        )}
      </div>
    </div>
  )
}
