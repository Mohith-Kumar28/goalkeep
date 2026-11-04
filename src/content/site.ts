export const site = {
  name: 'Goalkeep',
  /**
   * The footer line. Replaced in the September 2026 copy replacement, which
   * folded both of the footer's old lines — "Data with the team, not at them."
   * and "Goalkeep — data consultancy for the social sector. Mumbai, India." —
   * into this one sentence.
   */
  tagline:
    'Goalkeep helps organizations measure, communicate, and deepen their impact with confidence.',
  /**
   * <title> / og:title and the meta description - what shows when the link is
   * shared. 23 Oct: Rumit sent both, built from the hero headline and typing
   * line, because the old ones read wrong in a shared link.
   */
  metaTitle: 'Goalkeep enables social sector organisations to use data to scale impact.',
  description:
    'We work with nonprofits, funders, and ecosystem partners to turn data into decisions.',
  url: 'https://goalkeep.net',
}

export type NavItem = {
  label: string
  to: string
  children?: Array<{ label: string; to: string }>
}

/* 21 Oct: the homepage launches alone, so the header jumps to its sections
   - "whatever's there on the homepage so that if someone clicks they just go
   to that homepage section". `/#…` so the links also work from other routes. */
export const nav: Array<NavItem> = [
  { label: 'Why we exist', to: '/#why-we-exist' },
  { label: 'What we do', to: '/#what-we-do' },
  { label: 'Who we do it for', to: '/#who-we-do-it-for' },
  { label: 'Our approach', to: '/#our-approach' },
  { label: 'Case studies', to: '/#case-studies' },
  { label: 'FAQs', to: '/#faqs' },
]

export const contactHref = '/#contact'

/* Not rendered since 21 Oct - the footer is one line until the other pages
   go live. */
export const footerGroups = [
  {
    heading: 'What we do',
    links: [
      { label: 'Design, build, adopt', to: '/what-we-do' },
      { label: 'Custom projects', to: '/custom-projects' },
      { label: 'Case studies', to: '/case-studies' },
      { label: 'Kickstarter program', to: '/programs/kickstarter' },
      { label: 'Data literacy program', to: '/programs/data-literacy' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Field notes', to: '/resources/blog' },
      { label: 'Newsletter', to: '/resources/newsletter' },
      { label: 'Data culture quiz', to: '/resources/data-quiz' },
    ],
  },
  {
    heading: 'Goalkeep',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Partner with us', to: '/partner-with-us' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]
