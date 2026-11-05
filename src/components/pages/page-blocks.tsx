import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { createContext, useContext, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { audiences } from '@/content/homepage'
import type { Block, Heading, Page, Photo, Story } from '@/content/pages'
import type { AudienceId, Cta } from '@/content/types'
import { Scribble } from '@/components/primitives/doodles'
import { GkButton } from '@/components/primitives/gk-button'
import { ArcPiece, MarkAssembly } from '@/components/primitives/logo-shapes'
import { MarkerText } from '@/components/primitives/marker-text'
import { ProgramVisual } from '@/components/primitives/program-visuals'
import { Reveal } from '@/components/primitives/reveal'
import { SpotlightCard } from '@/components/primitives/spotlight-card'
import { StatCounter } from '@/components/primitives/stat-counter'
import { Contact } from '@/components/sections/contact'
import { Credibility } from '@/components/sections/credibility'
import { Faqs } from '@/components/sections/faqs'
import { Proof } from '@/components/sections/proof'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Renders a programs or services page from its blocks.
 *
 * The rules this follows came out of a six-reviewer design council in
 * November, measured against the client-approved homepage:
 *
 *   · One accent per band. The mark's four hues appear only where they mean
 *     something; checks, labels and glyphs take the band's accent.
 *   · Photographs dissolve into the ground through a mask. None sits in a
 *     rounded, shadowed box, and no small arc is stuck to a corner.
 *   · Surfaces are one plane divided by hairlines, never cards inside cards.
 *   · Every page has one navy band mid-page; the rest alternate white and the
 *     light-blue highlight. Grounds are decided here, never in content.
 *   · The hand (Caveat) is rationed to a few notes a page, and the
 *     highlighter marks one phrase per band at most.
 */
export function PageView({ page }: { page: Page }) {
  return (
    <ContactCta.Provider value={contactLabel(page.blocks)}>
      <Blocks blocks={page.blocks} />
      <Contact defaultService={page.contactService} aside={<ContactAside />} />
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

/** The column beside the contact form: the team, so a reader sees who replies. */
function ContactAside() {
  return (
    <div className="mt-10 hidden lg:block">
      <img
        src="/photos/group-team.webp"
        alt="The Goalkeep team with a partner organisation after a workshop"
        loading="lazy"
        decoding="async"
        className="dissolve-b aspect-[4/3] w-full object-cover"
      />
      <p className="mt-2 max-w-[36ch] text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-2)]">
        Someone from this team reads every message and writes back.
      </p>
    </div>
  )
}

const LIGHT = ['ground-cream', 'ground-cream-deep'] as const

const isNavy = (block: Block) =>
  block.kind === 'stats' ||
  block.kind === 'closing' ||
  block.kind === 'proof' ||
  ((block.kind === 'prose' || block.kind === 'testimonial') && block.tone === 'navy')

function Blocks({ blocks, startTone = 0 }: { blocks: Array<Block>; startTone?: number }) {
  let tone = startTone
  return blocks.map((block, index) => {
    const ground = LIGHT[tone % 2]
    if (!isNavy(block) && block.kind !== 'hero' && block.kind !== 'faq' && block.kind !== 'audienceSwitch') tone += 1
    return <BlockView key={index} block={block} ground={ground} tone={tone} />
  })
}

function BlockView({ block, ground, tone }: { block: Block; ground: string; tone: number }) {
  switch (block.kind) {
    case 'hero':
      return <Hero block={block} />
    case 'partners':
      return <Credibility ground={ground} />
    case 'proof':
      return <Proof />
    case 'prose':
      return block.tone === 'navy' ? <Statement block={block} /> : <Prose block={block} ground={ground} />
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
      return <TestimonialBand audience={block.audience} navy={block.tone === 'navy'} ground={ground} />
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
  navy = false,
}: {
  ground: string
  accent?: string
  children: ReactNode
  className?: string
  navy?: boolean
}) {
  return (
    <section
      data-ground={navy ? 'navy' : undefined}
      className={cn(navy ? 'ground-navy' : ground, accent, 'band relative overflow-x-clip', className)}
      style={navy ? { backgroundColor: 'var(--gk-navy)' } : undefined}
    >
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

/** The text with `phrase` (if it occurs) under the highlighter, one swipe per line. */
function Highlighted({ text, phrase, hue }: { text: string; phrase?: string; hue?: string }) {
  const at = phrase ? text.indexOf(phrase) : -1
  if (!phrase || at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <MarkerText hue={hue}>{phrase}</MarkerText>
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

/** A handwritten aside, with an arrow back at what it annotates. */
function HandNote({
  children,
  color = 'var(--band-accent-ink)',
  className,
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span aria-hidden="true" className={cn('pointer-events-none flex items-start gap-1.5', className)} style={{ color }}>
      <Scribble name="arrow-hook" color={color} className="mt-0.5 h-8 w-12 shrink-0 -scale-y-100" />
      <span className="hand -rotate-2 leading-tight">{children}</span>
    </span>
  )
}

/** A small category label: the site's eyebrow, in the band accent. */
function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'text-[length:var(--fs-xs)] font-bold tracking-[var(--tracking-label)] text-[var(--band-accent-ink,var(--gk-blue-deep))] uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * A photograph bled to one edge of its band and dissolving towards the copy.
 * Desktop only; on a phone the same photograph sits above the copy and
 * dissolves downwards.
 */
function BleedPhoto({ photo, side, width = '42%' }: { photo: Photo; side: 'left' | 'right'; width?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-y-0 hidden lg:block', side === 'left' ? 'dissolve-r left-0' : 'dissolve-l right-0')}
      style={{ width }}
    >
      <img src={photo.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </div>
  )
}

function PhonePhoto({ photo }: { photo: Photo }) {
  return (
    <div className="dissolve-b -mx-4 mb-8 h-64 sm:h-80 md:-mx-12 lg:hidden">
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </div>
  )
}

/** One large piece of the mark, bleeding off a band's edge: the shape layer's own rule. */
function BandArc({ className, color = 'var(--gk-navy-lift)' }: { className?: string; color?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute hidden lg:block', className)}>
      <ArcPiece sweep={130} start={200} thickness={14} color={color} />
    </div>
  )
}

/* ---------------------------------------------------------------- hero */

/**
 * Flat navy, the photograph bled off the right edge and dissolving into the
 * panel. One paragraph, so the buttons are on screen without scrolling. The
 * programs overview carries its two programs as panels in place of a photo.
 */
function Hero({ block }: { block: Of<'hero'> }) {
  const long = `${block.headline.lead} ${block.headline.em ?? ''}`.length > 60
  return (
    <section data-ground="navy" className="ground-navy accent-yellow relative overflow-hidden" style={{ backgroundColor: 'var(--gk-navy)' }}>
      <BandArc className="-bottom-56 -left-40 size-[26rem]" />

      {block.photo && !block.links && (
        <div
          className="photo-bleed photo-bleed-b photo-bleed-lg-x relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[44%]"
          aria-hidden="true"
        >
          <img src={block.photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}

      <div className={cn('shell relative pt-8 pb-16 lg:py-24', block.links && 'grid items-center gap-12 lg:grid-cols-12')}>
        <Reveal className={block.links ? 'lg:col-span-6' : 'lg:max-w-[54%]'}>
          <p className="eyebrow mb-5">{block.eyebrow}</p>
          <Title
            heading={block.headline}
            as="h1"
            className={long ? 'max-w-[24ch] !text-[length:clamp(2rem,3.4vw,2.75rem)]' : 'max-w-[18ch]'}
          />
          <p className="lead mt-6 max-w-[48ch]">
            <Highlighted text={block.lead} phrase={block.highlight} hue="var(--gk-white)" />
          </p>

          {(block.primary || block.secondary) && (
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {block.primary && <CtaButton cta={block.primary} variant="accent" onDark withArrow />}
              {block.secondary && <CtaButton cta={block.secondary} variant="secondary" onDark />}
            </div>
          )}
          {block.primary?.note && (
            <HandNote color="var(--gk-yellow)" className="mt-3 ml-6">
              {block.primary.note}
            </HandNote>
          )}
        </Reveal>

        {block.links && (
          <Reveal delay={0.12} className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {block.links.map((link) => (
              <SpotlightCard key={link.to} className="h-full rounded-[var(--r-lg)]">
                <a
                  href={link.to}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline-inverse)] bg-[rgb(255_255_255_/_0.07)] text-white"
                >
                  <div className="dissolve-b aspect-[4/3] overflow-hidden">
                    <img src={link.photo.src} alt={link.photo.alt} className="h-full w-full object-cover" />
                  </div>
                  <div className="-mt-8 flex flex-1 flex-col gap-1.5 p-6">
                    <span className="text-[length:var(--fs-sm)] text-[var(--fg-inverse-2)]">{link.label}</span>
                    <span className="flex items-center justify-between gap-3 text-[length:var(--fs-xl)] font-extrabold">
                      {link.title}
                      <ArrowRight aria-hidden="true" className="size-5 text-[var(--gk-yellow)] transition-transform duration-[var(--dur-base)] group-hover:translate-x-1" />
                    </span>
                  </div>
                </a>
              </SpotlightCard>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- prose */

/** A statement with its photograph bled off the band's left edge. */
function Prose({ block, ground }: { block: Of<'prose'>; ground: string }) {
  const [first, ...rest] = block.paragraphs

  return (
    <section className={cn(ground, 'accent-blue band relative overflow-x-clip')}>
      {block.photo && <BleedPhoto photo={block.photo} side="left" />}
      <div className="shell relative">
        {block.photo && <PhonePhoto photo={block.photo} />}
        <Reveal className={cn('flex flex-col gap-6', block.photo ? 'lg:ml-[46%] lg:max-w-[40rem]' : 'max-w-[60rem]')}>
          <Title heading={block.headline} className="max-w-[20ch]" />
          <p className="lead max-w-[56ch]">
            <Highlighted text={first} phrase={block.highlight} />
          </p>
          {rest.map((paragraph, i) => (
            <p key={i} className="max-w-[62ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">
              {paragraph}
            </p>
          ))}
          {block.note && <HandNote className="mt-1">{block.note}</HandNote>}
        </Reveal>
      </div>
    </section>
  )
}

/** The page's navy moment: one large sentence, the rest under it, a piece of the mark off the edge. */
function Statement({ block }: { block: Of<'prose'> }) {
  const [first, ...rest] = block.paragraphs
  return (
    <Band ground="" navy accent="accent-yellow">
      <BandArc className="-top-24 -right-56 size-[34rem]" />
      <Reveal className="relative max-w-[58rem]">
        <Title heading={block.headline} className="max-w-[22ch]" />
        <p className="mt-8 text-[length:clamp(1.25rem,2.2vw,1.75rem)] leading-[1.5] font-medium text-white">
          <Highlighted text={first} phrase={block.highlight} hue="var(--gk-white)" />
        </p>
        {rest.map((paragraph, i) => (
          <p key={i} className="mt-6 max-w-[62ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-inverse-2)]">
            {paragraph}
          </p>
        ))}
      </Reveal>
    </Band>
  )
}

/* ---------------------------------------------------------- self-check */

/**
 * "This may be right for you if…" lists as something to do: tick what sounds
 * familiar. A ticked line takes the highlighter. At three, the page says so
 * and offers the conversation. Nothing is stored.
 */
function SelfCheck({ block, ground }: { block: Of<'checklist'>; ground: string }) {
  const [ticked, setTicked] = useState<Array<number>>([])
  const ctaLabel = useContext(ContactCta)
  const count = ticked.length
  const toggle = (i: number) => setTicked((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]))
  const odd = block.items.length % 2 === 1

  const result = (
    <div className="flex min-h-12 flex-col justify-center gap-3" aria-live="polite">
      {count >= 3 ? (
        <>
          <p className="text-[length:var(--fs-lg)] leading-snug font-bold">
            {count} of {block.items.length} sound familiar. That is worth a conversation.
          </p>
          <div>
            <GkButton href="#contact" variant="primary" withArrow>
              {ctaLabel}
            </GkButton>
          </div>
        </>
      ) : (
        <p className="text-[length:var(--fs-sm)] text-[var(--fg-2)]">
          {count === 0 ? 'Nothing is saved. It is just for you.' : `${count} ticked so far.`}
        </p>
      )}
    </div>
  )

  return (
    <Band ground={ground} accent="accent-teal">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className={block.aside ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <Title heading={block.headline} className="max-w-[22ch]" />
          <HandNote className="mt-3">tick what sounds familiar</HandNote>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
            {block.items.map((item, i) => {
              const on = ticked.includes(i)
              return (
                <li key={item} className="bg-[var(--gk-white)]">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(i)}
                    className="group flex h-full w-full items-start gap-4 px-6 py-5 text-left transition-colors duration-[var(--dur-base)] hover:bg-[var(--gk-cream-deep)] focus-visible:bg-[var(--gk-cream-deep)] focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'relative mt-1 grid size-6 shrink-0 place-items-center rounded-[var(--r-sm)] border-2 transition-colors duration-[var(--dur-fast)]',
                        on ? 'border-[var(--gk-teal-ink)]' : 'border-[var(--hairline-strong)] group-hover:border-[var(--gk-teal-ink)]',
                      )}
                    >
                      {on && <Scribble name="check" color="var(--gk-teal-ink)" weight={4} duration={0.3} className="absolute -top-2.5 -right-2.5 size-8" />}
                    </span>
                    <span className="text-[length:var(--fs-lg)] leading-snug text-[var(--gk-ink)]">
                      {on ? <MarkerText>{item}</MarkerText> : item}
                    </span>
                  </button>
                </li>
              )
            })}
            {odd && <li className="bg-[var(--gk-white)] px-6 py-5">{result}</li>}
          </ul>
          {!odd && <div className="mt-6">{result}</div>}
        </Reveal>

        {block.aside && (
          <div className="lg:col-span-4">
            <aside
              data-ground="navy"
              className="ground-navy rounded-[var(--r-lg)] p-8 lg:sticky lg:top-[var(--pin-top,8rem)]"
              style={{ backgroundColor: 'var(--gk-navy)' }}
            >
              <p className="max-w-[26ch] text-[length:var(--fs-lg)] leading-snug font-bold text-white">{block.aside.intro}</p>
              <ol className="mt-6 flex flex-col">
                {block.aside.people.map((person, i) => (
                  <li key={person} className="flex flex-col gap-1.5 border-t border-[var(--hairline-inverse)] py-4">
                    <span className="text-[length:var(--fs-xs)] font-bold tracking-[var(--tracking-label)] text-[var(--gk-yellow)] uppercase">
                      {i === 0 ? 'Organisational influence' : 'Measurement expertise'}
                    </span>
                    <span className="text-[length:var(--fs-base)] leading-snug text-white">{person}</span>
                  </li>
                ))}
              </ol>
              <p className="border-t border-[var(--hairline-inverse)] pt-4 text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-inverse-2)]">
                {block.aside.outro}
              </p>
            </aside>
          </div>
        )}
      </div>
    </Band>
  )
}

/* --------------------------------------------------------------- steps */

function Steps({ block, ground }: { block: Of<'steps'>; ground: string }) {
  switch (block.layout) {
    case 'rows':
      return <StageRows block={block} ground={ground} />
    case 'bento':
      return <Bento block={block} ground={ground} />
    case 'flow':
      return <Flow block={block} ground={ground} />
    case 'paths':
      return <Paths block={block} ground={ground} />
  }
}

function StepsHeader({ block, className }: { block: Of<'steps'>; className?: string }) {
  return (
    <Reveal className={cn('max-w-[48rem]', className)}>
      <Title heading={block.headline} className="max-w-[22ch]" />
      {block.intro?.map((line, i) => (
        <p key={i} className={i === 0 ? 'lead mt-6' : 'mt-4 text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-2)]'}>
          {line}
        </p>
      ))}
    </Reveal>
  )
}

const number = (i: number) => String(i + 1).padStart(2, '0')

/**
 * Kickstarter's four stages, in the shape the homepage's "Our approach"
 * already taught the client: one surface divided by hairlines, the open
 * stage inverted to navy with its photograph dissolving into the panel. The
 * order is the information here, so the stages keep their numbers.
 */
function StageRows({ block, ground }: { block: Of<'steps'>; ground: string }) {
  const [open, setOpen] = useState(0)
  const reduced = useReducedMotion()
  const id = useId()

  return (
    <Band ground={ground}>
      <StepsHeader block={block} />
      <Reveal className="mt-12 overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] shadow-[var(--shadow-sm)]">
        {block.steps.map((s, i) => {
          const isOpen = open === i
          return (
            <div key={s.title} className={cn('border-[var(--hairline)] [&:not(:first-child)]:border-t', isOpen && 'ground-navy')} style={isOpen ? { backgroundColor: 'var(--gk-navy)' } : undefined} data-ground={isOpen ? 'navy' : undefined}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${id}-${i}`}
                  onClick={() => setOpen(i)}
                  className={cn(
                    'flex w-full items-center gap-5 px-6 py-5 text-left transition-colors duration-[var(--dur-base)] md:px-8',
                    isOpen ? 'cursor-default' : 'hover:bg-[var(--gk-cream-deep)]',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-[var(--r-sm)] text-[length:var(--fs-sm)] font-extrabold tabular-nums',
                      isOpen ? 'bg-[var(--gk-yellow)] text-[var(--gk-navy-deep)]' : 'bg-[var(--gk-blue-tint)] text-[var(--gk-blue-deep)]',
                    )}
                  >
                    {number(i)}
                  </span>
                  <span className={cn('text-[length:var(--fs-2xl)] leading-tight font-extrabold', isOpen ? 'text-white' : 'text-[var(--gk-ink)]')}>
                    {s.title}
                  </span>
                  {!isOpen && s.lead && (
                    <span className="hidden flex-1 truncate text-[length:var(--fs-base)] text-[var(--fg-2)] md:block">{s.lead}</span>
                  )}
                  {s.visual && !isOpen && (
                    <span aria-hidden="true" className="ml-auto hidden w-24 shrink-0 opacity-90 lg:block">
                      <ProgramVisual name={s.visual} />
                    </span>
                  )}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn('size-5 shrink-0 transition-transform duration-[var(--dur-base)]', isOpen ? 'ml-auto rotate-180 text-white lg:ml-auto' : 'text-[var(--gk-navy)]', !isOpen && s.visual ? 'lg:ml-0' : 'ml-auto')}
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`${id}-${i}`}
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid md:grid-cols-2">
                      <div className="flex flex-col gap-4 px-6 pt-2 pb-10 md:px-8 md:pb-12">
                        {s.lead && <p className="text-[length:var(--fs-xl)] leading-snug font-bold text-[var(--gk-yellow)]">{s.lead}</p>}
                        {s.body.map((paragraph, j) => (
                          <p key={j} className="max-w-[54ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-inverse-2)]">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      {s.photo && (
                        <div className="photo-bleed relative min-h-[16rem] md:min-h-0" aria-hidden="true">
                          <img src={s.photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </Reveal>
    </Band>
  )
}

/* Five skills: one white plane divided by hairlines, two wide cells over three. */
function Bento({ block, ground }: { block: Of<'steps'>; ground: string }) {
  return (
    <Band ground={ground}>
      <StepsHeader block={block} />
      <Reveal className="mt-12">
        <ul className="grid gap-px overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-6">
          {block.steps.map((s, i) => {
            const wide = i < 2
            return (
              <li key={s.title} className={cn('flex flex-col gap-4 bg-[var(--gk-white)] p-8', wide ? 'md:col-span-3 lg:flex-row lg:items-center lg:gap-8' : 'md:col-span-2')}>
                {s.visual && (
                  <div className={cn('w-full', wide ? 'max-w-[15rem] lg:w-1/2' : 'max-w-[14rem]')}>
                    <ProgramVisual name={s.visual} />
                  </div>
                )}
                <div className={cn('flex flex-col gap-2', wide && 'lg:w-1/2')}>
                  <h3 className="text-[length:var(--fs-xl)] leading-tight font-extrabold">{s.title}</h3>
                  {s.body.map((paragraph, j) => (
                    <p key={j} className="text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </Reveal>
    </Band>
  )
}

/** Three moves, read left to right: hand-circled numbers, hand-drawn arrows between. */
function Flow({ block, ground }: { block: Of<'steps'>; ground: string }) {
  return (
    <Band ground={ground}>
      <StepsHeader block={block} />
      <Reveal className="mt-14">
        <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
          {block.steps.map((s, i) => (
            <li key={s.title} className="relative flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="relative grid size-14 shrink-0 place-items-center text-[length:var(--fs-2xl)] font-extrabold text-[var(--gk-navy)]">
                  {i + 1}
                  <Scribble name="circle" color="var(--band-accent)" weight={3} delay={0.15 + i * 0.25} className="absolute -inset-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+0.75rem)]" />
                </span>
                {i < block.steps.length - 1 && (
                  <Scribble name="arrow-hook" color="var(--band-accent)" weight={3} delay={0.35 + i * 0.25} className="hidden h-9 w-20 -rotate-6 md:block" />
                )}
              </div>
              <h3 className="text-[length:var(--fs-2xl)] leading-tight font-extrabold">{s.title}</h3>
              {s.body.map((paragraph, j) => (
                <p key={j} className="max-w-[36ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-2)]">
                  {paragraph}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </Reveal>
      {block.outro && (
        <Reveal className="mt-14 max-w-[52rem] border-t border-[var(--hairline-strong)] pt-8">
          <p className="lead">{block.outro}</p>
        </Reveal>
      )}
    </Band>
  )
}

/** Ways in: an index of rows, one photograph for the band bled off the right edge. */
function Paths({ block, ground }: { block: Of<'steps'>; ground: string }) {
  const photo = block.steps.find((s) => s.photo)?.photo
  return (
    <section className={cn(ground, 'accent-blue band relative overflow-x-clip')}>
      {photo && <BleedPhoto photo={photo} side="right" width="36%" />}
      <div className="shell relative">
        <div className="lg:max-w-[58%]">
          <StepsHeader block={block} />
          <ol className="mt-12 border-t border-[var(--hairline-strong)]">
            {block.steps.map((s) => (
              <Reveal as="li" key={s.title} className="flex flex-col gap-4 border-b border-[var(--hairline-strong)] py-9">
                <h3 className="text-[length:var(--fs-2xl)] leading-tight font-extrabold">{s.title}</h3>
                {s.body.map((paragraph, j) => (
                  <p key={j} className="max-w-[62ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">
                    {paragraph}
                  </p>
                ))}
                {s.ctas && (
                  <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
                    {s.ctas.map((cta, k) => (
                      <CtaButton key={cta.label} cta={cta} variant={k === 0 ? 'primary' : 'tertiary'} withArrow={k === 0} />
                    ))}
                  </div>
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------- deliverables */

function Deliverables({ block, ground }: { block: Of<'deliverables'>; ground: string }) {
  return (
    <Band ground={ground} accent="accent-coral">
      {block.shift && <Shift shift={block.shift} />}

      <div className={cn('grid gap-12 lg:grid-cols-12 lg:gap-16', block.shift && 'mt-20')}>
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-6 lg:sticky lg:top-[var(--pin-top,8rem)]">
            <Reveal>
              <Title heading={block.headline} className="max-w-[18ch]" />
              {block.opening?.map((paragraph, i) => (
                <p key={i} className={i === 0 ? 'lead mt-6' : 'mt-4 text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]'}>
                  {paragraph}
                </p>
              ))}
            </Reveal>
            {block.duration && <Duration text={block.duration} weeks={block.weeks} />}
          </div>
        </div>

        <Reveal className="lg:col-span-7">
          {block.intro && <p className="mb-7 text-[length:var(--fs-lg)] font-bold">{block.intro}</p>}
          <ul className="grid content-start gap-x-10 gap-y-7 sm:grid-cols-2">
            {block.items.map((item) => (
              <li key={item} className="flex gap-4">
                <Scribble name="check" color="var(--band-accent)" weight={4} className="mt-0.5 size-7 shrink-0" />
                <span className="text-[length:var(--fs-lg)] leading-snug text-[var(--gk-ink)]">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Band>
  )
}

/**
 * The indicative duration on a ruler of weeks, the range swiped with the
 * highlighter. A range is easier to hold in the head as a length.
 */
function Duration({ text, weeks }: { text: string; weeks?: [number, number] }) {
  const reduced = useReducedMotion()
  const max = weeks ? Math.max(12, weeks[1]) : 0
  const ticks = weeks ? Array.from({ length: max / 2 + 1 }, (_, i) => i * 2) : []

  return (
    <Reveal delay={0.1} className="border-t border-[var(--hairline-strong)] pt-6">
      <p className="text-[length:var(--fs-sm)] font-bold text-[var(--band-accent-ink)]">Indicative duration</p>

      {weeks && (
        <div className="mt-5" aria-hidden="true">
          <div className="relative h-9">
            <motion.span
              className="marker absolute top-0 flex h-8 items-center justify-center !m-0 text-[length:var(--fs-sm)] font-bold whitespace-nowrap"
              style={{ left: `${(weeks[0] / max) * 100}%`, width: `${((weeks[1] - weeks[0]) / max) * 100}%`, transformOrigin: 'left' }}
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {weeks[0]}-{weeks[1]} weeks
            </motion.span>
          </div>
          <div className="relative mt-1 h-6 border-t-2 border-[var(--gk-navy)]">
            {ticks.map((t) => (
              <span key={t} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${(t / max) * 100}%` }}>
                <span className="h-2 w-px bg-[var(--gk-navy)]" />
                <span className="mt-0.5 text-[length:var(--fs-xs)] text-[var(--fg-2)] tabular-nums">{t}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="mt-5 text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">{text}</p>
    </Reveal>
  )
}

/** Before and after: the "after" question's second clause takes the highlighter. */
function Shift({ shift }: { shift: NonNullable<Of<'deliverables'>['shift']> }) {
  const comma = shift.after.indexOf(', ')
  const phrase = comma > 0 ? shift.after.slice(comma + 2) : shift.after
  return (
    <Reveal className="grid items-start gap-8 border-b border-[var(--hairline-strong)] pb-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
      <figure>
        <figcaption>
          <Label className="!text-[var(--fg-2)]">{shift.beforeLabel}</Label>
        </figcaption>
        <blockquote className="mt-3 text-[length:clamp(1.375rem,2.6vw,2rem)] leading-snug font-medium text-[var(--fg-2)]">
          &ldquo;{shift.before}&rdquo;
        </blockquote>
      </figure>
      <Scribble name="arrow-curve" color="var(--band-accent)" weight={4} className="mx-auto mt-8 h-16 w-20 rotate-90 lg:rotate-0" />
      <figure>
        <figcaption>
          <Label>{shift.afterLabel}</Label>
        </figcaption>
        <blockquote className="mt-3 text-[length:clamp(1.375rem,2.6vw,2rem)] leading-snug font-extrabold text-[var(--gk-ink)]">
          &ldquo;
          <Highlighted text={shift.after} phrase={phrase} />
          &rdquo;
        </blockquote>
      </figure>
    </Reveal>
  )
}

/* ------------------------------------------------------------ outcomes */

/** What the program changes: a ledger, each line opened by the same piece of the mark. */
function Outcomes({ block, ground }: { block: Of<'outcomes'>; ground: string }) {
  return (
    <section className={cn(ground, 'accent-teal band relative overflow-x-clip')}>
      <BleedPhoto photo={{ src: '/photos/aud-mature-4.webp', alt: '' }} side="right" width="34%" />
      <div className="shell relative">
        <div className="lg:max-w-[60%]">
          <Reveal>
            <Title heading={block.headline} className="max-w-[20ch]" />
          </Reveal>
          <Reveal className="mt-10">
            <ul className="border-t border-[var(--hairline-strong)]">
              {block.items.map((item) => (
                <li key={item.title} className="grid gap-3 border-b border-[var(--hairline-strong)] py-7 md:grid-cols-[2.75rem_1fr]">
                  <span className="mt-1 size-8" aria-hidden="true">
                    <ArcPiece sweep={110} start={300} thickness={22} color="var(--band-accent)" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[length:var(--fs-2xl)] leading-tight font-extrabold">{item.title}</h3>
                    <p className="max-w-[60ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-2)]">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
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
            <Reveal key={stat.label} delay={i * 0.1} className="flex flex-col gap-2">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="leading-none">
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
          <div className="mt-20 border-t border-[var(--hairline-inverse)] pt-14 lg:max-w-[52rem]">
            <Quote audience={block.testimonial} onDark />
          </div>
        )}
      </div>
    </section>
  )
}

/* --------------------------------------------------------- testimonial */

function useTestimonial(id: AudienceId) {
  const audience = audiences.find((a) => a.id === id)
  if (!audience) throw new Error(`No homepage audience "${id}"`)
  return audience.testimonial
}

/** The quote with a small portrait by the name. */
function Quote({ audience, onDark = false }: { audience: AudienceId; onDark?: boolean }) {
  const testimonial = useTestimonial(audience)
  return (
    <figure className="flex flex-col pt-8">
      <blockquote className={cn('relative text-[length:clamp(1.25rem,2.3vw,1.75rem)] leading-[1.45] font-medium', onDark ? 'text-white' : 'text-[var(--gk-ink)]')}>
        <span
          aria-hidden="true"
          className="absolute -top-10 -left-1 font-[family-name:var(--font-display)] text-[5rem] leading-none font-extrabold"
          style={{ color: onDark ? 'var(--gk-yellow)' : 'var(--gk-coral-deep)' }}
        >
          &ldquo;
        </span>
        {testimonial.quote.value.text}
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-4 text-[length:var(--fs-base)]">
        <img src={testimonial.photo} alt="" loading="lazy" decoding="async" className="size-14 shrink-0 rounded-full object-cover" />
        <span>
          <span className="font-bold">{testimonial.name}</span>
          <span className={onDark ? 'text-[var(--fg-inverse-2)]' : 'text-[var(--fg-2)]'}>, {testimonial.credentials}</span>
        </span>
      </figcaption>
    </figure>
  )
}

/** A testimonial band: the person's photograph bled off the right edge, the quote beside it. */
function TestimonialBand({ audience, navy, ground }: { audience: AudienceId; navy: boolean; ground: string }) {
  const testimonial = useTestimonial(audience)
  const photo = { src: testimonial.photo, alt: '' }
  return (
    <section
      data-ground={navy ? 'navy' : undefined}
      className={cn(navy ? 'ground-navy' : ground, 'accent-yellow band relative overflow-x-clip')}
      style={navy ? { backgroundColor: 'var(--gk-navy)' } : undefined}
    >
      <BleedPhoto photo={photo} side="right" width="40%" />
      <div className="shell relative">
        <PhonePhoto photo={{ src: testimonial.photo, alt: testimonial.name }} />
        <Reveal className="lg:max-w-[54%]">
          <figure className="flex flex-col pt-8">
            <blockquote className={cn('relative text-[length:clamp(1.375rem,2.6vw,2.125rem)] leading-[1.4] font-medium', navy ? 'text-white' : 'text-[var(--gk-ink)]')}>
              <span
                aria-hidden="true"
                className="absolute -top-12 -left-1 font-[family-name:var(--font-display)] text-[6rem] leading-none font-extrabold"
                style={{ color: navy ? 'var(--gk-yellow)' : 'var(--gk-coral-deep)' }}
              >
                &ldquo;
              </span>
              {testimonial.quote.value.text}
            </blockquote>
            <figcaption className="mt-8 text-[length:var(--fs-lg)]">
              <span className="font-bold">{testimonial.name}</span>
              <span className={navy ? 'text-[var(--fg-inverse-2)]' : 'text-[var(--fg-2)]'}>, {testimonial.credentials}</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
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
      {/* The grid reveals as one, so a tall card never leaves a hole while the
          smaller ones beside it have already arrived. */}
      <Reveal className="mt-12">
        {block.stories.length === 1 && block.testimonial ? (
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <StoryCard story={lead} />
            </div>
            <div className="flex items-center lg:col-span-7">
              <Quote audience={block.testimonial} />
            </div>
          </div>
        ) : block.stories.length === 1 ? (
          <StoryCard story={lead} wide />
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <StoryCard story={lead} tall />
            </div>
            <div className="grid gap-6 lg:col-span-5">
              {rest.map((story) => (
                <StoryCard key={story.org} story={story} side />
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </Band>
  )
}

function StoryCard({ story, wide = false, tall = false, side = false }: { story: Story; wide?: boolean; tall?: boolean; side?: boolean }) {
  return (
    <article
      className={cn(
        'h-full overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] text-[var(--gk-ink)]',
        wide && 'grid md:grid-cols-2',
        side ? 'flex flex-col sm:grid sm:grid-cols-[40%_1fr]' : !wide && 'flex flex-col',
      )}
    >
      <div className={cn('relative', wide ? 'min-h-[15rem]' : side ? 'aspect-[16/10] sm:aspect-auto sm:min-h-[13rem]' : tall ? 'aspect-[16/11]' : 'aspect-[16/10]')}>
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
        <h3 className={cn('leading-tight font-extrabold', wide || tall ? 'text-[length:var(--fs-2xl)]' : 'text-[length:var(--fs-xl)]')}>{story.org}</h3>
        <p className={cn('leading-relaxed text-[var(--fg-1)]', tall || wide ? 'text-[length:var(--fs-lg)]' : 'text-[length:var(--fs-base)]')}>{story.body}</p>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------ programs */

/** The two programs in full, side by side under one rule. Their photographs are in the hero. */
function Programs({ block, ground }: { block: Of<'programs'>; ground: string }) {
  return (
    <Band ground={ground}>
      {block.opening && (
        <Reveal className="max-w-[56rem]">
          {block.opening.map((paragraph, i) => (
            <p key={i} className="text-[length:clamp(1.25rem,2.2vw,1.75rem)] leading-[1.5] font-medium text-[var(--gk-ink)]">
              {paragraph}
            </p>
          ))}
        </Reveal>
      )}
      <Reveal className={cn('grid gap-12 md:grid-cols-2 md:gap-0', block.opening && 'mt-14')}>
        {block.cards.map((card, i) => (
          <article key={card.title} className={cn('flex flex-col gap-4 border-t-2 border-[var(--gk-navy)] pt-8', i === 0 ? 'md:pr-12' : 'md:border-l md:border-l-[var(--hairline-strong)] md:pl-12')}>
            <Label>{card.eyebrow}</Label>
            <h2 className="text-[length:clamp(1.625rem,2.6vw,2.25rem)] leading-tight font-extrabold">{card.title}</h2>
            <p className="max-w-[52ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-2)]">{card.body}</p>
            <div className="mt-auto pt-4">
              <CtaButton cta={card.cta} variant="primary" withArrow />
            </div>
          </article>
        ))}
      </Reveal>
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
      <Reveal delay={0.08} className="mt-12">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">The two programs compared</caption>
          <thead>
            <tr className="hidden md:table-row">
              <th scope="col" className="w-[18%] pb-5" />
              {block.columns.map((col) => (
                <th key={col.title} scope="col" className="pr-8 pb-5 align-bottom">
                  <a href={col.to} className="group inline-flex items-center gap-2 text-[length:var(--fs-2xl)] font-extrabold text-[var(--gk-ink)]">
                    {col.title}
                    <ArrowRight aria-hidden="true" className="size-5 text-[var(--gk-navy)] transition-transform duration-[var(--dur-base)] group-hover:translate-x-1" />
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.label} className="flex flex-col border-t border-[var(--hairline-strong)] md:table-row">
                <th scope="row" className="pt-6 pb-2 align-top md:py-6">
                  <Label>{row.label}</Label>
                </th>
                {row.values.map((value, i) => (
                  <td key={i} className="py-2 pr-8 align-top text-[length:var(--fs-lg)] leading-relaxed md:py-6">
                    <span className="mb-1 block text-[length:var(--fs-sm)] font-bold text-[var(--fg-2)] md:hidden">{block.columns[i].title}</span>
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
      <Reveal className="mt-10">
        <ul className="border-t border-[var(--hairline-strong)]">
          {block.items.map((item) => (
            <li key={item.to}>
              <a
                href={item.to}
                className="group flex items-start gap-6 border-b border-[var(--hairline-strong)] py-8 transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] md:px-4 md:hover:bg-[var(--gk-white)]"
              >
                <span className="flex flex-1 flex-col gap-2">
                  <Label>{item.label}</Label>
                  <span className="text-[length:var(--fs-2xl)] leading-tight font-extrabold text-balance text-[var(--gk-ink)]">{item.title}</span>
                  <span className="max-w-[64ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-2)]">{item.body}</span>
                </span>
                <span
                  className="mt-6 grid size-11 shrink-0 place-items-center rounded-[var(--r-btn)] border border-[var(--hairline-strong)] text-[var(--gk-navy)] transition-colors duration-[var(--dur-base)] group-hover:border-[var(--gk-navy)] group-hover:bg-[var(--gk-navy)] group-hover:text-white"
                  aria-hidden="true"
                >
                  <ArrowRight className="size-5 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
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
      {block.opening && (
        <section className={cn(LIGHT[tone % 2], 'relative pt-16 pb-10 md:pt-20')}>
          <div className="shell">
            <Reveal className="max-w-[56rem]">
              {block.opening.map((paragraph, i) => (
                <p key={i} className="text-[length:clamp(1.25rem,2.2vw,1.625rem)] leading-[1.5] font-medium text-[var(--gk-ink)]">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </section>
      )}
      {/* Columns that pin inside this region clear the switch as well as the header. */}
      <div className="[--pin-top:11rem]">
        <div className="sticky top-20 z-30 border-y border-[var(--hairline)] bg-[var(--gk-cream)] shadow-[var(--shadow-xs)]">
          <div className="shell flex items-center gap-x-5 py-3">
            <p id={`${id}-prompt`} className="hidden text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] sm:block">
              {block.prompt}
            </p>
            <div
              role="tablist"
              aria-labelledby={`${id}-prompt`}
              className="grid w-full grid-cols-2 rounded-[var(--r-btn)] border border-[var(--hairline-strong)] bg-[var(--gk-white)] p-1 sm:inline-grid sm:w-auto"
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
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${option.id}`} className="[&_h2]:scroll-mt-44">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={option.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Blocks blocks={body} startTone={tone + (block.opening ? 1 : 0)} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Blocks key={`${option.id}-close`} blocks={close} />
    </div>
  )
}

/* ------------------------------------------------------------- closing */

/** The homepage close, without its newsletter: one sentence, the buttons, the mark. */
function Closing({ block }: { block: Of<'closing'> }) {
  return (
    <section data-ground="navy" className="ground-navy accent-yellow relative overflow-hidden py-16 md:py-20" style={{ backgroundColor: 'var(--gk-navy)' }}>
      <div className="shell relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal delay={0.12}>
            <Title heading={block.headline} className="max-w-[26ch]" />
            <p className="lead mt-5 max-w-[52ch]">{block.body}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaButton cta={block.primary} variant="accent" onDark withArrow />
              {block.secondary && <CtaButton cta={block.secondary} variant="secondary" onDark />}
            </div>
          </Reveal>
        </div>
        <div className="flex justify-start lg:col-span-4 lg:justify-center">
          <MarkAssembly settled size={170} className="hidden lg:block" />
          <MarkAssembly settled size={96} className="lg:hidden" />
        </div>
      </div>
    </section>
  )
}
