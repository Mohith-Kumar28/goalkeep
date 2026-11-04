import { createFileRoute } from '@tanstack/react-router'

import { Approach } from '@/components/sections/approach'
import { Audiences } from '@/components/sections/audiences'
import { CaseStudies } from '@/components/sections/case-studies'
import { Closing } from '@/components/sections/closing'
import { Contact } from '@/components/sections/contact'
import { Credibility } from '@/components/sections/credibility'
import { Faqs } from '@/components/sections/faqs'
import { Hero } from '@/components/sections/hero'
import { Proof } from '@/components/sections/proof'
import { WhatWeDo } from '@/components/sections/what-we-do'
import { WhyWeExist } from '@/components/sections/why-we-exist'
import { site } from '@/content/site'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: site.metaTitle },
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
 * 21 Oct: the homepage launches on its own as a one-pager, so nothing on it
 * leads off the page - every button scrolls to a section, and the page ends
 * on a contact form.
 *
 *   Hero            navy        flat, the creatives' blue. No footage behind it.
 *   Partners        white       the proof you don't have to read
 *   Why we exist    beige       one paragraph and the missing-layer illustration
 *   What we do      white       the four services (new, 21 Oct)
 *   Whom for        tinted      the one "light coloured highlight" band
 *   Our approach    white       Design / Build / Adopt - "what we do" until 21 Oct
 *   Proof           navy        four numbers, over the photography moved down
 *                               out of the hero
 *   Case studies    white       10x-style grid; the horizontal rail is gone
 *   FAQs            pale yellow no surfaces at all
 *   Closing         navy        the ending, assembling one element at a time
 *   Contact         white       the form every "Talk to us" lands on
 *
 * Field notes sat between FAQs and the close. "Just remove that whole field
 * notes section for now… keep it saved" - the component and its copy are kept
 * for when the blog is ready.
 */
function Home() {
  return (
    <>
      <Hero />
      <Credibility />
      <WhyWeExist />
      <WhatWeDo />
      <Audiences />
      <Approach />
      <Proof />
      <CaseStudies />
      <Faqs />
      <Closing />
      <Contact />
    </>
  )
}
