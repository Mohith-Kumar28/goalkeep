import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  detailLabels,
  detailOptions,
  domains,
  formatScore,
  likert,
  scoreQuiz,
  statementCount,
} from '@/content/quiz'
import type { Answer, DomainId, QuizDetails, QuizScore } from '@/content/quiz'
import { Scribble } from '@/components/primitives/doodles'
import { GkButton } from '@/components/primitives/gk-button'
import { Field, inputClass } from '@/components/sections/contact'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import { submitQuiz } from '@/server/forms'

/**
 * The data culture quiz.
 *
 * The four domains are drawn as the four coloured arcs of the Goalkeep ring.
 * While the visitor answers, each arc fills one statement at a time; on the
 * results screen each arc is drawn to the length of that domain's score. One
 * statement per screen, and choosing an answer moves on, so twelve questions
 * read as a conversation rather than a form.
 */

type Stage =
  | { kind: 'details' }
  | { kind: 'question'; index: number }
  | { kind: 'result'; score: QuizScore; delivery: 'sending' | 'sent' | 'saved' | 'error'; error?: string }

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

  /* How far each arc has filled: answered statements in that domain. */
  const progress = domains.map((_, d) => {
    const own = statements.flatMap((s, i) => (s.domain === d ? [i] : []))
    return own.filter((i) => answers[i] !== undefined).length / own.length
  })
  const activeDomain = stage.kind === 'question' ? statements[stage.index].domain : undefined

  return (
    <div ref={top} id="quiz" className="scroll-mt-28">
      <div className="grid overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-md)] lg:grid-cols-[21rem_1fr]">
        <aside
          data-ground="navy"
          className="ground-navy relative flex flex-col items-center gap-6 px-6 py-8 lg:justify-center lg:px-10 lg:py-12"
          style={{ backgroundColor: 'var(--gk-navy)' }}
        >
          {stage.kind === 'result' ? (
            <ResultMark score={stage.score} />
          ) : (
            <>
              <DomainRing fills={progress} active={activeDomain} className="w-36 lg:w-52" />
              <ul className="grid w-full max-w-[16rem] grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1">
                {domains.map((d, i) => (
                  <li
                    key={d.id}
                    className={cn(
                      'flex items-center gap-2 text-[length:var(--fs-sm)] font-bold transition-opacity duration-[var(--dur-base)]',
                      activeDomain === undefined || activeDomain === i ? 'opacity-100' : 'opacity-60',
                    )}
                  >
                    <span aria-hidden="true" className="h-1 w-4 rounded-full" style={{ background: DOMAIN_HUES[d.id].lift }} />
                    <span className="text-white">{d.title}</span>
                    <span className="ml-auto text-[var(--fg-inverse-2)] tabular-nums">
                      {Math.round(progress[i] * d.statements.length)}/{d.statements.length}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        <div className="min-h-[34rem] p-6 sm:p-8 lg:p-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage.kind === 'question' ? `q${stage.index}` : stage.kind}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
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
                  onRestart={() => {
                    setAnswers(Array(statementCount).fill(undefined))
                    go({ kind: 'question', index: 0 })
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ the ring */

/* Four arcs around a ring with a gap at twelve o'clock, like the mark. */
const ARCS = [
  { start: 22, sweep: 72 },
  { start: 104, sweep: 72 },
  { start: 186, sweep: 72 },
  { start: 268, sweep: 72 },
]
const R = 40

function arcPath(start: number, sweep: number) {
  const point = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return `${50 + R * Math.cos(rad)} ${50 + R * Math.sin(rad)}`
  }
  return `M ${point(start)} A ${R} ${R} 0 0 1 ${point(start + sweep)}`
}

/** The ring. `fills` is 0..1 per domain: how much of each arc is drawn over its faint track. */
export function DomainRing({
  fills,
  active,
  onDark = true,
  className,
  children,
}: {
  fills: Array<number>
  active?: number
  onDark?: boolean
  className?: string
  children?: ReactNode
}) {
  const reduced = useReducedMotion()
  return (
    <div className={cn('relative aspect-square', className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true">
        {ARCS.map((arc, i) => {
          const hue = DOMAIN_HUES[domains[i].id]
          const d = arcPath(arc.start, arc.sweep)
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={onDark ? 'rgb(255 255 255 / 0.14)' : 'var(--hairline)'} strokeWidth={11} strokeLinecap="round" />
              <motion.path
                d={d}
                fill="none"
                stroke={onDark ? hue.lift : hue.arc}
                strokeWidth={active === i ? 13 : 11}
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: Math.max(fills[i], 0.001), opacity: fills[i] > 0 ? 1 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          )
        })}
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  )
}

/* ------------------------------------------------------------- details */

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

  const text = (key: keyof QuizDetails, props: { type?: string; autoComplete?: string; required?: boolean; wide?: boolean } = {}) => (
    <Field label={detailLabels[key]} htmlFor={`quiz-${key}`} wide={props.wide}>
      <input
        id={`quiz-${key}`}
        type={props.type ?? 'text'}
        required={props.required ?? true}
        maxLength={200}
        autoComplete={props.autoComplete}
        value={details[key]}
        onChange={(event) => set(key)(event.target.value)}
        className={inputClass}
      />
    </Field>
  )

  return (
    <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2 className="text-[length:clamp(1.5rem,2.6vw,2rem)] leading-tight font-extrabold">First, a little about you.</h2>
        <p className="mt-2 max-w-[52ch] text-[length:var(--fs-base)] text-[var(--fg-2)]">
          So we can email you your results. The statements come next, one at a time.
        </p>
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
      {text('budget', { required: false, wide: true })}
      <div className="flex items-center justify-end gap-4 md:col-span-2">
        <GkButton type="submit" variant="primary" withArrow>
          Start the quiz
        </GkButton>
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
    <Field label={detailLabels[id]} htmlFor={`quiz-${id}`}>
      <div className="relative">
        <select
          id={`quiz-${id}`}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(inputClass, 'cursor-pointer appearance-none pr-11', !value && 'text-[var(--fg-2)]')}
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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4">
        <p className="hand" style={{ color: hue.ink }}>
          {domain.title.toLowerCase()}
        </p>
        <p className="text-[length:var(--fs-sm)] font-bold text-[var(--fg-2)] tabular-nums">
          {index + 1} of {statementCount}
        </p>
      </div>

      <fieldset className="mt-6 flex flex-1 flex-col">
        <legend className="max-w-[30ch] text-[length:clamp(1.5rem,3vw,2.375rem)] leading-[1.2] font-extrabold tracking-[-0.01em] text-[var(--gk-ink)]">
          {statement.text}
        </legend>

        <div className="mt-10 grid gap-2 sm:grid-cols-5">
          {scale.map((option, i) => {
            const checked = value === option.value
            return (
              <label
                key={option.value}
                className={cn(
                  'group relative flex cursor-pointer items-center gap-3 rounded-[var(--r-md)] border-2 px-4 py-3.5 text-[length:var(--fs-sm)] font-bold transition-[background-color,border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] active:scale-[0.98] sm:min-h-[6.5rem] sm:flex-col sm:items-start sm:justify-between sm:px-3.5 sm:py-4',
                  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--gk-navy)]',
                  checked
                    ? 'border-[var(--gk-navy)] bg-[var(--gk-navy)] text-white'
                    : 'border-[var(--hairline-strong)] bg-[var(--gk-white)] text-[var(--gk-ink)] hover:border-[var(--gk-navy)] hover:bg-[var(--gk-cream-deep)]',
                )}
              >
                <input
                  type="radio"
                  name={`quiz-statement-${index}`}
                  value={option.value}
                  checked={checked}
                  onChange={() => onAnswer(option.value)}
                  className="sr-only"
                />
                {/* Bars that grow with agreement: the scale, drawn. */}
                <span aria-hidden="true" className="flex h-5 items-end gap-[3px]">
                  {Array.from({ length: 5 }, (_, k) => (
                    <span
                      key={k}
                      className={cn(
                        'w-1.5 rounded-[1px]',
                        k <= i ? (checked ? 'bg-[var(--gk-yellow)]' : 'bg-[var(--gk-navy)]') : checked ? 'bg-white/25' : 'bg-[var(--hairline-strong)]',
                      )}
                      style={{ height: `${(k + 1) * 20}%` }}
                    />
                  ))}
                </span>
                <span className="leading-tight">{option.label}</span>
                <span
                  aria-hidden="true"
                  className={cn('ml-auto text-[length:var(--fs-xs)] tabular-nums sm:absolute sm:top-2.5 sm:right-3', checked ? 'text-white/70' : 'text-[var(--fg-2)]')}
                >
                  {i + 1}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back
        </button>
        <p className="hidden text-[length:var(--fs-sm)] text-[var(--fg-2)] sm:block">Answer for your organisation as it is today. Keys 1 to 5 work too.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- results */

const LEVEL_TINTS = {
  emerging: { ground: 'var(--gk-coral-tint)', ink: 'var(--gk-coral-ink)' },
  developing: { ground: 'var(--gk-yellow-tint)', ink: 'var(--gk-yellow-ink)' },
  established: { ground: 'var(--gk-teal-tint)', ink: 'var(--gk-teal-ink)' },
}

/** The ring drawn to the scores: each arc as long as its domain is strong. */
function ResultMark({ score }: { score: QuizScore }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <DomainRing fills={score.domains.map((d) => (d.average - 1) / 4)} className="w-44 lg:w-56">
        <div className="text-center">
          <p className="stat-figure text-[length:clamp(2.75rem,5vw,3.75rem)] text-white">{formatScore(score.average)}</p>
          <p className="text-[length:var(--fs-xs)] font-bold text-[var(--fg-inverse-2)]">out of 5</p>
        </div>
      </DomainRing>
      <ul className="grid w-full max-w-[16rem] grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1">
        {score.domains.map((d) => (
          <li key={d.id} className="flex items-center gap-2 text-[length:var(--fs-sm)] font-bold text-white">
            <span aria-hidden="true" className="h-1 w-4 rounded-full" style={{ background: DOMAIN_HUES[d.id].lift }} />
            {d.title}
            <span className="ml-auto text-[var(--fg-inverse-2)] tabular-nums">{formatScore(d.average)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Results({
  stage,
  email,
  onRetry,
  onRestart,
}: {
  stage: Extract<Stage, { kind: 'result' }>
  email: string
  onRetry: () => void
  onRestart: () => void
}) {
  const { score } = stage
  const tint = LEVEL_TINTS[score.level.id]

  return (
    <div className="flex flex-col gap-10">
      <div>
        <span className="chip text-[length:var(--fs-sm)] font-bold" style={{ background: tint.ground, color: tint.ink }}>
          {score.level.label}
        </span>
        <h2 className="mt-4 max-w-[28ch] text-[length:clamp(1.5rem,2.8vw,2.125rem)] leading-tight font-extrabold">{score.level.reading}</h2>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 pt-6 sm:grid-cols-4">
        {score.domains.map((d) => {
          const hue = DOMAIN_HUES[d.id]
          const weakest = d.id === score.weakest.id
          return (
            <div key={d.id} className="relative flex flex-col gap-1 border-t-4 pt-3" style={{ borderColor: hue.arc }}>
              {weakest && (
                <span className="hand pointer-events-none absolute -top-9 left-0 text-[var(--gk-coral-ink)]" aria-hidden="true">
                  start here
                </span>
              )}
              <dt className="text-[length:var(--fs-sm)] font-bold text-[var(--fg-2)]">
                {d.title}
                {weakest && <span className="sr-only"> (your lowest score)</span>}
              </dt>
              <dd className="stat-figure text-[length:2.25rem] text-[var(--gk-ink)]">{formatScore(d.average)}</dd>
              <dd className="text-[length:var(--fs-sm)] font-semibold" style={{ color: LEVEL_TINTS[d.level.id].ink }}>
                {d.level.label}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="rounded-[var(--r-lg)] p-6 md:p-8" style={{ background: DOMAIN_HUES[score.weakest.id].tint }}>
        <p className="max-w-[56ch] text-[length:var(--fs-lg)] leading-relaxed">
          Your lowest score is in <strong>{score.weakest.title}</strong>. That is usually the best place to start, and it is what our work on{' '}
          {score.weakest.next.label.toLowerCase()} is for.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GkButton to="/#contact" variant="primary" withArrow>
            Talk to us about your results
          </GkButton>
          <GkButton to={score.weakest.next.to} variant="secondary">
            {score.weakest.next.label}
          </GkButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] pt-6">
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
        <button type="button" onClick={onRestart} className="inline-flex items-center gap-2 text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] hover:underline">
          Retake the quiz
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  )
}
