import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { createContext, useContext, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { audiences } from '@/content/homepage'
import type { Block, Heading, Page, Photo, Story } from '@/content/pages'
import type { AudienceId, Cta } from '@/content/types'
import { Scribble } from '@/components/primitives/doodles'
import { GkButton } from '@/components/primitives/gk-button'
import { ArcPiece, MarkAssembly } from '@/components/primitives/logo-shapes'
import { Marker } from '@/components/primitives/marker'
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
      return <Faqs headline={block.headline.lead} headlineEm={block.headline.em} items={block.items} soft />
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
  decor,
}: {
  ground: string
  accent?: string
  children: ReactNode
  className?: string
  navy?: boolean
  /** Shapes anchored to the band's own edges, not the content column's. */
  decor?: ReactNode
}) {
  return (
    <section
      data-ground={navy ? 'navy' : undefined}
      className={cn(navy ? 'ground-navy' : ground, accent, 'band relative overflow-x-clip', className)}
      style={navy ? { backgroundColor: 'var(--gk-navy)' } : undefined}
    >
      {decor}
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

/**
 * The text with `phrase` (if it occurs) under the highlighter. A short phrase
 * is one unbroken swipe that wraps as a whole, so a line never ends on a
 * one-letter stub; a long one gets a swipe per line. A white swipe on navy
 * keeps white ends: the default ends are gold.
 */
function Highlighted({ text, phrase, hue }: { text: string; phrase?: string; hue?: string }) {
  const at = phrase ? text.indexOf(phrase) : -1
  if (!phrase || at < 0) return <>{text}</>
  const short = phrase.split(/\s+/).length <= 5
  /* Punctuation straight after the phrase goes inside the swipe: left
     outside, the stroke's overshoot painted over it. */
  const tail = /^[.,:;!?]/.test(text.slice(at + phrase.length)) ? text[at + phrase.length] : ''
  const marked = phrase + tail
  return (
    <>
      {text.slice(0, at)}
      {short ? (
        <Marker hue={hue} className="whitespace-nowrap" style={hue ? ({ '--marker-end': hue } as CSSProperties) : undefined}>
          {marked}
        </Marker>
      ) : (
        <MarkerText hue={hue}>{marked}</MarkerText>
      )}
      {text.slice(at + marked.length)}
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
/* The Canva highlight guide: every hand mark is this one yellow. */
const SCRIBBLE = 'var(--gk-scribble)'

function HandNote({
  children,
  color = 'var(--gk-ink)',
  mark = 'arrow-hook',
  tilt = -2,
  className,
}: {
  children: ReactNode
  color?: string
  /** Vary the hand: the same arrow at the same angle on every band reads as a stamp. */
  mark?: 'arrow-hook' | 'arrow-curve' | 'underline'
  tilt?: number
  className?: string
}) {
  if (mark === 'underline') {
    return (
      <span aria-hidden="true" className={cn('pointer-events-none inline-flex', className)} style={{ color }}>
        <span className="hand relative leading-tight" style={{ rotate: `${tilt}deg` }}>
          {children}
          <Scribble name="underline" color={SCRIBBLE} weight={3.5} className="absolute inset-x-0 -bottom-1.5 h-2.5 w-full" />
        </span>
      </span>
    )
  }
  return (
    <span aria-hidden="true" className={cn('pointer-events-none flex items-start gap-1.5', className)} style={{ color }}>
      <Scribble
        name={mark}
        color={SCRIBBLE}
        weight={3.5}
        className={cn('shrink-0', mark === 'arrow-hook' ? 'mt-0.5 h-8 w-12 -scale-y-100' : 'mt-1 h-10 w-9 -scale-x-100')}
      />
      <span className="hand leading-tight" style={{ rotate: `${tilt}deg` }}>
        {children}
      </span>
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
function BleedPhoto({
  photo,
  side,
  width = '42%',
  position = 'center',
}: {
  photo: Photo
  side: 'left' | 'right'
  width?: string
  /** Where the crop holds; a tall band crops a landscape photograph hard. */
  position?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-y-0 hidden lg:block', side === 'left' ? 'dissolve-r left-0' : 'dissolve-l right-0')}
      style={{ width }}
    >
      <img src={photo.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: position }} />
    </div>
  )
}

function PhonePhoto({ photo }: { photo: Photo }) {
  return (
    <div className="dissolve-b -mx-4 -mt-16 mb-8 h-64 sm:h-80 md:-mx-12 md:-mt-24 lg:hidden">
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
    </div>
  )
}

/** One large piece of the mark, bleeding off a band's edge: the shape layer's own rule. */
/**
 * One segment of the mark, bleeding off a band's edge: the mark's own span
 * (~72°) and stroke (13.8% of the ring). `start` is chosen per placement so
 * the drawn part, with one round cap, lands inside the band.
 */
function BandArc({
  className,
  start,
  sweep = 66,
  color = 'var(--gk-navy-lift)',
}: {
  className?: string
  start: number
  sweep?: number
  color?: string
}) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute', className ?? 'hidden lg:block')}>
      <ArcPiece sweep={sweep} start={start} thickness={14} color={color} />
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
  return (
    /* Pulled up under the sticky header, as the homepage hero is, so the
       header floats transparent on the navy. 82px is the header plus its rule. */
    <section
      data-ground="navy"
      className="ground-navy accent-yellow relative -mt-[82px] overflow-hidden pt-[82px] lg:pt-0"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <BandArc start={18} sweep={64} className="hidden lg:block -bottom-16 -left-44 size-[24rem]" />
      <BandArc start={300} sweep={60} className="lg:hidden -right-20 -bottom-24 size-60" />

      {block.photo && !block.links && (
        <div
          className="photo-bleed photo-bleed-b photo-bleed-lg-x relative h-48 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[44%]"
          aria-hidden="true"
        >
          <img src={block.photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}

      <div className={cn('shell relative pt-8 pb-16 lg:pt-[calc(82px+5.5rem)] lg:pb-24', block.links && 'grid items-center gap-12 lg:grid-cols-12')}>
        <Reveal className={block.links ? 'lg:col-span-6' : 'lg:max-w-[55%]'}>
          <p className="eyebrow mb-5">{block.eyebrow}</p>
          <Title heading={block.headline} as="h1" className="max-w-[24ch]" />
          <p className="lead mt-6 max-w-[48ch]">
            <Highlighted text={block.lead} phrase={block.highlight} hue="var(--gk-white)" />
          </p>

          {(block.primary || block.secondary) && (
            <div className="mt-9 flex flex-col items-stretch gap-x-6 gap-y-4 sm:flex-row sm:flex-wrap sm:items-center">
              {block.primary && <CtaButton cta={block.primary} variant="accent" onDark withArrow />}
              {block.secondary && <CtaButton cta={block.secondary} variant="tertiary" onDark className="self-start sm:self-auto" />}
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
                    <span className="flex min-h-[2.6em] items-end justify-between gap-3 text-[length:var(--fs-xl)] leading-tight font-extrabold">
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
      {block.photo && <BleedPhoto photo={block.photo} side="left" position={block.photoPosition} />}
      <div className="shell relative">
        {block.photo && <PhonePhoto photo={block.photo} />}
        <Reveal className={cn('flex flex-col gap-6', block.photo ? 'lg:ml-[46%] lg:max-w-[40rem]' : 'max-w-[60rem]')}>
          <Title heading={block.headline} className="max-w-[20ch]" />
          <p className="lead max-w-[56ch]">
            <Highlighted text={first} phrase={block.highlight} />
          </p>
          {rest.map((paragraph, i) => (
            <p key={i} className="max-w-[62ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-1)]">
              {paragraph}
            </p>
          ))}
          {block.note && (
            <HandNote mark="underline" tilt={-2} className="mt-2">
              {block.note}
            </HandNote>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/** The page's navy moment: one large sentence, the rest under it, a piece of the mark off the edge. */
function Statement({ block }: { block: Of<'prose'> }) {
  const [first, ...rest] = block.paragraphs
  return (
    <Band ground="" navy accent="accent-yellow" decor={<BandArc start={96} sweep={70} className="hidden lg:block -top-12 -right-16 size-[36rem]" />}>
      <Reveal className={cn('relative', block.facts ? 'grid gap-12 lg:grid-cols-12' : 'max-w-[64rem]')}>
        <div className={block.facts ? 'lg:col-span-7' : undefined}>
        <Title heading={block.headline} className="max-w-[22ch]" />
        <p className="mt-8 text-[length:clamp(1.25rem,2.2vw,1.75rem)] leading-[1.5] font-medium text-white">
          <Highlighted text={first} phrase={block.highlight} hue="var(--gk-white)" />
        </p>
        {rest.map((paragraph, i) => (
          <p key={i} className="mt-6 max-w-[62ch] text-[length:var(--fs-lg)] leading-relaxed text-white/80">
            {paragraph}
          </p>
        ))}
        </div>
        {block.facts && (
          <dl className="flex flex-col self-end lg:col-span-4 lg:col-start-9">
            {block.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 border-t border-[var(--hairline-inverse)] py-4">
                <dt className="text-[length:var(--fs-sm)] font-bold text-[var(--gk-yellow)]">{fact.label}</dt>
                <dd className="text-[length:var(--fs-lg)] leading-snug text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
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
  const enough = count >= 3

  const result = (
    <div className="mt-8 hidden min-h-12 flex-col items-start gap-4 lg:flex" aria-live="polite">
      {enough ? (
        <>
          <p className="text-[length:var(--fs-lg)] leading-snug font-bold">
            {count} of {block.items.length} sound familiar. That is worth a conversation.
          </p>
          <GkButton href="#contact" variant="primary" withArrow>
            {ctaLabel}
          </GkButton>
        </>
      ) : (
        count > 0 && <p className="text-[length:var(--fs-base)] text-[var(--fg-1)]">{count} ticked so far.</p>
      )}
    </div>
  )

  /* An odd last line runs the full width, so the grid never shows an empty cell. */
  const list = (
    <ul className="grid gap-px overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 [&>li:last-child:nth-child(odd)]:sm:col-span-2">
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
                  'relative mt-1 grid size-6 shrink-0 place-items-center rounded-[var(--r-sm)] border-2 bg-[var(--gk-white)] transition-colors duration-[var(--dur-fast)]',
                  on ? 'border-[var(--gk-navy)]' : 'border-[rgb(47_74_146_/_0.4)] group-hover:border-[var(--gk-navy)]',
                )}
              >
                {on && <Scribble name="check" color="var(--gk-navy)" weight={4} duration={0.3} className="absolute -top-2.5 -right-2.5 size-8" />}
              </span>
              <span className="text-[length:var(--fs-lg)] leading-snug text-[var(--gk-ink)]">{on ? <MarkerText>{item}</MarkerText> : item}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )

  const heading = (
    <>
      <Title heading={block.headline} className="max-w-[18ch]" />
      {block.intro && <p className="mt-5 max-w-[48ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]">{block.intro}</p>}
      <HandNote mark="underline" tilt={-1.5} className="mt-5">
        tick what sounds familiar
      </HandNote>
      <p className="mt-3 max-w-[30ch] text-[length:var(--fs-sm)] text-[var(--fg-2)]">Nothing is saved. It is just for you.</p>
    </>
  )

  /* On a phone the count and the button ride along at the foot of the list,
     so ticking the third line visibly does something. */
  const phoneBar = enough && (
    <div className="sticky bottom-4 z-20 mt-4 flex flex-col gap-3 rounded-[var(--r-lg)] bg-[var(--gk-navy)] p-4 text-white shadow-[var(--shadow-md)] lg:hidden">
      <span className="text-[length:var(--fs-sm)] font-bold">
        {count} of {block.items.length} sound familiar.
      </span>
      <GkButton href="#contact" variant="accent" onDark withArrow className="w-full">
        {ctaLabel}
      </GkButton>
    </div>
  )

  return (
    <Band
      ground={ground}
      accent="accent-yellow"
      className="!bg-[var(--gk-yellow-tint)]"
      decor={<BandArc start={16} sweep={60} color="var(--gk-yellow)" className="hidden lg:block -bottom-20 -left-40 size-[20rem]" />}
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className={block.aside ? 'lg:col-span-8' : 'lg:col-span-4'}>
          <div className={block.aside ? undefined : 'lg:sticky lg:top-[var(--pin-top,8rem)]'}>
            {heading}
            {!block.aside && result}
          </div>
          {block.aside && (
            <div className="mt-8">
              {list}
              {result}
              {phoneBar}
            </div>
          )}
        </Reveal>
        {block.aside ? (
          <div className="lg:col-span-4">
            <aside className="rounded-[var(--r-lg)] bg-[var(--gk-white)] p-8 shadow-[var(--shadow-xs)] lg:sticky lg:top-[var(--pin-top,8rem)]">
              <p className="max-w-[26ch] text-[length:var(--fs-lg)] leading-snug font-bold">{block.aside.intro}</p>
              <ol className="mt-6 flex flex-col">
                {block.aside.people.map((person, i) => (
                  <li key={person} className="flex flex-col gap-1.5 border-t border-[var(--hairline-strong)] py-4">
                    <span className="text-[length:var(--fs-sm)] font-bold text-[var(--gk-teal-ink)]">
                      {i === 0 ? 'Organisational influence' : 'Measurement expertise'}
                    </span>
                    <span className="text-[length:var(--fs-base)] leading-snug">{person}</span>
                  </li>
                ))}
              </ol>
              <p className="border-t border-[var(--hairline-strong)] pt-4 text-[length:var(--fs-sm)] leading-relaxed text-[var(--fg-1)]">{block.aside.outro}</p>
            </aside>
          </div>
        ) : (
          <Reveal className="lg:col-span-8">
            {list}
            {phoneBar}
          </Reveal>
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
      return <PathCells block={block} ground={ground} />
  }
}

/** A band's heading with its intro beside it, so the right half is never left empty. */
function StepsHeader({ block, className }: { block: Of<'steps'>; className?: string }) {
  return (
    <Reveal className={cn('grid gap-6 lg:grid-cols-12 lg:gap-12', className)}>
      <Title heading={block.headline} className="max-w-[18ch] lg:col-span-5" />
      {block.intro && (
        <div className="flex flex-col gap-4 lg:col-span-7 lg:pt-2">
          {block.intro.map((line, i) => (
            <p key={i} className={i === 0 ? 'lead' : 'text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]'}>
              {line}
            </p>
          ))}
        </div>
      )}
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
            <div
              key={s.title}
              className={cn('relative border-[var(--hairline)] [&:not(:first-child)]:border-t', isOpen && 'ground-navy')}
              style={isOpen ? { backgroundColor: 'var(--gk-navy)' } : undefined}
              data-ground={isOpen ? 'navy' : undefined}
            >
              {isOpen && s.photo && (
                <div className="photo-bleed photo-bleed-lg-x absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden="true">
                  <img src={s.photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              )}
              <h3 className="relative">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${id}-${i}`}
                  onClick={() => setOpen(i)}
                  className={cn(
                    'flex w-full items-center gap-5 px-6 py-6 text-left transition-colors duration-[var(--dur-base)] focus-visible:shadow-[inset_0_0_0_3px_var(--gk-yellow)] focus-visible:outline-none md:px-10',
                    isOpen ? 'cursor-default md:w-1/2' : 'hover:bg-[var(--gk-cream-deep)]',
                  )}
                >
                  <span className={cn('w-8 shrink-0 text-[length:var(--fs-lg)] font-extrabold tabular-nums', isOpen ? 'text-[var(--gk-yellow)]' : 'text-[var(--gk-blue-deep)]')}>
                    {number(i)}
                  </span>
                  <span className={cn('flex-1 text-[length:var(--fs-2xl)] leading-tight font-extrabold', isOpen ? 'text-white' : 'text-[var(--gk-ink)]')}>{s.title}</span>
                  {!isOpen && s.lead && <span className="hidden max-w-[42ch] flex-1 truncate text-[length:var(--fs-base)] text-[var(--fg-2)] lg:block">{s.lead}</span>}
                  {!isOpen && <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-[var(--gk-navy)]" />}
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
                    className="relative overflow-hidden"
                  >
                    {s.photo && (
                      <div className="photo-bleed photo-bleed-b relative h-52 md:hidden" aria-hidden="true">
                        <img src={s.photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex flex-col gap-4 px-6 pt-1 pb-10 md:w-1/2 md:pr-10 md:pb-12 md:pl-[5.75rem]">
                      {s.lead && <p className="text-[length:var(--fs-xl)] leading-snug font-semibold text-balance text-[var(--gk-yellow)]">{s.lead}</p>}
                      {s.body.map((paragraph, j) => (
                        <p key={j} className="max-w-[54ch] text-[length:var(--fs-base)] leading-relaxed text-white/85">
                          {paragraph}
                        </p>
                      ))}
                      {s.visual && (
                        <div aria-hidden="true" className="mt-2 w-56">
                          <ProgramVisual name={s.visual} onDark />
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

/** Ways in: a choice, not a sequence, so all three side by side on one hairline plane. */
function PathCells({ block, ground }: { block: Of<'steps'>; ground: string }) {
  return (
    <Band ground={ground}>
      <StepsHeader block={block} />
      <Reveal className="mt-12">
        <ul className="grid gap-px overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--hairline)] lg:grid-cols-3">
          {block.steps.map((s) => (
            <li key={s.title} className="flex flex-col bg-[var(--gk-white)]">
              {s.photo && (
                <div className="dissolve-b aspect-[16/10] overflow-hidden">
                  <img src={s.photo.src} alt={s.photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="-mt-6 flex flex-1 flex-col gap-4 p-8">
                <h3 className="text-[length:var(--fs-xl)] leading-tight font-extrabold text-balance">{s.title}</h3>
                {s.body.map((paragraph, j) => (
                  <p key={j} className="text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]">
                    {paragraph}
                  </p>
                ))}
                {s.ctas && (
                  <div className="mt-auto flex flex-col items-start gap-3 pt-3">
                    {[...s.ctas].reverse().map((cta) => (
                      <CtaButton key={cta.label} cta={cta} variant={cta === s.ctas?.[0] ? 'primary' : 'tertiary'} withArrow={cta === s.ctas?.[0]} />
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
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
              <li
                key={s.title}
                className={cn('flex flex-col gap-5 bg-[var(--gk-white)] p-8', wide ? 'md:col-span-3 lg:grid lg:grid-cols-[1fr_15rem] lg:items-center lg:gap-8' : 'md:col-span-2')}
              >
                {s.visual && (
                  <div className={cn('w-full max-w-[15rem]', wide && 'lg:order-last')}>
                    <ProgramVisual name={s.visual} />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[length:var(--fs-xl)] leading-tight font-extrabold">{s.title}</h3>
                  {s.body.map((paragraph, j) => (
                    <p key={j} className="text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]">
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
        <ol className="grid gap-12 md:grid-cols-3 md:gap-16">
          {block.steps.map((s, i) => (
            <li key={s.title} className="relative flex flex-col gap-4">
              <div className="relative flex items-center">
                <span className="relative grid size-14 shrink-0 place-items-center text-[length:var(--fs-2xl)] font-extrabold text-[var(--gk-navy)]">
                  {i + 1}
                  <Scribble name={i === 1 ? 'oval' : 'circle'} color={SCRIBBLE} weight={3.5} delay={0.15 + i * 0.25} className="absolute -inset-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+0.75rem)]" />
                </span>
                {/* Runs from this number across the column to the next one. */}
                {i < block.steps.length - 1 && (
                  <Scribble
                    name="underline-swash"
                    color={SCRIBBLE}
                    weight={3}
                    delay={0.35 + i * 0.25}
                    className="absolute top-1/2 left-20 hidden h-4 w-[calc(100%-1rem)] -translate-y-1/2 md:block"
                  />
                )}
              </div>
              <h3 className="text-[length:var(--fs-2xl)] leading-tight font-extrabold">{s.title}</h3>
              {s.body.map((paragraph, j) => (
                <p key={j} className="max-w-[36ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-1)]">
                  {paragraph}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </Reveal>
      {block.outro && (
        <Reveal className="mt-14 border-t border-[var(--hairline-strong)] pt-8">
          <p className="lead max-w-[60ch]">{block.outro}</p>
        </Reveal>
      )}
    </Band>
  )
}

/* -------------------------------------------------------- deliverables */

function Deliverables({ block, ground }: { block: Of<'deliverables'>; ground: string }) {
  return (
    <Band ground={ground} accent="accent-coral">
      {block.shift && (
        <>
          <Reveal className="mb-12">
            <Title heading={block.headline} className="max-w-[22ch]" />
          </Reveal>
          <Shift shift={block.shift} />
        </>
      )}

      <div className={cn('grid gap-12 lg:grid-cols-12 lg:gap-16', block.shift && 'mt-16')}>
        <div className="lg:col-span-5">
          <Reveal>
            {!block.shift && <Title heading={block.headline} className="max-w-[18ch]" />}
            {block.shift && block.intro && <p className="lead max-w-[36ch] font-semibold">{block.intro}</p>}
            {block.opening?.map((paragraph, i) => (
              <p key={i} className={i === 0 ? 'lead mt-6' : 'mt-4 text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]'}>
                {paragraph}
              </p>
            ))}
            {block.visual && (
              <div aria-hidden="true" className="mt-10 hidden max-w-[20rem] lg:block">
                <ProgramVisual name={block.visual} />
              </div>
            )}
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7">
          {!block.shift && block.intro && <p className="mb-7 text-[length:var(--fs-lg)] font-bold">{block.intro}</p>}
          <ul className="grid content-start gap-x-10 gap-y-7 sm:grid-cols-2 [&>li:last-child:nth-child(odd)]:sm:col-span-2">
            {block.items.map((item) => (
              <li key={item} className="flex gap-4">
                <Scribble name="check" color="var(--gk-navy)" weight={4} className="mt-0.5 size-7 shrink-0" />
                <span className="text-[length:var(--fs-lg)] leading-snug text-[var(--gk-ink)]">{item}</span>
              </li>
            ))}
          </ul>
          {block.duration && (
            <div className="mt-12">
              <Duration text={block.duration} weeks={block.weeks} />
            </div>
          )}
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
  const max = weeks ? Math.ceil((weeks[1] + 4) / 2) * 2 : 0
  const ticks = weeks ? Array.from({ length: max / 2 + 1 }, (_, i) => i * 2) : []
  const at = (w: number) => `${(w / max) * 100}%`

  return (
    <Reveal delay={0.1} className="border-t border-[var(--hairline-strong)] pt-6">
      <Label>Indicative duration</Label>

      {weeks && (
        <div className="relative mt-10 h-12" aria-hidden="true">
          <span
            className="absolute -top-7 -translate-x-1/2 text-[length:var(--fs-sm)] font-extrabold whitespace-nowrap text-[var(--gk-ink)]"
            style={{ left: at((weeks[0] + weeks[1]) / 2) }}
          >
            {weeks[0]}-{weeks[1]} weeks
          </span>
          <motion.span
            className="marker absolute top-0 !m-0 block h-4 -translate-y-1/2"
            style={{ left: at(weeks[0]), width: at(weeks[1] - weeks[0]), transformOrigin: 'left' }}
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-x-0 top-0 border-t-2 border-[var(--gk-navy)]" />
          {ticks.map((t) => (
            <span key={t} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: at(t) }}>
              <span className="h-2 w-px bg-[var(--gk-navy)]" />
              <span className="mt-1 text-[length:var(--fs-xs)] text-[var(--fg-2)] tabular-nums">{t}</span>
            </span>
          ))}
        </div>
      )}

      <p className="mt-2 text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]">{text}</p>
    </Reveal>
  )
}

/** Before and after: the "after" question's second clause takes the highlighter. */
function Shift({ shift }: { shift: NonNullable<Of<'deliverables'>['shift']> }) {
  const comma = shift.after.indexOf(', ')
  const phrase = comma > 0 ? shift.after.slice(comma + 2) : shift.after
  return (
    <Reveal className="grid items-start gap-8 border-b border-[var(--hairline-strong)] pb-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
      <figure>
        <figcaption className="hand text-[var(--fg-2)]">{shift.beforeLabel.toLowerCase()}</figcaption>
        <blockquote className="mt-3 text-[length:clamp(1.375rem,2.6vw,2rem)] leading-snug font-medium text-[var(--fg-2)]">
          &ldquo;{shift.before}&rdquo;
        </blockquote>
      </figure>
      <Scribble name="arrow-curve" color={SCRIBBLE} weight={4} className="mt-6 h-14 w-16 rotate-90 lg:mx-auto lg:mt-8 lg:h-16 lg:w-20 lg:rotate-0" />
      <figure>
        <figcaption className="hand text-[var(--gk-ink)]">{shift.afterLabel.toLowerCase()}</figcaption>
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

/** What the program changes: the heading beside a two-column ledger under hairlines. */
function Outcomes({ block, ground }: { block: Of<'outcomes'>; ground: string }) {
  return (
    <Band ground={ground} accent="accent-coral" decor={<BandArc start={200} sweep={64} color="var(--gk-coral)" className="hidden lg:block -right-36 -bottom-40 size-[22rem]" />}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <Title heading={block.headline} className="max-w-[16ch] lg:sticky lg:top-[var(--pin-top,8rem)]" />
        </Reveal>
        <Reveal className="lg:col-span-8">
          <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2 [&>li:last-child:nth-child(odd)]:md:col-span-2">
            {block.items.map((item) => (
              <li key={item.title} className="flex flex-col gap-3 border-t border-[var(--hairline-strong)] pt-5">
                <h3 className="text-[length:var(--fs-xl)] leading-tight font-extrabold text-balance">{item.title}</h3>
                <p className="max-w-[60ch] text-[length:var(--fs-base)] leading-relaxed text-[var(--fg-1)]">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
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
      <BleedPhoto photo={photo} side="right" width="38%" position="center 30%" />
      <div className="shell relative">
        <PhonePhoto photo={{ src: testimonial.photo, alt: testimonial.name }} />
        <Reveal className="flex min-h-[22rem] items-center lg:max-w-[56%]">
          <figure className="flex flex-col pt-8">
            <blockquote className={cn('relative max-w-[46ch] text-[length:clamp(1.25rem,1.9vw,1.625rem)] leading-[1.5] font-medium', navy ? 'text-white' : 'text-[var(--gk-ink)]')}>
              <span
                aria-hidden="true"
                className="absolute -top-9 -left-1 font-[family-name:var(--font-display)] text-[4rem] leading-none font-extrabold"
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
          <div className="relative grid overflow-hidden rounded-[var(--r-lg)] bg-[var(--gk-white)] md:grid-cols-2">
            <div className="dissolve-r relative min-h-[18rem]">
              <img src={lead.image} alt={lead.imageAlt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center gap-4 p-8 md:py-14 md:pr-14 md:pl-4">
              <StoryTags story={lead} />
              <h3 className="text-[length:clamp(1.75rem,3vw,2.5rem)] leading-tight font-extrabold">{lead.org}</h3>
              <p className="lead max-w-[42ch]">{lead.body}</p>
            </div>
          </div>
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

function StoryTags({ story }: { story: Story }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]" style={{ background: 'var(--gk-beige-deep)' }}>
        {story.sector}
      </span>
      <span className="chip text-[length:var(--fs-xs)] text-[var(--gk-ink)]" style={{ background: INTERVENTION_TINTS[story.intervention] ?? 'var(--gk-teal-tint)' }}>
        {story.intervention}
      </span>
    </div>
  )
}

function StoryCard({ story, wide = false, tall = false, side = false }: { story: Story; wide?: boolean; tall?: boolean; side?: boolean }) {
  return (
    <article
      className={cn(
        'h-full overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] text-[var(--gk-ink)]',
        wide && 'grid md:grid-cols-2',
        !wide && 'flex flex-col',
      )}
    >
      <div className={cn('relative', wide ? 'min-h-[15rem]' : side ? 'aspect-[16/7]' : tall ? 'min-h-[20rem] flex-1' : 'aspect-[16/10]')}>
        <img src={story.image} alt={story.imageAlt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className={cn('flex flex-col gap-3', !tall && 'flex-1', wide ? 'justify-center p-8 md:p-12' : side ? 'justify-center p-6' : 'p-8')}>
        <StoryTags story={story} />
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
      {(block.headline || block.opening) && (
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          {block.headline && <Title heading={block.headline} className="max-w-[18ch] lg:col-span-5" />}
          <div className="flex flex-col gap-4 lg:col-span-7 lg:pt-2">
            {block.opening?.map((paragraph, i) => (
              <p key={i} className="lead">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      )}
      {/* Subgrid rows, so the two columns' labels and buttons share a line. */}
      <Reveal className="mt-12 grid gap-12 md:grid-cols-2 md:grid-rows-[auto_auto_auto_1fr_auto] md:gap-x-0 md:gap-y-4">
        {block.cards.map((card, i) => (
          <article
            key={card.title}
            className={cn('flex flex-col gap-4 rounded-[var(--r-lg)] p-8 md:row-span-5 md:grid md:grid-rows-subgrid md:p-10', i === 0 ? 'md:mr-3' : 'md:ml-3')}
            style={{ background: i === 0 ? 'var(--gk-yellow-tint)' : 'var(--gk-blue-tint)' }}
          >
            <Label>{card.eyebrow}</Label>
            <h2 className="text-[length:clamp(1.625rem,2.6vw,2.25rem)] leading-tight font-extrabold">{card.title}</h2>
            <p className="max-w-[52ch] text-[length:var(--fs-lg)] leading-relaxed text-[var(--fg-1)]">{card.body}</p>
            {card.facts ? (
              <dl className="mt-2 grid content-start gap-3 border-t border-[rgb(20_19_26_/_0.12)] pt-5">
                {card.facts.map((fact) => (
                  <div key={fact.label} className="text-[length:var(--fs-base)] leading-relaxed">
                    <dt className="inline font-bold">{fact.label}. </dt>
                    <dd className="inline">{fact.label === 'Next cohort' ? <Marker>{fact.value}</Marker> : fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <span />
            )}
            <div className="pt-4">
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

/* The homepage "What we do" card tints, so sibling pages read in the same
   language the homepage already taught. */
const CARD_THEMES = [
  { ground: 'var(--gk-yellow-tint)', label: 'var(--gk-yellow-ink)' },
  { ground: 'var(--gk-blue-tint)', label: 'var(--gk-blue-deep)' },
  { ground: 'var(--gk-coral-tint)', label: 'var(--gk-coral-ink)' },
  { ground: 'var(--gk-teal-tint)', label: 'var(--gk-teal-ink)' },
]

/** Sibling pages as the homepage's tinted cards, each card a link. */
function RelatedList({ block, ground }: { block: Of<'related'>; ground: string }) {
  return (
    <Band ground={ground}>
      <Reveal>
        <Title heading={block.headline} className="max-w-[22ch]" />
      </Reveal>
      <Reveal className="mt-10">
        <ul className={cn('grid gap-4 md:gap-5', block.items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3')}>
          {block.items.map((item, i) => {
            const theme = CARD_THEMES[i % CARD_THEMES.length]
            return (
              <li key={item.to}>
                <a
                  href={item.to}
                  className="card-lift group flex h-full flex-col rounded-[var(--r-lg)] p-7 text-[var(--gk-ink)] md:p-8"
                  style={{ background: theme.ground }}
                >
                  <span className="text-[length:var(--fs-xs)] font-extrabold tracking-[var(--tracking-label)] uppercase" style={{ color: theme.label }}>
                    {String(i + 1).padStart(2, '0')} / {item.label}
                  </span>
                  <span className="mt-4 text-[length:clamp(1.375rem,2.2vw,1.75rem)] leading-tight font-extrabold text-balance">{item.title}</span>
                  <span className="mt-4 text-[length:var(--fs-base)] leading-relaxed">{item.body}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[length:var(--fs-sm)] font-bold" style={{ color: theme.label }}>
                    Explore
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-[var(--dur-base)] group-hover:translate-x-[3px]" />
                  </span>
                </a>
              </li>
            )
          })}
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
  const panel = useRef<HTMLDivElement>(null)
  const option = block.options.find((o) => o.id === active) ?? block.options[0]
  /* Switching from deep in the page lands on the start of the new content,
     not in the middle of something else. */
  const choose = (next: string) => {
    setActive(next)
    const top = panel.current?.getBoundingClientRect().top ?? 0
    if (top < 0) panel.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const i = block.options.findIndex((o) => o.id === active)
    const last = block.options.length - 1
    const at = event.key === 'Home' ? 0 : event.key === 'End' ? last : (i + (event.key === 'ArrowRight' ? 1 : last)) % block.options.length
    const next = block.options[at]
    choose(next.id)
    document.getElementById(`${id}-tab-${next.id}`)?.focus()
  }
  /* The close sits outside the pinned region so the switch has scrolled
     away before it reaches the close's buttons. */
  /* The switch is pinned only over what changes with the audience. The
     shared tail (other services, partners, the close) scrolls free of it. */
  const tailAt = option.blocks.findIndex((b) => b.kind === 'related' || b.kind === 'partners' || b.kind === 'closing')
  const body = tailAt < 0 ? option.blocks : option.blocks.slice(0, tailAt)
  const close = tailAt < 0 ? [] : option.blocks.slice(tailAt)

  return (
    <div>
      {/* Columns that pin inside this region clear the switch as well as the header. */}
      <div className="[--pin-top:11rem]">
        <div className="sticky top-20 z-30 border-y border-[var(--hairline)] bg-[var(--gk-cream)] shadow-[var(--shadow-xs)]">
          <div className="shell flex items-center gap-x-5 py-2">
            <p id={`${id}-prompt`} className="hidden text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] sm:block">
              {block.prompt}
            </p>
            <div
              role="tablist"
              aria-labelledby={`${id}-prompt`}
              onKeyDown={onKey}
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
                    tabIndex={selected ? 0 : -1}
                    onClick={() => choose(o.id)}
                    className={cn(
                      'rounded-[calc(var(--r-btn)-1px)] px-4 py-2 text-[length:var(--fs-sm)] font-bold transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gk-navy)]',
                      selected ? 'bg-[var(--gk-yellow)] text-[var(--gk-navy-deep)]' : 'text-[var(--gk-navy)] hover:bg-[var(--gk-blue-tint)]',
                    )}
                  >
                    <span className="sm:hidden">{o.short ?? o.label}</span>
                    <span className="hidden sm:inline">{o.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div ref={panel} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${option.id}`} className="scroll-mt-40 [&_h2]:scroll-mt-44">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={option.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Blocks blocks={body} startTone={tone} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Blocks key={`${option.id}-close`} blocks={close} startTone={tone + body.filter((b) => !isNavy(b)).length} />
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
        <div className="flex justify-center lg:col-span-4">
          <MarkAssembly size={170} settleAt={0.8} className="hidden lg:block" />
          <MarkAssembly size={110} settleAt={0.85} className="lg:hidden" />
        </div>
      </div>
    </section>
  )
}
