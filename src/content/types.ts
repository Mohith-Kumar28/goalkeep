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
  /** The client's paragraph for the stage, verbatim from the copy doc. */
  body: string
  /** The two photographs the panel reveals once its animation resolves. */
  images: Array<{ src: string; alt: string }>
}

export type PullQuote = Verify<{
  text: string
  attribution: string
}>

/* Renamed per the homepage feedback: 'mid-sized' → 'data-mature',
   'funders' → 'intermediary'. Funders came back as a fourth, separate segment
   in the 23 Sep review. */
export type AudienceId = 'early-stage' | 'data-mature' | 'intermediary' | 'funders'

export type Audience = {
  id: AudienceId
  label: string
  /** Opens the block. A question the visitor should recognise themselves in.
   *  Two lines at most at desktop width. */
  header: string
  /** One paragraph. */
  body: Verify<string>
  photos: Array<{ src: string; alt: string; org: string; location: string }>
  testimonial: {
    quote: PullQuote
    name: string
    credentials: string
    /** The testimonial is image-led: a large photograph with the quote over
     *  its lower edge. */
    photo: string
  }
  /** One CTA per segment. */
  cta: Cta
}

export type CaseStudy = {
  slug: string
  /** The organisation the card is about — it is the card's headline now. */
  org: string
  /** Neutral tag: the partner's sector. */
  sector: string
  /** Coloured tag: the work Goalkeep did for them. */
  intervention: string
  /** What changed, and what it took. Carries the card on its own; the
   *  before/after stat figures were dropped in the copy replacement. */
  body: string
  image: string
  imageAlt: string
}

export type FieldNote = {
  slug: string
  date: string
  readingTime: string
  title: string
  dek: string
  /** Neutral tag, matching the case studies' sector label (23 Sep doc: "add
   *  sector tags to blog cards where possible"). */
  sector: string
  /** The topic. Tinted, like the case studies' intervention label. */
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
