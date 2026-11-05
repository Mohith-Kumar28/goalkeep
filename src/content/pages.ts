import type { VisualName } from '@/components/primitives/program-visuals'
import { services } from './homepage'
import type { AudienceId, Cta } from './types'

/**
 * The programs and services pages are built from one vocabulary of blocks.
 *
 * Each page is an ordered list of these, rendered by
 * components/pages/page-blocks.tsx, which owns grounds and rhythm. A content
 * file never says which colour a band is.
 */

/** A light lead and a bold-italic tail, the way every heading on the site
 *  is set (23 Oct). */
export type Heading = {
  lead: string
  em?: string
  /** The section's eyebrow, where the renderer's own name for it is wrong. */
  label?: string
}

export type Photo = { src: string; alt: string }

/** Every "Work with us", "Apply" and "Register your interest" on these pages
 *  scrolls to the contact form at the bottom of the same page. */
export const toContact = '#contact'

/* The contact form lists the four homepage services and nothing else (the
   client's call, 23 Oct), so a page preselects one of those. */
export const serviceTitle = (title: string) => {
  if (!services.some((s) => s.title === title)) throw new Error(`No homepage service "${title}"`)
  return title
}

export type Story = {
  org: string
  sector: string
  intervention: string
  body: string
  image: string
  imageAlt: string
}

export type Step = {
  title: string
  lead?: string
  body: Array<string>
  visual?: VisualName
  ctas?: Array<Cta>
  photo?: Photo
}

/** A link card to a sibling page: the other services, the other program. */
export type Related = { label: string; title: string; body: string; to: string }

export type Block =
  | {
      kind: 'hero'
      eyebrow: string
      headline: Heading
      /** The doc's first hero paragraph, set as the lead. */
      lead: string
      /** The doc's further hero paragraphs, in order. */
      body?: Array<string>
      /** A phrase in the lead that takes the highlighter. */
      highlight?: string
      primary?: Cta & { note?: string }
      secondary?: Cta
      photo?: Photo
      /** In place of the photograph: the pages this one leads to, as panels. */
      links?: Array<{ label: string; title: string; to: string; photo: Photo }>
    }
  /** The homepage's partner logo rail. */
  | { kind: 'partners' }
  /** The homepage's proof band: the figures over session footage. */
  | { kind: 'proof' }
  | {
      kind: 'prose'
      /** A navy statement band, for the one dark moment mid-page. */
      tone?: 'navy'
      headline: Heading
      paragraphs: Array<string>
      /** A phrase in the first paragraph that takes the highlighter. */
      highlight?: string
      photo?: Photo
      /** Where the bleed crop holds, e.g. 'center 75%'. */
      photoPosition?: string
      /** A handwritten note beside the photograph. */
      note?: string
      /** Label and value pairs set beside a navy statement. */
      facts?: Array<{ label: string; value: string }>
    }
  | {
      kind: 'checklist'
      headline: Heading
      /** A sentence under the heading: what the service is, before whether it fits. */
      intro?: string
      items: Array<string>
      /** The DLP's recommended pair of nominees, beside the checklist. */
      aside?: { intro: string; people: Array<string>; outro: string }
    }
  | {
      kind: 'steps'
      /** rows: one surface of stages; the open one turns navy with its photograph.
       *  bento: illustrated cells of one surface, divided by hairlines.
       *  flow: a short sequence read left to right.
       *  paths: ways in, each with its own calls to action. */
      layout: 'rows' | 'bento' | 'flow' | 'paths'
      headline: Heading
      intro?: Array<string>
      /** A closing line under the steps. */
      outro?: string
      steps: Array<Step>
    }
  | {
      kind: 'deliverables'
      headline: Heading
      /** What the service is, before what you leave with. */
      opening?: Array<string>
      /** Kickstarter's before and after questions. */
      shift?: { before: string; after: string; beforeLabel: string; afterLabel: string }
      intro?: string
      items: Array<string>
      duration?: string
      /** The duration's range in weeks, drawn on a ruler. */
      weeks?: [number, number]
      /** The service's drawing, under the opening. */
      visual?: VisualName
    }
  | {
      kind: 'outcomes'
      headline: Heading
      /** Under the pinned heading, so the column beside the ledger is not empty. */
      photo?: Photo
      items: Array<{ title: string; body: string }>
    }
  | {
      kind: 'stats'
      headline: Heading
      stats: Array<{ value: number; suffix?: string; label: string }>
      /** A homepage testimonial, under the figures. */
      testimonial?: AudienceId
    }
  | {
      kind: 'stories'
      /** Optional: the services doc places a case study card with no heading. */
      headline?: Heading
      stories: Array<Story>
      /** A homepage testimonial beside a single story. */
      testimonial?: AudienceId
    }
  | { kind: 'testimonial'; audience: AudienceId; tone?: 'navy' }
  /** "Indicative duration", where the doc places it on its own. */
  | { kind: 'duration'; text: string; weeks?: [number, number] }
  | { kind: 'faq'; headline: Heading; items: Array<{ question: string; answer: string }> }
  | {
      kind: 'programs'
      headline?: Heading
      opening?: Array<string>
      cards: Array<{
        eyebrow: string
        title: string
        body: string
        cta: Cta
        photo: Photo
        facts?: Array<{ label: string; value: string }>
      }>
    }
  /** Rows of facts, one column per program. */
  | {
      kind: 'compare'
      headline: Heading
      columns: Array<{ title: string; to: string }>
      rows: Array<{ label: string; values: Array<string> }>
    }
  | { kind: 'related'; headline: Heading; items: Array<Related> }
  | {
      kind: 'audienceSwitch'
      prompt: string
      /** `short` is the label on a phone, where the full one wraps. */
      options: Array<{ id: string; label: string; short?: string; blocks: Array<Block> }>
    }
  | {
      kind: 'closing'
      headline: Heading
      body: string
      primary: Cta
      secondary?: Cta
      /** The whole mark assembling from its parts: the programs overview's
       *  close only. Every other close draws one segment of the ring. */
      mark?: boolean
    }

export type Page = {
  path: string
  title: string
  description: string
  /** Preselected in the contact form at the bottom of the page. */
  contactService: string
  blocks: Array<Block>
}
