import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { GkButton } from '@/components/primitives/gk-button'
import { Marker } from '@/components/primitives/marker'
import { Reveal } from '@/components/primitives/reveal'
import { DomainArc, ScoredMark, markLabelStyle } from '@/components/primitives/scored-mark'
import { Contact } from '@/components/sections/contact'
import { Credibility } from '@/components/sections/credibility'
import { DOMAIN_HUES, DataQuiz } from '@/components/sections/data-quiz'
import { domains } from '@/content/quiz'
import type { DomainId } from '@/content/quiz'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export const Route = createFileRoute('/resources/data-quiz')({
  head: () => ({
    meta: [
      { title: 'Data culture quiz — Goalkeep' },
      {
        name: 'description',
        content: 'Twelve statements, about three minutes: a short, honest read on how your organisation actually uses data.',
      },
    ],
  }),
  component: DataQuizPage,
})

const FULL: Record<DomainId, number> = { data: 1, technology: 1, process: 1, strategy: 1 }

/* What each part of the quiz is really asking, in one line. */
const ABOUT: Record<DomainId, string> = {
  data: 'Whether people can reach, use and trust the data they need.',
  technology: 'Whether data lives in one place and reaches people as reports they can read.',
  process: 'Whether collecting, analysing and following data routines is easy and regular.',
  strategy: 'Whether budget, training and clear goals make data use possible for everyone.',
}

function DataQuizPage() {
  return (
    <>
      {/* Pulled up under the sticky header, as the homepage hero is. */}
      <section
        data-ground="navy"
        className="ground-navy accent-yellow relative -mt-[82px] pt-[82px]"
        style={{ backgroundColor: 'var(--gk-navy)' }}
      >
        <div className="shell relative grid items-center gap-12 pt-12 pb-24 md:pt-16 lg:grid-cols-12 lg:pb-28">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-5">data culture quiz</p>
            <h1 className="display max-w-[16ch] pb-1">
              How does your team{' '}
              <em>
                <Marker hue="var(--gk-white)" onDark>
                  actually use data?
                </Marker>
              </em>
            </h1>
            <p className="lead mt-6 max-w-[44ch]">
              Twelve statements across four parts of a data culture. About three minutes, and we’ll email your results to you.
            </p>
            {/* Below desktop the mark has no column of its own: on a phone it
                stands centred over the button, on a tablet beside it. */}
            <div className="mt-9 flex flex-col-reverse items-stretch gap-8 sm:flex-row sm:items-center sm:gap-12">
              <GkButton href="#quiz" variant="accent" onDark withArrow className="justify-center">
                Take the quiz
              </GkButton>
              <ScoredMark fills={FULL} size={128} drawOnMount className="self-center lg:hidden" />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="hidden lg:col-span-5 lg:flex lg:justify-center">
            <div className="relative mt-6">
              <ScoredMark fills={FULL} size={248} drawOnMount />
              {domains.map((d) => (
                <span
                  key={d.id}
                  aria-hidden="true"
                  className="hand-lg absolute whitespace-nowrap"
                  style={{ color: DOMAIN_HUES[d.id].lift, ...markLabelStyle(d.id) }}
                >
                  {d.title.toLowerCase()}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* `flow-root` keeps the card's negative margin from collapsing through
          the section, which would move the cream ground up over the navy
          instead of letting the card overlap it. */}
      <section className="ground-cream-deep relative flow-root pb-16">
        <div className="shell -mt-12 max-w-[76rem]">
          <DataQuiz />
        </div>
      </section>

      <section className="ground-cream band relative">
        <div className="shell">
          <Reveal>
            <h2 className="h2 max-w-[22ch] pb-1">
              Four parts, <em>and where each one leads.</em>
            </h2>
            <p className="lead mt-5 max-w-[52ch]">
              Your lowest-scoring part is usually the best place to start. Each one maps to the work we do.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-12 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {domains.map((d) => (
                <li
                  key={d.id}
                  className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-2 py-7 md:grid-cols-[4.5rem_11rem_1fr_auto] md:gap-x-8"
                >
                  <DomainArc domain={d.id} size={72} className="row-span-3 self-start md:row-span-1 md:self-center" />
                  <h3 className="text-[length:var(--fs-xl)] leading-tight font-bold text-[var(--gk-ink)]">{d.title}</h3>
                  <p className="col-start-2 text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)] md:col-start-auto">
                    {ABOUT[d.id]}
                  </p>
                  <a
                    href={d.next.to}
                    className="group col-start-2 inline-flex items-center gap-2 text-[length:var(--fs-sm)] font-bold whitespace-nowrap text-[var(--gk-navy)] md:col-start-auto"
                  >
                    {d.next.label}
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Credibility ground="ground-cream-deep" />

      <section
        data-ground="navy"
        className="ground-navy accent-yellow relative overflow-hidden py-14 md:py-16"
        aria-labelledby="quiz-closing-heading"
        style={{ backgroundColor: 'var(--gk-navy)' }}
      >
        <div className="shell relative grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal delay={0.12}>
              <h2 id="quiz-closing-heading" className="display max-w-[20ch]">
                Want to talk through <em>your results?</em>
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="lead mt-5 max-w-[44ch]">A short call to read your scores together and decide what to do first.</p>
              <div className="mt-8">
                <GkButton href="#contact" variant="accent" onDark withArrow>
                  Talk to us
                </GkButton>
              </div>
            </Reveal>
          </div>
          <div className="flex justify-center lg:hidden">
            <ScoredMark fills={FULL} size={104} drawOnView />
          </div>
        </div>
        <ClosingArc />
      </section>

      <Contact aside={<QuizContactAside />} />
    </>
  )
}

/*
 * The closing band's one shape: a single large segment of the mark's ring,
 * centred past the band's right edge so it runs off the edge with one round
 * cap showing, drawn in from that cap when the band comes into view. The
 * hero already has the whole mark; this is the mark's line, not the mark.
 */
function ClosingArc() {
  const reduced = useReducedMotion()
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const thickness = 10
  const start = 232
  const sweep = 150
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 100 100"
      className="pointer-events-none absolute top-1/2 right-0 hidden size-[30rem] translate-x-[56%] -translate-y-1/2 overflow-visible lg:block"
    >
      <motion.circle
        cx="50"
        cy="50"
        r={50 - thickness / 2}
        fill="none"
        stroke="var(--gk-yellow)"
        strokeWidth={thickness}
        strokeLinecap="round"
        transform={`rotate(${start - 90} 50 50)`}
        initial={false}
        animate={{ pathLength: inView || reduced ? sweep / 360 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/** The column beside the contact form: who reads the scores with you. */
function QuizContactAside() {
  return (
    <div className="mt-10 hidden lg:block">
      <img
        src="/photos/group-team.webp"
        alt="The Goalkeep team with a partner organisation after a workshop"
        loading="lazy"
        decoding="async"
        className="dissolve-rb aspect-[4/3] w-full object-cover"
      />
    </div>
  )
}
