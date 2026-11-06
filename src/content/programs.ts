import { serviceTitle } from './pages'
import type { Page, Story } from './pages'

/**
 * Programs: the overview page. Kickstarter and Data Literacy are built from
 * the 6 Nov design in src/content/design/.
 * Copy, headings and section order are the November programs doc, verbatim
 * apart from typos and British spelling. Nothing is added that the doc does
 * not have; the doc's section names ("Why Kickstarter exists") are the
 * eyebrows.
 */

/* Vanavil is not on the homepage any more, so its card lives here. The
   tags follow the homepage vocabulary and are our first pass. */
export const vanavilStory: Story = {
  org: 'Vanavil Trust',
  sector: 'Education',
  intervention: 'Data collection & visualisation',
  body: 'Using timely information to identify and re-engage children who had dropped out.',
  image: '/photos/case-vanavil.webp',
  imageAlt: 'Children studying in a Vanavil Trust classroom',
}

export const programsPage: Page = {
  path: '/programs',
  title: 'Programs — Goalkeep',
  description:
    'Goalkeep’s programs help social-purpose organisations strengthen two foundations of data use: the systems through which information flows and the capabilities people need to interpret and act on it.',
  contactService: serviceTitle('Data systems and workflows'),
  blocks: [
    {
      kind: 'hero',
      eyebrow: 'programs',
      headline: { lead: 'Build the systems and skills that', em: 'make data useful' },
      lead: 'Goalkeep’s programs help social-purpose organisations strengthen two foundations of data use: the systems through which information flows and the capabilities people need to interpret and act on it.',
      body: [
        'Whether your organisation is building its first reliable data system or strengthening data confidence across its workforce, our programs combine technical expertise, practical learning and sustained adoption support. We also partner with funders and intermediaries to run either program across their portfolios or cohorts.',
      ],
      highlight: 'two foundations of data use',
      photo: { src: '/photos/aud-eco-2.webp', alt: 'A partner cohort group photograph at a convening' },
    },
    {
      kind: 'programs',
      cards: [
        {
          eyebrow: 'Kickstarter',
          title: 'Build the data backbone your organisation needs to grow',
          body: 'A hands-on program for early-stage nonprofits that need a simple, integrated and usable data system. Work with Goalkeep to identify what matters, organise how it is captured and build a system that turns everyday data into useful insights for your programs.',
          cta: { label: 'Explore Kickstarter', to: '/programs/kickstarter' },
          photo: { src: '/photos/aud-early-1.webp', alt: 'A facilitator presenting a dashboard on screen to a partner team' },
        },
        {
          eyebrow: 'Data Literacy Program',
          title: 'Build a data-confident workforce from within',
          body: 'A cohort-based, train-the-trainer program that equips organisational and MEL leaders to strengthen data literacy across their teams. Participants build foundational data skills, practise using AI responsibly and receive the resources and support to take the learnings back to improve the data culture in their respective organisations.',
          cta: { label: 'Explore the Data Literacy Program', to: '/programs/data-literacy' },
          photo: { src: '/photos/aud-mature-3.webp', alt: 'A Data Literacy Program cohort gathered in front of the programme banner' },
        },
      ],
    },
  ],
}
