import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { hero } from "@/content/homepage"
import { GkButton } from "@/components/primitives/gk-button"
import { Spotlight } from "@/components/primitives/spotlight"
import { SpotlightCard } from "@/components/primitives/spotlight-card"
import { TypedPhrase } from "@/components/primitives/typed-phrase"
import { ShapeField } from "@/components/primitives/logo-shapes"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/**
 * The hero.
 *
 * Rebuilt after the review. What changed and why:
 *
 *   · The Ken Burns photography and its 0.84 navy wash are gone. "I'm just
 *     wondering if we should remove this — too much is happening over here."
 *     The ground is now flat navy, the colour the marketing creatives use.
 *     The photography moved down to the numbers band, which is where the
 *     "keep this video in some other component's background below" note sends
 *     it.
 *   · The arc lattice and the floating rings, arcs and half-discs are gone:
 *     "this random circle, this half a circle, this little
 *     semicircle — it's not working here, remove it for now." What replaced
 *     them is the deck's own use of the same geometry: two large fragments
 *     anchored to corners and bleeding off frame, tonal rather than coloured.
 *     See logo-shapes.tsx.
 *   · The spotlight stays. It is the one effect the review singled out as
 *     working: "I like the little hover and style effect you've given."
 *   · The subheader types and backspaces instead of being swept by a marker.
 *   · The case-study card lost its 2px ink outline, its hard offset shadow and
 *     its tilt.
 *
 * And after the 23 Sep review:
 *
 *   · The band is tighter, so the partner wall shows above the fold.
 *   · The headline is set light with the phrase that carries it in bold
 *     italic, matching the "Why we exist" reference; the machine-drawn
 *     underline is gone, as is the handwritten margin note.
 *   · The card is white. "The blue on blue is just looking a little off" -
 *     a white card is what gives the band its depth.
 */
/*
 * "Headline weight to be mildly reduced (I would like to see variations of
 * this banner with weight different)." The default is 500; `?hw=300`, `400`,
 * `600` or `700` on the homepage URL shows the same banner at another weight
 * for the review. Remove once a weight is picked.
 */
const HEADLINE_WEIGHTS = [300, 400, 500, 600, 700]

function useHeadlineWeight() {
  const [weight, setWeight] = useState<number | undefined>(undefined)
  useEffect(() => {
    const asked = Number(new URLSearchParams(window.location.search).get("hw"))
    if (HEADLINE_WEIGHTS.includes(asked)) setWeight(asked)
  }, [])
  return weight
}

export function Hero() {
  const headlineWeight = useHeadlineWeight()

  return (
    <section
      data-ground="navy"
      /* Pulled up under the sticky header so the navy runs to the top of the
         viewport and the header floats on it. 82px is the header's h-20 plus
         its 2px progress rule. */
      className="ground-navy relative isolate -mt-[82px] overflow-hidden accent-yellow"
      style={{ backgroundColor: "var(--gk-navy)" }}
    >
      {/* Fragments of the mark, tonal rather than coloured - the hero is the
          one ground the review asked to keep completely quiet. */}
      <ShapeField variant="hero" />
      <Spotlight />

      {/* "This banner should not cover the entire above-the-fold screen" -
          the padding is sized so the partner heading clears 900px. */}
      <div className="shell relative z-10 grid items-center gap-12 pt-[calc(82px+2.5rem)] pb-14 md:pt-[calc(82px+3rem)] md:pb-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1
            className="display max-w-[22ch] text-white"
            style={headlineWeight ? { fontWeight: headlineWeight } : undefined}
          >
            {hero.headlineLead} <em>{hero.headlineHighlight}</em>
          </h1>

          {/* min-height reserves the tallest rendering of the typed sentence so
              the buttons below never move while it types. */}
          <p className="mt-7 min-h-[4.7em] max-w-[44ch] text-[length:clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.55] font-normal text-white/90 sm:min-h-[3.2em]">
            <TypedPhrase
              lead={hero.typed.lead}
              phrases={hero.typed.phrases}
              tail={hero.typed.tail}
              accent="var(--gk-yellow)"
            />
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <GkButton to={hero.primaryCta.to} variant="accent" onDark withArrow>
              {hero.primaryCta.label}
            </GkButton>
            <GkButton to={hero.secondaryCta.to} variant="secondary" onDark>
              {hero.secondaryCta.label}
            </GkButton>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ProofCard />
        </div>
      </div>
    </section>
  )
}

/**
 * The rotating case-study card.
 *
 * White now, carrying the four things the review listed: an image, a
 * headline, a small tag for the kind of project, and the read-case-study link.
 * It stays prominent on the right - "visitors see evidence of the work as soon
 * as they land."
 */
function ProofCard() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % hero.proofCards.length),
      4600
    )
    return () => window.clearInterval(id)
  }, [reduced, paused])

  const card = hero.proofCards[index]

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="mx-auto max-w-[27rem]"
    >
      <SpotlightCard>
        <article
          className="overflow-hidden rounded-[var(--r-lg)] bg-[var(--gk-white)] text-[var(--gk-ink)] shadow-[0_18px_48px_rgb(12_20_44_/_0.35)]"
          /* A light surface inside a navy band: the link colours are reset
             here so the band's yellow-on-navy link doesn't carry in. */
          style={
            {
              "--link-color": "var(--gk-navy)",
              "--link-color-hover": "var(--gk-navy-deep)",
            } as React.CSSProperties
          }
        >
          <div className="relative aspect-[16/9] bg-[var(--gk-cream-deep)]">
            {hero.proofCards.map((item, i) => (
              <img
                key={item.image}
                src={item.image}
                alt={i === index ? item.imageAlt : ""}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[700ms] ease-[var(--ease-out)]"
                style={{ opacity: i === index ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="px-7 pt-6 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-[var(--gk-yellow-tint)] text-[var(--gk-ink)]">
                {card.tag}
              </span>
              <span className="text-[length:var(--fs-xs)] font-bold tracking-[var(--tracking-label)] text-[var(--gk-navy)] uppercase">
                {card.org}
              </span>
            </div>
            {/* min-height keeps the pager and the link still while the copy
                cross-fades between organisations. */}
            <p className="mt-3 min-h-[4.35em] text-[length:clamp(1.0625rem,1.4vw,1.1875rem)] leading-[1.45] font-semibold text-[var(--gk-navy-deep)]">
              {card.line.value}
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <Link
                to={card.to}
                className="link-cta text-[length:var(--fs-sm)]"
              >
                Read case study
              </Link>

              <ol className="flex gap-1.5" aria-hidden="true">
                {hero.proofCards.map((item, i) => (
                  <li
                    key={item.org}
                    className="h-[3px] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)]"
                    style={{
                      width: i === index ? 22 : 10,
                      background:
                        i === index ? "var(--gk-navy)" : "var(--hairline-strong)",
                    }}
                  />
                ))}
              </ol>
            </div>
          </div>
        </article>
      </SpotlightCard>
    </div>
  )
}
