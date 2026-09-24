import { proof } from '@/content/homepage'
import { StatCounter } from '@/components/primitives/stat-counter'
import { Reveal } from '@/components/primitives/reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * The numbers, in one place.
 *
 * This is where the hero's photography went. "Let's remove the background from
 * here and keep a simple solid blue colour like in the marketing materials,
 * and keep this video in some other component's background below" — below is
 * here. It sits at 0.16 behind a navy band whose only content is four figures,
 * so there is no text fighting it for legibility, which was the objection to
 * having it behind the headline.
 *
 * The ring pattern, the floating shapes and the hand-drawn zigzag that used to
 * decorate this band are gone with the rest of them.
 *
 * 23 Sep: "can we have the video BTS playing here instead of static images" -
 * teaching, facilitation, working with organisations. public/video/bts is
 * ~26s of b-roll cut from the two Data Literacy Programme films (no talking
 * heads, burned-in subtitles cropped off), silent and looped. Under reduced
 * motion it is the poster frame and nothing moves.
 */
const HUES = [
  'var(--gk-yellow)',
  'var(--gk-teal-lift)',
  'var(--gk-coral-lift)',
  'var(--gk-yellow)',
]

export function Proof() {
  const reduced = useReducedMotion()

  return (
    <section
      data-ground="navy"
      className="ground-navy band accent-yellow relative overflow-hidden"
      aria-labelledby="proof-heading"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {reduced ? (
          <img src="/video/bts-poster.jpg" alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/video/bts-poster.jpg"
          >
            <source src="/video/bts.webm" type="video/webm" />
            <source src="/video/bts.mp4" type="video/mp4" />
          </video>
        )}
        {/* Lighter than the photographs' 0.84 - footage has to read as
            footage - but still enough for the figures to sit on. */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgb(47 74 146 / 0.78)' }}
        />
      </div>

      <div className="shell relative">
        <Reveal>
          <p className="eyebrow mb-4 text-[var(--gk-yellow)]">{proof.eyebrow}</p>
          <h2 id="proof-heading" className="h2 mb-12 max-w-[20ch] font-medium">
            {proof.headline}
          </h2>
        </Reveal>

        <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {proof.stats.map((stat, index) => (
            <Reveal as="li" key={stat.value.sentence} delay={index * 0.08}>
              <StatCounter
                value={stat.value.figure}
                suffix={stat.value.suffix}
                className="text-[length:clamp(2.5rem,5vw,3.5rem)]"
                style={{ color: HUES[index] }}
              />
              <p className="mt-4 max-w-[24ch] text-[length:var(--fs-base)] leading-snug text-white/85">
                {stat.value.sentence}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
