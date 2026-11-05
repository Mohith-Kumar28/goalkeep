import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { GkButton } from '@/components/primitives/gk-button'
import { MarkAssembly } from '@/components/primitives/logo-shapes'
import { Marker } from '@/components/primitives/marker'
import { Reveal } from '@/components/primitives/reveal'
import { ScoredMark, markLabelStyle } from '@/components/primitives/scored-mark'
import { Contact } from '@/components/sections/contact'
import { Credibility } from '@/components/sections/credibility'
import { DOMAIN_HUES, DataQuiz } from '@/components/sections/data-quiz'
import { domains } from '@/content/quiz'
import type { DomainId } from '@/content/quiz'

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
      <section data-ground="navy" className="ground-navy accent-yellow relative" style={{ backgroundColor: 'var(--gk-navy)' }}>
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
            <div className="mt-9">
              <GkButton href="#quiz" variant="accent" onDark withArrow>
                Take the quiz
              </GkButton>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="hidden lg:col-span-5 lg:flex lg:justify-center">
            <div className="relative mt-6">
              <ScoredMark fills={FULL} size={248} />
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

      <section className="ground-cream-deep relative pb-20 md:pb-28">
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
            <p className="lead mt-5 max-w-[54ch]">
              Your lowest-scoring part is usually the best place to start. Each one maps to the work we do.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-12 divide-y divide-[var(--hairline)] overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-sm)]">
              {domains.map((d) => {
                const hue = DOMAIN_HUES[d.id]
                return (
                  <li key={d.id} className="grid gap-3 px-6 py-6 md:grid-cols-[10rem_1fr_auto] md:items-center md:gap-8 md:px-8">
                    <h3 className="flex items-center gap-3 text-[length:var(--fs-lg)] leading-tight font-extrabold text-[var(--gk-ink)]">
                      <span aria-hidden="true" className="h-[3px] w-4 shrink-0 rounded-full" style={{ background: hue.arc }} />
                      {d.title}
                    </h3>
                    <p className="text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">{ABOUT[d.id]}</p>
                    <a
                      href={d.next.to}
                      className="group inline-flex items-center gap-2 text-[length:var(--fs-sm)] font-bold whitespace-nowrap text-[var(--gk-navy)]"
                    >
                      {d.next.label}
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5" />
                    </a>
                  </li>
                )
              })}
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
            <div className="mt-10 flex justify-center lg:hidden">
              <MarkAssembly settled size={110} />
            </div>
          </div>
          <div className="hidden lg:col-span-4 lg:flex lg:items-center lg:justify-center">
            <MarkAssembly settled size={150} />
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}
