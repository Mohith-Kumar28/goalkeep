import type { CaseCard } from '@/components/design/case-study-cards'
import type { ExploreCard } from '@/components/design/explore-more'
import type { HeroPhoto } from '@/components/design/hero'
import type { Tone } from '@/components/design/tones'

/** Authored inline markup copied from the 6 Nov design: only <em>, <strong>,
 *  <br class="dc-br-d">, <span class="dc-nowrap"> and plain text. Rendered with innerHTML, so it must
 *  never carry user input. */
export type Html = string

/** An illustration's raw SVG markup, imported from a sibling file with `?raw`. */
export type Svg = string

export type ServiceSlug =
  | 'impact-and-measurement-strategy'
  | 'data-systems-and-workflows'
  | 'dashboards-and-reporting'
  | 'data-adoption-and-capacity-building'

export type Verdict = { title: string; body: string }

/** One sticky note: its text and the 20px stroke icon, a full
 *  `<svg width="20" height="20" viewBox="0 0 24 24" ...>` imported with `?raw`.
 *  The template cycles tints from the page tone. */
export type Sign = { text: string; icon: Svg }

/** The six-signs sticky notes. Verdicts are picked by how many notes are
 *  tapped: none, one or two, three or more. */
export type SixSigns = {
  heading: Html
  prompt: string
  cta: string
  verdicts: { none: Verdict; few: Verdict; many: Verdict }
  signs: Array<Sign>
}

export type CaseQuote = {
  text: string
  name: string
  org: string
  avatar: { src: string; alt: string }
}

/** One audience of a page that has a sticky nonprofit/funder switch. Switching
 *  clears the tapped notes. The page-level fields are the nonprofit view; the
 *  optional fields here replace them when this audience is chosen. */
export type AudienceView = {
  label: string
  sub: string
  /** The pill above the signs, deliverables, case study and contact heading. */
  tag: string
  signs?: { heading: Html; items: Array<Sign> }
  deliverables?: Array<Deliverable>
  caseStudy?: CaseCard
  caseQuote?: CaseQuote
  contact?: { heading: Html; body: string }
}

export type Audiences = { nonprofit: AudienceView; funder: AudienceView }

export type ApproachAction =
  /** A primary button that opens the contact form with its label as the intent. */
  | { kind: 'form'; label: string }
  /** A text link with an arrow, in the page tone's ink. */
  | { kind: 'link'; label: string; href: string }

export type ApproachRow = {
  heading: Html
  body: Html
  photo: HeroPhoto
  /** A text link on its own line under the body. */
  link?: { label: string; href: string }
  /** Buttons and links in one row under the body. */
  actions?: Array<ApproachAction>
}

export type Deliverable = { label: string; illustration: Svg }

/** A bar on the duration ruler, over `from`..`to` of the ticks (0-based, `to`
 *  exclusive). Ticks inside any span are emphasised. */
export type RulerSpan = {
  from: number
  to: number
  /** The bracketed caption above the bar. */
  caption: string
  /** A bold row title above the bar, for rulers with more than one. */
  label?: string
  /** A caption for the hatched stripe that runs from `to` to the last tick. */
  trail?: string
}

export type Duration = {
  eyebrow: string
  heading: Html
  body: string
  /** One label per ruler cell, e.g. `weekTicks(10)`, `monthTicks(6)` or `['4 hours', '1 day']`. */
  ticks: Array<string>
  spans: Array<RulerSpan>
  /** The single-bar ruler of the impact page: 64px of headroom and no gap under the bar. */
  compact?: boolean
}

export const monthTicks = (months: number): Array<string> => Array.from({ length: months }, (_, i) => `mo ${i + 1}`)

export const weekTicks = (weeks: number): Array<string> => Array.from({ length: weeks }, (_, i) => `wk ${i + 1}`)

export type Deliverables = { heading: Html; items: Array<Deliverable> }

export type ServicePageContent = {
  slug: ServiceSlug
  /** One of the four homepage service titles; the contact form sends it. */
  service: string
  meta: { title: string; description: string }
  /** Page colour; the header and hero take it. */
  tone: Tone
  hero: {
    headline: Html
    lead: string
    primary: string
    secondary: { label: string; href: string }
    photos: Array<HeroPhoto>
    /** The dashboards page sits its buttons 24px under the lead, the others 28px. */
    tightActions?: boolean
  }
  audiences?: Audiences
  signs: SixSigns
  approach: { eyebrow: string; rows: Array<ApproachRow> }
  deliverables: Deliverables
  duration: Duration
  caseStudy: CaseCard
  caseQuote?: CaseQuote
  /** The impact page's roomier case study text column: 44px padding and looser gaps. */
  caseRoomy?: boolean
  contact: { heading: Html; body: string; ctas: Array<string> }
  explore: { heading: Html; cards: Array<ExploreCard> }
}
