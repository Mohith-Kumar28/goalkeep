import { createFileRoute } from '@tanstack/react-router'
import { Reveal } from '@/components/primitives/reveal'
import { DataQuiz } from '@/components/sections/data-quiz'

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

function DataQuizPage() {
  return (
    <>
      <section data-ground="navy" className="ground-navy accent-yellow relative" style={{ backgroundColor: 'var(--gk-navy)' }}>
        <div className="shell pt-12 pb-28 md:pt-16 md:pb-32">
          <Reveal className="max-w-[52ch]">
            <p className="eyebrow mb-5">data culture quiz</p>
            <h1 className="display">
              How does your team <em>actually use data?</em>
            </h1>
            <p className="lead mt-6">
              Twelve statements across data, technology, process and strategy. It takes about three minutes, and
              we’ll email your results to you.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="ground-cream-deep relative pb-20 md:pb-28">
        <div className="shell -mt-20 max-w-[60rem]">
          <DataQuiz />
        </div>
      </section>
    </>
  )
}
