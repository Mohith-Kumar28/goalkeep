import { proof } from '@/content/homepage'
import { StatCounter } from '@/components/primitives/stat-counter'
import { Scribble } from '@/components/primitives/doodles'
import { FloatingField, PatternField } from '@/components/primitives/shapes'
import { Reveal } from '@/components/primitives/reveal'

/**
 * The numbers, in one place.
 *
 * These were previously scattered — 73% in the hero panel, 4 hrs at the foot
 * of what-we-do, the org count in the ticker line. Collecting them buys a
 * navy band between two light ones and lets each figure count itself up, which
 * is far more persuasive than the same number sitting still in a paragraph.
 */
const HUES = [
  'var(--gk-yellow)',
  'var(--gk-teal)',
  'var(--gk-coral)',
  'var(--gk-yellow)',
]

export function Proof() {
  return (
    <section
      data-ground="navy"
      className="ground-navy band accent-yellow relative overflow-hidden"
      aria-labelledby="proof-heading"
    >
      <PatternField pattern="rings" color="#ffffff" opacity={0.08} scale={72} />
      <FloatingField variant="b" />

      <div className="shell relative">
        <Reveal>
          <div className="mb-12 flex items-end gap-4">
            <div>
              <p className="eyebrow mb-3">{proof.eyebrow}</p>
              <h2 id="proof-heading" className="h2">
                {proof.headline}
              </h2>
            </div>
            <Scribble
              name="zigzag"
              color="var(--gk-yellow)"
              className="mb-3 hidden h-5 w-32 md:block"
            />
          </div>
        </Reveal>

        <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {proof.stats.map((stat, index) => (
            <Reveal as="li" key={stat.value.sentence} delay={index * 0.08}>
              <StatCounter
                value={stat.value.figure}
                suffix={stat.value.suffix}
                className="text-[length:clamp(3rem,7vw,4.75rem)]"
                style={{ color: HUES[index] }}
              />
              <p className="mt-4 max-w-[22ch] text-[length:var(--fs-lg)] font-semibold leading-snug text-white">
                {stat.value.sentence}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
