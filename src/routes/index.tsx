import { createFileRoute } from '@tanstack/react-router'

import { Audiences } from '@/components/sections/audiences'
import { CaseStudies } from '@/components/sections/case-studies'
import { Closing } from '@/components/sections/closing'
import { Credibility } from '@/components/sections/credibility'
import { Faqs } from '@/components/sections/faqs'
import { FieldNotes } from '@/components/sections/field-notes'
import { Hero } from '@/components/sections/hero'
import { Team } from '@/components/sections/team'
import { WhatWeDo } from '@/components/sections/what-we-do'
import { site } from '@/content/site'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: `${site.name} — ${site.tagline}` },
      { name: 'description', content: site.description },
    ],
  }),
  component: Home,
})

/**
 * Band order is load-bearing, not arbitrary.
 *
 * Only three of the eight bands carry an accent (blue = data, teal = outcome,
 * coral = people); the other five are charcoal on paper. The neutral bands
 * between them are the accent-free buffers that keep the Single-Accent
 * Viewport Rule true: at most one accent hue visible at any scroll position.
 *
 * Reordering these, or shortening a band's charcoal-only opener, breaks that
 * rule. See the plan's band map before moving anything.
 */
function Home() {
  return (
    <>
      <Hero />
      <Credibility />
      <WhatWeDo />
      <Audiences />
      <Team />
      <CaseStudies />
      <Faqs />
      <FieldNotes />
      <Closing />
    </>
  )
}
