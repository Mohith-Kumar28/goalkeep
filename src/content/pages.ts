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
export type Heading = { lead: string; em?: string }

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
}

export type Block =
  | {
      kind: 'hero'
      eyebrow: string
      headline: Heading
      paragraphs: Array<string>
      primary?: Cta & { note?: string }
      secondary?: Cta
      photo: Photo
    }
  | { kind: 'prose'; eyebrow: string; headline: Heading; paragraphs: Array<string> }
  | {
      kind: 'checklist'
      eyebrow: string
      headline: Heading
      items: Array<string>
      /** The DLP's recommended pair of nominees, beside the checklist. */
      aside?: { intro: string; people: Array<string>; outro: string }
    }
  | {
      kind: 'steps'
      eyebrow: string
      headline: Heading
      intro?: Array<string>
      steps: Array<Step>
    }
  | {
      kind: 'deliverables'
      eyebrow: string
      headline: Heading
      /** Kickstarter's before and after questions. */
      shift?: { before: string; after: string }
      intro?: string
      items: Array<string>
      duration?: string
    }
  | {
      kind: 'outcomes'
      eyebrow: string
      headline: Heading
      items: Array<{ title: string; body: string }>
    }
  | {
      kind: 'stats'
      eyebrow: string
      headline: Heading
      stats: Array<{ value: number; suffix?: string; label: string }>
      /** A homepage testimonial, under the figures. */
      testimonial?: AudienceId
    }
  | {
      kind: 'stories'
      eyebrow: string
      headline: Heading
      stories: Array<Story>
      /** A homepage testimonial beside a single story. */
      testimonial?: AudienceId
    }
  | { kind: 'testimonial'; audience: AudienceId }
  | { kind: 'faq'; headline: Heading; items: Array<{ question: string; answer: string }> }
  | {
      kind: 'programs'
      cards: Array<{
        eyebrow: string
        title: string
        body: string
        cta: Cta
        photo: Photo
      }>
    }
  | {
      kind: 'audienceSwitch'
      prompt: string
      options: Array<{ id: string; label: string; blocks: Array<Block> }>
    }
  | {
      kind: 'closing'
      headline: Heading
      body: string
      primary: Cta
      secondary?: Cta
    }

export type Page = {
  path: string
  title: string
  description: string
  /** Preselected in the contact form at the bottom of the page. */
  contactService: string
  blocks: Array<Block>
}
