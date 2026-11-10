import type { DomainId } from '@/content/quiz'

/* Page copy for the data culture quiz (the 10 Nov export). The statements,
   answer scale, option lists and scoring stay in src/content/quiz.ts. */
export const quizPage = {
  meta: {
    title: 'Data culture quiz | Goalkeep',
    description: 'Our data culture quiz assesses your organization’s current baseline. 12 questions, no more than three minutes.',
  },
  eyebrow: 'Data culture quiz',
  headline: ['How does your team', 'make program decisions?'],
  lead: 'Our data culture quiz assesses your organization’s current baseline. Simply answer these 12 questions, it should take no more than three minutes.',
  start: 'Take the quiz',
  form: {
    title: 'First, a little about you.',
    sub: 'So we can email you your results.',
    note: 'Twelve questions come next, one at a time.',
    submit: 'Start the quiz',
    invalid: 'Please fill in the highlighted fields.',
    badEmail: 'Enter a full email address, like name@organisation.org.',
  },
  hint: 'Answer for your organisation as it is today.',
  thanks: {
    title: 'Thank you for your submission!',
    body: 'Please check your email, we have e-mailed your results to you.',
    saved: 'Your answers are saved. We could not send the results email just now, so we will send it to you shortly.',
    sending: 'Sending your results…',
    talk: 'Talk to us about your results',
    share: 'Get your team to take the quiz',
    copied: 'Quiz link copied. Share it with your team.',
    shareText: 'How does our team make program decisions? Take this 3-minute quiz:',
    shareTitle: 'Goalkeep data culture quiz',
  },
  steps: { about: 'About you', results: 'Your results' },
} as const

export type Mark = { mark: string; label: string; ink: string; tint: string }

export const marks: Record<DomainId, Mark> = {
  data: { mark: '#526eb5', label: '#8ea6e6', ink: '#2f4d9f', tint: '#eaeff9' },
  technology: { mark: '#79c2b4', label: '#79c2b4', ink: '#176059', tint: '#e7f2f0' },
  process: { mark: '#ee9d90', label: '#ee9d90', ink: '#9c452a', tint: '#fbeee9' },
  strategy: { mark: '#e8e724', label: '#eac452', ink: '#7d5e0c', tint: '#fbf3df' },
}

/* Geometry measured from the logo's SVG (viewBox 0 0 282 428). */
export const ring = {
  top: { cx: 141, cy: 141, r: 121.5, width: 39 },
  segments: {
    data: { rot: 20.6956, len: 122.1637 },
    technology: { rot: 91.6956, len: 135.9474 },
    process: { rot: 169.1956, len: 124.28 },
    strategy: { rot: 241.1956, len: 123.22 },
  } satisfies Record<DomainId, { rot: number; len: number }>,
  whiteTop: { rot: -47.3044, len: 115.802 },
  bottom: { cx: 142, cy: 283.8, r: 124.2, rot: 7.4957, len: 357.6889 },
}

export const ringLabels: Array<{ id: DomainId; text: string; left: string; top: string }> = [
  { id: 'strategy', text: 'strategy', left: '51%', top: '-9%' },
  { id: 'process', text: 'process', left: '-17%', top: '19.5%' },
  { id: 'technology', text: 'technology', left: '-21%', top: '53.5%' },
  { id: 'data', text: 'data', left: '112%', top: '49%' },
]
