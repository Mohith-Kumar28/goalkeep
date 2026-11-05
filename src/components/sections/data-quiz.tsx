import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
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
import type { Answer, QuizDetails, QuizScore } from '@/content/quiz'
import { GkButton } from '@/components/primitives/gk-button'
import { Field, inputClass } from '@/components/sections/contact'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import { submitQuiz } from '@/server/forms'

/**
 * The data culture quiz: the visitor's details, then one screen per domain
 * with its three statements, then the results. The results are shown the
 * moment the last answer is in; storing them and emailing them happens
 * alongside, and only the email line waits on it.
 */

type Stage =
  | { kind: 'details' }
  | { kind: 'domain'; index: number }
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

/* Where each domain's statements start in the flat answer list. */
const offsets = domains.map((_, i) => domains.slice(0, i).reduce((n, d) => n + d.statements.length, 0))

export function DataQuiz() {
  const [stage, setStage] = useState<Stage>({ kind: 'details' })
  const [details, setDetails] = useState<QuizDetails>(emptyDetails)
  const [answers, setAnswers] = useState<Array<Answer | undefined>>(() => Array(statementCount).fill(undefined))
  const top = useRef<HTMLDivElement>(null)

  const go = (next: Stage) => {
    setStage(next)
    top.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
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

  const finish = () => {
    const complete = answers.filter((a): a is Answer => a !== undefined)
    if (complete.length !== statementCount) return
    void send(complete, scoreQuiz(complete))
  }

  const step = stage.kind === 'details' ? 0 : stage.kind === 'domain' ? stage.index + 1 : domains.length + 1

  return (
    <div ref={top} className="scroll-mt-28">
      <div className="rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-6 shadow-[var(--shadow-md)] md:p-10">
        <div className="mb-8 border-b border-[var(--hairline)] pb-6">
          <Progress step={step} />
        </div>
        {stage.kind === 'details' && (
          <DetailsStep details={details} onChange={setDetails} onNext={() => go({ kind: 'domain', index: 0 })} />
        )}
        {stage.kind === 'domain' && (
          <DomainStep
            key={stage.index}
            index={stage.index}
            answers={answers}
            onAnswer={(at, value) => setAnswers((current) => current.map((a, i) => (i === at ? value : a)))}
            onBack={() => go(stage.index === 0 ? { kind: 'details' } : { kind: 'domain', index: stage.index - 1 })}
            onNext={() => (stage.index === domains.length - 1 ? finish() : go({ kind: 'domain', index: stage.index + 1 }))}
          />
        )}
        {stage.kind === 'result' && (
          <Results
            stage={stage}
            email={details.email}
            onRetry={finish}
            onRestart={() => {
              setAnswers(Array(statementCount).fill(undefined))
              go({ kind: 'details' })
            }}
          />
        )}
      </div>
    </div>
  )
}

const STEP_LABELS = ['Your details', ...domains.map((d) => d.title), 'Results']

function Progress({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-6 gap-1.5" aria-label="Quiz progress">
      {STEP_LABELS.map((label, i) => (
        <li key={label} aria-current={i === step ? 'step' : undefined} className="flex flex-col gap-2">
          <span
            className={cn(
              'h-1.5 rounded-full transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
              i <= step ? 'bg-[var(--gk-navy)]' : 'bg-[var(--hairline-strong)]',
            )}
          />
          <span
            className={cn(
              'hidden text-[length:var(--fs-xs)] font-bold sm:block',
              i === step ? 'text-[var(--gk-ink)]' : 'text-[var(--fg-2)]',
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
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
      <StepHeading eyebrow="Step 1 of 5" title="First, a little about you" />
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
      <div className="flex justify-end md:col-span-2">
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

function StepHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note?: ReactNode }) {
  return (
    <div className="md:col-span-2">
      <p className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] text-[var(--gk-blue-deep)] uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-tight font-extrabold">{title}</h2>
      {note && <p className="mt-2 text-[length:var(--fs-base)] text-[var(--fg-2)]">{note}</p>}
    </div>
  )
}

/* -------------------------------------------------------------- domain */

function DomainStep({
  index,
  answers,
  onAnswer,
  onBack,
  onNext,
}: {
  index: number
  answers: Array<Answer | undefined>
  onAnswer: (at: number, value: Answer) => void
  onBack: () => void
  onNext: () => void
}) {
  const domain = domains[index]
  const start = offsets[index]
  const done = domain.statements.every((_, i) => answers[start + i] !== undefined)
  const last = index === domains.length - 1

  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        eyebrow={`Step ${index + 2} of 5 · ${domain.title}`}
        title="How far do you agree?"
        note="Answer for your organisation as it is today, not as you’d like it to be."
      />

      <ol className="flex flex-col gap-6">
        {domain.statements.map((statement, i) => {
          const at = start + i
          const name = `quiz-statement-${at}`
          return (
            <li key={statement} className="border-t border-[var(--hairline)] pt-6">
              <fieldset>
                <legend className="text-[length:var(--fs-lg)] leading-snug font-bold">
                  <span className="mr-2 text-[var(--gk-blue-deep)] tabular-nums">{at + 1}.</span>
                  {statement}
                </legend>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
                  {likert.map((option) => {
                    const checked = answers[at] === option.value
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-[var(--r-btn)] border px-4 py-3 text-[length:var(--fs-sm)] font-bold transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] sm:justify-center sm:px-2 sm:text-center',
                          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--gk-navy)]',
                          checked
                            ? 'border-[var(--gk-navy)] bg-[var(--gk-navy)] text-white'
                            : 'border-[var(--hairline-strong)] bg-[var(--gk-white)] text-[var(--gk-ink)] hover:border-[var(--gk-navy)] hover:bg-[var(--gk-cream-deep)]',
                        )}
                      >
                        <input
                          type="radio"
                          name={name}
                          value={option.value}
                          checked={checked}
                          onChange={() => onAnswer(at, option.value)}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </li>
          )
        })}
      </ol>

      <div className="flex items-center justify-between gap-4">
        <GkButton variant="secondary" onClick={onBack}>
          Back
        </GkButton>
        <GkButton variant="primary" withArrow disabled={!done} onClick={onNext} className="disabled:cursor-not-allowed disabled:opacity-50">
          {last ? 'See my results' : 'Next'}
        </GkButton>
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
  const reduced = useReducedMotion()
  const { score } = stage
  const tint = LEVEL_TINTS[score.level.id]

  return (
    <div className="flex flex-col gap-10">
      <div className="grid items-start gap-8 md:grid-cols-[auto_1fr] md:gap-10">
        <div className="flex flex-col items-start gap-3">
          <p className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] text-[var(--gk-blue-deep)] uppercase">
            Your overall score
          </p>
          <p className="stat-figure text-[length:clamp(3.5rem,8vw,5rem)] text-[var(--gk-navy)]">
            {formatScore(score.average)}
            <span className="text-[length:var(--fs-xl)] text-[var(--fg-2)]"> / 5</span>
          </p>
          <span className="chip text-[length:var(--fs-sm)] font-bold" style={{ background: tint.ground, color: tint.ink }}>
            {score.level.label}
          </span>
        </div>
        <p className="lead md:pt-7">{score.level.reading}</p>
      </div>

      <ul className="flex flex-col gap-5">
        {score.domains.map((d, i) => (
          <li key={d.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[length:var(--fs-lg)] font-extrabold">{d.title}</span>
              <span className="text-[length:var(--fs-sm)] text-[var(--fg-2)]">
                {d.level.label} ·{' '}
                <span className="font-bold text-[var(--gk-ink)] tabular-nums">{formatScore(d.average)}</span> / 5
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[var(--gk-cream-deep)]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: LEVEL_TINTS[d.level.id].ink, transformOrigin: 'left' }}
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: (d.average - 1) / 4 || 0.02 }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-[var(--r-lg)] bg-[var(--gk-cream-deep)] p-6 md:p-8">
        <p className="text-[length:var(--fs-base)] leading-relaxed">
          Your lowest score is in <strong>{score.weakest.title}</strong>. That is usually the best place to start, and
          it is what our work on {score.weakest.next.label.toLowerCase()} is for.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <GkButton to="/#contact" variant="primary" withArrow>
            Talk to us about your results
          </GkButton>
          <GkButton to={score.weakest.next.to} variant="secondary">
            {score.weakest.next.label}
          </GkButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] pt-6">
        <p role="status" className="text-[length:var(--fs-sm)] text-[var(--fg-2)]">
          {stage.delivery === 'sending' && 'Sending a copy to your inbox…'}
          {stage.delivery === 'sent' && (
            <>
              We’ve emailed these results to <strong className="text-[var(--gk-ink)]">{email}</strong>.
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
        <GkButton variant="tertiary" onClick={onRestart}>
          Retake the quiz
        </GkButton>
      </div>
    </div>
  )
}
