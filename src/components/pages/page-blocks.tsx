import { ArrowRight, Check, Clock } from 'lucide-react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { audiences } from '@/content/homepage'
import type { Block, Heading, Page, Step, Story } from '@/content/pages'
import type { AudienceId, Cta } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { MarkAssembly } from '@/components/primitives/logo-shapes'
import { ProgramVisual } from '@/components/primitives/program-visuals'
import { Reveal } from '@/components/primitives/reveal'
import { StatCounter } from '@/components/primitives/stat-counter'
import { Contact } from '@/components/sections/contact'
import { Faqs } from '@/components/sections/faqs'
import { cn } from '@/lib/utils'

/**
 * Renders a programs or services page from its blocks.
 *
 * Grounds are decided here, not in content. The hero, the figures and the
 * close are navy, the FAQ is the homepage's pale yellow, and everything else
 * alternates white and the light-blue highlight, so two adjacent bands never
 * share a ground however a page is ordered. Every page ends on the contact
 * form, which is where each of its buttons lands.
 */
export function PageView({ page }: { page: Page }) {
  return (
    <>
      <Blocks blocks={page.blocks} />
      <Contact defaultService={page.contactService} />
    </>
  )
}

const LIGHT = ['ground-cream', 'ground-cream-deep'] as const

function Blocks({ blocks, startTone = 0 }: { blocks: Array<Block>; startTone?: number }) {
  let tone = startTone
  return blocks.map((block, index) => {
    const ground = LIGHT[tone % 2]
    if (!SELF_GROUNDED.has(block.kind)) tone += 1
    return <BlockView key={index} block={block} ground={ground} tone={tone} />
  })
}

const SELF_GROUNDED = new Set<Block['kind']>(['hero', 'stats', 'faq', 'closing', 'audienceSwitch'])

function BlockView({ block, ground, tone }: { block: Block; ground: string; tone: number }) {
  switch (block.kind) {
    case 'hero':
      return <Hero block={block} />
    case 'prose':
      return <Prose block={block} ground={ground} />
    case 'checklist':
      return <Checklist block={block} ground={ground} />
    case 'steps':
      return <Steps block={block} ground={ground} />
    case 'deliverables':
      return <Deliverables block={block} ground={ground} />
    case 'outcomes':
      return <Outcomes block={block} ground={ground} />
    case 'stats':
      return <Stats block={block} />
    case 'stories':
      return <Stories block={block} ground={ground} />
    case 'testimonial':
      return (
        <Band ground={ground}>
          <Testimonial audience={block.audience} />
        </Band>
      )
    case 'faq':
      return <Faqs headline={block.headline.lead} headlineEm={block.headline.em} items={block.items} />
    case 'programs':
      return <Programs block={block} ground={ground} />
    case 'audienceSwitch':
      return <AudienceSwitch block={block} tone={tone} />
    case 'closing':
      return <Closing block={block} />
  }
}

type Of<TKind extends Block['kind']> = Extract<Block, { kind: TKind }>

function Band({
  ground,
  accent = 'accent-blue',
  children,
  className,
}: {
  ground: string
  accent?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn(ground, accent, 'band relative', className)}>
      <div className="shell">{children}</div>
    </section>
  )
}

function Title({ heading, as: As = 'h2', className }: { heading: Heading; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <As className={cn(As === 'h1' ? 'display' : 'h2', className)}>
      {heading.lead}
      {heading.em && (
        <>
          {' '}
          <em>{heading.em}</em>
        </>
      )}
    </As>
  )
}

/** Eyebrow and heading, the opener every band shares. */
function Opener({ eyebrow, heading, className }: { eyebrow: string; heading: Heading; className?: string }) {
  return (
    <Reveal className={className}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <Title heading={heading} className="max-w-[22ch]" />
    </Reveal>
  )
}

/** In-page CTAs scroll to the form; anything else is a route. */
function CtaButton({ cta, ...rest }: { cta: Cta } & Omit<Parameters<typeof GkButton>[0], 'children' | 'to' | 'href'>) {
  const target = cta.to.startsWith('#') ? { href: cta.to } : { to: cta.to }
  return (
    <GkButton {...target} {...rest}>
      {cta.label}
    </GkButton>
  )
}

/* ---------------------------------------------------------------- hero */

/**
 * Flat navy, like the homepage hero, with the photograph bled off the right
 * edge and dissolving into the panel rather than sitting in a frame.
 */
function Hero({ block }: { block: Of<'hero'> }) {
  return (
    <section
      data-ground="navy"
      className="ground-navy relative overflow-hidden accent-yellow"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <div
        className="photo-bleed photo-bleed-b photo-bleed-lg-x relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[44%]"
        aria-hidden="true"
      >
        <img src={block.photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <div className="shell relative pt-6 pb-16 lg:py-24">
        <Reveal className="lg:max-w-[56%]">
          <p className="eyebrow mb-5">{block.eyebrow}</p>
          <Title heading={block.headline} as="h1" className="max-w-[20ch]" />
          <div className="mt-6 flex max-w-[56ch] flex-col gap-4">
            {block.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={i === 0 ? 'lead' : 'text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-inverse-2)]'}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {(block.primary || block.secondary) && (
            <div className="mt-9 flex flex-wrap items-start gap-x-4 gap-y-3">
              {block.primary && (
                <div className="flex flex-col gap-2.5">
                  <CtaButton cta={block.primary} variant="accent" onDark withArrow />
                  {block.primary.note && (
                    <p className="flex items-center gap-2 text-[length:var(--fs-sm)] font-semibold text-[var(--gk-yellow)]">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                      {block.primary.note}
                    </p>
                  )}
                </div>
              )}
              {block.secondary && <CtaButton cta={block.secondary} variant="secondary" onDark />}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- prose */

function Prose({ block, ground }: { block: Of<'prose'>; ground: string }) {
  return (
    <Band ground={ground}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <Opener eyebrow={block.eyebrow} heading={block.headline} className="lg:col-span-5" />
        <Reveal delay={0.08} className="flex flex-col gap-5 lg:col-span-7 lg:pt-8">
          {block.paragraphs.map((paragraph, i) => (
            <p key={i} className={i === 0 ? 'lead' : 'text-[length:var(--fs-base)] leading-relaxed'}>
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </Band>
  )
}

/* ----------------------------------------------------------- checklist */

function Checklist({ block, ground }: { block: Of<'checklist'>; ground: string }) {
  return (
    <Band ground={ground} accent="accent-teal">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[var(--pin-top,8rem)]">
            <Opener eyebrow={block.eyebrow} heading={block.headline} />
            {block.aside && <Nominees aside={block.aside} />}
          </div>
        </div>

        <ul className="lg:col-span-7">
          {block.items.map((item, i) => (
            <Reveal
              as="li"
              key={item}
              delay={Math.min(i, 6) * 0.04}
              className="flex gap-4 border-b border-[var(--band-hairline)] py-5 first:border-t"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[var(--gk-teal-tint)] text-[var(--gk-teal-ink)]"
              >
                <Check className="size-4" strokeWidth={2.5} />
              </span>
              <span className="text-[length:var(--fs-lg)] leading-snug">{item}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Band>
  )
}

function Nominees({ aside }: { aside: NonNullable<Of<'checklist'>['aside']> }) {
  return (
    <Reveal
      delay={0.1}
      className="mt-8 rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-6 shadow-[var(--shadow-xs)]"
    >
      <p className="text-[length:var(--fs-base)] font-bold">{aside.intro}</p>
      <ol className="mt-4 grid gap-3">
        {aside.people.map((person, i) => (
          <li key={person} className="flex items-center gap-3 rounded-[var(--r-md)] bg-[var(--gk-teal-tint)] px-4 py-3">
            <span className="stat-figure text-[length:var(--fs-lg)] text-[var(--gk-teal-ink)]">{i + 1}</span>
            <span className="text-[length:var(--fs-base)]">{person}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-2)]">{aside.outro}</p>
    </Reveal>
  )
}

/* --------------------------------------------------------------- steps */

/**
 * Steps with an illustration are cards in a grid (Kickstarter's four stages,
 * the DLP's five skills). Steps without one are a numbered sequence (the AI
 * approach, the three ways to work with Goalkeep).
 */
function Steps({ block, ground }: { block: Of<'steps'>; ground: string }) {
  const illustrated = block.steps.every((step) => step.visual)

  return (
    <Band ground={ground}>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
        <Opener eyebrow={block.eyebrow} heading={block.headline} className="lg:col-span-7" />
        {block.intro && (
          <Reveal delay={0.08} className="flex flex-col gap-3 lg:col-span-5 lg:pt-8">
            {block.intro.map((line, i) => (
              <p
                key={i}
                className={i === 0 ? 'lead' : 'text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]'}
              >
                {line}
              </p>
            ))}
          </Reveal>
        )}
      </div>

      {illustrated ? (
        <ol className="mt-12 grid gap-5 md:grid-cols-6">
          {block.steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={(i % 3) * 0.08}
              className={cn('h-full', cardSpan(i, block.steps.length))}
            >
              <IllustratedStep step={step} index={i} />
            </Reveal>
          ))}
        </ol>
      ) : (
        <ol className="mt-12 grid gap-0 lg:grid-cols-3 lg:gap-6">
          {block.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.08}>
              <SequenceStep step={step} index={i} last={i === block.steps.length - 1} />
            </Reveal>
          ))}
        </ol>
      )}
    </Band>
  )
}

/* Four cards sit two by two; five sit three over two. */
function cardSpan(index: number, count: number) {
  if (count % 3 === 0) return 'md:col-span-3 lg:col-span-2'
  if (count === 4 || count % 2 === 0) return 'md:col-span-3'
  return index >= count - 2 ? 'md:col-span-3' : 'md:col-span-3 lg:col-span-2'
}

const number = (i: number) => String(i + 1).padStart(2, '0')

function IllustratedStep({ step, index }: { step: Step; index: number }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-xs)]">
      {step.visual && (
        <div className="border-b border-[var(--hairline)] bg-[var(--gk-cream)] px-8 py-6">
          <ProgramVisual name={step.visual} className="mx-auto max-w-[19rem]" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-7 md:p-8">
        <p className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] text-[var(--gk-blue-deep)] uppercase">
          {number(index)}
        </p>
        <h3 className="text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-tight font-extrabold">{step.title}</h3>
        {step.lead && <p className="text-[length:var(--fs-base)] leading-snug font-bold">{step.lead}</p>}
        {step.body.map((paragraph, i) => (
          <p key={i} className="text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  )
}

function SequenceStep({ step, index, last }: { step: Step; index: number; last: boolean }) {
  return (
    <div className="relative flex h-full gap-5 pb-10 lg:flex-col lg:gap-5 lg:pb-0">
      <div className="flex flex-col items-center lg:flex-row">
        <span className="stat-figure grid size-12 shrink-0 place-items-center rounded-full bg-[var(--gk-navy)] text-[length:var(--fs-lg)] text-white">
          {index + 1}
        </span>
        {!last && (
          <span
            aria-hidden="true"
            className="mt-2 w-px flex-1 bg-[var(--hairline-strong)] lg:mt-0 lg:ml-3 lg:h-px lg:w-auto"
          />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="h3">{step.title}</h3>
        {step.body.map((paragraph, i) => (
          <p key={i} className="text-[length:var(--fs-base)] leading-relaxed">
            {paragraph}
          </p>
        ))}
        {step.ctas && (
          <div className="mt-2 flex flex-col items-start gap-3">
            {step.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} variant="tertiary" withArrow />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------- deliverables */

function Deliverables({ block, ground }: { block: Of<'deliverables'>; ground: string }) {
  return (
    <Band ground={ground} accent="accent-coral">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[var(--pin-top,8rem)]">
            <Opener eyebrow={block.eyebrow} heading={block.headline} />
            {block.duration && (
              <Reveal
                delay={0.1}
                className="rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-6 shadow-[var(--shadow-xs)]"
              >
                <p className="flex items-center gap-2 text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] text-[var(--gk-coral-ink)] uppercase">
                  <Clock aria-hidden="true" className="size-4" strokeWidth={2.25} />
                  Indicative duration
                </p>
                <p className="mt-3 text-[length:var(--fs-base)] leading-relaxed">{block.duration}</p>
              </Reveal>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-7">
          {block.shift && <Shift shift={block.shift} />}
          {block.intro && <p className="lead font-bold">{block.intro}</p>}
          <ul className="grid gap-3 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                delay={Math.min(i, 6) * 0.04}
                className="flex gap-3 rounded-[var(--r-md)] border border-[var(--hairline)] bg-[var(--gk-white)] p-5 shadow-[var(--shadow-xs)]"
              >
                <span className="text-[length:var(--fs-xs)] font-extrabold text-[var(--gk-coral-ink)] tabular-nums">
                  {number(i)}
                </span>
                <span className="text-[length:var(--fs-base)] leading-snug">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Band>
  )
}

function Shift({ shift }: { shift: NonNullable<Of<'deliverables'>['shift']> }) {
  return (
    <Reveal className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
      <figure className="rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-6">
        <figcaption className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] text-[var(--fg-2)] uppercase">
          Before Kickstarter
        </figcaption>
        <blockquote className="mt-3 text-[length:var(--fs-lg)] leading-snug text-[var(--fg-2)] italic">
          &ldquo;{shift.before}&rdquo;
        </blockquote>
      </figure>
      <span aria-hidden="true" className="grid place-items-center text-[var(--gk-coral)]">
        <ArrowRight className="size-6 rotate-90 sm:rotate-0" strokeWidth={2.25} />
      </span>
      <figure className="rounded-[var(--r-lg)] bg-[var(--gk-navy)] p-6 text-white shadow-[var(--shadow-sm)]">
        <figcaption className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] text-[var(--gk-yellow)] uppercase">
          After Kickstarter
        </figcaption>
        <blockquote className="mt-3 text-[length:var(--fs-lg)] leading-snug font-bold italic">
          &ldquo;{shift.after}&rdquo;
        </blockquote>
      </figure>
    </Reveal>
  )
}

/* ------------------------------------------------------------ outcomes */

/* The homepage "What we do" tints, one per card. */
const TINTS = [
  { ground: 'var(--gk-blue-tint)', label: 'var(--gk-blue-deep)' },
  { ground: 'var(--gk-teal-tint)', label: 'var(--gk-teal-ink)' },
  { ground: 'var(--gk-coral-tint)', label: 'var(--gk-coral-ink)' },
  { ground: 'var(--gk-yellow-tint)', label: 'var(--gk-yellow-ink)' },
]

function Outcomes({ block, ground }: { block: Of<'outcomes'>; ground: string }) {
  return (
    <Band ground={ground}>
      <Opener eyebrow={block.eyebrow} heading={block.headline} />
      <ul className="mt-12 grid gap-4 md:grid-cols-6 md:gap-5">
        {block.items.map((item, i) => {
          const tint = TINTS[i % TINTS.length]
          return (
            <Reveal
              as="li"
              key={item.title}
              delay={(i % 3) * 0.08}
              className={cn('h-full', cardSpan(i, block.items.length))}
            >
              <article
                className="flex h-full flex-col gap-3 rounded-[var(--r-lg)] p-7 md:p-8"
                style={{ background: tint.ground }}
              >
                <p
                  className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] uppercase"
                  style={{ color: tint.label }}
                >
                  {number(i)}
                </p>
                <h3 className="text-[length:var(--fs-xl)] leading-tight font-extrabold">{item.title}</h3>
                <p className="text-[length:var(--fs-base)] leading-relaxed">{item.body}</p>
              </article>
            </Reveal>
          )
        })}
      </ul>
    </Band>
  )
}

/* --------------------------------------------------------------- stats */

const STAT_HUES = ['var(--gk-yellow)', 'var(--gk-teal-lift)', 'var(--gk-coral-lift)']

function Stats({ block }: { block: Of<'stats'> }) {
  return (
    <section
      data-ground="navy"
      className="ground-navy band relative accent-yellow"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <div className="shell">
        <Opener eyebrow={block.eyebrow} heading={block.headline} />
        <dl className="mt-12 grid gap-10 sm:grid-cols-3">
          {block.stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.08}
              className="flex flex-col gap-3 border-t border-[var(--hairline-inverse)] pt-6"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <StatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-[length:clamp(3rem,6vw,4.5rem)]"
                  style={{ color: STAT_HUES[i % STAT_HUES.length] }}
                />
              </dd>
              <dd
                aria-hidden="true"
                className="max-w-[28ch] text-[length:var(--fs-base)] leading-snug text-[var(--fg-inverse-2)]"
              >
                {stat.label}
              </dd>
            </Reveal>
          ))}
        </dl>
        {block.testimonial && (
          <div className="mt-16">
            <Testimonial audience={block.testimonial} onDark />
          </div>
        )}
      </div>
    </section>
  )
}

/* --------------------------------------------------------- testimonial */

/** A homepage testimonial, photograph beside the quote. */
function Testimonial({
  audience: id,
  onDark = false,
  compact = false,
}: {
  audience: AudienceId
  onDark?: boolean
  /** Beside a case-study card: the quote carries it, with a small portrait
   *  by the name instead of a large photograph. */
  compact?: boolean
}) {
  const audience = audiences.find((a) => a.id === id)
  if (!audience) throw new Error(`No homepage audience "${id}"`)
  const { testimonial } = audience
  const quote = (
    <blockquote
      className={cn(
        'text-[length:clamp(1.25rem,2.2vw,1.75rem)] leading-snug font-medium',
        onDark ? 'text-white' : 'text-[var(--gk-ink)]',
      )}
    >
      &ldquo;{testimonial.quote.value.text}&rdquo;
    </blockquote>
  )
  const credit = (
    <>
      <span className="font-bold">{testimonial.name}</span>
      <span className={onDark ? 'text-[var(--fg-inverse-2)]' : 'text-[var(--fg-2)]'}> · {testimonial.credentials}</span>
    </>
  )

  if (compact) {
    return (
      <Reveal delay={0.08} className="h-full">
        <figure className="flex h-full flex-col justify-center">
          {quote}
          <figcaption className="mt-8 flex items-center gap-4 text-[length:var(--fs-base)]">
            <img
              src={testimonial.photo}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-14 shrink-0 rounded-full object-cover shadow-[var(--shadow-xs)]"
            />
            <span>{credit}</span>
          </figcaption>
        </figure>
      </Reveal>
    )
  }

  return (
    <Reveal>
      <figure className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <img
          src={testimonial.photo}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full rounded-[var(--r-lg)] object-cover shadow-[var(--shadow-md)] md:col-span-5 md:aspect-[5/6]"
        />
        <div className="md:col-span-7">
          {quote}
          <figcaption className="mt-6 text-[length:var(--fs-base)]">{credit}</figcaption>
        </div>
      </figure>
    </Reveal>
  )
}

/* ------------------------------------------------------------- stories */

const INTERVENTION_TINTS: Record<string, string> = {
  'Data collection & visualisation': 'var(--gk-teal-tint)',
  'Designing Organizational Impact Framework': 'var(--gk-yellow-tint)',
  'Identifying key metrics': 'var(--gk-blue-tint)',
}

function Stories({ block, ground }: { block: Of<'stories'>; ground: string }) {
  const single = block.stories.length === 1

  return (
    <Band ground={ground}>
      <Opener eyebrow={block.eyebrow} heading={block.headline} />
      {single && block.testimonial ? (
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <StoryCard story={block.stories[0]} />
          </Reveal>
          <div className="lg:col-span-7">
            <Testimonial audience={block.testimonial} compact />
          </div>
        </div>
      ) : single ? (
        <Reveal className="mt-12">
          <StoryCard story={block.stories[0]} wide />
        </Reveal>
      ) : (
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {block.stories.map((story, i) => (
            <Reveal as="li" key={story.org} delay={i * 0.07} className="h-full">
              <StoryCard story={story} />
            </Reveal>
          ))}
        </ul>
      )}
    </Band>
  )
}

function StoryCard({ story, wide = false }: { story: Story; wide?: boolean }) {
  return (
    <article
      className={cn(
        'h-full overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] text-[var(--gk-ink)]',
        wide ? 'grid md:grid-cols-2' : 'flex flex-col'
      )}
    >
      <div className={cn('relative', wide ? 'min-h-[16rem]' : 'aspect-[16/10]')}>
        <img
          src={story.image}
          alt={story.imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className={cn('flex flex-1 flex-col gap-3', wide ? 'justify-center p-8 md:p-12' : 'p-7')}>
        <div className="flex flex-wrap gap-2">
          <span
            className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]"
            style={{ background: 'var(--gk-beige-deep)' }}
          >
            {story.sector}
          </span>
          <span
            className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]"
            style={{
              background: INTERVENTION_TINTS[story.intervention] ?? 'var(--gk-teal-tint)',
            }}
          >
            {story.intervention}
          </span>
        </div>
        <h3
          className={
            wide
              ? 'text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-tight font-extrabold'
              : 'text-[length:var(--fs-lg)] leading-tight font-extrabold'
          }
        >
          {story.org}
        </h3>
        <p className="text-[length:var(--fs-base)] leading-relaxed">{story.body}</p>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------ programs */

function Programs({ block, ground }: { block: Of<'programs'>; ground: string }) {
  return (
    <Band ground={ground}>
      <ul className="grid gap-6 md:grid-cols-2">
        {block.cards.map((card, i) => (
          <Reveal as="li" key={card.title} delay={i * 0.08} className="h-full">
            <article className="card-lift flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-sm)]">
              <img
                src={card.photo.src}
                alt={card.photo.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-4 p-8 md:p-10">
                <p
                  className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] uppercase"
                  style={{ color: TINTS[i].label }}
                >
                  {card.eyebrow}
                </p>
                <h2 className="text-[length:clamp(1.5rem,2.4vw,2rem)] leading-tight font-extrabold">{card.title}</h2>
                <p className="text-[length:var(--fs-base)] leading-relaxed">{card.body}</p>
                <div className="mt-auto pt-4">
                  <CtaButton cta={card.cta} variant="primary" withArrow />
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Band>
  )
}

/* ------------------------------------------------------ audience switch */

/**
 * "There should be an option here to select one of two identifiers: funding
 * organisation or nonprofit. Basis that selection, they should see different
 * content for the remainder of the page." The switch stays pinned under the
 * header while its content scrolls, so a reader halfway down can flip.
 */
function AudienceSwitch({ block, tone }: { block: Of<'audienceSwitch'>; tone: number }) {
  const [active, setActive] = useState(block.options[0].id)
  const id = useId()
  const option = block.options.find((o) => o.id === active) ?? block.options[0]
  /* The close sits outside the pinned region so the switch has scrolled
     away before it reaches the close's buttons. */
  const body = option.blocks.filter((b) => b.kind !== 'closing')
  const close = option.blocks.filter((b) => b.kind === 'closing')

  return (
    <div>
      {/* Columns that pin inside this region clear the switch as well as the header. */}
      <div className="[--pin-top:12rem]">
        <div className="sticky top-20 z-30 border-y border-[var(--hairline)] bg-[var(--gk-cream)]/95 backdrop-blur-sm">
          <div className="shell flex flex-wrap items-center gap-x-5 gap-y-3 py-4">
            <p id={`${id}-prompt`} className="text-[length:var(--fs-sm)] font-bold">
              {block.prompt}
            </p>
            <div
              role="tablist"
              aria-labelledby={`${id}-prompt`}
              className="inline-flex rounded-[var(--r-btn)] border border-[var(--hairline-strong)] bg-[var(--gk-white)] p-1"
            >
              {block.options.map((o) => {
                const selected = o.id === active
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${o.id}`}
                    aria-selected={selected}
                    aria-controls={`${id}-panel`}
                    onClick={() => setActive(o.id)}
                    className={cn(
                      'rounded-[calc(var(--r-btn)-1px)] px-4 py-2 text-[length:var(--fs-sm)] font-bold transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                      selected
                        ? 'bg-[var(--gk-navy)] text-white'
                        : 'text-[var(--gk-navy)] hover:bg-[var(--gk-cream-deep)]'
                    )}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${option.id}`}>
          <Blocks key={option.id} blocks={body} startTone={tone} />
        </div>
      </div>
      <Blocks key={`${option.id}-close`} blocks={close} />
    </div>
  )
}

/* ------------------------------------------------------------- closing */

/** The homepage close, without its newsletter: one sentence, the buttons,
 *  and the mark assembling beside them. */
function Closing({ block }: { block: Of<'closing'> }) {
  return (
    <section
      data-ground="navy"
      className="ground-navy relative overflow-hidden py-14 accent-yellow md:py-16"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <div className="shell relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal delay={0.12}>
            <Title heading={block.headline} className="max-w-[24ch]" />
            <p className="lead mt-5 max-w-[52ch]">{block.body}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaButton cta={block.primary} variant="accent" onDark withArrow />
              {block.secondary && <CtaButton cta={block.secondary} variant="secondary" onDark />}
            </div>
          </Reveal>
        </div>
        <div className="hidden lg:col-span-4 lg:flex lg:items-center lg:justify-center">
          <MarkAssembly size={150} />
        </div>
      </div>
    </section>
  )
}
