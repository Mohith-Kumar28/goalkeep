import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, BookOpenCheck, Clock, ScanSearch, Sparkles } from 'lucide-react'
import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { audiences } from '@/content/homepage'
import type { Block, Heading, Page, Step, Story } from '@/content/pages'
import type { AudienceId, Cta } from '@/content/types'
import { Scribble } from '@/components/primitives/doodles'
import { GkButton } from '@/components/primitives/gk-button'
import { ArcPiece, MarkAssembly, ShapeField } from '@/components/primitives/logo-shapes'
import { Marker } from '@/components/primitives/marker'
import { ProgramVisual } from '@/components/primitives/program-visuals'
import { Reveal } from '@/components/primitives/reveal'
import { StatCounter } from '@/components/primitives/stat-counter'
import { Approach } from '@/components/sections/approach'
import { Contact } from '@/components/sections/contact'
import { Credibility } from '@/components/sections/credibility'
import { Faqs } from '@/components/sections/faqs'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Renders a programs or services page from its blocks.
 *
 * Grounds are decided here, not in content. The hero, the evidence band and
 * the close are navy and the FAQ is the homepage's pale yellow; everything
 * else alternates white and the light-blue highlight, so two adjacent bands
 * never share a ground however a page is ordered. Every page ends on the
 * contact form, which is where its in-page buttons land.
 *
 * Each block kind has its own composition. The November review of the first
 * pass ("looking a bit AI generated") was right that one sticky split and one
 * card grid repeated down a page reads as a template.
 */
export function PageView({ page }: { page: Page }) {
  return (
    <ContactCta.Provider value={contactLabel(page.blocks)}>
      <Blocks blocks={page.blocks} />
      <Contact defaultService={page.contactService} />
    </ContactCta.Provider>
  )
}

/* One label per intent: anything on the page that leads to the form reuses
   the label the page's own close gives it. */
const ContactCta = createContext('Talk to us')

function contactLabel(blocks: Array<Block>): string {
  for (const block of blocks) {
    if (block.kind === 'closing' && block.primary.to.startsWith('#')) return block.primary.label
    if (block.kind === 'audienceSwitch') return contactLabel(block.options[0].blocks)
  }
  return 'Talk to us'
}

const LIGHT = ['ground-cream', 'ground-cream-deep'] as const
const NAVY = new Set<Block['kind']>(['stats', 'closing'])

function Blocks({ blocks, startTone = 0 }: { blocks: Array<Block>; startTone?: number }) {
  let tone = startTone
  return blocks.map((block, index) => {
    const ground = LIGHT[tone % 2]
    if (!NAVY.has(block.kind) && block.kind !== 'faq' && block.kind !== 'audienceSwitch') tone += 1
    return <BlockView key={index} block={block} ground={ground} tone={tone} />
  })
}

function BlockView({ block, ground, tone }: { block: Block; ground: string; tone: number }) {
  switch (block.kind) {
    case 'hero':
      return <Hero block={block} ground={ground} />
    case 'partners':
      return <Credibility ground={ground} />
    case 'approach':
      return <Approach ground={ground} />
    case 'prose':
      return <Prose block={block} ground={ground} />
    case 'checklist':
      return <SelfCheck block={block} ground={ground} />
    case 'steps':
      return <Steps block={block} ground={ground} />
    case 'deliverables':
      return <Deliverables block={block} ground={ground} />
    case 'outcomes':
      return <Outcomes block={block} ground={ground} />
    case 'stats':
      return <Evidence block={block} />
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
    case 'compare':
      return <Compare block={block} ground={ground} />
    case 'related':
      return <RelatedList block={block} ground={ground} />
    case 'audienceSwitch':
      return <AudienceSwitch block={block} tone={tone} />
    case 'closing':
      return <Closing block={block} />
  }
}

type Of<TKind extends Block['kind']> = Extract<Block, { kind: TKind }>

/* ------------------------------------------------------------ helpers */

function Band({
  ground,
  accent = 'accent-blue',
  children,
  className,
  id,
}: {
  ground: string
  accent?: string
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn(ground, accent, 'band relative overflow-x-clip', className)}>
      <div className="shell relative">{children}</div>
    </section>
  )
}

function Title({ heading, as: As = 'h2', className }: { heading: Heading; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <As className={cn(As === 'h1' ? 'display' : 'h2', 'pb-1', className)}>
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

/** The text with `phrase` (if it occurs) under the highlighter. */
function Highlighted({ text, phrase, onDark = false }: { text: string; phrase?: string; onDark?: boolean }) {
  const at = phrase ? text.indexOf(phrase) : -1
  if (!phrase || at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <Marker onDark={onDark}>{phrase}</Marker>
      {text.slice(at + phrase.length)}
    </>
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

/** A handwritten aside with an arrow back at what it annotates. */
function HandNote({
  children,
  color = 'var(--gk-coral-ink)',
  arrow = 'left',
  className,
}: {
  children: ReactNode
  color?: string
  arrow?: 'left' | 'up' | 'none'
  className?: string
}) {
  return (
    <span aria-hidden="true" className={cn('pointer-events-none flex items-start gap-1.5', className)} style={{ color }}>
      {arrow === 'left' && <Scribble name="arrow-curve" color={color} className="mt-1 h-10 w-9 shrink-0 -scale-x-100" />}
      {arrow === 'up' && <Scribble name="arrow-hook" color={color} className="mt-0.5 h-8 w-12 shrink-0 -scale-y-100" />}
      <span className="hand -rotate-2 leading-tight">{children}</span>
    </span>
  )
}

/* The mark's four hues, for anything that cycles through them. */
const HUES = [
  { arc: 'var(--gk-blue)', tint: 'var(--gk-blue-tint)', ink: 'var(--gk-blue-deep)' },
  { arc: 'var(--gk-teal)', tint: 'var(--gk-teal-tint)', ink: 'var(--gk-teal-ink)' },
  { arc: 'var(--gk-coral)', tint: 'var(--gk-coral-tint)', ink: 'var(--gk-coral-ink)' },
  { arc: 'var(--gk-yellow-deep)', tint: 'var(--gk-yellow-tint)', ink: 'var(--gk-yellow-ink)' },
]

/* ---------------------------------------------------------------- hero */

/**
 * Flat navy with the mark's arcs in the corners, as on the homepage. The
 * photograph bleeds off the right edge and dissolves into the panel. Only the
 * first paragraph stays in the hero; the rest opens the page below it as a
 * standfirst, so the buttons are on screen without scrolling.
 */
function Hero({ block, ground }: { block: Of<'hero'>; ground: string }) {
  const [first, ...rest] = block.paragraphs

  return (
    <>
      <section
        data-ground="navy"
        className="ground-navy accent-yellow relative overflow-hidden"
        style={{ backgroundColor: 'var(--gk-navy)' }}
      >
        <ShapeField variant="hero" />
        <div
          className="photo-bleed photo-bleed-b photo-bleed-lg-x relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[44%]"
          aria-hidden="true"
        >
          <img src={block.photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>

        <div className="shell relative pt-6 pb-16 lg:py-24">
          <Reveal className="lg:max-w-[54%]">
            <p className="eyebrow mb-5">{block.eyebrow}</p>
            <Title
              heading={block.headline}
              as="h1"
              className={
                /* The services doc's headlines run long; a long one steps down a size rather than running to five lines. */
                `${block.headline.lead} ${block.headline.em ?? ''}`.length > 60
                  ? 'max-w-[24ch] !text-[length:clamp(2rem,3.4vw,2.75rem)]'
                  : 'max-w-[18ch]'
              }
            />
            <p className="lead mt-6 max-w-[48ch]">
              <Highlighted text={first} phrase={block.highlight} onDark />
            </p>

            {(block.primary || block.secondary) && (
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {block.primary && <CtaButton cta={block.primary} variant="accent" onDark withArrow />}
                {block.secondary && <CtaButton cta={block.secondary} variant="secondary" onDark />}
              </div>
            )}
            {block.primary?.note && (
              <HandNote arrow="up" color="var(--gk-yellow)" className="mt-3 ml-6">
                {block.primary.note}
              </HandNote>
            )}
          </Reveal>
        </div>
      </section>

      {rest.length > 0 && (
        <section className={cn(ground, 'relative pt-14 pb-4 md:pt-20')}>
          <div className="shell">
            <Reveal className="grid gap-6 lg:grid-cols-12">
              <div className="flex flex-col gap-5 lg:col-span-9 lg:col-start-2">
                {rest.map((paragraph, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? 'text-[length:clamp(1.25rem,2vw,1.625rem)] leading-[1.5] font-medium text-[var(--gk-ink)]'
                        : 'max-w-[68ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-2)]'
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}

/* --------------------------------------------------------------- prose */

function Prose({ block, ground }: { block: Of<'prose'>; ground: string }) {
  const [first, ...rest] = block.paragraphs

  if (block.photo) {
    return (
      <Band ground={ground}>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="relative lg:col-span-5">
            <img
              src={block.photo.src}
              alt={block.photo.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-[var(--r-lg)] object-cover shadow-[var(--shadow-md)]"
            />
            {/* A quarter of the mark, pinned to the photograph's corner. */}
            <div className="absolute -right-8 -bottom-8 hidden size-28 md:block" aria-hidden="true">
              <ArcPiece sweep={110} start={95} thickness={16} color="var(--gk-yellow)" />
            </div>
            {block.note && (
              <HandNote className="mt-5 md:ml-10" color="var(--gk-blue-deep)" arrow="up">
                {block.note}
              </HandNote>
            )}
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col gap-6 lg:col-span-7">
            <Title heading={block.headline} className="max-w-[20ch]" />
            <p className="lead max-w-[56ch]">
              <Highlighted text={first} phrase={block.highlight} />
            </p>
            {rest.map((paragraph, i) => (
              <p key={i} className="max-w-[62ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </Band>
    )
  }

  /* Without a photograph the statement is the picture: one large sentence,
     the rest in two quiet columns under it. */
  return (
    <Band ground={ground}>
      <Reveal className="max-w-[60rem]">
        <Title heading={block.headline} className="max-w-[24ch]" />
        <p className="mt-8 text-[length:clamp(1.25rem,2.2vw,1.75rem)] leading-[1.45] font-medium text-[var(--gk-ink)]">
          <Highlighted text={first} phrase={block.highlight} />
        </p>
        {rest.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {rest.map((paragraph, i) => (
              <p key={i} className="text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </Reveal>
    </Band>
  )
}

/* ---------------------------------------------------------- self-check */

/**
 * "This may be right for you if…" lists, made into something to do: tick
 * what sounds familiar. Three or more and the page says so and offers the
 * conversation. Nothing is stored; it is a reading aid.
 */
function SelfCheck({ block, ground }: { block: Of<'checklist'>; ground: string }) {
  const [ticked, setTicked] = useState<Array<number>>([])
  const ctaLabel = useContext(ContactCta)
  const count = ticked.length
  const toggle = (i: number) => setTicked((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]))

  return (
    <Band ground={ground} accent="accent-teal">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-12">
          <Title heading={block.headline} className="max-w-[22ch]" />
          <HandNote color="var(--gk-teal-ink)" arrow="none" className="mt-4">
            tick what sounds familiar
          </HandNote>
        </Reveal>

        <div className={cn(block.aside ? 'lg:col-span-8' : 'lg:col-span-12')}>
          <ul className={cn('grid gap-3 sm:grid-cols-2', !block.aside && block.items.length % 3 === 0 && 'xl:grid-cols-3')}>
            {block.items.map((item, i) => {
              const on = ticked.includes(i)
              return (
                <Reveal as="li" key={item} delay={Math.min(i, 5) * 0.04} className="h-full">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(i)}
                    className={cn(
                      'group flex h-full w-full items-start gap-4 rounded-[var(--r-lg)] border p-5 text-left transition-[background-color,border-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)]',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gk-teal-ink)]',
                      on
                        ? 'border-[var(--gk-teal)] bg-[var(--gk-teal-tint)] shadow-[var(--shadow-xs)]'
                        : 'border-[var(--hairline)] bg-[var(--gk-white)] hover:border-[var(--gk-teal)] hover:shadow-[var(--shadow-sm)]',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-[var(--r-sm)] border-2 transition-colors duration-[var(--dur-fast)]',
                        on ? 'border-[var(--gk-teal)] bg-[var(--gk-white)]' : 'border-[var(--hairline-strong)] group-hover:border-[var(--gk-teal)]',
                      )}
                    >
                      {on && <Scribble name="check" color="var(--gk-teal-ink)" weight={4} duration={0.35} className="absolute -top-2 -right-2 size-9" />}
                    </span>
                    <span className="text-[length:var(--fs-lg)] leading-snug font-semibold text-[var(--gk-ink)]">{item}</span>
                  </button>
                </Reveal>
              )
            })}
          </ul>

          <div className="mt-6 flex min-h-12 flex-wrap items-center gap-x-5 gap-y-3" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {count >= 3 ? (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap items-center gap-x-5 gap-y-3"
                >
                  <p className="text-[length:var(--fs-lg)] font-bold">
                    {count} of {block.items.length} sound familiar. That is a conversation worth having.
                  </p>
                  <GkButton href="#contact" variant="primary" withArrow>
                    {ctaLabel}
                  </GkButton>
                </motion.div>
              ) : (
                <motion.p
                  key="count"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[length:var(--fs-sm)] text-[var(--fg-2)]"
                >
                  {count === 0 ? 'Nothing is saved. It is just for you.' : `${count} ticked so far.`}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {block.aside && (
          <Reveal delay={0.1} className="lg:col-span-4">
            <aside
              className="ground-navy relative overflow-hidden rounded-[var(--r-lg)] p-7 shadow-[var(--shadow-md)] lg:sticky lg:top-[var(--pin-top,8rem)]"
              style={{ backgroundColor: 'var(--gk-navy)' }}
            >
              <div className="absolute -right-12 -bottom-12 size-32 opacity-90" aria-hidden="true">
                <ArcPiece sweep={120} start={170} thickness={18} color="var(--gk-teal-lift)" />
              </div>
              <p className="relative max-w-[26ch] text-[length:var(--fs-lg)] leading-snug font-bold text-white">{block.aside.intro}</p>
              <ol className="relative mt-6 flex flex-col gap-4">
                {block.aside.people.map((person, i) => (
                  <li key={person} className="flex flex-col gap-1 border-t border-[var(--hairline-inverse)] pt-4">
                    <span className="hand text-[var(--gk-yellow)]">{i === 0 ? 'organisational influence' : 'measurement expertise'}</span>
                    <span className="text-[length:var(--fs-base)] leading-snug text-white">{person}</span>
                  </li>
                ))}
              </ol>
              <p className="relative mt-6 text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-inverse-2)]">{block.aside.outro}</p>
            </aside>
          </Reveal>
        )}
      </div>
    </Band>
  )
}

/* --------------------------------------------------------------- steps */

function Steps({ block, ground }: { block: Of<'steps'>; ground: string }) {
  switch (block.layout) {
    case 'story':
      return <StoryScroll block={block} ground={ground} />
    case 'bento':
      return <Bento block={block} ground={ground} />
    case 'flow':
      return <Flow block={block} ground={ground} />
    case 'paths':
      return <Paths block={block} ground={ground} />
  }
}

/**
 * Kickstarter's four stages. The illustration pins beside the text and
 * changes as each stage scrolls past, so the reader always sees the stage
 * they are reading about. On a phone each stage carries its own.
 */
function StoryScroll({ block, ground }: { block: Of<'steps'>; ground: string }) {
  const [active, setActive] = useState(0)
  const refs = useRef<Array<HTMLLIElement | null>>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const step = block.steps[active]

  return (
    <Band ground={ground}>
      <Reveal>
        <Title heading={block.headline} className="max-w-[22ch]" />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-32">
            <div className="relative overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-10 shadow-[var(--shadow-sm)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduced ? false : { opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={reduced ? undefined : { opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step.visual && <ProgramVisual name={step.visual} className="mx-auto max-w-[22rem]" />}
                </motion.div>
              </AnimatePresence>
            </div>
            <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Stages">
              {block.steps.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => refs.current[i]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })}
                    className="flex w-full flex-col items-start gap-2 text-left"
                    aria-current={i === active ? 'step' : undefined}
                  >
                    <span
                      className={cn(
                        'h-1 w-full rounded-full transition-colors duration-[var(--dur-base)]',
                        i <= active ? 'bg-[var(--gk-navy)]' : 'bg-[var(--hairline-strong)]',
                      )}
                    />
                    <span className={cn('text-[length:var(--fs-sm)] font-bold', i === active ? 'text-[var(--gk-ink)]' : 'text-[var(--fg-2)]')}>
                      {s.title}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <ol className="flex flex-col gap-16 lg:col-span-7 lg:gap-0">
          {block.steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                refs.current[i] = el
              }}
              data-index={i}
              className="flex flex-col gap-4 lg:min-h-[50vh] lg:justify-center"
            >
              {s.visual && (
                <div className="rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-6 lg:hidden">
                  <ProgramVisual name={s.visual} className="mx-auto max-w-[18rem]" />
                </div>
              )}
              <p className="hand text-[var(--gk-coral-ink)]">stage {i + 1} of {block.steps.length}</p>
              <h3 className="text-[length:clamp(2rem,4vw,3rem)] leading-none font-extrabold tracking-[-0.02em]">{s.title}</h3>
              {s.lead && <p className="lead max-w-[46ch] font-bold">{s.lead}</p>}
              {s.body.map((paragraph, j) => (
                <p key={j} className="max-w-[58ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">
                  {paragraph}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </div>
    </Band>
  )
}

/* Five skills: two wide tiles over three. Each tile its own tint. */
function Bento({ block, ground }: { block: Of<'steps'>; ground: string }) {
  return (
    <Band ground={ground}>
      <Reveal>
        <Title heading={block.headline} className="max-w-[22ch]" />
      </Reveal>
      <ul className="mt-12 grid gap-4 md:grid-cols-6 md:gap-5">
        {block.steps.map((s, i) => {
          const hue = HUES[i % HUES.length]
          const wide = i < 2
          return (
            <Reveal as="li" key={s.title} delay={(i % 3) * 0.06} className={cn('h-full', wide ? 'md:col-span-3' : 'md:col-span-2')}>
              <article
                className={cn('flex h-full flex-col overflow-hidden rounded-[var(--r-lg)]', wide && 'lg:flex-row')}
                style={{ background: i === 4 ? 'var(--gk-white)' : hue.tint, boxShadow: i === 4 ? 'var(--shadow-sm)' : undefined }}
              >
                {s.visual && (
                  <div className={cn('flex items-center justify-center p-6', wide ? 'lg:w-1/2 lg:p-8' : '')}>
                    <div className="w-full max-w-[17rem] rounded-[var(--r-md)] bg-[var(--gk-white)] p-4 shadow-[var(--shadow-xs)]">
                      <ProgramVisual name={s.visual} />
                    </div>
                  </div>
                )}
                <div className={cn('flex flex-col gap-3 px-7 pb-7', wide && 'lg:w-1/2 lg:justify-center lg:py-8 lg:pl-0')}>
                  <h3 className="text-[length:var(--fs-xl)] leading-tight font-extrabold">{s.title}</h3>
                  {s.body.map((paragraph, j) => (
                    <p key={j} className="text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </Reveal>
          )
        })}
      </ul>
    </Band>
  )
}

const FLOW_ICONS = [BookOpenCheck, Sparkles, ScanSearch]

/** Three moves, read left to right, the arrows between them drawn by hand. */
function Flow({ block, ground }: { block: Of<'steps'>; ground: string }) {
  const [opening, closing] = block.intro ?? []
  return (
    <Band ground={ground}>
      <Reveal className="max-w-[48rem]">
        <Title heading={block.headline} className="max-w-[24ch]" />
        {opening && <p className="lead mt-6">{opening}</p>}
      </Reveal>

      <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        {block.steps.map((s, i) => {
          const Icon = FLOW_ICONS[i % FLOW_ICONS.length]
          const hue = HUES[i % HUES.length]
          return (
            <Reveal as="li" key={s.title} delay={i * 0.12} className="relative flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="grid size-20 shrink-0 place-items-center rounded-full" style={{ background: hue.tint, color: hue.ink }}>
                  <Icon aria-hidden="true" strokeWidth={1.75} className="size-9" />
                </span>
                {i < block.steps.length - 1 && (
                  <Scribble
                    name="arrow-hook"
                    color="var(--gk-coral)"
                    weight={3}
                    delay={0.3 + i * 0.2}
                    className="ml-auto mr-4 hidden h-10 w-20 -rotate-6 md:block"
                  />
                )}
              </div>
              <h3 className="text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-tight font-extrabold">{s.title}</h3>
              {s.body.map((paragraph, j) => (
                <p key={j} className="max-w-[36ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-2)]">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          )
        })}
      </ol>

      {closing && (
        <Reveal className="mt-14 max-w-[52rem] rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-7 shadow-[var(--shadow-xs)]">
          <p className="text-[length:var(--fs-lg)] leading-relaxed">{closing}</p>
        </Reveal>
      )}
    </Band>
  )
}

/** Ways in: the first full width, the next two side by side. */
function Paths({ block, ground }: { block: Of<'steps'>; ground: string }) {
  const [lead, ...rest] = block.steps
  return (
    <Band ground={ground}>
      <Reveal>
        <Title heading={block.headline} className="max-w-[22ch]" />
      </Reveal>

      <Reveal className="mt-12">
        <PathCard step={lead} wide />
      </Reveal>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {rest.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08} className="h-full">
            <PathCard step={s} navy={i === rest.length - 1} />
          </Reveal>
        ))}
      </div>
    </Band>
  )
}

function PathCard({ step, wide = false, navy = false }: { step: Step; wide?: boolean; navy?: boolean }) {
  return (
    <article
      data-ground={navy ? 'navy' : undefined}
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] shadow-[var(--shadow-sm)]',
        wide && 'md:flex-row',
        navy ? 'ground-navy text-white' : 'border border-[var(--hairline)] bg-[var(--gk-white)]',
      )}
      style={navy ? { backgroundColor: 'var(--gk-navy)' } : undefined}
    >
      {step.photo && (
        <div className={cn('relative', wide ? 'aspect-[16/10] md:aspect-auto md:w-[42%]' : 'aspect-[16/9]')}>
          <img src={step.photo.src} alt={step.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}
      <div className={cn('flex flex-1 flex-col gap-4 p-7 md:p-9', wide && 'md:justify-center md:p-12')}>
        <h3 className={cn('leading-tight font-extrabold', wide ? 'text-[length:clamp(1.5rem,2.6vw,2.125rem)]' : 'text-[length:var(--fs-xl)]')}>
          {step.title}
        </h3>
        {step.body.map((paragraph, j) => (
          <p
            key={j}
            className={cn('max-w-[60ch] text-[length:var(--fs-base)] leading-relaxed', navy ? 'text-[var(--fg-inverse-2)]' : 'text-[var(--fg-2)]')}
          >
            {paragraph}
          </p>
        ))}
        {step.ctas && (
          <div className="mt-auto flex flex-wrap gap-3 pt-3">
            {step.ctas.map((cta, k) => (
              <CtaButton
                key={cta.label}
                cta={cta}
                variant={k === 0 ? (navy ? 'accent' : 'primary') : 'secondary'}
                onDark={navy}
                withArrow={k === 0}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

/* -------------------------------------------------------- deliverables */

function Deliverables({ block, ground }: { block: Of<'deliverables'>; ground: string }) {
  return (
    <Band ground={ground} accent="accent-coral">
      {block.shift && <Shift shift={block.shift} />}

      <div className={cn('grid gap-12 lg:grid-cols-12 lg:gap-16', block.shift && 'mt-20')}>
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[var(--pin-top,8rem)]">
            <Reveal>
              <Title heading={block.headline} className="max-w-[18ch]" />
              {block.intro && <p className="lead mt-5 max-w-[40ch]">{block.intro}</p>}
            </Reveal>
            {block.duration && <Duration text={block.duration} weeks={block.weeks} />}
          </div>
        </div>

        <ul className="grid content-start gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-7">
          {block.items.map((item, i) => (
            <Reveal as="li" key={item} delay={Math.min(i, 6) * 0.04} className="flex gap-4">
              <Scribble name="check" color={HUES[i % HUES.length].arc} weight={4} delay={0.1 + i * 0.05} className="mt-0.5 size-7 shrink-0" />
              <span className="text-[length:var(--fs-lg)] leading-snug text-[var(--gk-ink)]">{item}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Band>
  )
}

/**
 * The indicative duration on a ruler of weeks, the range swiped with the
 * highlighter. A number range is easier to hold in the head as a length.
 */
function Duration({ text, weeks }: { text: string; weeks?: [number, number] }) {
  const reduced = useReducedMotion()
  const max = weeks ? Math.max(12, weeks[1]) : 0
  const ticks = weeks ? Array.from({ length: max / 2 + 1 }, (_, i) => i * 2) : []

  return (
    <Reveal delay={0.1} className="rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-6 shadow-[var(--shadow-xs)]">
      <p className="flex items-center gap-2 text-[length:var(--fs-sm)] font-bold text-[var(--gk-coral-ink)]">
        <Clock aria-hidden="true" className="size-4" strokeWidth={2.25} />
        Indicative duration
      </p>

      {weeks && (
        <div className="mt-6" aria-hidden="true">
          <div className="relative h-10">
            <motion.div
              className="absolute top-1 h-7 -skew-x-6 rounded-[3px] bg-[var(--gk-yellow)] opacity-80"
              style={{ left: `${(weeks[0] / max) * 100}%`, width: `${((weeks[1] - weeks[0]) / max) * 100}%`, transformOrigin: 'left' }}
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <span
              className="hand absolute top-0 -translate-x-1/2 text-[var(--gk-ink)]"
              style={{ left: `${(((weeks[0] + weeks[1]) / 2) / max) * 100}%` }}
            >
              {weeks[0]}-{weeks[1]} weeks
            </span>
          </div>
          <div className="relative mt-1 h-6 border-t-2 border-[var(--gk-ink)]">
            {ticks.map((t) => (
              <span key={t} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${(t / max) * 100}%` }}>
                <span className="h-2 w-px bg-[var(--gk-ink)]" />
                <span className="mt-0.5 text-[length:var(--fs-xs)] text-[var(--fg-2)] tabular-nums">{t}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="mt-5 text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-2)]">{text}</p>
    </Reveal>
  )
}

function Shift({ shift }: { shift: NonNullable<Of<'deliverables'>['shift']> }) {
  return (
    <Reveal className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
      <figure>
        <figcaption className="hand text-[var(--fg-2)]">{shift.beforeLabel.toLowerCase()}</figcaption>
        <blockquote className="mt-2 text-[length:clamp(1.375rem,2.6vw,2rem)] leading-snug font-medium text-[var(--fg-2)]">
          &ldquo;{shift.before}&rdquo;
        </blockquote>
      </figure>
      <Scribble name="arrow-curve" color="var(--gk-coral)" weight={4} className="mx-auto h-16 w-20 rotate-90 lg:rotate-0" />
      <figure>
        <figcaption className="hand text-[var(--gk-coral-ink)]">{shift.afterLabel.toLowerCase()}</figcaption>
        <blockquote className="mt-2 text-[length:clamp(1.375rem,2.6vw,2rem)] leading-snug font-extrabold text-[var(--gk-ink)]">
          <Marker>&ldquo;{shift.after}&rdquo;</Marker>
        </blockquote>
      </figure>
    </Reveal>
  )
}

/* ------------------------------------------------------------ outcomes */

/** What the program changes: a ledger, each line opened by a piece of the mark. */
function Outcomes({ block, ground }: { block: Of<'outcomes'>; ground: string }) {
  return (
    <Band ground={ground}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Title heading={block.headline} className="max-w-[16ch]" />
            <img
              src="/photos/aud-mature-4.webp"
              alt="A participant making a point during a table discussion"
              loading="lazy"
              decoding="async"
              className="mt-10 hidden aspect-[4/5] w-full rounded-[var(--r-lg)] object-cover shadow-[var(--shadow-md)] lg:block"
            />
          </div>
        </Reveal>
        <ul className="flex flex-col lg:col-span-8">
          {block.items.map((item, i) => {
            const hue = HUES[i % HUES.length]
            return (
              <Reveal as="li" key={item.title} delay={0.04} className="grid gap-4 border-b border-[var(--hairline)] py-9 first:pt-0 last:border-0 md:grid-cols-[3.5rem_1fr]">
                <span className="size-11" aria-hidden="true">
                  <ArcPiece sweep={240} start={i * 70} thickness={20} color={hue.arc} />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-tight font-extrabold">{item.title}</h3>
                  <p className="max-w-[60ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-2)]">{item.body}</p>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </Band>
  )
}

/* ------------------------------------------------------------ evidence */

const STAT_HUES = ['var(--gk-yellow)', 'var(--gk-teal-lift)', 'var(--gk-coral-lift)']

/** The figures over the same session footage the homepage's proof band uses. */
function Evidence({ block }: { block: Of<'stats'> }) {
  const reduced = useReducedMotion()
  return (
    <section data-ground="navy" className="ground-navy accent-yellow band relative overflow-hidden" style={{ backgroundColor: 'var(--gk-navy)' }}>
      <div className="absolute inset-0" aria-hidden="true">
        {reduced ? (
          <img src="/video/bts-poster.jpg" alt="" className="h-full w-full object-cover" />
        ) : (
          <video className="h-full w-full object-cover" autoPlay muted playsInline loop preload="metadata" poster="/video/bts-poster.jpg">
            <source src="/video/bts.mp4" type="video/mp4" />
            <source src="/video/bts.webm" type="video/webm" />
          </video>
        )}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgb(47 74 146 / 0.86)' }} />
      </div>

      <div className="shell relative">
        <Reveal>
          <Title heading={block.headline} className="max-w-[24ch]" />
        </Reveal>
        <dl className="mt-14 grid gap-10 sm:grid-cols-3">
          {block.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1} className="flex flex-col gap-3">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <StatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-[length:clamp(3.5rem,7vw,5.5rem)]"
                  style={{ color: STAT_HUES[i % STAT_HUES.length] }}
                />
              </dd>
              <dd aria-hidden="true" className="max-w-[26ch] text-[length:var(--fs-lg)] leading-snug text-white">
                {stat.label}
              </dd>
            </Reveal>
          ))}
        </dl>
        {block.testimonial && (
          <div className="mt-20 border-t border-[var(--hairline-inverse)] pt-14">
            <Testimonial audience={block.testimonial} onDark />
          </div>
        )}
      </div>
    </section>
  )
}

/* --------------------------------------------------------- testimonial */

/** A homepage testimonial: the photograph, the quote at reading size, the name. */
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
        'relative text-[length:clamp(1.25rem,2.3vw,1.875rem)] leading-[1.4] font-medium',
        onDark ? 'text-white' : 'text-[var(--gk-ink)]',
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -top-10 -left-1 font-[family-name:var(--font-display)] text-[5rem] leading-none font-extrabold"
        style={{ color: onDark ? 'var(--gk-yellow)' : 'var(--gk-coral-deep)' }}
      >
        &ldquo;
      </span>
      {testimonial.quote.value.text}
    </blockquote>
  )
  const credit = (
    <>
      <span className="font-bold">{testimonial.name}</span>
      <span className={onDark ? 'text-[var(--fg-inverse-2)]' : 'text-[var(--fg-2)]'}>, {testimonial.credentials}</span>
    </>
  )

  if (compact) {
    return (
      <Reveal delay={0.08} className="h-full">
        <figure className="flex h-full flex-col justify-center pt-8">
          {quote}
          <figcaption className="mt-8 flex items-center gap-4 text-[length:var(--fs-base)]">
            <img src={testimonial.photo} alt="" loading="lazy" decoding="async" className="size-14 shrink-0 rounded-full object-cover shadow-[var(--shadow-xs)]" />
            <span>{credit}</span>
          </figcaption>
        </figure>
      </Reveal>
    )
  }

  return (
    <Reveal>
      <figure className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        <div className="relative md:col-span-5">
          <img
            src={testimonial.photo}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-[var(--r-lg)] object-cover shadow-[var(--shadow-md)] md:aspect-[5/6]"
          />
          <div className="absolute -bottom-6 -left-6 hidden size-24 md:block" aria-hidden="true">
            <ArcPiece sweep={100} start={200} thickness={18} color={onDark ? 'var(--gk-teal-lift)' : 'var(--gk-teal)'} />
          </div>
        </div>
        <div className="pt-8 md:col-span-7">
          {quote}
          <figcaption className="mt-8 text-[length:var(--fs-base)]">{credit}</figcaption>
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
  const [lead, ...rest] = block.stories

  return (
    <Band ground={ground}>
      <Reveal>
        <Title heading={block.headline} className="max-w-[24ch]" />
      </Reveal>
      {block.stories.length === 1 && block.testimonial ? (
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <StoryCard story={lead} />
          </Reveal>
          <div className="lg:col-span-7">
            <Testimonial audience={block.testimonial} compact />
          </div>
        </div>
      ) : block.stories.length === 1 ? (
        <Reveal className="mt-12">
          <StoryCard story={lead} wide />
        </Reveal>
      ) : (
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <StoryCard story={lead} tall />
          </Reveal>
          <div className="grid gap-6 lg:col-span-5">
            {rest.map((story, i) => (
              <Reveal key={story.org} delay={(i + 1) * 0.08}>
                <StoryCard story={story} side />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Band>
  )
}

function StoryCard({ story, wide = false, tall = false, side = false }: { story: Story; wide?: boolean; tall?: boolean; side?: boolean }) {
  return (
    <article
      className={cn(
        'h-full overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] text-[var(--gk-ink)] shadow-[var(--shadow-xs)]',
        wide && 'grid md:grid-cols-2',
        side && 'grid grid-cols-[40%_1fr]',
        !wide && !side && 'flex flex-col',
      )}
    >
      <div className={cn('relative', wide || side ? 'min-h-[13rem]' : tall ? 'aspect-[16/11]' : 'aspect-[16/10]')}>
        <img src={story.image} alt={story.imageAlt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className={cn('flex flex-1 flex-col gap-3', wide ? 'justify-center p-8 md:p-12' : side ? 'justify-center p-6' : 'p-8')}>
        <div className="flex flex-wrap gap-2">
          <span className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]" style={{ background: 'var(--gk-beige-deep)' }}>
            {story.sector}
          </span>
          <span className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]" style={{ background: INTERVENTION_TINTS[story.intervention] ?? 'var(--gk-teal-tint)' }}>
            {story.intervention}
          </span>
        </div>
        <h3 className={cn('leading-tight font-extrabold', wide || tall ? 'text-[length:clamp(1.5rem,2.4vw,2rem)]' : 'text-[length:var(--fs-xl)]')}>{story.org}</h3>
        <p className={cn('leading-relaxed text-[var(--fg-1)]', tall || wide ? 'text-[length:var(--fs-lg)]' : 'text-[length:var(--fs-base)]')}>{story.body}</p>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------ programs */

function Programs({ block, ground }: { block: Of<'programs'>; ground: string }) {
  return (
    <Band ground={ground}>
      <ul className="grid gap-6 lg:grid-cols-2">
        {block.cards.map((card, i) => (
          <Reveal as="li" key={card.title} delay={i * 0.08} className="h-full">
            <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-sm)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={card.photo.src}
                  alt={card.photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-8 md:p-10">
                <p className="hand" style={{ color: HUES[i === 0 ? 0 : 1].ink }}>
                  {card.eyebrow}
                </p>
                <h2 className="text-[length:clamp(1.625rem,2.6vw,2.25rem)] leading-tight font-extrabold">{card.title}</h2>
                <p className="text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-2)]">{card.body}</p>
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

/* ------------------------------------------------------------- compare */

function Compare({ block, ground }: { block: Of<'compare'>; ground: string }) {
  return (
    <Band ground={ground}>
      <Reveal>
        <Title heading={block.headline} className="max-w-[22ch]" />
      </Reveal>
      <Reveal delay={0.08} className="mt-12 overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-sm)]">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">The two programs compared</caption>
          <thead>
            <tr className="hidden md:table-row">
              <th scope="col" className="w-[22%] p-6" />
              {block.columns.map((col, i) => (
                <th key={col.title} scope="col" className="p-6 align-bottom" style={{ background: HUES[i].tint }}>
                  <a href={col.to} className="group inline-flex items-center gap-2 text-[length:var(--fs-xl)] font-extrabold" style={{ color: HUES[i].ink }}>
                    {col.title}
                    <ArrowUpRight aria-hidden="true" className="size-5 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.label} className="flex flex-col border-t border-[var(--hairline)] md:table-row">
                <th scope="row" className="p-6 pb-2 align-top text-[length:var(--fs-sm)] font-bold text-[var(--fg-2)] md:pb-6">
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td key={i} className="px-6 py-3 align-top text-[length:var(--fs-base)] leading-relaxed md:py-6">
                    <span className="mb-1 block text-[length:var(--fs-xs)] font-bold md:hidden" style={{ color: HUES[i].ink }}>
                      {block.columns[i].title}
                    </span>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Band>
  )
}

/* ------------------------------------------------------------- related */

/** Sibling pages as an index: big titles, the whole row a link. */
function RelatedList({ block, ground }: { block: Of<'related'>; ground: string }) {
  return (
    <Band ground={ground}>
      <Reveal>
        <Title heading={block.headline} className="max-w-[22ch]" />
      </Reveal>
      <ul className="mt-10 border-t border-[var(--hairline-strong)]">
        {block.items.map((item, i) => {
          const hue = HUES[i % HUES.length]
          return (
            <Reveal as="li" key={item.to} delay={i * 0.06}>
              <a
                href={item.to}
                className="group grid items-start gap-3 border-b border-[var(--hairline-strong)] py-8 transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] md:grid-cols-[14rem_1fr_auto] md:gap-10 md:px-4 md:hover:bg-[var(--gk-white)]"
              >
                <span className="hand" style={{ color: hue.ink }}>
                  {item.label.toLowerCase()}
                </span>
                <span className="flex flex-col gap-2">
                  <span className="text-[length:clamp(1.375rem,2.4vw,1.875rem)] leading-tight font-extrabold text-[var(--gk-ink)]">{item.title}</span>
                  <span className="max-w-[64ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">{item.body}</span>
                </span>
                <span
                  className="hidden size-12 place-items-center rounded-full border border-[var(--hairline-strong)] text-[var(--gk-navy)] transition-colors duration-[var(--dur-base)] group-hover:border-[var(--gk-navy)] group-hover:bg-[var(--gk-navy)] group-hover:text-white md:grid"
                  aria-hidden="true"
                >
                  <ArrowRight className="size-5" />
                </span>
              </a>
            </Reveal>
          )
        })}
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
            <p id={`${id}-prompt`} className="hand text-[var(--gk-navy)]">
              {block.prompt.toLowerCase()}
            </p>
            <div
              role="tablist"
              aria-labelledby={`${id}-prompt`}
              className="inline-flex rounded-[var(--r-btn)] border border-[var(--hairline-strong)] bg-[var(--gk-white)] p-1 shadow-[var(--shadow-xs)]"
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
                      selected ? 'bg-[var(--gk-navy)] text-white' : 'text-[var(--gk-navy)] hover:bg-[var(--gk-cream-deep)]',
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
      className="ground-navy accent-yellow relative overflow-hidden py-16 md:py-20"
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

