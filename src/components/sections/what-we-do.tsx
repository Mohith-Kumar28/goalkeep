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

const MOBILE_MASK =
  'linear-gradient(to bottom, transparent 0%, rgb(0 0 0 / 0.55) 12%, #000 34%, #000 68%, rgb(0 0 0 / 0.55) 88%, transparent 100%)'

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
        !first && 'border-t border-[var(--hairline)]',
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
      <div className="relative grid gap-6 p-6 md:min-h-[22rem] md:grid-cols-12 md:gap-10 md:p-9">
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

        {/* The right-hand track. Two blocks when closed; one panel when open.

            "The images blending into the website is seeming more of a forced
            fit… rather than seamlessly integrating into the UI." So when the
            row opens, its media is not a card sitting inside the padding — it
            fills the right of the row edge to edge and dissolves leftward into
            the navy, which is the treatment agreed in the call: "keep that
            image as a background for the right side of the main card itself,
            so there won't be another box, and it slowly fades away to the
            blue." */}
        <div className="md:col-span-5">
          {active ? (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-[50%] md:block"
                /* The mask, not an overlay: it dissolves the sketch's own
                   board and grid as well as the photographs, so the panel has
                   no hard left edge in either stage. */
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.62) 15%, #000 42%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.62) 15%, #000 42%)',
                }}
              >
                <PhaseAnimation
                  kind={hue.kind}
                  images={pillar.images}
                  active={playing}
                  ink="var(--fg-inverse)"
                  accent={hue.onNavy}
                  className="h-full w-full rounded-none"
                />
              </div>
              {/* Below md the row is a single column, so the panel is inline
                  and bleeds to the bottom edge instead of the right. */}
              <PhaseAnimation
                kind={hue.kind}
                images={pillar.images}
                active={playing}
                ink="var(--fg-inverse)"
                accent={hue.onNavy}
                /* Full-bleed to the row's edges on a phone, and dissolving at
                   top and bottom, so it reads as part of the row rather than a
                   photograph dropped into the padding. */
                className="-mx-6 -mb-6 aspect-[4/3] w-[calc(100%+3rem)] rounded-none md:hidden"
                style={{
                  maskImage: MOBILE_MASK,
                  WebkitMaskImage: MOBILE_MASK,
                }}
              />
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {pillar.images.map((image) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full rounded-[var(--r-sm)] object-cover opacity-60 grayscale transition-[opacity,filter] duration-[var(--dur-base)] group-hover:opacity-100 group-hover:grayscale-0"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
