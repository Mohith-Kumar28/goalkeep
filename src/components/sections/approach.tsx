import { useEffect, useRef, useState } from 'react'
import { approach, pillars } from '@/content/homepage'
import type { Pillar } from '@/content/types'
import { PhaseAnimation } from '@/components/primitives/phase-animation'
import type { PhaseKind } from '@/components/primitives/phase-animation'
import { Reveal } from '@/components/primitives/reveal'
import { cn } from '@/lib/utils'

/**
 * Our approach - Design, Build, Adopt.
 *
 * This was "what we do" until the 21 Oct review: "this reads more like an
 * approach… it's not really a what we do." It moved below "who we do it for"
 * under a new headline, and each stage gained a one-line heading. The
 * interaction and the illustrations are unchanged.
 *
 * "Nice approach, I can see this working out well — needs tweaks though."
 *
 * Hovering or focusing a stage opens it, and its media plays a sequence.
 * 10 Nov: "a lot going on… with the inverse of colours". The text half is
 * always black on white; only the media half turns navy and animates. On
 * phones the media sits above its text in every row, so the stages read
 * image, text, image, text.
 *
 *   · The three rows were three separate bordered cards with gaps between them.
 *     "This is seeming very blocks right now — block, block, block. Let's make
 *     it a little more seamless." They are now one surface divided by
 *     hairlines, and the open row fills it edge to edge.
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
 * In the open row's media the accent has to survive on navy, which the muted teal
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

export function Approach({ ground = 'ground-cream' }: { ground?: string }) {
  // The first row opens by default. An all-closed section reads as three
  // inert bars and gives no hint that anything here responds.
  const [open, setOpen] = useState(0)

  /*
   * 21 Oct: "I nearly missed it" about the design sticky notes, so the open
   * row's sequence waits until the section's top has come well up the screen.
   * A position, not a visibility ratio: on a phone the section is several
   * screens tall and never gets to half visible.
   *
   * 23 Oct: a phone has no hover, so without a hover-capable pointer
   * whichever row sits across the middle of the screen opens instead.
   *
   * 11 Nov: "some button clicks are being stopped by design/build/adopt
   * animations stopping the scroll". The sequences animate the notes' size
   * and position, a layout on every frame, and they were starting mid-scroll
   * as rows crossed the middle and then running for good, offscreen too,
   * under every tap further down the page. So nothing here changes while the
   * page moves: a row opens, and its sequence starts, only once scrolling has
   * settled, and the sequence stops when the section leaves the screen.
   */
  const ref = useRef<HTMLElement>(null)
  const rows = useRef<Array<HTMLLIElement | null>>([])
  const [live, setLive] = useState(false)

  useEffect(() => {
    const section = ref.current
    if (!section) return
    const noHover = window.matchMedia('(hover: none), (max-width: 767px)')
    let inView = false
    let crossed: number | undefined
    let settle: number | undefined
    const arm = () => {
      window.clearTimeout(settle)
      settle = window.setTimeout(() => {
        if (inView && noHover.matches && crossed !== undefined) setOpen(crossed)
        crossed = undefined
        setLive(inView)
      }, 180)
    }
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (!inView) setLive(false)
        arm()
      },
      { rootMargin: '0px 0px -45% 0px' },
    )
    const rowObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossed = rows.current.indexOf(entry.target as HTMLLIElement)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    sectionObserver.observe(section)
    rows.current.forEach((row) => row && rowObserver.observe(row))
    window.addEventListener('scroll', arm, { passive: true })
    return () => {
      sectionObserver.disconnect()
      rowObserver.disconnect()
      window.removeEventListener('scroll', arm)
      window.clearTimeout(settle)
    }
  }, [])

  return (
    <section
      ref={ref}
      id="our-approach"
      className={`${ground} band accent-blue relative scroll-mt-24`}
      aria-labelledby="approach-heading"
    >
      <div className="shell relative">
        <Reveal>
          <div className="mb-6 md:mb-10">
            <p className="eyebrow mb-4">{approach.eyebrow}</p>
            <h2 id="approach-heading" className="h2 max-w-[34ch]">
              {approach.headline} <em>{approach.headlineTail}</em>
            </h2>
          </div>
        </Reveal>

        {/* One surface, three rows, hairlines between. Not three cards. */}
        <ol className="overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-sm)]">
          {pillars.map((pillar, index) => (
            <PhaseRow
              key={pillar.title}
              rowRef={(node) => {
                rows.current[index] = node
              }}
              pillar={pillar}
              active={open === index}
              playing={open === index && live}
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
  rowRef,
  pillar,
  active,
  playing,
  first,
  flip,
  onOpen,
}: {
  rowRef: (node: HTMLLIElement | null) => void
  pillar: Pillar
  active: boolean
  /** Open, on screen, and the page at rest. See the effect in Approach. */
  playing: boolean
  first: boolean
  /** Media on the left. Every other row, so the stages alternate. */
  flip: boolean
  onOpen: () => void
}) {
  const hue = HUE[pillar.hue]

  return (
    <li
      ref={rowRef}
      className="group relative overflow-hidden bg-[var(--gk-white)] text-[var(--fg-1)]"
      /* 23 Oct: hover opens a row only when the pointer itself moves. A
         "Partner with us" or "Talk to us" scrolls the page under a still
         cursor, and a row opening on that resized the section mid-scroll and
         stopped the page at Adopt. */
      onPointerMove={(event) => {
        if (!active && event.pointerType === 'mouse' && (event.movementX || event.movementY)) onOpen()
      }}
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
          /* Every row holds the open height, so hovering only swaps the
             image's animation and never shifts the layout. */
          'relative grid md:min-h-[22rem] md:grid-cols-12 md:items-stretch',
        )}
      >
        <div
          className={cn(
            'relative z-10 flex flex-col items-start justify-center px-5 pt-4 pb-6 md:col-span-6 md:px-8 md:py-8',
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
              className="stat-figure grid size-10 shrink-0 place-items-center rounded-[var(--r-sm)] text-[length:var(--fs-base)] transition-colors duration-[var(--dur-slow)] md:size-11"
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
            className="mt-4 text-[length:clamp(1.0625rem,1.6vw,1.3125rem)] leading-snug font-bold md:mt-5"
          >
            {pillar.heading}
          </p>

          {/* 28 Sep: wide enough that no row's paragraph leaves one word
              alone on a fifth line. */}
          <p className="mt-2 max-w-[54ch] text-[length:var(--fs-base)] leading-relaxed md:mt-3">
            {pillar.body}
          </p>
        </div>

        {/* The media. A plain photograph in colour, open or closed - no
            dissolve, no greyscale. The open row plays its sequence first and
            then settles on the photographs. 28 Sep: it bleeds to the row's
            edges instead of sitting as an inset box, so each row is half
            text, half picture. */}
        <div
          className={cn(
            'pointer-events-none relative order-first mx-5 mt-5 aspect-[4/3] overflow-hidden [contain:strict] rounded-[var(--r-md)] transition-colors duration-[var(--dur-slow)] sm:aspect-[16/10] md:order-none md:col-span-6 md:m-0 md:aspect-auto md:rounded-none',
          )}
          style={{ background: playing ? 'var(--gk-navy)' : 'var(--gk-cream-deep)' }}
          data-ground={playing ? 'navy' : undefined}
        >
          {playing ? (
            <PhaseAnimation
              kind={hue.kind}
              images={pillar.images}
              active
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
