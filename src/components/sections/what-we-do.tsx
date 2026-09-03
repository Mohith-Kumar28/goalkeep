import { useState } from 'react'
import { pillars, whatWeDo, whatWeDoStat } from '@/content/homepage'
import type { Pillar } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { PhaseAnimation } from '@/components/primitives/phase-animation'
import type { PhaseKind } from '@/components/primitives/phase-animation'
import { Annotate, Scribble } from '@/components/primitives/doodles'
import { PatternField } from '@/components/primitives/shapes'
import { Reveal } from '@/components/primitives/reveal'
import { StatCounter } from '@/components/primitives/stat-counter'
import { cn } from '@/lib/utils'

/**
 * "Can we have an interactive-sort of layout for this? If someone hovers on
 * the build section, invert that section's colours and make the two blocks on
 * the right into one."
 *
 * That is exactly what this does. Three rows; opening one floods it with the
 * stage's hue, collapses the two right-hand blocks into a single panel, and
 * plays a short sequence in it before resolving to two photographs. The
 * handwritten line — the Whole Truth Foods device from the brief — lands
 * inside the open panel with a circle drawn round it.
 *
 * Opening is on hover *and* focus *and* click: hover alone would make the
 * whole section unreachable by keyboard and dead on a phone.
 */

const HUE: Record<
  Pillar['hue'],
  { fill: string; on: string; ink: string; kind: PhaseKind }
> = {
  // On blue the foreground has to be white; on teal and coral it has to be
  // ink. Every one of these pairs clears 5:1.
  blue: { fill: 'var(--gk-blue)', on: '#ffffff', ink: 'var(--gk-blue)', kind: 'design' },
  teal: { fill: 'var(--gk-teal)', on: 'var(--gk-ink)', ink: 'var(--gk-teal-ink)', kind: 'build' },
  coral: { fill: 'var(--gk-coral)', on: 'var(--gk-ink)', ink: 'var(--gk-coral-ink)', kind: 'adopt' },
}

export function WhatWeDo() {
  // The first row opens by default. An all-closed section reads as three
  // inert bars and gives no hint that anything here responds.
  const [open, setOpen] = useState(0)

  return (
    <section className="ground-cream band accent-blue relative" aria-labelledby="wwd-heading">
      <PatternField pattern="dots" color="var(--gk-ink)" opacity={0.05} scale={30} />

      <div className="shell relative">
        <Reveal>
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">{whatWeDo.eyebrow}</p>
              <h2 id="wwd-heading" className="h2 max-w-[18ch]">
                {whatWeDo.headline}{' '}
                {/* A hue, not a grey. "The grey text not working the best"
                    was the first line of the feedback. */}
                <span className="text-[var(--gk-blue)]">{whatWeDo.headlineTail}</span>
              </h2>
            </div>
            <p className="hand max-w-[22ch] -rotate-2 text-[var(--gk-coral-ink)] md:mb-2">
              {whatWeDo.lead}
            </p>
          </div>
        </Reveal>

        <ol className="flex flex-col gap-4">
          {pillars.map((pillar, index) => (
            <PhaseRow
              key={pillar.title}
              pillar={pillar}
              active={open === index}
              onOpen={() => setOpen(index)}
            />
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="card-pop mt-10 flex flex-col items-start gap-6 rounded-[var(--r-lg)] bg-[var(--gk-navy)] p-8 text-white md:flex-row md:items-center md:justify-between md:p-10">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <StatCounter
                value={4}
                suffix={"\u00A0hrs"}
                className="text-[length:clamp(2.5rem,6vw,4rem)] text-[var(--gk-yellow)]"
              />
              <span className="max-w-[34ch] text-[length:var(--fs-lg)] font-semibold">
                {whatWeDoStat.value.sentence}
              </span>
            </p>
            <GkButton to={whatWeDo.cta.to} variant="primary" onDark withArrow>
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
  onOpen,
}: {
  pillar: Pillar
  active: boolean
  onOpen: () => void
}) {
  const hue = HUE[pillar.hue]

  return (
    <li>
      <div
        onPointerEnter={onOpen}
        onFocusCapture={onOpen}
        className={cn(
          'group relative overflow-hidden rounded-[var(--r-lg)] border-2 border-[var(--gk-ink)]',
          'transition-[background-color,color,box-shadow,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)]',
          active ? 'shadow-[var(--shadow-pop)]' : 'shadow-[var(--shadow-pop-sm)]',
        )}
        style={{
          background: active ? hue.fill : 'var(--gk-white)',
          color: active ? hue.on : 'var(--gk-ink)',
        }}
      >
        <div className="grid gap-6 p-6 md:grid-cols-12 md:gap-8 md:p-8">
          <div className="md:col-span-7">
            <button
              type="button"
              onClick={onOpen}
              aria-expanded={active}
              className="flex w-full items-center gap-4 text-left"
            >
              <span
                className="stat-figure grid size-14 shrink-0 place-items-center rounded-full border-2 text-[length:var(--fs-lg)] transition-colors duration-[var(--dur-slow)]"
                style={{
                  borderColor: active ? hue.on : 'var(--gk-ink)',
                  background: active ? 'transparent' : hue.fill,
                  color: active ? hue.on : hue.fill === 'var(--gk-blue)' ? '#ffffff' : 'var(--gk-ink)',
                }}
              >
                {pillar.index}
              </span>
              <span className="h2 text-[length:clamp(1.75rem,3.4vw,2.75rem)]">
                {pillar.title}
              </span>
              {!active && (
                <Scribble
                  name="arrow-hook"
                  color={hue.ink}
                  className="ml-auto hidden h-6 w-12 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block"
                />
              )}
            </button>

            <p
              className="mt-5 max-w-[46ch] text-[length:var(--fs-lg)]"
              style={{ opacity: active ? 1 : 0.82 }}
            >
              {pillar.body}
            </p>

            {/* The handwritten aside. Only in the open state — three of these
                showing at once would be a wall of handwriting. */}
            <div
              className="grid transition-[grid-template-rows,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out)]"
              style={{
                gridTemplateRows: active ? '1fr' : '0fr',
                opacity: active ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <p className="hand-lg mt-6 max-w-[24ch] -rotate-1">
                  <Annotate
                    mark="oval"
                    color={active ? hue.on : hue.ink}
                    delay={0.35}
                    inset="-9%"
                  >
                    {pillar.handwritten}
                  </Annotate>
                </p>
                {pillar.marginalia && (
                  <p className="hand mt-8 opacity-70">{pillar.marginalia}</p>
                )}
              </div>
            </div>
          </div>

          {/* The right-hand track. Two blocks when closed; one panel when open. */}
          <div className="md:col-span-5">
            {active ? (
              <PhaseAnimation
                kind={hue.kind}
                images={pillar.images}
                active
                ink={hue.on}
                className="aspect-[4/3] w-full border-2 border-current"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {pillar.images.map((image) => (
                  <img
                    key={image.src}
                    src={image.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-[var(--r-sm)] border-2 border-[var(--gk-ink)] object-cover opacity-70 transition-opacity duration-[var(--dur-base)] group-hover:opacity-100"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
