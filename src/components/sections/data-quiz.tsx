import { ArrowLeft, ArrowRight, Check, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { detailOptions, domains, formatScore, likert, scoreQuiz, statementCount } from '@/content/quiz'
import type { Answer, DomainId, QuizDetails, QuizScore } from '@/content/quiz'
import { Scribble } from '@/components/primitives/doodles'
import { GkButton } from '@/components/primitives/gk-button'
import { ScoredMark } from '@/components/primitives/scored-mark'
import { Field, inputClass } from '@/components/sections/contact'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import { submitQuiz } from '@/server/forms'

/**
 * The data culture quiz.
 *
 * Three stages: a short form about the visitor, twelve statements one at a
 * time, and the results. The card's navy aside is the itinerary through
 * those stages: on the form it lists what is coming, on the statements it
 * turns into progress (three dots per domain), and on the results it draws
 * the mark to the scores. The mark itself appears only there and in the
 * page hero; everywhere else progress is dots, so the mark stays the mark.
 */

type Delivery = 'sending' | 'sent' | 'saved' | 'error'

type Stage =
  | { kind: 'details' }
  | { kind: 'question'; index: number }
  | { kind: 'result'; score: QuizScore; delivery: Delivery; error?: string }

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

/* Every statement, flat, with the domain it belongs to. */
const statements = domains.flatMap((domain, d) => domain.statements.map((text) => ({ text, domain: d })))

/* Disagree on the left, agree on the right: the direction a scale is read. */
const scale = [...likert].reverse()

export const DOMAIN_HUES: Record<DomainId, { arc: string; tint: string; ink: string; lift: string }> = {
  data: { arc: 'var(--gk-blue)', tint: 'var(--gk-blue-tint)', ink: 'var(--gk-blue-deep)', lift: 'var(--gk-blue-lift)' },
  technology: { arc: 'var(--gk-teal)', tint: 'var(--gk-teal-tint)', ink: 'var(--gk-teal-ink)', lift: 'var(--gk-teal-lift)' },
  process: { arc: 'var(--gk-coral)', tint: 'var(--gk-coral-tint)', ink: 'var(--gk-coral-ink)', lift: 'var(--gk-coral-lift)' },
  strategy: { arc: 'var(--gk-yellow-deep)', tint: 'var(--gk-yellow-tint)', ink: 'var(--gk-yellow-ink)', lift: 'var(--gk-yellow)' },
}

/** A score on the 1 to 5 scale as a share of the whole bar or arc. */
const share = (average: number) => average / 5

export function DataQuiz() {
  const [stage, setStage] = useState<Stage>({ kind: 'details' })
  const [details, setDetails] = useState<QuizDetails>(emptyDetails)
  const [answers, setAnswers] = useState<Array<Answer | undefined>>(() => Array(statementCount).fill(undefined))
  const top = useRef<HTMLDivElement>(null)

  const go = (next: Stage, scroll = true) => {
    setStage(next)
    if (scroll) top.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const send = async (complete: Array<Answer>, score: QuizScore) => {
    go({ kind: 'result', score, delivery: 'sending' })
    try {
      const result = await submitQuiz({ data: { ...details, answers: complete, website: '' } })
      setStage(
        result.ok
          ? { kind: 'result', score, delivery: result.emailed ? 'sent' : 'saved' }
          : { kind: 'result', score, delivery: 'error', error: result.error },
      )
    } catch {
      setStage({ kind: 'result', score, delivery: 'error', error: 'We couldn’t send your results just now.' })
    }
  }

  const finish = (all: Array<Answer | undefined>) => {
    const complete = all.filter((a): a is Answer => a !== undefined)
    if (complete.length !== statementCount) return
    void send(complete, scoreQuiz(complete))
  }

  /* A short beat on the chosen answer before moving on, so the choice
     registers. Input during that beat, or from the statement sliding out,
     is ignored rather than landing on the wrong question. */
  const moving = useRef(false)
  const answer = (index: number, value: Answer) => {
    if (moving.current) return
    moving.current = true
    const next = answers.map((a, i) => (i === index ? value : a))
    setAnswers(next)
    window.setTimeout(() => {
      if (index === statementCount - 1) finish(next)
      else go({ kind: 'question', index: index + 1 }, false)
      window.setTimeout(() => (moving.current = false), 320)
    }, 240)
  }

  const restart = () => {
    setAnswers(Array(statementCount).fill(undefined))
    go({ kind: 'question', index: 0 })
  }

  return (
    <div ref={top} id="quiz" className="scroll-mt-20">
      <div className="grid overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-md)] lg:grid-cols-[17rem_1fr]">
        <aside
          data-ground="navy"
          className={cn(
            'ground-navy flex-col',
            stage.kind === 'details' && 'hidden lg:flex',
            stage.kind === 'question' && 'flex',
            stage.kind === 'result' && 'flex items-center justify-center px-8 py-10',
          )}
          style={{ backgroundColor: 'var(--gk-navy-deep)' }}
        >
          {stage.kind === 'result' ? (
            <ScoredMark
              size={176}
              fills={Object.fromEntries(stage.score.domains.map((d) => [d.id, share(d.average)])) as Record<DomainId, number>}
            >
              <div className="text-center">
                <p className="stat-figure text-[length:2.75rem] leading-none text-white">{formatScore(stage.score.average)}</p>
                <p className="mt-1 text-[length:var(--fs-xs)] font-bold text-[var(--fg-inverse-2)]">out of 5</p>
              </div>
            </ScoredMark>
          ) : (
            <>
              <Itinerary stage={stage} answers={answers} className="hidden lg:flex" />
              {stage.kind === 'question' && <ProgressStrip index={stage.index} answers={answers} className="lg:hidden" />}
            </>
          )}
        </aside>

        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage.kind === 'question' ? `q${stage.index}` : stage.kind}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col"
            >
              {stage.kind === 'details' && (
                <DetailsStep details={details} onChange={setDetails} onNext={() => go({ kind: 'question', index: 0 })} />
              )}
              {stage.kind === 'question' && (
                <QuestionStep
                  index={stage.index}
                  value={answers[stage.index]}
                  onAnswer={(v) => answer(stage.index, v)}
                  onBack={() => go(stage.index === 0 ? { kind: 'details' } : { kind: 'question', index: stage.index - 1 }, false)}
                />
              )}
              {stage.kind === 'result' && (
                <Results
                  stage={stage}
                  email={details.email}
                  onRetry={() => finish(answers)}
                  onReview={() => go({ kind: 'question', index: 0 })}
                  onRestart={restart}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- itinerary */

type Dot = { filled: boolean; current: boolean }
type Leg =
  | { id: 'about' | 'results'; title: string; state: 'done' | 'current' | 'upcoming' }
  | { id: DomainId; title: string; state: 'done' | 'current' | 'upcoming'; dots: Array<Dot> }

/** The route through the quiz, with where the visitor is on it. */
function legs(stage: Exclude<Stage, { kind: 'result' }>, answers: Array<Answer | undefined>): Array<Leg> {
  const current = stage.kind === 'question' ? stage.index : -1
  return [
    { id: 'about', title: 'About you', state: stage.kind === 'details' ? 'current' : 'done' },
    ...domains.map((domain, d): Leg => {
      const own = statements.flatMap((s, i) => (s.domain === d ? [i] : []))
      const dots = own.map((i) => ({ filled: answers[i] !== undefined, current: i === current }))
      const state = own.includes(current) ? 'current' : stage.kind === 'question' && dots.every((dot) => dot.filled) ? 'done' : 'upcoming'
      return { id: domain.id, title: domain.title, state, dots }
    }),
    { id: 'results', title: 'Your results', state: 'upcoming' },
  ]
}

function Itinerary({
  stage,
  answers,
  className,
}: {
  stage: Exclude<Stage, { kind: 'result' }>
  answers: Array<Answer | undefined>
  className?: string
}) {
  const listing = stage.kind === 'details'
  return (
    <div className={cn('flex-col items-stretch px-8 py-10', className)}>
      <ol className="flex flex-col">
        {legs(stage, answers).map((leg) => (
          <li
            key={leg.id}
            className={cn(
              'flex min-h-[3.25rem] items-center gap-3 border-b border-[var(--hairline-inverse)] py-3 text-[length:var(--fs-sm)] text-white transition-opacity duration-[var(--dur-base)] last:border-b-0',
              leg.state === 'current' ? 'font-bold' : 'font-semibold',
              leg.state === 'upcoming' && !listing && 'opacity-60',
              leg.state === 'done' && 'opacity-60',
            )}
          >
            {'dots' in leg ? (
              <span aria-hidden="true" className="h-[3px] w-3.5 shrink-0 rounded-full" style={{ background: DOMAIN_HUES[leg.id].lift }} />
            ) : (
              <span aria-hidden="true" className="h-[3px] w-3.5 shrink-0 rounded-full bg-white/70" />
            )}
            <span className="whitespace-nowrap">{leg.title}</span>
            <span className="ml-auto flex items-center">
              {leg.state === 'done' && !('dots' in leg) && <Check aria-hidden="true" strokeWidth={2.5} className="size-3.5" />}
              {leg.id === 'about' && leg.state === 'current' && (
                <span className="hand -mt-1 flex items-center gap-1.5 text-[length:var(--fs-hand-sm)] font-bold whitespace-nowrap text-[var(--gk-yellow)]">
                  <Scribble name="arrow-curve" color="var(--gk-yellow)" weight={2.5} className="mt-1.5 h-6 w-5 rotate-90" />
                  you’re here
                </span>
              )}
              {'dots' in leg &&
                (listing ? (
                  <span className="font-semibold text-[var(--fg-inverse-2)]">3 statements</span>
                ) : (
                  <Dots dots={leg.dots} hue={DOMAIN_HUES[leg.id].lift} />
                ))}
            </span>
          </li>
        ))}
      </ol>
      {listing && (
        <p className="mt-6 text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-inverse-2)]">
          About three minutes. Nothing is scored until the last statement.
        </p>
      )}
    </div>
  )
}

function Dots({ dots, hue }: { dots: Array<Dot>; hue: string }) {
  return (
    <span className="flex items-center gap-2">
      {dots.map((dot, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            'size-2 rounded-full transition-colors duration-[var(--dur-base)]',
            dot.current && 'ring-2 ring-white ring-offset-2 ring-offset-[var(--gk-navy-deep)]',
          )}
          style={{ background: dot.filled ? hue : 'rgb(255 255 255 / 0.28)' }}
        />
      ))}
    </span>
  )
}

/** On a phone the itinerary collapses to one strip: the domain and the twelve dots. */
function ProgressStrip({ index, answers, className }: { index: number; answers: Array<Answer | undefined>; className?: string }) {
  const domain = domains[statements[index].domain]
  return (
    <div className={cn('flex h-14 items-center justify-between gap-4 px-5', className)}>
      <span className="hand text-[length:var(--fs-hand-sm)]" style={{ color: DOMAIN_HUES[domain.id].lift }}>
        {domain.title.toLowerCase()}
      </span>
      <span className="flex items-center gap-3">
        {legs({ kind: 'question', index }, answers).map(
          (leg) => 'dots' in leg && <Dots key={leg.id} dots={leg.dots} hue={DOMAIN_HUES[leg.id].lift} />,
        )}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------- details */

/* The content file's labels carry their explanations in parentheses; here
   the aside already says what the email is for, so the labels are bare. */
const labels: Record<keyof QuizDetails, string> = {
  name: 'Full name',
  email: 'Email',
  organization: 'Organisation name',
  region: 'Region',
  sector: 'Sector',
  sectorOther: 'Your sector',
  role: 'Your role',
  roleOther: 'Your role',
  size: 'Organisation size',
  budget: 'Organisation budget (optional)',
}

const quizInputClass = cn(inputClass, 'hover:border-[var(--gk-navy)]')

function DetailsStep({
  details,
  onChange,
  onNext,
}: {
  details: QuizDetails
  onChange: (next: QuizDetails) => void
  onNext: () => void
}) {
  const set = (key: keyof QuizDetails) => (value: string) => onChange({ ...details, [key]: value })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onNext()
  }

  const text = (
    key: keyof QuizDetails,
    props: { type?: string; autoComplete?: string; required?: boolean; wide?: boolean; placeholder?: string } = {},
  ) => (
    <Field label={labels[key]} htmlFor={`quiz-${key}`} wide={props.wide}>
      <input
        id={`quiz-${key}`}
        type={props.type ?? 'text'}
        required={props.required ?? true}
        maxLength={200}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        value={details[key]}
        onChange={(event) => set(key)(event.target.value)}
        className={quizInputClass}
      />
    </Field>
  )

  return (
    <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2 className="text-[length:clamp(1.5rem,2.6vw,2rem)] leading-tight font-extrabold">First, a little about you.</h2>
        <p className="mt-2 max-w-[52ch] text-[length:var(--fs-base)] text-[var(--fg-2)]">So we can email you your results.</p>
      </div>
      {text('name', { autoComplete: 'name' })}
      {text('email', { type: 'email', autoComplete: 'email' })}
      {text('organization', { autoComplete: 'organization', wide: true })}
      <Select id="region" value={details.region} options={detailOptions.region} onChange={set('region')} />
      <Select id="size" value={details.size} options={detailOptions.size} onChange={set('size')} />
      <Select id="sector" value={details.sector} options={detailOptions.sector} onChange={set('sector')} />
      <Select id="role" value={details.role} options={detailOptions.role} onChange={set('role')} />
      {details.sector === 'Other' && text('sectorOther', { wide: details.role !== 'Other' })}
      {details.role === 'Other' && text('roleOther', { wide: details.sector !== 'Other' })}
      {text('budget', { required: false, wide: true, placeholder: 'e.g. INR 1 crore' })}
      <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3 md:col-span-2">
        <GkButton type="submit" variant="primary" withArrow>
          Start the quiz
        </GkButton>
        <p className="text-[length:var(--fs-sm)] text-[var(--fg-2)]">Twelve statements come next, one at a time.</p>
      </div>
    </form>
  )
}

function Select({
  id,
  value,
  options,
  onChange,
}: {
  id: 'region' | 'sector' | 'role' | 'size'
  value: string
  options: Array<string>
  onChange: (value: string) => void
}) {
  return (
    <Field label={labels[id]} htmlFor={`quiz-${id}`}>
      <div className="relative">
        <select
          id={`quiz-${id}`}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(quizInputClass, 'cursor-pointer appearance-none pr-11', !value && 'text-[var(--fg-2)]')}
        >
          <option value="" disabled>
            Choose one
          </option>
          {options.map((option) => (
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
  )
}

/* ------------------------------------------------------------ question */

function QuestionStep({
  index,
  value,
  onAnswer,
  onBack,
}: {
  index: number
  value: Answer | undefined
  onAnswer: (value: Answer) => void
  onBack: () => void
}) {
  const statement = statements[index]
  const domain = domains[statement.domain]
  const hue = DOMAIN_HUES[domain.id]
  const statementId = `quiz-statement-${index}`

  /* The pointer is usually resting where the last tile was, so the next
     question's tile would light up before anyone moved. Mouse tiles stay
     inert until the pointer actually moves; touch has no hover to carry. */
  const [armed, setArmed] = useState(false)

  /* Keys 1 to 5 answer, in the order the scale reads. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement && event.target.type !== 'radio') return
      if (event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return
      const n = Number(event.key)
      if (n >= 1 && n <= 5) onAnswer(scale[n - 1].value)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onAnswer])

  return (
    <div className="flex flex-1 flex-col" onPointerMove={() => setArmed(true)}>
      <div className="flex items-center justify-between gap-4">
        <p className="hand" style={{ color: hue.ink }}>
          {domain.title.toLowerCase()}
        </p>
        <p className="text-[length:var(--fs-sm)] font-bold text-[var(--fg-2)] tabular-nums">
          {index + 1} of {statementCount}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center py-8 lg:py-10">
        <p
          id={statementId}
          className="max-w-[30ch] text-[length:clamp(1.5rem,3vw,2.375rem)] leading-[1.2] font-extrabold tracking-[-0.01em] text-[var(--gk-ink)]"
        >
          {statement.text}
        </p>

        <div
          role="radiogroup"
          aria-labelledby={statementId}
          className={cn('mt-8 grid gap-2 sm:grid-cols-5', !armed && '[@media(hover:hover)]:pointer-events-none')}
        >
          {scale.map((option, i) => {
            const checked = value === option.value
            return (
              <label
                key={`${index}-${option.value}`}
                className={cn(
                  'relative flex min-h-[3.25rem] cursor-pointer items-center gap-2 rounded-[var(--r-sm)] border px-3 py-2 text-[length:var(--fs-sm)] leading-tight font-semibold transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] sm:min-h-[4.5rem]',
                  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--gk-navy)]',
                  checked
                    ? 'border-[var(--gk-navy)] bg-[var(--gk-navy)] text-white'
                    : 'border-[var(--hairline-strong)] bg-[var(--gk-white)] text-[var(--gk-ink)] hover:bg-[var(--gk-cream-deep)]',
                )}
              >
                <input
                  type="radio"
                  name={statementId}
                  value={option.value}
                  checked={checked}
                  onChange={() => onAnswer(option.value)}
                  className="sr-only"
                />
                <kbd
                  aria-hidden="true"
                  className={cn(
                    'hidden size-5 shrink-0 place-items-center rounded-[3px] border font-sans text-[11px] font-bold tabular-nums xl:[@media(hover:hover)]:grid',
                    checked ? 'border-white/40 text-white/80' : 'border-[var(--hairline-strong)] text-[var(--fg-2)]',
                  )}
                >
                  {i + 1}
                </kbd>
                <span className="flex-1 text-center text-balance">{option.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back
        </button>
        <p className="hidden text-[length:var(--fs-sm)] text-[var(--fg-2)] sm:block">
          Answer for your organisation as it is today. Keys 1 to 5 work too.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- results */

const LEVEL_INKS = {
  emerging: 'var(--gk-coral-ink)',
  developing: 'var(--gk-yellow-ink)',
  established: 'var(--gk-teal-ink)',
}

function Results({
  stage,
  email,
  onRetry,
  onReview,
  onRestart,
}: {
  stage: Extract<Stage, { kind: 'result' }>
  email: string
  onRetry: () => void
  onReview: () => void
  onRestart: () => void
}) {
  const reduced = useReducedMotion()
  const { score } = stage
  const weakest = DOMAIN_HUES[score.weakest.id]

  return (
    <div className="flex flex-col gap-10">
      <h2 className="max-w-[44ch] text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-snug font-normal text-[var(--gk-ink)]">
        <strong className="font-extrabold">{score.level.label}.</strong> {score.level.reading}
      </h2>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 pt-4 sm:grid-cols-4">
        {score.domains.map((d) => {
          const hue = DOMAIN_HUES[d.id]
          const lowest = d.id === score.weakest.id
          return (
            <div key={d.id} className="relative flex flex-col gap-1">
              {lowest && (
                <span className="hand pointer-events-none absolute -top-9 left-0 text-[var(--gk-coral-ink)]" aria-hidden="true">
                  start here
                </span>
              )}
              <motion.span
                aria-hidden="true"
                className="mb-2 block h-1 rounded-full"
                style={{ background: hue.arc }}
                initial={{ width: 0 }}
                animate={{ width: `${share(d.average) * 100}%` }}
                transition={reduced ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <dt className="text-[length:var(--fs-sm)] font-bold text-[var(--fg-2)]">
                {d.title}
                {lowest && <span className="sr-only"> (your lowest score)</span>}
              </dt>
              <dd className="stat-figure text-[length:2.25rem] text-[var(--gk-ink)]">{formatScore(d.average)}</dd>
              <dd className="text-[length:var(--fs-sm)] font-semibold" style={{ color: LEVEL_INKS[d.level.id] }}>
                {d.level.label}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="rounded-[var(--r-lg)] p-6 md:p-8" style={{ background: weakest.tint }}>
        <p className="max-w-[56ch] text-[length:var(--fs-lg)] leading-relaxed">
          Your lowest score is in <strong>{score.weakest.title}</strong>. That is usually the best place to start, and it is what our work on{' '}
          {score.weakest.next.label.toLowerCase()} is for.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GkButton href="#contact" variant="primary" withArrow>
            Talk to us about your results
          </GkButton>
          <GkButton to={score.weakest.next.to} variant="secondary">
            {score.weakest.next.label}
          </GkButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-[var(--hairline)] pt-6">
        <p role="status" className="flex items-center gap-2 text-[length:var(--fs-sm)] text-[var(--fg-2)]">
          {stage.delivery === 'sending' && 'Sending a copy to your inbox…'}
          {stage.delivery === 'sent' && (
            <>
              <Scribble name="check" color="var(--gk-teal)" weight={4} className="size-5 shrink-0" />
              <span>
                We’ve emailed these results to <strong className="text-[var(--gk-ink)]">{email}</strong>.
              </span>
            </>
          )}
          {stage.delivery === 'saved' && 'Your results are saved, but we couldn’t email a copy just now. Keep this page open or take a screenshot.'}
          {stage.delivery === 'error' && (
            <span className="text-[var(--gk-coral-ink)]">
              {stage.error}{' '}
              <button type="button" onClick={onRetry} className="font-bold underline">
                Try again
              </button>
            </span>
          )}
        </p>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button type="button" onClick={onReview} className="text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] hover:underline">
            Review your answers
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] hover:underline"
          >
            Retake the quiz
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </span>
      </div>
    </div>
  )
}
