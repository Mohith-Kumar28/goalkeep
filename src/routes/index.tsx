import { createFileRoute } from '@tanstack/react-router'

import { Audiences } from '@/components/sections/audiences'
import { CaseStudies } from '@/components/sections/case-studies'
import { Closing } from '@/components/sections/closing'
import { Credibility } from '@/components/sections/credibility'
import { Faqs } from '@/components/sections/faqs'
import { FieldNotes } from '@/components/sections/field-notes'
import { Hero } from '@/components/sections/hero'
import { Proof } from '@/components/sections/proof'
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
 * The rhythm the review asked for: "let's stick mostly to dark blue and white
 * for background, with maybe some sections having the light coloured
 * highlights", and "in general the alternating is good — light, followed by
 * dark, an alternating thing is nice".
 *
 *   Hero            navy        flat, the creatives' blue. No footage behind it.
 *   Partners        white       the proof you don't have to read
 *   What we do      white       the interactive one
 *   Whom for        pale blue   the one "light coloured highlight" band
 *   Proof           navy        four numbers, over the photography moved down
 *                               out of the hero
 *   Case studies    white       10x-style grid; the horizontal rail is gone
 *   FAQs            pale blue   no surfaces at all
 *   Field notes     white
 *   Closing         navy        the ending, assembling one element at a time
 *
 * The Team band sat between case studies and FAQs. "Team — no need for team
 * over here, we can get rid of the team thing." Removed, along with its
 * component and its content file.
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
      <Faqs />
      <FieldNotes />
      <Closing />
    </>
  )
}
