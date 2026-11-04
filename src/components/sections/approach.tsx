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

export function Approach() {
  // The first row opens by default. An all-closed section reads as three
  // inert bars and gives no hint that anything here responds.
  const [open, setOpen] = useState(0)

  /*
   * The open row's sequence only starts once the section is actually on
   * screen. Without this the first row plays its whole animation during page
   * load, several screens above where the visitor is, and has resolved to
   * photographs by the time anyone scrolls down to it — so the one row that is
   * open by default is the one row whose animation nobody ever sees.
   *
   * 21 Oct: "I nearly missed it" about the design sticky notes - so it
   * waits until the section's top has come well up the screen and the
   * visitor has stopped scrolling, and the panel returns to its sketch after
   * the photographs (see phase-animation.tsx). A position, not a visibility
   * ratio: on a phone the section is several screens tall and never gets to
   * half visible.
   */
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    /* Starts once the section is in place *and* scrolling has stopped. The
       sticky notes animate their size and position, and starting that in the
       middle of a smooth scroll (a "Our approach" link) cut the scroll short.
       It also means the sketch plays from the top while someone is actually
       looking at it. */
    let settle: number | undefined
    let inView = false
    const arm = () => {
      window.clearTimeout(settle)
      settle = window.setTimeout(() => {
        if (!inView) return
        setSeen(true)
        observer.disconnect()
        window.removeEventListener('scroll', arm)
      }, 180)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) arm()
      },
      { rootMargin: '0px 0px -45% 0px' },
    )
    observer.observe(node)
    window.addEventListener('scroll', arm, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', arm)
      window.clearTimeout(settle)
    }
  }, [])

  /*
   * 23 Oct: a phone has no hover, so Build and Adopt never opened unless
   * someone thought to tap their titles - and their sequences went unseen.
   * Without a hover-capable pointer, whichever row crosses the middle of the
   * screen opens instead, so each stage plays as it is scrolled to. Open and
   * closed rows are the same height below md, so this never resizes the
   * section under the scroll.
   */
  const rows = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    const query = window.matchMedia('(hover: none), (max-width: 767px)')
    let observer: IntersectionObserver | undefined
    const sync = () => {
      observer?.disconnect()
      observer = undefined
      if (!query.matches) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const index = rows.current.indexOf(entry.target as HTMLLIElement)
            if (index >= 0) setOpen(index)
          }
        },
        { rootMargin: '-45% 0px -45% 0px' },
      )
      rows.current.forEach((row) => row && observer?.observe(row))
    }
    sync()
    query.addEventListener('change', sync)
    return () => {
      observer?.disconnect()
      query.removeEventListener('change', sync)
    }
  }, [])

  return (
    <section
      ref={ref}
      id="our-approach"
      className="ground-cream band accent-blue relative scroll-mt-24"
      aria-labelledby="approach-heading"
    >
      <div className="shell relative">
        <Reveal>
          <div className="mb-8 md:mb-10">
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
      ref={rowRef}
      className="group relative overflow-hidden transition-colors duration-[var(--dur-slow)] ease-[var(--ease-out)]"
      style={{
        background: active ? 'var(--gk-navy)' : 'var(--gk-white)',
        color: active ? 'var(--fg-inverse)' : 'var(--fg-1)',
      }}
      data-ground={active ? 'navy' : undefined}
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
          'relative grid md:grid-cols-12 md:items-stretch',
          /* Open and closed heights are fixed so that one open row plus two
             closed ones always sums to the same total - content-height rows
             made the section resize under the pointer. Both came down on 28
             Sep ("tighter, less empty space"). */
          active ? 'md:min-h-[22rem]' : 'md:min-h-[12rem]',
        )}
      >
        <div
          className={cn(
            'relative z-10 flex flex-col justify-center p-6 md:col-span-6 md:px-8 md:py-8',
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
            className="mt-5 text-[length:clamp(1.125rem,1.6vw,1.3125rem)] leading-snug font-bold"
            style={{ color: active ? hue.onNavy : 'var(--fg-1)' }}
          >
            {pillar.heading}
          </p>

          <p
            /* 28 Sep: wide enough that no row's paragraph leaves one word
               alone on a fifth line. */
            className="mt-3 max-w-[54ch] text-[length:var(--fs-base)] leading-relaxed"
            style={{ color: active ? 'var(--fg-inverse)' : 'var(--fg-1)' }}
          >
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
            'pointer-events-none relative mx-6 mb-6 aspect-square overflow-hidden sm:aspect-[16/10] rounded-[var(--r-md)] md:col-span-6 md:m-0 md:aspect-auto md:rounded-none',
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
