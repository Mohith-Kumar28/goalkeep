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
   * The strapline for <title> and og:title, which is where the old tagline
   * used to end up. A 90-character sentence is not a page title, and this one
   * would have opened with "Goalkeep — Goalkeep helps…", so the short
   * descriptor from the footer's second line carries it instead.
   */
  strapline: 'Data consultancy for the social sector',
  description:
    'Goalkeep is a data consultancy for the social sector. We partner with NGOs, foundations and impact organizations to turn messy operational data into reliable systems, dashboards and decisions.',
  url: 'https://goalkeep.net',
}

export type NavItem = {
  label: string
  to: string
  children?: Array<{ label: string; to: string }>
}

export const nav: Array<NavItem> = [
  { label: 'About us', to: '/about' },
  { label: 'What we do', to: '/what-we-do' },
  { label: 'Case studies', to: '/case-studies' },
  {
    label: 'Programs',
    to: '/programs/kickstarter',
    children: [
      { label: 'Kickstarter program', to: '/programs/kickstarter' },
      { label: 'Data literacy program', to: '/programs/data-literacy' },
    ],
  },
  {
    label: 'Resources',
    to: '/resources/blog',
    children: [
      { label: 'Blog', to: '/resources/blog' },
      { label: 'Newsletter', to: '/resources/newsletter' },
      { label: 'Data quiz', to: '/resources/data-quiz' },
    ],
  },
]

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
