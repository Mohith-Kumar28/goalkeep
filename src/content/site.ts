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

/** Page colours of the services and programs pages. The values live in design.css, keyed by `data-theme`. */
export type PageTheme = 'navy' | 'blue' | 'teal' | 'coral' | 'gold' | 'sun'

export type NavChild = {
  label: string
  description: string
  to: string
  /** The header colour while this page is open. */
  theme: PageTheme
  /** The tint behind this entry in the menu while its page is open. */
  tint: string
}

export type NavItem = {
  label: string
  to: string
  children?: Array<NavChild>
}

/* The links are anchors into the homepage (`/#…`) so they also work from
   other routes. Resources goes to the blog index, the only resources page
   that is live; the data culture quiz stays out until it launches. */
export const nav: Array<NavItem> = [
  { label: 'About us', to: '/#why-we-exist' },
  {
    label: 'What we do',
    to: '/#what-we-do',
    children: [
      {
        label: 'Impact and measurement strategy',
        description: 'Turn your Theory of Change into a usable framework',
        to: '/services/impact-and-measurement-strategy',
        theme: 'gold',
        tint: '#FBF3DF',
      },
      {
        label: 'Data systems and workflows',
        description: 'An integrated system that scales with you',
        to: '/services/data-systems-and-workflows',
        theme: 'blue',
        tint: '#EAEFF9',
      },
      {
        label: 'Dashboards and reporting',
        description: 'Use your data to make better decisions',
        to: '/services/dashboards-and-reporting',
        theme: 'coral',
        tint: '#FBEEE9',
      },
      {
        label: 'Data adoption and capacity-building',
        description: 'Build a data-confident workforce',
        to: '/services/data-adoption-and-capacity-building',
        theme: 'teal',
        tint: '#E7F2F0',
      },
    ],
  },
  {
    label: 'Programs',
    to: '/programs',
    children: [
      {
        label: 'Kickstarter Program',
        description: 'A data backbone for early-stage nonprofits',
        to: '/programs/kickstarter',
        theme: 'navy',
        tint: '#FBF3DF',
      },
      {
        label: 'Data Literacy Program',
        description: 'Scale data best practices within your teams',
        to: '/programs/data-literacy',
        theme: 'navy',
        tint: '#E7F2F0',
      },
    ],
  },
  { label: 'Case studies', to: '/#case-studies' },
  { label: 'Resources', to: '/resources/blog' },
]

/** The menu entry for a page, if it has one. */
export function navChildFor(pathname: string): NavChild | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  return nav.flatMap((item) => item.children ?? []).find((child) => child.to === path)
}

export function themeForPath(pathname: string): PageTheme {
  return navChildFor(pathname)?.theme ?? 'navy'
}

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
