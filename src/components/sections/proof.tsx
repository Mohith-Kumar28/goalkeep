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
      {/* Phones get the footage as a landscape block between the headline
          and the figures (10 Nov: "a landscape view… rather than a vertical
          thing"), and the figures two to a row. From md up it is the band's
          background again: the shell is static there, so this positions
          against the section. */}
      <div className="shell flex flex-col">
        <Reveal className="relative z-[1]">
          <p className="eyebrow mb-4 text-[var(--gk-yellow)]">{proof.eyebrow}</p>
          <h2 id="proof-heading" className="h2 mb-6 max-w-[34ch] font-medium md:mb-10">
            {/* 28 Sep: plain. The yellow emphasis marks came off with the
                rest of the page's circles, underlines and highlights. */}
            {proof.headline}
          </h2>
        </Reveal>

        <div
          className="relative mb-8 aspect-video overflow-hidden rounded-[var(--r-md)] md:absolute md:inset-0 md:mb-0 md:aspect-auto md:rounded-none"
          aria-hidden="true"
        >
          {reduced ? (
            <img src="/video/bts-poster.jpg" alt="" className="h-full w-full object-cover" />
          ) : (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
              preload="metadata"
              /* 28 Sep: `loop` stopped after one pass in some browsers, so the
                 rewind is done here - `ended` always fires without `loop`. The
                 mp4 goes first because its index makes the seek back to 0
                 dependable. */
              onEnded={(event) => {
                event.currentTarget.currentTime = 0
                void event.currentTarget.play()
              }}
              poster="/video/bts-poster.jpg"
            >
              <source src="/video/bts.mp4" type="video/mp4" />
              <source src="/video/bts.webm" type="video/webm" />
            </video>
          )}
          {/* Lighter than the photographs' 0.84 - footage has to read as
              footage - but still enough for the figures to sit on. */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{ backgroundColor: 'rgb(47 74 146 / 0.78)' }}
          />
        </div>

        <ol className="relative z-[1] grid grid-cols-2 gap-x-5 gap-y-7 md:gap-x-8 md:gap-y-12 lg:grid-cols-4">
          {proof.stats.map((stat, index) => (
            <Reveal as="li" key={stat.value.sentence} delay={index * 0.08}>
              <StatCounter
                value={stat.value.figure}
                suffix={stat.value.suffix}
                className="text-[length:clamp(2rem,5vw,3.5rem)]"
                style={{ color: HUES[index] }}
              />
              <p className="mt-2 max-w-[24ch] text-[length:var(--fs-sm)] leading-snug text-white/85 md:mt-4 md:text-[length:var(--fs-base)]">
                {stat.value.sentence}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
