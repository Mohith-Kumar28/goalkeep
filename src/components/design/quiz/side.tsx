import { PartIcon } from './g-mark'
import { marks, quizPage } from '@/content/design/quiz'
import { domains } from '@/content/quiz'
import type { Answer } from '@/content/quiz'

export type QuizView = 'banner' | 'details' | 'question' | 'thanks'

function Check() {
  return (
    <svg className="dc-q-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

const Dash = () => (
  <span className="dc-q-ico">
    <span className="dc-q-dash" />
  </span>
)

/** The itinerary: about you, the four parts with a dot per statement, your results. */
export function QuizSide({ view, index, answers }: { view: QuizView; index: number; answers: Array<Answer | undefined> }) {
  const active = view === 'question' ? Math.floor(index / 3) : view === 'thanks' ? 99 : -1
  return (
    <aside className="dc-q-side">
      <ul className="dc-q-steps">
        <li>
          <Dash />
          {quizPage.steps.about}
          {view !== 'details' && (
            <span className="dc-q-meta">
              <Check />
            </span>
          )}
        </li>
        {domains.map((domain, d) => {
          const done = active > d
          const current = active === d
          const dim = view === 'question' && !current && !done
          const first = d * 3
          return (
            <li key={domain.id} className={dim ? 'is-dim' : undefined}>
              <span className="dc-q-ico">
                <PartIcon id={domain.id} />
              </span>
              {domain.title}
              {done ? (
                <span className="dc-q-meta">
                  <Check />
                </span>
              ) : (
                view === 'question' && (
                  <span className="dc-q-meta">
                    <span className="dc-q-dots">
                      {domain.statements.map((_, i) => {
                        const n = first + i
                        return n === index ? (
                          <i key={n} className="is-cur" />
                        ) : (
                          <i key={n} style={answers[n] !== undefined ? { background: marks[domain.id].mark } : undefined} />
                        )
                      })}
                    </span>
                  </span>
                )
              )}
            </li>
          )
        })}
        <li className={view === 'thanks' ? undefined : 'is-dim'}>
          <Dash />
          {quizPage.steps.results}
          {view === 'thanks' && (
            <span className="dc-q-meta">
              <Check />
            </span>
          )}
        </li>
      </ul>
    </aside>
  )
}
