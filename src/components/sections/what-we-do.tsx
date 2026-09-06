import { useEffect, useRef, useState } from 'react'
import { pillars, whatWeDo, whatWeDoStat } from '@/content/homepage'
import type { Pillar } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { PhaseAnimation } from '@/components/primitives/phase-animation'
import type { PhaseKind } from '@/components/primitives/phase-animation'
import { Annotate } from '@/components/primitives/doodles'
import { Reveal } from '@/components/primitives/reveal'
import { StatCounter } from '@/components/primitives/stat-counter'
import { cn } from '@/lib/utils'

/**
 * "Nice approach, I can see this working out well — needs tweaks though."
 *
 * The interaction survives the review intact: hovering or focusing a stage
 * inverts it and collapses the two right-hand blocks into one panel that plays
 * a sequence. What changed is everything around it.
 *
 *   · The three rows were three separate bordered cards with gaps between them.
 *     "This is seeming very blocks right now — block, block, block. Let's make
 *     it a little more seamless." They are now one surface divided by
 *     hairlines, and the open row fills it edge to edge.
 *   · Open rows inverted to a saturated teal or coral. "Colours mismatch to
 *     brand." They now invert to navy, which is the brand's own dark ground;
 *     each stage keeps its identity through one accent hue rather than a
 *     full-bleed fill.
 *   · The closed-state photographs had 2px ink borders. Gone — they sit flush,
 *     and the open panel's photographs bleed to its edges.
 *   · The animations themselves were abstract. They are now the two sequences
 *     specced in the review; see phase-animation.tsx.
 */

/**
 * On the inverted row the accent has to survive on navy, which the muted teal
 * and coral do not — hence the -lift values. See tokens.css.
 */
const HUE: Record<
  Pillar['hue'],
  { closed: string; onNavy: string; kind: PhaseKind }
> = {
  blue: { closed: 'var(--gk-blue)', onNavy: 'var(--gk-yellow)', kind: 'design' },
  teal: { closed: 'var(--gk-teal)', onNavy: 'var(--gk-teal-lift)', kind: 'build' },
  coral: { closed: 'var(--gk-coral)', onNavy: 'var(--gk-coral-lift)', kind: 'adopt' },
}

/*
 * The dissolve. Both ramps are deliberately long and multi-stop.
 *
 * A two-stop ramp over a quarter of the panel reads as a strip of gradient
 * sitting on top of a photograph — you can see where it starts and stops. Four
 * stops spread across most of the panel reads as the photograph itself fading
 * out, which is the effect the whole treatment is for.
 */
const DESKTOP_MASK =
  'linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.06) 20%, rgb(0 0 0 / 0.28) 42%, rgb(0 0 0 / 0.66) 68%, rgb(0 0 0 / 0.92) 87%, #000 100%)'

const MOBILE_MASK =
  'linear-gradient(to bottom, transparent 0%, rgb(0 0 0 / 0.18) 14%, rgb(0 0 0 / 0.72) 42%, #000 62%, #000 78%, rgb(0 0 0 / 0.5) 93%, transparent 100%)'

export function WhatWeDo() {
  // The first row opens by default. An all-closed section reads as three
  // inert bars and gives no hint that anything here responds.
  const [open, setOpen] = useState(0)

  /*
   * The open row's sequence only starts once the section is actually on
   * screen. Without this the first row plays its whole animation during page
   * load, several screens above where the visitor is, and has resolved to
   * photographs by the time anyone scrolls down to it — so the one row that is
   * open by default is the one row whose animation nobody ever sees.
   */
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="ground-cream band accent-blue relative"
      aria-labelledby="wwd-heading"
    >
      <div className="shell relative">
        <Reveal>
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4">{whatWeDo.eyebrow}</p>
              <h2 id="wwd-heading" className="h2 max-w-[20ch]">
                {whatWeDo.headline}{' '}
                <span className="font-medium text-[var(--fg-2)]">
                  {whatWeDo.headlineTail}
                </span>
              </h2>
            </div>
            <p className="hand max-w-[24ch] text-[var(--gk-coral-ink)] md:mb-2">
              {whatWeDo.lead}
            </p>
          </div>
        </Reveal>

        {/* One surface, three rows, hairlines between. Not three cards. */}
        <ol className="overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-sm)]">
          {pillars.map((pillar, index) => (
            <PhaseRow
              key={pillar.title}
              pillar={pillar}
              active={open === index}
              playing={open === index && seen}
              first={index === 0}
              onOpen={() => setOpen(index)}
            />
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-start gap-6 rounded-[var(--r-lg)] bg-[var(--gk-cream-deep)] p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <StatCounter
                value={4}
                suffix={' hrs'}
                className="text-[length:clamp(2rem,4vw,2.75rem)] text-[var(--gk-navy)]"
              />
              <span className="max-w-[36ch] text-[length:var(--fs-base)] text-[var(--fg-2)]">
                {whatWeDoStat.value.sentence}
              </span>
            </p>
            <GkButton to={whatWeDo.cta.to} variant="primary" withArrow>
              {whatWeDo.cta.label}
            </GkButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function PhaseRow({
  pillar,
  active,
  playing,
  first,
  onOpen,
}: {
  pillar: Pillar
  active: boolean
  /** Open *and* on screen — see the observer in WhatWeDo. */
  playing: boolean
  first: boolean
  onOpen: () => void
}) {
  const hue = HUE[pillar.hue]

  return (
    <li
      className={cn(
        'group relative overflow-hidden transition-colors duration-[var(--dur-slow)] ease-[var(--ease-out)]',
      )}
      style={{
        background: active ? 'var(--gk-navy)' : 'var(--gk-white)',
        color: active ? 'var(--fg-inverse)' : 'var(--fg-1)',
        borderTopColor: active ? 'transparent' : undefined,
      }}
      data-ground={active ? 'navy' : undefined}
      onPointerEnter={onOpen}
      onFocusCapture={onOpen}
    >
      {/* The divider between rows. A plain border ran straight across the
          photograph bleeding in from the right; this fades out exactly where
          the image stops being transparent. */}
      {!first && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 h-px"
          style={{
            background:
              'linear-gradient(to right, var(--hairline) 0%, var(--hairline) 46%, transparent 72%)',
          }}
        />
      )}

      <div
        className={cn(
          'relative grid gap-6 p-6 md:grid-cols-12 md:gap-10 md:p-9',
          /* Open and closed heights are fixed so that one open row plus two
             closed ones always sums to the same total. Content-height rows
             made the whole section grow and shrink as the pointer moved down
             it, which drags everything below out from under the cursor. */
          active ? 'md:min-h-[23rem]' : 'md:min-h-[15rem]',
        )}
      >
        <div className="relative z-10 md:col-span-7">
          <button
            type="button"
            onClick={onOpen}
            aria-expanded={active}
            className="flex w-full items-center gap-4 text-left"
          >
            <span
              className="stat-figure grid size-11 shrink-0 place-items-center rounded-[var(--r-sm)] text-[length:var(--fs-base)] transition-colors duration-[var(--dur-slow)]"
              style={{
                background: active ? hue.onNavy : 'var(--gk-cream-deep)',
                color: active ? 'var(--gk-ink)' : 'var(--gk-navy)',
              }}
            >
              {pillar.index}
            </span>
            <span className="h2 text-[length:clamp(1.5rem,2.6vw,2rem)]">
              {pillar.title}
            </span>
          </button>

          <p
            className="mt-5 max-w-[48ch] text-[length:var(--fs-base)] leading-relaxed"
            style={{ color: active ? 'var(--fg-inverse-2)' : 'var(--fg-2)' }}
          >
            {pillar.body}
          </p>

          {/* The handwritten aside — the device the review explicitly keeps.
              White text with the circle in the stage accent: the hue itself is
              not readable at text size on navy, the ring around it is. */}
          <div
            className="grid transition-[grid-template-rows,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out)]"
            style={{
              gridTemplateRows: active ? '1fr' : '0fr',
              opacity: active ? 1 : 0,
            }}
          >
            {/* The colours track `active` rather than being hardcoded white.
                A closed row is collapsed to 0fr and invisible, but its text is
                still in the DOM on a white ground — hardcoding white there is
                white-on-white, which the contrast audit is right to fail. */}
            <div className="overflow-hidden">
              <p
                className="hand-lg mt-7 max-w-[26ch]"
                style={{ color: active ? 'var(--fg-inverse)' : 'var(--fg-1)' }}
              >
                <Annotate
                  mark="oval"
                  color={active ? hue.onNavy : hue.closed}
                  delay={0.35}
                  inset="-9%"
                >
                  {pillar.handwritten}
                </Annotate>
              </p>
              {pillar.marginalia && (
                <p
                  className="hand mt-7"
                  style={{ color: active ? 'rgb(255 255 255 / 0.6)' : 'var(--fg-2)' }}
                >
                  {pillar.marginalia}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* The media track.

            Open and closed now get the *same* treatment, which is what makes
            the section read as one component: a single photograph running the
            full height of the row, bleeding off its right edge, dissolving
            leftward into the ground. Closed rows are greyscale and dimmed;
            the open row is in colour and plays its sequence.

            It used to be two small thumbnails side by side when closed, which
            put the boxed look the review objected to straight back on two of
            the three rows.

            The dissolve is applied to the photographs only - see the note on
            DESKTOP_MASK above. */}
        <div className="md:col-span-5">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] md:block">
            {active ? (
              <PhaseAnimation
                kind={hue.kind}
                images={pillar.images}
                active={playing}
                ink="var(--fg-inverse)"
                accent={hue.onNavy}
                photoMask={DESKTOP_MASK}
                className="h-full w-full rounded-none"
              />
            ) : (
              <img
                src={pillar.images[0].src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-55 grayscale transition-[opacity,filter] duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:opacity-80"
                style={{ maskImage: DESKTOP_MASK, WebkitMaskImage: DESKTOP_MASK }}
              />
            )}
          </div>

          {/* Below md the row is a single column, so the media is inline and
              bleeds to the row's own edges instead of to the right. */}
          <div className="pointer-events-none relative -mx-6 -mb-6 mt-2 aspect-[16/10] w-[calc(100%+3rem)] md:hidden">
            {active ? (
              <PhaseAnimation
                kind={hue.kind}
                images={pillar.images}
                active={playing}
                ink="var(--fg-inverse)"
                accent={hue.onNavy}
                photoMask={MOBILE_MASK}
                className="h-full w-full rounded-none"
              />
            ) : (
              <img
                src={pillar.images[0].src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-55 grayscale"
                style={{ maskImage: MOBILE_MASK, WebkitMaskImage: MOBILE_MASK }}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
