import type { Verify } from './types'

/**
 * The data culture quiz. Twelve statements in four domains, each answered on
 * a five-point agreement scale, from Goalkeep's quiz doc (5 Nov).
 *
 * The visitor never sees a score on the page (Nov 10 review). The server
 * scores the answers, stores them, and emails the result for their band.
 */

export const likert = [
  { value: 5, label: 'Strongly agree' },
  { value: 4, label: 'Agree' },
  { value: 3, label: 'Undecided' },
  { value: 2, label: 'Disagree' },
  { value: 1, label: 'Strongly disagree' },
] as const

export type Answer = (typeof likert)[number]['value']

export type DomainId = 'data' | 'technology' | 'process' | 'strategy'

export type Domain = {
  id: DomainId
  title: string
  statements: Array<string>
  /** Where to go next when this is the weakest domain. */
  next: { label: string; to: string }
}

export const domains: Array<Domain> = [
  {
    id: 'data',
    title: 'Data',
    statements: [
      'Everyone in my organisation is able to easily access any data they need.',
      'Everybody in my organisation is able to use data to inform their work.',
      'Everyone in my organisation trusts the data they have access to.',
    ],
    next: { label: 'Data adoption and capacity-building', to: '/services/data-adoption-and-capacity-building' },
  },
  {
    id: 'technology',
    title: 'Technology',
    statements: [
      'Everyone in my organisation can find all the data they need in one place / on one platform.',
      'Everyone in my organisation can see real-time data.',
      'Everyone in my organisation can see relevant data in the form of reports, charts, dashboards, etc.',
    ],
    next: { label: 'Data systems and workflows', to: '/services/data-systems-and-workflows' },
  },
  {
    id: 'process',
    title: 'Process',
    statements: [
      'Everyone in my organisation regularly collects data with ease.',
      'Everyone in my organisation regularly analyses data for insights.',
      'Everyone in my organisation regularly follows defined data processes/policies.',
    ],
    next: { label: 'Dashboards and reporting', to: '/services/dashboards-and-reporting' },
  },
  {
    id: 'strategy',
    title: 'Strategy',
    statements: [
      'My organisation invests a sufficient budget to enable everyone to use data.',
      'My organisation makes data training opportunities available to everyone.',
      'My organisation has clearly defined goals for everyone to work towards.',
    ],
    next: { label: 'Impact and measurement strategy', to: '/services/impact-and-measurement-strategy' },
  },
]

export const statementCount = domains.reduce((n, d) => n + d.statements.length, 0)

/* The doc gives the detail fields but not their options. These are a first
   pass for Goalkeep to correct; the sectors follow the case-study tags. */
export const detailOptions = {
  region: [
    'North India',
    'South India',
    'East India',
    'West India',
    'Central India',
    'North-East India',
    'Outside India',
  ],
  sector: [
    'Education',
    'Health',
    'Livelihoods',
    'Disability',
    'Gender',
    'Environment and climate',
    'Agriculture',
    'Arts and culture',
    'Philanthropy and grant-making',
    'Other',
  ],
  role: [
    'Founder or CEO',
    'Senior leadership',
    'Programme management',
    'Monitoring, evaluation and learning (MEL)',
    'Data or technology',
    'Fundraising or communications',
    'Operations or finance',
    'Field staff',
    'Other',
  ],
  size: ['1–10', '11–50', '51–200', '201–500', 'More than 500'],
}

export type QuizDetails = {
  name: string
  email: string
  organization: string
  region: string
  sector: string
  sectorOther: string
  role: string
  roleOther: string
  size: string
  budget: string
}

export const detailLabels: Record<keyof QuizDetails, string> = {
  name: 'Full name',
  email: 'Email (we’ll email your results to you)',
  organization: 'Organisation name',
  region: 'Region',
  sector: 'Sector',
  sectorOther: 'If “Other” sector, please tell us here',
  role: 'Your role in the organisation',
  roleOther: 'If “Other” role, please tell us here',
  size: 'Organisation size (number of employees)',
  budget: 'Organisation budget (e.g. INR 1 crore)',
}

export type BandId = 'starting' | 'emerging' | 'developing' | 'established'

export type Band = {
  id: BandId
  label: string
  /** The lowest 1–5 average in this band. A band runs up to the next band's `min`. */
  min: number
  /** One line under the score in the results email. */
  reading: string
  /** The results email's paragraph for this band. */
  email: string
}

const PENDING = 'Placeholder threshold and copy. Rumit to confirm the four categories, their score cut-offs and what each email says (Nov 10 review, 00:26:53).'

/* The four performance categories the results email is customised by,
   lowest first. Thresholds split the 1–5 average into equal steps until
   Goalkeep sends theirs. */
export const bands: Array<Verify<Band>> = [
  {
    verify: `${PENDING} Currently an average from 1.0 to below 2.0.`,
    value: {
      id: 'starting',
      label: 'Getting started',
      min: 1,
      reading: 'Data is mostly collected for reports. Few decisions lean on it yet.',
      email: 'Most organisations we work with started here. The quickest progress usually comes from one small, visible win: pick a single question your team keeps asking, and answer it with data you already collect.',
    },
  },
  {
    verify: `${PENDING} Currently an average from 2.0 to below 3.0.`,
    value: {
      id: 'emerging',
      label: 'Emerging',
      min: 2,
      reading: 'Data is collected more than it is used. A few foundations would change how decisions get made.',
      email: 'You have the raw material. What tends to be missing at this stage is a shared place for the data and a routine for looking at it together, so it reaches the people making decisions.',
    },
  },
  {
    verify: `${PENDING} Currently an average from 3.0 to below 4.0.`,
    value: {
      id: 'developing',
      label: 'Developing',
      min: 3,
      reading: 'The pieces are there but unevenly spread. Some teams use data well; others work around it.',
      email: 'Some of your teams already use data well. The next step is usually spreading what works: common definitions, dashboards people open, and training for the teams that still work around the data.',
    },
  },
  {
    verify: `${PENDING} Currently an average of 4.0 or more.`,
    value: {
      id: 'established',
      label: 'Established',
      min: 4,
      reading: 'Data is part of how most people here work.',
      email: 'Data is already part of how your organisation works. The opportunity now is depth: sharper questions, faster loops from insight to action, and evidence your funders and partners can use too.',
    },
  },
]

export const bandFor = (average: number): Band => {
  const band = [...bands].reverse().find((b) => average >= b.value.min) ?? bands[0]
  return band.value
}

export type DomainScore = { id: DomainId; title: string; average: number; band: Band }

export type QuizScore = {
  domains: Array<DomainScore>
  average: number
  band: Band
  weakest: Domain
}

/** `answers` is one value per statement, in the order the domains list them. */
export function scoreQuiz(answers: Array<Answer>): QuizScore {
  let offset = 0
  const scored = domains.map((domain) => {
    const slice = answers.slice(offset, offset + domain.statements.length)
    offset += domain.statements.length
    const average = slice.reduce<number>((sum, a) => sum + a, 0) / slice.length
    return { id: domain.id, title: domain.title, average, band: bandFor(average) }
  })
  const average = answers.reduce<number>((sum, a) => sum + a, 0) / answers.length
  const weakestId = scored.reduce((low, d) => (d.average < low.average ? d : low)).id
  return {
    domains: scored,
    average,
    band: bandFor(average),
    weakest: domains.find((d) => d.id === weakestId) ?? domains[0],
  }
}

/** One decimal, the way the scores are shown everywhere. */
export const formatScore = (average: number) => average.toFixed(1)
