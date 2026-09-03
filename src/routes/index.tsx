import { createFileRoute } from '@tanstack/react-router'

import { Audiences } from '@/components/sections/audiences'
import { CaseStudies } from '@/components/sections/case-studies'
import { Closing } from '@/components/sections/closing'
import { Credibility } from '@/components/sections/credibility'
import { Faqs } from '@/components/sections/faqs'
import { FieldNotes } from '@/components/sections/field-notes'
import { Hero } from '@/components/sections/hero'
import { Proof } from '@/components/sections/proof'
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
 * Band order is load-bearing.
 *
 * The v0 rule here was the Single-Accent Viewport Rule: at most one accent
 * hue on screen at once, enforced by putting a neutral band between every
 * coloured one. It worked, and it is also precisely what made the page read
 * flat and dull. It is retired.
 *
 * What replaces it is a ground rhythm. Navy and light alternate, roughly half
 * the page each, and no two navy bands ever touch:
 *
 *   Hero            navy      photography + the promise
 *   Partners        cream-deep the proof you don't have to read
 *   What we do      cream      the interactive one
 *   Whom for        coral tint the longest band; needs its own ground
 *   Proof           navy       four numbers, counting up
 *   Case studies    navy*      *continuous with Proof by design — the numbers
 *                              and the work they came from are one thought
 *   Team            cream      faces
 *   FAQs            yellow tint the only band with no surfaces at all
 *   Field notes     cream-deep
 *   Closing         navy       the ending
 *
 * Proof and Case studies are the deliberate exception to "no two navy bands
 * touch": read together they are a claim and its evidence, and a light band
 * between them would break the argument in half.
 */
function Home() {
  return (
    <>
      <Hero />
      <Credibility />
      <WhatWeDo />
      <Audiences />
      <Proof />
      <CaseStudies />
      <Team />
      <Faqs />
      <FieldNotes />
      <Closing />
    </>
  )
}
