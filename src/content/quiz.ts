
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
  budget: ['Under 2 Cr', '2 - 5 Cr', '5.1 - 10 Cr', '10.1 - 50 Cr', 'Above 50 Cr'],
}

export type QuizDetails = {
  name: string
  email: string
  organization: string
  sector: string
  sectorOther: string
  role: string
  roleOther: string
  size: string
  budget: string
}

export type PersonaId = 'explorer' | 'consumer' | 'striver' | 'trailblazer'

/** What the results email calls the respondent: "You are a Data ___". `min` is
 *  the lowest total (out of 60) for the tier; a tier runs up to the next one's. */
export type Persona = { id: PersonaId; label: string; min: number }

/* Goalkeep's tiers, Nov 11: 0–14, 15–29, 30–44, 45–60. */
export const personas: Array<Persona> = [
  { id: 'explorer', label: 'Explorer', min: 0 },
  { id: 'consumer', label: 'Consumer', min: 15 },
  { id: 'striver', label: 'Striver', min: 30 },
  { id: 'trailblazer', label: 'Trailblazer', min: 45 },
]

export const personaFor = (total: number): Persona =>
  [...personas].reverse().find((p) => total >= p.min) ?? personas[0]

const MAX_ANSWER = Math.max(...likert.map((option) => option.value))

export type DomainScore = { id: DomainId; title: string; average: number; total: number; max: number }

export type QuizScore = {
  domains: Array<DomainScore>
  average: number
  total: number
  max: number
  persona: Persona
}

const sum = (values: Array<number>) => values.reduce((total, v) => total + v, 0)

export function scoreQuiz(answers: Array<Answer>): QuizScore {
  let offset = 0
  const scored = domains.map((domain) => {
    const slice = answers.slice(offset, offset + domain.statements.length)
    offset += domain.statements.length
    const total = sum(slice)
    return { id: domain.id, title: domain.title, average: total / slice.length, total, max: slice.length * MAX_ANSWER }
  })
  const total = sum(answers)
  return {
    domains: scored,
    average: total / answers.length,
    total,
    max: answers.length * MAX_ANSWER,
    persona: personaFor(total),
  }
}
