import type { CaseCard } from '@/components/design/case-study-cards'
import type { ExploreCard } from '@/components/design/explore-more'
import type { HeroPhoto } from '@/components/design/hero'
import type { Tone } from '@/components/design/tones'

/** Authored inline markup copied from the 6 Nov design: only <em>, <strong>,
 *  <br class="dc-br-d"> and plain text. Rendered with innerHTML, so it must
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

/** The six-signs sticky notes. Verdicts are picked by how many notes are
 *  tapped: none, one or two, three or more. */
export type SixSigns = {
  heading: Html
  prompt: string
  cta: string
  verdicts: { none: Verdict; few: Verdict; many: Verdict }
  signs: Array<string>
}

/** Dashboards only: a sticky nonprofit/funder switch that swaps the signs and
 *  clears what was tapped. */
export type AudienceSigns = {
  nonprofit: { label: string; sub: string; tag: string; signs: Array<string> }
  funder: { label: string; sub: string; tag: string; signs: Array<string> }
}

export type ApproachRow = { heading: Html; body: Html; photo: HeroPhoto }

export type Deliverable = { label: string; illustration: Svg }

export type Duration = {
  eyebrow: string
  heading: Html
  body: string
  /** Inclusive week range that is highlighted on the ruler. */
  range: [number, number]
  /** Weeks drawn on the ruler, 1..n. */
  weeks: number
  note: string
}

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
  }
  audiences?: AudienceSigns
  signs: SixSigns
  approach: { eyebrow: string; rows: Array<ApproachRow> }
  deliverables: { heading: Html; items: Array<Deliverable> }
  duration: Duration
  caseStudy: CaseCard
  contact: { heading: Html; body: string; ctas: Array<string> }
  explore: { heading: Html; cards: Array<ExploreCard> }
}
