import { useEffect, useRef, useState } from 'react'
import { ArrowIcon } from '../icons'
import { GMark } from './g-mark'
import { DetailsStep } from './details-step'
import { QuestionStep } from './question-step'
import { QuizSide } from './side'
import type { QuizView } from './side'
import { ThanksStep } from './thanks-step'
import type { Submission } from './thanks-step'
import { marks, quizPage, ringLabels } from '@/content/design/quiz'
import { statementCount } from '@/content/quiz'
import type { Answer, QuizDetails } from '@/content/quiz'
import { submitQuiz } from '@/server/forms'
import '@/styles/design-quiz.css'

const emptyDetails: QuizDetails = {
  name: '',
  email: '',
  organization: '',
  region: '',
  sector: '',
  sectorOther: '',
  role: '',
  roleOther: '',
  size: '',
  budget: '',
}

const ANSWER_PAUSE_MS = 180

export function QuizPage() {
  const [view, setView] = useState<QuizView>('banner')
  const [index, setIndex] = useState(0)
  const [details, setDetails] = useState<QuizDetails>(emptyDetails)
  const [answers, setAnswers] = useState<Array<Answer | undefined>>(() => Array(statementCount).fill(undefined))
  const [submission, setSubmission] = useState<Submission>({ status: 'sending' })
  const busy = useRef(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (window.innerWidth < 900) window.scrollTo(0, 0)
  }, [view, index])

  const send = async (all: Array<Answer>) => {
    setSubmission({ status: 'sending' })
    try {
      const result = await submitQuiz({ data: { ...details, answers: all, website: '' } })
      setSubmission(result.ok ? { status: result.emailed ? 'sent' : 'saved' } : { status: 'error', error: result.error })
    } catch {
      setSubmission({ status: 'error', error: 'We couldn’t send your results just now.' })
    }
  }

  const answer = (value: Answer) => {
    if (busy.current) return
    busy.current = true
    const next = answers.map((a, i) => (i === index ? value : a))
    setAnswers(next)
    window.setTimeout(() => {
      busy.current = false
      let n = next.findIndex((a, i) => a === undefined && i > index)
      if (n < 0) n = next.findIndex((a) => a === undefined)
      if (n >= 0) {
        setIndex(n)
        return
      }
      setView('thanks')
      void send(next as Array<Answer>)
    }, ANSWER_PAUSE_MS)
  }

  const answerRef = useRef(answer)
  answerRef.current = answer

  useEffect(() => {
    if (view !== 'question') return
    const onKey = (event: KeyboardEvent) => {
      const tag = document.activeElement?.tagName
      if (!/^[1-5]$/.test(event.key) || tag === 'INPUT' || tag === 'SELECT') return
      event.preventDefault()
      answerRef.current(Number(event.key) as Answer)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [view])

  const back = () => {
    if (index === 0) setView('details')
    else setIndex(index - 1)
  }

  const inCard = view !== 'banner'

  return (
    <div className="dc dc-q">
      <section className="dc-q-stage" aria-live="polite">
        <div className="dc-q-body">
          <div className="dc-q-container">
            {view === 'banner' ? (
              <div className="dc-q-view dc-q-banner">
                <div>
                  <div className="dc-q-eyebrow">{quizPage.eyebrow}</div>
                  <h1>
                    {quizPage.headline[0]}
                    <br />
                    <span className="dc-q-brush">{quizPage.headline[1]}</span>
                  </h1>
                  <p>{quizPage.lead}</p>
                  <button type="button" className="dc-q-btn dc-q-btn-yellow" onClick={() => setView('details')}>
                    {quizPage.start}
                    <ArrowIcon />
                  </button>
                </div>
                <div className="dc-q-art" aria-hidden="true">
                  <GMark />
                  {ringLabels.map((label) => (
                    <span key={label.id} className="dc-q-art-label" style={{ left: label.left, top: label.top, color: marks[label.id].label }}>
                      {label.text}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {inCard && (
              <div className="dc-q-view dc-q-card">
                <QuizSide view={view} index={index} answers={answers} />
                <div className="dc-q-main">
                  {view === 'details' && (
                    <DetailsStep
                      details={details}
                      onChange={(key, value) => setDetails((d) => ({ ...d, [key]: value }))}
                      onDone={() => {
                        setIndex(0)
                        setView('question')
                      }}
                    />
                  )}
                  {view === 'question' && <QuestionStep index={index} current={answers[index]} onAnswer={answer} onBack={back} />}
                  {view === 'thanks' && <ThanksStep submission={submission} onRetry={() => void send(answers as Array<Answer>)} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
