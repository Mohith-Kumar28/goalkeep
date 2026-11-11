import { ArrowIcon } from '../icons'
import { marks, quizPage } from '@/content/design/quiz'
import { domains, likert } from '@/content/quiz'
import type { Answer } from '@/content/quiz'

/* Disagree on the left, agree on the right: the direction a scale is read. */
const scale = [...likert].reverse()

const statements = domains.flatMap((domain) => domain.statements.map((text) => ({ domain, text })))

export function QuestionStep({
  index,
  current,
  onAnswer,
  onBack,
  organization,
}: {
  index: number
  current: Answer | undefined
  onAnswer: (value: Answer) => void
  onBack: () => void
  organization: string
}) {
  const { domain, text } = statements[index]
  const mark = marks[domain.id]
  return (
    <div className="dc-q-pane is-question" key={index}>
      <div className="dc-q-top">
        <span className="dc-q-domain" style={{ color: mark.ink }}>
          {domain.title}
        </span>
        <span className="dc-q-count">
          {index + 1} of {statements.length}
        </span>
      </div>
      <div className="dc-q-mid">
        <h2 className="dc-q-statement">{text}</h2>
        <div className="dc-q-hint">
          {organization ? (
            <>
              Answer for <strong>{organization}</strong> as it is today.
            </>
          ) : (
            quizPage.hint
          )}
        </div>
        <div className="dc-q-answers" role="radiogroup" aria-label="Your answer">
          {scale.map((option) => {
            const on = current === option.value
            return (
              <button
                key={option.value}
                type="button"
                className="dc-q-ans"
                role="radio"
                aria-checked={on}
                onClick={() => onAnswer(option.value)}
                style={on ? { border: `2px solid ${mark.ink}`, background: mark.tint } : undefined}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
      <button type="button" className="dc-q-back" onClick={onBack}>
        <ArrowIcon className="dc-q-back-arrow" />
        Back
      </button>
    </div>
  )
}
