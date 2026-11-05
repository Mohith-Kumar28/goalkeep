import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { GkButton } from '@/components/primitives/gk-button'
import { ShapeField } from '@/components/primitives/logo-shapes'
import { Reveal } from '@/components/primitives/reveal'
import { Credibility } from '@/components/sections/credibility'
import { DOMAIN_HUES, DataQuiz, DomainRing } from '@/components/sections/data-quiz'
import { domains } from '@/content/quiz'

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

/* Where each label sits around the ring, matching its arc. */
const LABEL_SPOTS = [
  'top-[0%] right-[-16%] rotate-3',
  'right-[-42%] bottom-[16%] -rotate-2',
  'bottom-[2%] left-[-18%] rotate-2',
  'top-[4%] left-[-26%] -rotate-3',
]

function DataQuizPage() {
  return (
    <>
      <section data-ground="navy" className="ground-navy accent-yellow relative overflow-hidden" style={{ backgroundColor: 'var(--gk-navy)' }}>
        <ShapeField variant="hero" />
        <div className="shell relative grid items-center gap-12 pt-12 pb-32 md:pt-16 lg:grid-cols-12 lg:pb-40">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-5">data culture quiz</p>
            <h1 className="display max-w-[16ch] pb-1">
              How does your team <em>actually use data?</em>
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

          <Reveal delay={0.15} className="hidden justify-center lg:col-span-5 lg:flex">
            <div className="relative w-72">
              <DomainRing fills={[1, 1, 1, 1]} className="w-72" />
              {domains.map((d, i) => (
                <span
                  key={d.id}
                  aria-hidden="true"
                  className={`hand-lg absolute ${LABEL_SPOTS[i]}`}
                  style={{ color: DOMAIN_HUES[d.id].lift }}
                >
                  {d.title.toLowerCase()}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="ground-cream-deep relative pb-20 md:pb-28">
        <div className="shell -mt-20 max-w-[76rem] lg:-mt-24">
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
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map((d, i) => {
              const hue = DOMAIN_HUES[d.id]
              return (
                <Reveal as="li" key={d.id} delay={i * 0.07} className="flex flex-col gap-4">
                  <span aria-hidden="true" className="h-1 w-full rounded-full" style={{ background: hue.arc }} />
                  <h3 className="text-[length:var(--fs-2xl)] leading-tight font-extrabold" style={{ color: hue.ink }}>
                    {d.title}
                  </h3>
                  <ul className="flex flex-col gap-2 text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-2)]">
                    {d.statements.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <a
                    href={d.next.to}
                    className="group mt-auto inline-flex items-center gap-2 pt-2 text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)]"
                  >
                    {d.next.label}
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5" />
                  </a>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      <Credibility ground="ground-cream-deep" />
    </>
  )
}
