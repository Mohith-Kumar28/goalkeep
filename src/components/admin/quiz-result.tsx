import { domains, likert, personas } from "@/content/quiz"
import type { Field, RecordRow } from "@/server/admin/collections"
import { optionLabel, parseAnswers, score } from "./format"

const MAX = 5
const labelFor = (value: number) => likert.find((option) => option.value === value)?.label ?? "No answer"

/** Overall, the four domain scores as bars, and each statement with its answer. */
export function QuizResult({ fields, row }: { fields: Array<Field>; row: RecordRow }) {
  const scores = fields.filter((f) => f.kind === "score")
  const [overall, ...parts] = scores
  const band = fields.find((f) => f.key === "band")
  const persona = personas.find((p) => p.id === row[band?.key ?? ""])
  const answers = parseAnswers(row[fields.find((f) => f.kind === "answers")?.key ?? ""])

  let offset = 0
  return (
    <>
      <section className="ad-card" aria-label="Result">
        <div className="ad-result">
          <div className="ad-result-main">
            <span className="ad-label">{overall.label} score</span>
            <div className="ad-result-score num">
              {score(row[overall.key])}
              <small> / {MAX}</small>
            </div>
            {band && persona && (
              <div>
                <span className="ad-chip" data-tone={persona.id}>
                  {optionLabel(band, persona.id)}
                </span>
                <p className="ad-hint" style={{ margin: "var(--sp-2) 0 0" }}>
                  {persona.byline}
                </p>
              </div>
            )}
          </div>
          <ul className="ad-bars" aria-label="Score by area">
            {parts.map((part) => {
              const value = Number(row[part.key] ?? 0)
              return (
                <li key={part.key} className="ad-bar">
                  <span className="ad-bar-name">{part.label}</span>
                  <span
                    className="ad-bar-track"
                    role="img"
                    aria-label={`${part.label}: ${score(value)} out of ${MAX}`}
                  >
                    <span className="ad-bar-fill" style={{ width: `${(value / MAX) * 100}%` }} />
                  </span>
                  <span className="ad-bar-value num">{score(value)}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="ad-card ad-answers" aria-label="Answers">
        {domains.map((domain) => {
          const slice = answers.slice(offset, offset + domain.statements.length)
          offset += domain.statements.length
          return (
            <div key={domain.id} className="ad-answer-group">
              <h3>{domain.title}</h3>
              <ol>
                {domain.statements.map((statement, i) => {
                  const value = slice[i]
                  return (
                    <li key={statement} className="ad-answer">
                      <span>{statement}</span>
                      <span className="ad-answer-value">
                        <span>{value ? labelFor(value) : "Not answered"}</span>
                        <span className="ad-pips" aria-hidden>
                          {Array.from({ length: MAX }, (_, n) => (
                            <i key={n} data-on={value > n ? "" : undefined} />
                          ))}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>
          )
        })}
      </section>
    </>
  )
}
