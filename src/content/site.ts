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

/* 21 Oct: the homepage's sections are anchors (`/#…`, so they also work
   from other routes). November: Services and Programs open menus of their
   own pages; "All services" keeps the old "What we do" jump. */
export const nav: Array<NavItem> = [
  { label: 'Why we exist', to: '/#why-we-exist' },
  {
    label: 'Services',
    to: '/#what-we-do',
    children: [
      { label: 'Impact and measurement strategy', to: '/services/impact-and-measurement-strategy' },
      { label: 'Data systems and workflows', to: '/services/data-systems-and-workflows' },
      { label: 'Dashboards and reporting', to: '/services/dashboards-and-reporting' },
      { label: 'Data adoption and capacity-building', to: '/services/data-adoption-and-capacity-building' },
      { label: 'All services', to: '/#what-we-do' },
    ],
  },
  {
    label: 'Programs',
    to: '/programs',
    children: [
      { label: 'Kickstarter', to: '/programs/kickstarter' },
      { label: 'Data Literacy Program', to: '/programs/data-literacy' },
      { label: 'Data culture quiz', to: '/resources/data-quiz' },
      { label: 'All programs', to: '/programs' },
    ],
  },
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
