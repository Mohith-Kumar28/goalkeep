import { describe, expect, it } from 'vitest'
import { quizEmail } from '@/server/quiz-email'
import { personaFor, scoreQuiz, statementCount } from './quiz'
import type { Answer } from './quiz'

describe('quiz persona tiers', () => {
  it.each([
    [12, 'Explorer'],
    [14, 'Explorer'],
    [15, 'Consumer'],
    [29, 'Consumer'],
    [30, 'Striver'],
    [44, 'Striver'],
    [45, 'Trailblazer'],
    [60, 'Trailblazer'],
  ])('a total of %i is a Data %s', (total, label) => {
    expect(personaFor(total).label).toBe(label)
  })
})

describe('scoreQuiz', () => {
  it('totals out of 60 and each domain out of 15', () => {
    const answers = [4, 3, 3, 5, 4, 4, 2, 3, 3, 5, 4, 4] as Array<Answer>
    expect(answers).toHaveLength(statementCount)
    const score = scoreQuiz(answers)
    expect(score.total).toBe(44)
    expect(score.max).toBe(60)
    expect(score.persona.label).toBe('Striver')
    expect(score.domains.map((d) => `${d.total}/${d.max}`)).toEqual(['10/15', '13/15', '8/15', '13/15'])
  })
})

describe('quizEmail', () => {
  it('opens with the persona and carries the scores, report and contact', () => {
    const score = scoreQuiz([5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4] as Array<Answer>)
    const { subject, html, text } = quizEmail('Asha Rao', 'Sunrise Trust', score)
    expect(subject).toContain('You are a Data Trailblazer')
    expect(html).toContain('You are a Data Trailblazer')
    expect(text).toContain('Your total score: 52/60')
    expect(text).toContain('15/15 in the domain of Data')
    expect(html).not.toContain('How do you compare?')
    expect(html).toContain('mailto:aditya@goalkeep.org')
    expect(html).not.toContain('team@goalkeep')
    expect(html).toContain('Data culture in your organisation is institutional and universal.')
    expect(text).toContain('or to speak about taking a more in-depth data culture quiz for your entire team')
  })
})
