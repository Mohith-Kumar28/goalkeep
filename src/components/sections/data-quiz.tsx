import { ArrowLeft, ArrowRight, Check, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { detailOptions, domains, formatScore, likert, scoreQuiz, statementCount } from '@/content/quiz'
import type { Answer, DomainId, QuizDetails, QuizScore } from '@/content/quiz'
import { Annotate, Scribble } from '@/components/primitives/doodles'
import { GkButton } from '@/components/primitives/gk-button'
import { DomainArc, ScoredMark, segmentHue } from '@/components/primitives/scored-mark'
import { Field, inputClass } from '@/components/sections/contact'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import { submitQuiz } from '@/server/forms'

/**
 * The data culture quiz.
 *
 * Four stages: a short form about the visitor, twelve statements one at a
 * time, the results, and a review of the answers that can be changed. The
 * card's navy aside is the itinerary through those stages: on the form it
 * lists what is coming, on the statements it turns into progress (three dots
 * per domain), and on the results and the review it draws the mark to the
 * scores. The mark itself appears only there and in the page hero;
 * everywhere else progress is dots, so the mark stays the mark.
 */

type Stage = { kind: 'details' } | { kind: 'question'; index: number } | { kind: 'result' } | { kind: 'review' }

/* One attempt is submitted once, when its twelfth statement is answered.
   Answers changed in the review re-score on the page and never write a
   second row; only a retake starts a new attempt. */
type Submission =
  | { status: 'none' }
  | { status: 'sending' }
  | { status: 'sent' }
  | { status: 'saved' }
  | { status: 'error'; error: string }

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

type Hue = { arc: string; tint: string; ink: string; lift: string }

export const DOMAIN_HUES: Record<DomainId, Hue> = {
  data: { arc: 'var(--gk-blue)', tint: 'var(--gk-blue-tint)', ink: 'var(--gk-blue-deep)', lift: 'var(--gk-blue-lift)' },
  technology: { arc: 'var(--gk-teal)', tint: 'var(--gk-teal-tint)', ink: 'var(--gk-teal-ink)', lift: 'var(--gk-teal-lift)' },
  process: { arc: 'var(--gk-coral)', tint: 'var(--gk-coral-tint)', ink: 'var(--gk-coral-ink)', lift: 'var(--gk-coral-lift)' },
  strategy: { arc: 'var(--gk-yellow-deep)', tint: 'var(--gk-yellow-tint)', ink: 'var(--gk-yellow-ink)', lift: 'var(--gk-yellow)' },
}

/** A score on the 1 to 5 scale as a share of the whole bar or arc. */
const share = (average: number) => average / 5

const EASE = [0.22, 1, 0.36, 1] as const

const complete = (answers: Array<Answer | undefined>) => answers.filter((a): a is Answer => a !== undefined)

export function DataQuiz() {
  const [stage, setStage] = useState<Stage>({ kind: 'details' })
  const [details, setDetails] = useState<QuizDetails>(emptyDetails)
  const [answers, setAnswers] = useState<Array<Answer | undefined>>(() => Array(statementCount).fill(undefined))
  const [submission, setSubmission] = useState<Submission>({ status: 'none' })
  const top = useRef<HTMLDivElement>(null)

  const answered = complete(answers)
  const score = answered.length === statementCount ? scoreQuiz(answered) : undefined

  const go = (next: Stage, scroll = true) => {
    setStage(next)
    if (scroll) top.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const send = async (all: Array<Answer>) => {
    setSubmission({ status: 'sending' })
    try {
      const result = await submitQuiz({ data: { ...details, answers: all, website: '' } })
      setSubmission(result.ok ? { status: result.emailed ? 'sent' : 'saved' } : { status: 'error', error: result.error })
    } catch {
      setSubmission({ status: 'error', error: 'We couldn’t send your results just now.' })
    }
  }

  const finish = (all: Array<Answer | undefined>) => {
    const done = complete(all)
    if (done.length !== statementCount) return
    go({ kind: 'result' })
    if (submission.status === 'none') void send(done)
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
    setSubmission({ status: 'none' })
    go({ kind: 'question', index: 0 })
  }

  return (
    <div ref={top} id="quiz" className="scroll-mt-28">
      {/* The details form is the tallest step; holding every step to its
          height on desktop keeps the page below still from step to step.
          `overflow-clip` rounds the corners without making the card a
          scroll container, which would pin the review's sticky score to
          the card instead of the window. */}
      <div className="grid overflow-clip rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-md)] lg:min-h-[42rem] lg:grid-cols-[18rem_1fr]">
        <aside
          data-ground="navy"
          className={cn(
            'ground-navy flex-col',
            stage.kind === 'details' ? 'hidden lg:flex' : 'flex',
            /* On a phone the review's score row pins under the header, so the
               score stays in view while answers further down change. */
            stage.kind === 'review' && 'max-lg:sticky max-lg:top-[82px] max-lg:z-20',
          )}
          style={{ backgroundColor: 'var(--gk-navy-deep)' }}
        >
          {stage.kind === 'details' || stage.kind === 'question' ? (
            <>
              <Itinerary stage={stage} answers={answers} className="hidden lg:flex" />
              {stage.kind === 'question' && <ProgressStrip index={stage.index} answers={answers} className="lg:hidden" />}
            </>
          ) : (
            score && <ScoreAside score={score} sticky={stage.kind === 'review'} />
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
              {stage.kind === 'result' && score && (
                <Results
                  score={score}
                  submission={submission}
                  email={details.email}
                  onRetry={() => void send(answered)}
                  onReview={() => go({ kind: 'review' })}
                  onRestart={restart}
                />
              )}
              {stage.kind === 'review' && (
                <ReviewStep
                  answers={answers}
                  onChange={(index, value) => setAnswers(answers.map((a, i) => (i === index ? value : a)))}
                  onBack={() => go({ kind: 'result' })}
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
function legs(stage: Extract<Stage, { kind: 'details' | 'question' }>, answers: Array<Answer | undefined>): Array<Leg> {
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
  stage: Extract<Stage, { kind: 'details' | 'question' }>
  answers: Array<Answer | undefined>
  className?: string
}) {
  const listing = stage.kind === 'details'
  return (
    <div className={cn('flex-1 flex-col items-stretch px-7 py-10', className)}>
      <ol className="flex flex-col">
        {legs(stage, answers).map((leg) => {
          const current = leg.state === 'current'
          return (
            <li
              key={leg.id}
              className={cn(
                'flex min-h-[3.25rem] items-center gap-3 border-b border-[var(--hairline-inverse)] py-3 text-[length:var(--fs-sm)] text-white transition-opacity duration-[var(--dur-base)] last:border-b-0',
                current ? 'font-bold' : 'font-semibold',
                leg.state === 'upcoming' && !listing && 'opacity-[0.55]',
              )}
            >
              <span aria-hidden="true" className="flex w-5 shrink-0 items-center justify-center">
                {'dots' in leg ? (
                  <DomainArc domain={leg.id} size={current ? 20 : 15} color={DOMAIN_HUES[leg.id].lift} />
                ) : (
                  <span className={cn('rounded-full bg-white/70', current ? 'h-[3px] w-4' : 'h-[2px] w-3')} />
                )}
              </span>
              <span className="whitespace-nowrap">{leg.title}</span>
              <span className="ml-auto flex items-center">
                {leg.state === 'done' && <Check aria-hidden="true" strokeWidth={2.5} className="size-3.5" />}
                {leg.id === 'about' && current && (
                  <span className="hand -mt-1 flex items-center gap-1.5 text-[length:var(--fs-hand-sm)] font-bold whitespace-nowrap text-[var(--gk-yellow)]">
                    <Scribble name="arrow-curve" color="var(--gk-yellow)" weight={2.5} className="mt-1.5 h-6 w-5 rotate-90" />
                    you’re here
                  </span>
                )}
                {'dots' in leg &&
                  leg.state !== 'done' &&
                  (listing ? (
                    <span className="text-[length:var(--fs-xs)] font-semibold text-[var(--fg-inverse-2)]">3 statements</span>
                  ) : (
                    <Dots dots={leg.dots} hue={DOMAIN_HUES[leg.id].lift} />
                  ))}
              </span>
            </li>
          )
        })}
      </ol>
      {listing && (
        <p className="mt-auto pt-8 text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-inverse-2)]">
          Nothing is scored until the last statement.
        </p>
      )}
    </div>
  )
}

/* The desktop itinerary has room for a ring round the current dot; the
   phone strip packs its dots closer and marks the current one by outline. */
function Dots({ dots, hue, tight = false }: { dots: Array<Dot>; hue: string; tight?: boolean }) {
  return (
    <span className={cn('flex items-center', tight ? 'gap-[5px]' : 'gap-2')}>
      {dots.map((dot, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            'rounded-full transition-colors duration-[var(--dur-base)]',
            tight ? 'size-2.5' : 'size-2',
            dot.current && (tight ? 'outline outline-1 outline-offset-1 outline-white' : 'ring-2 ring-white ring-offset-2 ring-offset-[var(--gk-navy-deep)]'),
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
      <span className="flex items-center gap-3.5">
        {legs({ kind: 'question', index }, answers).map(
          (leg) => 'dots' in leg && <Dots key={leg.id} dots={leg.dots} hue={DOMAIN_HUES[leg.id].lift} tight />,
        )}
      </span>
    </div>
  )
}

/* The scores, drawn on the mark. Desktop puts the average inside the ring
   and the level and the two scores that decide what to do under it; a phone
   has no column to spare, so the mark sits in a row beside the average. On
   the review the column sticks to the top, so the score stays in view while
   answers further down are changed. */
function ScoreAside({ score, sticky }: { score: QuizScore; sticky: boolean }) {
  const fills = Object.fromEntries(score.domains.map((d) => [d.id, share(d.average)])) as Record<DomainId, number>
  const strongest = score.domains.reduce((high, d) => (d.average > high.average ? d : high))
  const weakest = score.domains.find((d) => d.id === score.weakest.id) ?? strongest
  const even = strongest.average === weakest.average
  const tiedTop = score.domains.filter((d) => d.average === strongest.average).length > 1
  const facts = even
    ? []
    : [...(tiedTop ? [] : [{ term: 'Strongest', domain: strongest }]), { term: 'Start with', domain: weakest }]
  return (
    <>
      <div className={cn('hidden flex-col items-center px-8 pt-12 pb-10 lg:flex', sticky && 'sticky top-28')}>
        <ScoredMark size={176} fills={fills}>
          <div className="text-center">
            <p className="stat-figure text-[length:2.75rem] leading-none text-white">{formatScore(score.average)}</p>
            <p className="mt-1 text-[length:var(--fs-xs)] font-bold text-[var(--fg-inverse-2)]">out of 5</p>
          </div>
        </ScoredMark>
        <dl className="mt-8 w-full divide-y divide-[var(--hairline-inverse)] border-y border-[var(--hairline-inverse)] empty:hidden">
          {facts.map(({ term, domain }) => (
            <div key={term} className="flex items-center gap-3 py-3.5">
              <DomainArc domain={domain.id} size={18} color={DOMAIN_HUES[domain.id].lift} />
              <dt className="text-[length:var(--fs-sm)] font-semibold text-[var(--fg-inverse-2)]">{term}</dt>
              <dd className="ml-auto text-[length:var(--fs-sm)] font-bold text-white tabular-nums">
                {domain.title} {formatScore(domain.average)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={cn('flex items-center px-6 lg:hidden', sticky ? 'gap-4 py-3' : 'gap-6 py-5')}>
        <ScoredMark size={sticky ? 64 : 112} fills={fills} />
        <div>
          <p className={cn('stat-figure leading-none text-white', sticky ? 'text-[length:1.75rem]' : 'text-[length:2.5rem]')}>
            {formatScore(score.average)}
            <span className="ml-1.5 text-[length:var(--fs-xs)] font-bold text-[var(--fg-inverse-2)]">out of 5</span>
          </p>
          {!sticky && <p className="mt-3 text-[length:var(--fs-sm)] font-bold text-white">{score.level.label}</p>}
          <p className="mt-1 text-[length:var(--fs-sm)] text-[var(--fg-inverse-2)]">
            {even ? (
              'Even across all four parts'
            ) : (
              <>
                Start with: <span className="whitespace-nowrap">{`${weakest.title} ${formatScore(weakest.average)}`}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </>
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

const quizInputClass = cn(inputClass, 'py-3 hover:border-[var(--gk-navy)]')

const stepHeadingClass = 'text-[length:clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium text-[var(--gk-ink)]'

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

  const text = (key: keyof QuizDetails, props: { type?: string; autoComplete?: string; required?: boolean; placeholder?: string } = {}) => (
    <Field key={key} label={labels[key]} htmlFor={`quiz-${key}`}>
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

  const others = [details.sector === 'Other' && 'sectorOther', details.role === 'Other' && 'roleOther'].filter(
    (key): key is 'sectorOther' | 'roleOther' => key !== false,
  )

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h2 className={stepHeadingClass}>First, a little about you.</h2>
          <span className="hand flex items-center gap-1.5 text-[length:var(--fs-hand-sm)] font-bold whitespace-nowrap text-[var(--gk-ink)]">
            <Scribble name="arrow-curve" color="var(--gk-scribble)" weight={3} className="mt-1.5 h-6 w-5 rotate-90" />
            takes about three minutes
          </span>
        </div>
        <p className="mt-2 max-w-[52ch] text-[length:var(--fs-base)] text-[var(--fg-1)]">So we can email you your results.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {text('name', { autoComplete: 'name' })}
        {text('email', { type: 'email', autoComplete: 'email' })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {text('organization', { autoComplete: 'organization' })}
        {text('budget', { required: false, placeholder: 'e.g. INR 1 crore' })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Select id="region" value={details.region} options={detailOptions.region} onChange={set('region')} />
        <Select id="size" value={details.size} options={detailOptions.size} onChange={set('size')} />
        <Select id="sector" value={details.sector} options={detailOptions.sector} onChange={set('sector')} />
        <Select id="role" value={details.role} options={detailOptions.role} onChange={set('role')} />
      </div>
      {others.length > 0 && <div className="grid gap-5 sm:grid-cols-2">{others.map((key) => text(key))}</div>}
      <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
        <GkButton type="submit" variant="primary" withArrow>
          Start the quiz
        </GkButton>
        <p className="text-[length:var(--fs-sm)] text-[var(--fg-1)]">Twelve statements come next, one at a time.</p>
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

/* -------------------------------------------------------------- answer */

/* One point on the agreement scale. The statements and the review use the
   same tile, large and small, so the two screens read as one control: the
   key number in the domain's ink, a tenth of the domain's hue on hover, and
   once chosen the domain's tint with its arc drawn along the foot. */
function AnswerTile({
  name,
  number,
  label,
  checked,
  hue,
  size,
  onSelect,
}: {
  name: string
  number: number
  label: string
  checked: boolean
  hue: Hue
  size: 'lg' | 'sm'
  onSelect: () => void
}) {
  const reduced = useReducedMotion()
  const large = size === 'lg'
  return (
    <label
      title={large ? undefined : label}
      className={cn(
        'relative flex cursor-pointer overflow-hidden rounded-[var(--r-sm)] border transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--gk-navy)]',
        large
          ? 'min-h-14 items-center gap-4 px-4 pt-1 pb-2 sm:min-h-[6rem] sm:flex-col sm:justify-start sm:gap-1.5 sm:px-2 sm:pt-4 sm:pb-3 sm:text-center xl:flex-row xl:justify-start xl:gap-2.5 xl:px-3.5 xl:text-left'
          : 'size-11 items-center justify-center pb-1',
        checked
          ? 'border-transparent'
          : cn(
              'border-[var(--hairline-strong)] bg-[var(--gk-white)]',
              /* A question's tiles tint on hover only once the pointer has moved
                 (see QuestionStep); they take a click at any time. */
              large ? '[[data-armed]_&:hover]:bg-[var(--tile-hover)]' : 'hover:bg-[var(--tile-hover)]',
            ),
      )}
      style={{ '--tile-hover': `color-mix(in srgb, ${hue.arc} 10%, transparent)`, background: checked ? hue.tint : undefined } as CSSProperties}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSelect()
        }}
        aria-label={large ? undefined : label}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn('hand shrink-0 leading-none font-bold tabular-nums', large ? 'w-4 text-[length:2.125rem] sm:w-auto xl:w-4' : 'text-[length:1.625rem]')}
        style={{ color: hue.ink }}
      >
        {number}
      </span>
      {large && (
        <span className="text-[length:var(--fs-sm)] leading-tight font-semibold text-[var(--gk-ink)]">
          {label}
        </span>
      )}
      {checked && (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          className={cn('pointer-events-none absolute overflow-visible', large ? 'inset-x-3 bottom-1.5 h-2' : 'inset-x-2 bottom-1 h-1.5')}
        >
          <motion.path
            d="M2 2Q50 12 98 2"
            fill="none"
            stroke={hue.arc}
            strokeWidth={large ? 3.5 : 3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </svg>
      )}
    </label>
  )
}

/* ------------------------------------------------------------ question */

/* Whether the last answer came from the keyboard, so the next question
   focuses its tiles. Module scope: each question is a fresh mount. */
let keyboardFlow = false

const statementClass =
  'max-w-[30ch] font-display text-[length:clamp(1.5rem,3.2vw,2.75rem)] leading-[1.25] font-medium tracking-[var(--tracking-display)] text-[var(--gk-ink)]'

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
     question's tile would light up before anyone moved. The hover tint
     waits for the pointer to move; a click lands at any time. */
  const [armed, setArmed] = useState(false)

  /* Arrow keys move between tiles, as in any radio group; only a click,
     Space or a number key answers. A keyboard user's focus carries on to the
     next question's tiles. */
  const group = useRef<HTMLDivElement>(null)
  const arrowed = useRef(false)
  useEffect(() => {
    if (keyboardFlow) {
      const tiles = group.current?.querySelectorAll<HTMLInputElement>('input[type=radio]')
      ;(Array.from(tiles ?? []).find((t) => t.checked) ?? tiles?.[0])?.focus()
    } else if (document.activeElement === document.body) {
      /* The button that started the quiz has gone; the statement takes the
         focus so a screen reader hears it. */
      document.getElementById(statementId)?.focus({ preventScroll: true })
    }
  }, [statementId])

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
    <div className="relative flex flex-1 flex-col" onPointerMove={() => setArmed(true)}>

      <div className="flex items-baseline gap-4">
        <p className="hand hidden lg:block" style={{ color: hue.ink }}>
          {domain.title.toLowerCase()}
        </p>
        <p className="text-[length:var(--fs-sm)] font-bold text-[var(--fg-1)] tabular-nums">
          {index + 1} of {statementCount}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center py-8">
        {/* Every statement is laid out invisibly in the same cell, so the
            block is as tall as the longest one at any width and nothing
            below it moves between questions. The visible one is centred in
            it, so a short statement does not leave a hole above itself. */}
        <div className="grid">
          {statements.map((s, i) => (
            <p key={i} aria-hidden="true" className={cn(statementClass, 'invisible col-start-1 row-start-1')}>
              {s.text}
            </p>
          ))}
          <p id={statementId} tabIndex={-1} className={cn(statementClass, 'col-start-1 row-start-1 self-center outline-none')}>
            {statement.text}
          </p>
        </div>

        <p className="mt-6 text-[length:var(--fs-sm)] text-[var(--fg-1)]">
          Answer for your organisation as it is today.
          <span className="hidden [@media(hover:hover)]:inline"> Keys 1 to 5 work too.</span>
        </p>

        <div
          ref={group}
          role="radiogroup"
          aria-labelledby={statementId}
          data-armed={armed || undefined}
          onKeyDownCapture={(event) => {
            keyboardFlow = true
            arrowed.current = event.key.startsWith('Arrow')
          }}
          onPointerDownCapture={() => {
            keyboardFlow = false
            arrowed.current = false
          }}
          className="mt-3 grid gap-2 sm:grid-cols-5"
        >
          {scale.map((option, i) => (
            <AnswerTile
              key={`${index}-${option.value}`}
              name={statementId}
              number={i + 1}
              label={option.label}
              checked={value === option.value}
              hue={hue}
              size="lg"
              onSelect={() => {
                if (arrowed.current) return
                onAnswer(option.value)
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back
        </button>
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

const linkClass = 'inline-flex min-h-11 items-center gap-2 text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] hover:underline'

function Results({
  score,
  submission,
  email,
  onRetry,
  onReview,
  onRestart,
}: {
  score: QuizScore
  submission: Submission
  email: string
  onRetry: () => void
  onReview: () => void
  onRestart: () => void
}) {
  const weakest = DOMAIN_HUES[score.weakest.id]
  const even = score.domains.every((d) => d.average === score.domains[0].average)
  /* The last tile answered has gone with its question: the reading takes the focus. */
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (document.activeElement === document.body || keyboardFlow) heading.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="flex flex-col gap-10">
      <h2
        ref={heading}
        tabIndex={-1}
        className="max-w-[44ch] text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-snug font-normal text-[var(--gk-ink)] outline-none"
      >
        <strong className="font-extrabold">{score.level.label}.</strong> {score.level.reading}
      </h2>

      {/* Every column has the same rows, the note's included, so the
          titles, figures and levels line up whichever column is lowest. */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {score.domains.map((d) => {
          const lowest = !even && d.id === score.weakest.id
          const figure = <span className="stat-figure text-[length:2.25rem] text-[var(--gk-ink)]">{formatScore(d.average)}</span>
          return (
            <div key={d.id} className="flex flex-col">
              <span aria-hidden="true" className={cn('flex items-start', !even && 'h-8')}>
                {lowest && (
                  <span className="hand flex items-start gap-1 text-[length:var(--fs-hand-sm)] leading-none font-bold whitespace-nowrap text-[var(--gk-ink)]">
                    start here
                    <Scribble name="arrow-curve" color="var(--gk-scribble)" weight={3} className="mt-1 h-6 w-6 -scale-x-100" />
                  </span>
                )}
              </span>
              <DomainArc
                domain={d.id}
                size={56}
                fill={share(d.average)}
                track={`color-mix(in srgb, ${segmentHue(d.id)} 22%, transparent)`}
                animate
              />
              <dt className="mt-3 text-[length:var(--fs-sm)] font-bold text-[var(--fg-1)]">
                {d.title}
                {lowest && <span className="sr-only"> (your lowest score)</span>}
              </dt>
              <dd className="mt-1 flex h-12 items-center">
                {lowest ? (
                  <Annotate mark="circle" color="var(--gk-scribble)" inset="-24%">
                    {figure}
                  </Annotate>
                ) : (
                  figure
                )}
              </dd>
              <dd className="mt-1 text-[length:var(--fs-sm)] font-semibold" style={{ color: LEVEL_INKS[d.level.id] }}>
                {d.level.label}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="-mx-6 px-6 py-8 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10" style={{ background: even ? 'var(--gk-blue-tint)' : weakest.tint }}>
        <p className="max-w-[56ch] text-[length:var(--fs-lg)] leading-relaxed">
          {even ? (
            <>Your scores are even across all four parts. A short call is the quickest way to find where to start.</>
          ) : (
            <>
              Your lowest score is in <strong>{score.weakest.title}</strong>. That is usually the best place to start, and it is what our work on{' '}
              {score.weakest.next.label.toLowerCase()} is for.
            </>
          )}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <GkButton href="#contact" variant="primary" withArrow className="justify-center">
            Talk to us about your results
          </GkButton>
          {!even && (
            <GkButton to={score.weakest.next.to} variant="secondary" className="justify-center">
              See how we help
            </GkButton>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p role="status" className="flex items-center gap-2 text-[length:var(--fs-sm)] text-[var(--fg-1)]">
          {submission.status === 'sending' && 'Sending a copy to your inbox…'}
          {submission.status === 'sent' && (
            <>
              <Scribble name="check" color="var(--gk-scribble)" weight={4} className="size-5 shrink-0" />
              <span>
                We’ve emailed these results to <strong className="text-[var(--gk-ink)]">{email}</strong>.
              </span>
            </>
          )}
          {submission.status === 'saved' && 'Your results are saved, but we couldn’t email a copy just now. Keep this page open or take a screenshot.'}
          {submission.status === 'error' && (
            <span className="text-[var(--gk-coral-ink)]">
              {submission.error}{' '}
              <button type="button" onClick={onRetry} className="font-bold underline">
                Try again
              </button>
            </span>
          )}
        </p>
        <span className="flex flex-wrap items-center gap-x-6">
          <button type="button" onClick={onReview} className={linkClass}>
            Review your answers
          </button>
          <button type="button" onClick={onRestart} className={linkClass}>
            Retake the quiz
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- review */

function ReviewStep({
  answers,
  onChange,
  onBack,
}: {
  answers: Array<Answer | undefined>
  onChange: (index: number, value: Answer) => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <button type="button" onClick={onBack} className={cn(linkClass, '-mt-3 mb-3')}>
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to results
        </button>
        <h2 className={stepHeadingClass}>Your answers.</h2>
        <p className="mt-2 max-w-[52ch] text-[length:var(--fs-base)] text-[var(--fg-1)]">
          Change any of them and the scores update here. The copy we emailed you stays as it was.
        </p>
      </div>
      {domains.map((domain, d) => {
        const hue = DOMAIN_HUES[domain.id]
        return (
          <section key={domain.id} aria-labelledby={`quiz-review-${domain.id}`}>
            <h3
              id={`quiz-review-${domain.id}`}
              className="flex items-center gap-3 text-[length:var(--fs-sm)] font-bold"
              style={{ color: hue.ink }}
            >
              <DomainArc domain={domain.id} size={16} />
              {domain.title}
            </h3>
            <ol className="mt-3 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {statements.map(
                (s, i) =>
                  s.domain === d && (
                    <li key={i} className="grid gap-3 py-4 xl:grid-cols-[1fr_auto] xl:items-center xl:gap-8">
                      <p id={`quiz-review-statement-${i}`} className="text-[length:var(--fs-base)] leading-snug text-[var(--gk-ink)]">
                        {s.text}
                      </p>
                      <ReviewScale index={i} value={answers[i]} hue={hue} onChange={(v) => onChange(i, v)} />
                    </li>
                  ),
              )}
            </ol>
          </section>
        )
      })}
      <div>
        <button type="button" onClick={onBack} className={linkClass}>
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to results
        </button>
      </div>
    </div>
  )
}

function ReviewScale({
  index,
  value,
  hue,
  onChange,
}: {
  index: number
  value: Answer | undefined
  hue: Hue
  onChange: (value: Answer) => void
}) {
  const chosen = likert.find((option) => option.value === value)
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div role="radiogroup" aria-labelledby={`quiz-review-statement-${index}`} className="flex gap-1.5">
        {scale.map((option, i) => (
          <AnswerTile
            key={option.value}
            name={`quiz-review-${index}`}
            number={i + 1}
            label={option.label}
            checked={value === option.value}
            hue={hue}
            size="sm"
            onSelect={() => onChange(option.value)}
          />
        ))}
      </div>
      <span className="w-[9.5rem] text-[length:var(--fs-sm)] font-semibold text-[var(--fg-1)]">{chosen?.label}</span>
    </div>
  )
}
