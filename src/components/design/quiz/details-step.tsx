import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowIcon } from '../icons'
import { quizPage } from '@/content/design/quiz'
import { detailOptions } from '@/content/quiz'
import type { QuizDetails } from '@/content/quiz'

type Key = keyof QuizDetails

const EMAIL = /^\S+@\S+\.\S+$/

function invalidFields(d: QuizDetails): Set<Key> {
  const bad = new Set<Key>()
  for (const key of ['name', 'email', 'organization', 'role'] as const) if (!d[key].trim()) bad.add(key)
  if (d.email && !EMAIL.test(d.email)) bad.add('email')
  if (d.sector === 'Other' && !d.sectorOther.trim()) bad.add('sectorOther')
  if (d.role === 'Other' && !d.roleOther.trim()) bad.add('roleOther')
  return bad
}

export function DetailsStep({
  details,
  onChange,
  onDone,
}: {
  details: QuizDetails
  onChange: (key: Key, value: string) => void
  onDone: () => void
}) {
  const [bad, setBad] = useState<Set<Key>>(new Set())
  const [shown, setShown] = useState(false)

  const edit = (key: Key, value: string) => {
    onChange(key, value)
    setBad((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    const found = invalidFields(details)
    setBad(found)
    setShown(found.size > 0)
    if (!found.size) onDone()
  }

  const text = (key: Key, label: string, type = 'text', placeholder = '', autoComplete = '') => {
    const malformed = key === 'email' && bad.has(key) && details.email.trim() !== ''
    return (
      <div className={bad.has(key) ? 'dc-q-field is-err' : 'dc-q-field'}>
        <label htmlFor={`q-${key}`}>{label}</label>
        <input
          id={`q-${key}`}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={details[key]}
          aria-invalid={bad.has(key) || undefined}
          aria-describedby={malformed ? `q-${key}-msg` : undefined}
          onChange={(e) => edit(key, e.target.value)}
        />
        {malformed && (
          <p id={`q-${key}-msg`} className="dc-q-field-msg">
            {quizPage.form.badEmail}
          </p>
        )}
      </div>
    )
  }

  const select = (key: 'role' | 'region' | 'size' | 'sector', label: string) => {
    const other = key === 'role' ? 'roleOther' : key === 'sector' ? 'sectorOther' : null
    return (
      <div className={bad.has(key) ? 'dc-q-field is-err' : 'dc-q-field'}>
        <label htmlFor={`q-${key}`}>{label}</label>
        <select
          id={`q-${key}`}
          className={details[key] ? undefined : 'is-placeholder'}
          value={details[key]}
          aria-invalid={bad.has(key) || undefined}
          onChange={(e) => edit(key, e.target.value)}
        >
          <option value="" disabled>
            Choose one
          </option>
          {detailOptions[key].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {other && details[key] === 'Other' && (
          <input
            className={bad.has(other) ? 'dc-q-other is-err' : 'dc-q-other'}
            aria-label={`${label}, please specify`}
            aria-invalid={bad.has(other) || undefined}
            placeholder="Please specify"
            value={details[other]}
            onChange={(e) => edit(other, e.target.value)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="dc-q-pane">
      <h2>{quizPage.form.title}</h2>
      <p className="dc-q-sub">{quizPage.form.sub}</p>
      <form noValidate onSubmit={submit}>
        <div className="dc-q-grid">
          {text('name', 'Full name *', 'text', '', 'name')}
          {text('email', 'Email *', 'email', '', 'email')}
          {text('organization', 'Organisation name *', 'text', '', 'organization')}
          {select('role', 'Your role *')}
          <hr className="dc-q-rule" />
          {text('budget', 'Organisation budget', 'text', 'e.g. INR 1 crore')}
          {select('region', 'Region')}
          {select('size', 'Organisation size')}
          {select('sector', 'Sector')}
        </div>
        <div className="dc-q-actions">
          <button className="dc-q-btn dc-q-btn-navy" type="submit">
            {quizPage.form.submit}
            <ArrowIcon />
          </button>
          <small>{quizPage.form.note}</small>
        </div>
        {shown && (
          <div className="dc-q-form-error" role="alert">
            {quizPage.form.invalid}
          </div>
        )}
      </form>
    </div>
  )
}
