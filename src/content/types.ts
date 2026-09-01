/**
 * Content types for the Goalkeep site.
 *
 * Every claim we cannot yet source carries a `verify` note. VERIFY.md is
 * generated from these fields (`pnpm verify:report`), so the client sign-off
 * list can never drift from what the page actually says.
 */

export type Verify<T> = {
  value: T
  /** Why this needs client sign-off. Omit once confirmed. */
  verify?: string
}

/** The three accents a band may claim, plus the neutral default.
 *  Enforced by the Single-Accent Viewport Rule: one per band, earned
 *  by meaning — blue = data, teal = outcome, coral = people. */
export type BandAccent = 'neutral' | 'blue' | 'teal' | 'coral'

export type Cta = {
  label: string
  to: string
}

export type Pillar = {
  index: string
  /** The stage's hue, carried from the hero pills into this section. */
  hue: 'blue' | 'teal' | 'coral'
  title: string
  body: string
  /** Mono marginalia in the left rail. A note, not a label. */
  marginalia?: string
}

export type StatCard = Verify<{
  figure: string
  sentence: string
}>

export type PullQuote = Verify<{
  text: string
  attribution: string
}>

export type AudienceId = 'early-stage' | 'mid-sized' | 'funders'

export type Audience = {
  id: AudienceId
  label: string
  image: string
  imageAlt: string
  /** The relatability statement — they should recognise themselves. */
  relatability: string
  problem: string
  quote: PullQuote
  primaryCta: Cta
  secondaryCta: Cta
}

export type CaseStudy = {
  slug: string
  tags: Array<string>
  title: string
  /** Mono stat line under the title. */
  stat: Verify<string>
  /** The charcoal inverse card — every fifth card, for tonal break. */
  inverse?: boolean
  /** Inverse cards carry prose instead of a photograph. */
  body?: string
  image?: string
  imageAlt?: string
}

export type FieldNote = {
  slug: string
  date: string
  readingTime: string
  title: string
  dek: string
  tag: string
  inverse?: boolean
  badge?: string
}

export type Faq = Verify<{
  question: string
  answer: string
}>

export type PartnerLogo = {
  file: string
  name: string
  /** Funders and intermediaries ride the second row. */
  kind: 'org' | 'funder'
}
