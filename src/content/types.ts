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

/** A band's accent hue. Meaning is still carried by colour — blue = data,
 *  teal = outcome, coral = people, yellow = emphasis — but the v0
 *  Single-Accent Viewport Rule is retired: it was what made the page read
 *  flat. A band now takes one dominant hue and up to two supporting pops in
 *  shapes and doodles. */
export type BandAccent = 'neutral' | 'blue' | 'teal' | 'coral' | 'yellow'

/** Which surface a band sits on. Navy now carries about half the page. */
export type Ground = 'navy' | 'cream' | 'cream-deep'

export type Cta = {
  label: string
  to: string
}

export type Pillar = {
  index: string
  /** The stage's hue, carried from the hero pills into this section. */
  hue: 'blue' | 'teal' | 'coral'
  title: string
  /** Short form, shown on the card. */
  body: string
  /** The client's exact wording from the brief. Shown in full on the
   *  What we do page; kept here so the source of truth never drifts. */
  bodyFull: string
  /** Handwritten marginalia. A note, not a label. */
  marginalia?: string
  /** The handwritten line that lands inside the open panel — the
   *  Whole Truth Foods device the feedback asked for. */
  handwritten: string
  /** The two photographs the panel reveals once its animation resolves. */
  images: Array<{ src: string; alt: string }>
}

export type StatCard = Verify<{
  figure: string
  sentence: string
}>

export type PullQuote = Verify<{
  text: string
  attribution: string
}>

/* Renamed per the homepage feedback: 'mid-sized' → 'data-mature',
   'funders' → 'intermediary'. The ids move with the labels so a stale deep
   link can never resolve to a category we no longer use. */
export type AudienceId = 'early-stage' | 'data-mature' | 'intermediary'

export type Audience = {
  id: AudienceId
  label: string
  /** Opens the block. Reads as a sentence with gaps, and the gaps type
   *  themselves in — they should recognise themselves before we say anything
   *  about ourselves. */
  challengeLead: string
  challengeBlanks: Array<string>
  challengeTail: string
  /** The phrase the hand-drawn circle lands on inside `challengeTail`. */
  circled?: string
  photos: Array<{ src: string; alt: string; org: string; location: string }>
  testimonial: {
    quote: PullQuote
    name: string
    credentials: string
    photo: string
  }
  primaryCta: Cta
  secondaryCta: Cta
}

export type CaseStudy = {
  slug: string
  tags: Array<string>
  title: string
  /** The one hard number the card is built around. */
  stat: Verify<string>
  /** The navy inverse card — the honest one, for tonal break. */
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
  /** Field notes were text-only by design in v0. "Too text-centric" was the
   *  single most repeated note in the feedback, so they carry an image now. */
  image: string
  imageAlt: string
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
