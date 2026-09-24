import { useEffect, useRef, useState } from 'react'
import { pillars, whatWeDo } from '@/content/homepage'
import type { Pillar } from '@/content/types'
import { PhaseAnimation } from '@/components/primitives/phase-animation'
import type { PhaseKind } from '@/components/primitives/phase-animation'
import { Reveal } from '@/components/primitives/reveal'
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
 *
 * After the 23 Sep review: the hover hint, the handwritten lines and the CTA
 * are gone, and the photographs no longer dissolve into the navy ("it's
 * dulling down the image… losing its vibrancy") - each is a plain, full-colour
 * image with rounded corners. The media alternates sides, left-right-left.
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
          <div className="mb-10 md:mb-14">
            <p className="eyebrow mb-4">{whatWeDo.eyebrow}</p>
            <h2 id="wwd-heading" className="h2 max-w-[28ch]">
              {whatWeDo.headline} <em>{whatWeDo.headlineTail}</em>
            </h2>
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
              flip={index % 2 === 1}
              onOpen={() => setOpen(index)}
            />
          ))}
        </ol>

      </div>
    </section>
  )
}

function PhaseRow({
  pillar,
  active,
  playing,
  first,
  flip,
  onOpen,
}: {
  pillar: Pillar
  active: boolean
  /** Open *and* on screen — see the observer in WhatWeDo. */
  playing: boolean
  first: boolean
  /** Media on the left. Every other row, so the stages alternate. */
  flip: boolean
  onOpen: () => void
}) {
  const hue = HUE[pillar.hue]

  return (
    <li
      className="group relative overflow-hidden transition-colors duration-[var(--dur-slow)] ease-[var(--ease-out)]"
      style={{
        background: active ? 'var(--gk-navy)' : 'var(--gk-white)',
        color: active ? 'var(--fg-inverse)' : 'var(--fg-1)',
      }}
      data-ground={active ? 'navy' : undefined}
      onPointerEnter={onOpen}
      onFocusCapture={onOpen}
    >
      {!first && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 h-px bg-[var(--hairline)]"
        />
      )}

      <div
        className={cn(
          'relative grid gap-6 p-6 md:grid-cols-12 md:items-stretch md:gap-10 md:p-8',
          /* Open and closed heights are fixed so that one open row plus two
             closed ones always sums to the same total - content-height rows
             made the section resize under the pointer. */
          active ? 'md:min-h-[25rem]' : 'md:min-h-[15rem]',
        )}
      >
        <div
          className={cn(
            'relative z-10 flex flex-col justify-center md:col-span-6',
            flip && 'md:order-last',
          )}
        >
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
            <span className="text-[length:clamp(1.5rem,2.6vw,2rem)] leading-tight font-extrabold">
              {pillar.title}
            </span>
          </button>

          <p
            className="mt-5 max-w-[48ch] text-[length:var(--fs-base)] leading-relaxed"
            style={{ color: active ? 'var(--fg-inverse)' : 'var(--fg-1)' }}
          >
            {pillar.body}
          </p>
        </div>

        {/* The media. A plain photograph with rounded corners, in colour,
            open or closed - no dissolve, no greyscale. The open row plays its
            sequence first and then settles on the photographs. */}
        <div
          className={cn(
            'pointer-events-none relative aspect-[16/10] overflow-hidden rounded-[var(--r-md)] md:col-span-6 md:aspect-auto',
          )}
          style={{ background: active ? 'rgb(255 255 255 / 0.05)' : 'var(--gk-cream-deep)' }}
        >
          {active ? (
            <PhaseAnimation
              kind={hue.kind}
              images={pillar.images}
              active={playing}
              ink="var(--fg-inverse)"
              accent={hue.onNavy}
              className="absolute inset-0 h-full w-full rounded-none"
            />
          ) : (
            <img
              src={pillar.images[0].src}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </li>
  )
}
