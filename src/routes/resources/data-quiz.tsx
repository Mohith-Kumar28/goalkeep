import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { GkButton } from '@/components/primitives/gk-button'
import { ClosingRing } from '@/components/primitives/logo-shapes'
import { Marker } from '@/components/primitives/marker'
import { Reveal } from '@/components/primitives/reveal'
import { DomainArc, ScoredMark, markLabelStyle } from '@/components/primitives/scored-mark'
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
          <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-4">the four parts</p>
              <h2 className="h2 max-w-[18ch] pb-1">
                Four parts, <em>and where each one leads.</em>
              </h2>
            </div>
            <p className="lead max-w-[52ch] lg:col-span-7 lg:self-end">
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
        className="ground-navy accent-yellow relative overflow-hidden py-16 md:py-20"
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
        </div>
        {/* The page closes as every programs and services page does: one
            drawn ring, cropped by the band's corner. */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -bottom-40 hidden lg:block">
          <ClosingRing size={420} />
        </div>
      </section>

      <Contact aside={<QuizContactAside />} />
    </>
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
