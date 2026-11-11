import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { hero } from "@/content/homepage"
import { GkButton } from "@/components/primitives/gk-button"
import { Spotlight } from "@/components/primitives/spotlight"
import { SpotlightCard } from "@/components/primitives/spotlight-card"
import { TypedPhrase } from "@/components/primitives/typed-phrase"
import { ShapeField } from "@/components/primitives/logo-shapes"
import { cn } from "@/lib/utils"

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
 *
 * And after the 21 Oct review: new headline and typing line, both buttons
 * scroll to sections on the page, and the case card no longer rotates on its
 * own - see ProofCards.
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
      className="ground-navy relative isolate overflow-hidden accent-yellow"
      style={{ backgroundColor: "var(--gk-navy)" }}
    >
      {/* Fragments of the mark, tonal rather than coloured - the hero is the
          one ground the review asked to keep completely quiet. */}
      <ShapeField variant="hero" />
      <Spotlight />

      {/* "This banner should not cover the entire above-the-fold screen" -
          the padding is sized so the partner heading clears 900px. 23 Oct:
          tightened again - "reduce the height of the hero section a bit". */}
      <div className="shell relative z-10 grid items-center gap-12 pt-8 pb-12 md:pt-9 md:pb-12 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-7">
          <h1
            className="display max-w-[22ch] text-white"
            style={headlineWeight ? { fontWeight: headlineWeight } : undefined}
          >
            {/* Hyphenated words stay whole - "social- / sector" broke across
                lines on narrow phones. */}
            {hero.headlineLead.split(/(\S+-\S+)/).map((part, i) =>
              i % 2 ? (
                <span key={i} className="whitespace-nowrap">
                  {part}
                </span>
              ) : (
                part
              ),
            )}{" "}
            {/* 28 Sep: no underline swash - the italic carries it. */}
            <em>{hero.headlineHighlight}</em>
          </h1>

          {/* min-height reserves the tallest rendering of the typed sentence so
              the buttons below never move while it types: three lines on a
              phone, two from sm up, where the 46ch measure kicks in. 23 Oct:
              it was a line taller than that, which read as a gap above the
              buttons. */}
          <p className="mt-6 min-h-[4.7em] max-w-[46ch] text-[length:clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.55] font-normal text-white/90 sm:min-h-[3.15em]">
            <TypedPhrase
              lead={hero.typed.lead}
              phrases={hero.typed.phrases}
              tail={hero.typed.tail}
              accent="var(--gk-yellow)"
            />
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <GkButton href={hero.primaryCta.to} variant="accent" onDark withArrow>
              {hero.primaryCta.label}
            </GkButton>
            <GkButton href={hero.secondaryCta.to} variant="secondary" onDark>
              {hero.secondaryCta.label}
            </GkButton>
          </div>
        </div>

        {/* min-w-0: the carousel track is three cards wide, and without it the
            grid column grows to fit the whole track. */}
        <div className="min-w-0 lg:col-span-5">
          <ProofCards />
        </div>
      </div>
    </section>
  )
}

const GAP_PX = 24

/**
 * The case cards.
 *
 * 21 Oct: the partner ticker right below and this card were both moving at
 * once - "a little bit like double distraction going on". So nothing here
 * moves on its own any more: one card sits in full and the next one runs off
 * the edge of the screen, and the arrows, the pager or a click on that card
 * move between them. Look and feel are otherwise the approved white card.
 *
 * The next card is cut by the screen edge, never by a box in the middle of
 * the layout - a hard clip beside the card read as broken. Cards already
 * passed fade out rather than being clipped, so they don't slide over the
 * headline and nothing cuts the card's shadow.
 *
 * 10 Nov: each description is written to fill three lines, so on phones the
 * card takes the full column and smaller type instead of leaving room for a
 * peek. Below about 375px that still runs to four.
 * The tag is smaller on phones too, so Peepul's long one stays on one line
 * and every card has the organisation on line two.
 */
function ProofCards() {
  const cards = hero.proofCards
  const [index, setIndex] = useState(0)
  const swipeFrom = useRef<number | null>(null)
  const last = cards.length - 1
  const go = (next: number) => setIndex(Math.min(last, Math.max(0, next)))

  const offset = `calc(${index} * (-1 * var(--card) - ${GAP_PX}px))`

  return (
    <div
      className="w-full max-w-[31rem] lg:mx-auto"
      role="region"
      aria-roledescription="carousel"
      aria-label="Our work"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1)
        if (event.key === "ArrowLeft") go(index - 1)
      }}
    >
      {/* Swipe on touch screens. pan-y leaves vertical scrolling to the page. */}
      <div
        className="touch-pan-y"
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") swipeFrom.current = event.clientX
        }}
        onPointerUp={(event) => {
          if (swipeFrom.current === null) return
          const dx = event.clientX - swipeFrom.current
          swipeFrom.current = null
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
        }}
        onPointerCancel={() => (swipeFrom.current = null)}
      >
        <ol
          className="pointer-events-none flex transition-transform duration-[600ms] ease-[var(--ease-out)] [--card:100%] motion-reduce:transition-none"
          style={{ gap: GAP_PX, transform: `translateX(${offset})` }}
        >
          {cards.map((card, i) => {
            const current = i === index
            return (
              <li
                key={card.org}
                /* The track slides over the headline once it moves, so it
                   takes no clicks itself; only the current and upcoming cards
                   do. Passed cards are invisible and must not catch clicks
                   meant for the buttons underneath. */
                className={cn("shrink-0", i >= index && "pointer-events-auto")}
                style={{ flexBasis: "var(--card)" }}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${cards.length}: ${card.org}`}
                aria-hidden={!current}
              >
                <div
                  className={cn(
                    "h-full transition-opacity duration-[600ms] ease-[var(--ease-out)]",
                    i < index && "opacity-0",
                    i > index && "cursor-pointer",
                  )}
                  onClick={current ? undefined : () => go(i)}
                >
                  <SpotlightCard className="h-full">
                    <article
                      className="h-full overflow-hidden rounded-[var(--r-lg)] bg-[var(--gk-white)] text-[var(--gk-ink)] shadow-[0_16px_36px_rgb(12_20_44_/_0.3)]"
                    >
                      <div className="relative aspect-[2/1] bg-[var(--gk-cream-deep)]">
                        <img
                          src={card.image}
                          alt={card.imageAlt}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>

                      <div className="px-4 pt-5 pb-6 sm:px-6 md:px-7 lg:max-xl:px-5">
                        <span className="chip bg-[var(--gk-yellow-tint)] text-[var(--gk-ink)] max-sm:text-[0.75rem] lg:max-xl:text-[0.8125rem]">
                          {card.tag}
                        </span>
                        <p className="mt-2 text-[length:var(--fs-xs)] font-bold tracking-[var(--tracking-label)] text-[var(--gk-navy)] uppercase">
                          {card.org}
                        </p>
                        <p className="mt-3 text-[0.9375rem] leading-[1.45] font-semibold text-[var(--gk-navy-deep)] sm:text-[length:clamp(1.0625rem,1.4vw,1.1875rem)] lg:max-xl:text-[0.9375rem]">
                          {card.line.value}
                        </p>
                      </div>
                    </article>
                  </SpotlightCard>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <ol className="-ml-1.5 flex items-center">
          {cards.map((card, i) => (
            <li key={card.org}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${card.org}`}
                aria-current={i === index ? "true" : undefined}
                className="grid h-11 min-w-8 place-items-center px-1.5"
              >
                <span
                  className="block h-[3px] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)]"
                  style={{
                    width: i === index ? 22 : 10,
                    background: i === index ? "var(--gk-yellow)" : "rgb(255 255 255 / 0.4)",
                  }}
                />
              </button>
            </li>
          ))}
        </ol>

        <div className="flex gap-2">
          <ArrowButton label="Previous case" disabled={index === 0} onClick={() => go(index - 1)}>
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={2} />
          </ArrowButton>
          <ArrowButton label="Next case" disabled={index === last} onClick={() => go(index + 1)}>
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={2} />
          </ArrowButton>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Showing ${index + 1} of ${cards.length}: ${cards[index].org}. ${cards[index].line.value}`}
      </p>
    </div>
  )
}

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-white/40 text-white transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:border-white hover:bg-white/10 disabled:cursor-default disabled:opacity-35 disabled:hover:border-white/40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}
