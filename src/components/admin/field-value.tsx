import type { Field, RecordRow } from "@/server/admin/collections"
import { When, optionLabel, score } from "./format"

/** One stored value, rendered by its field's kind. Used by the list and the detail view. */
export function FieldValue({ field, row, stacked }: { field: Field; row: RecordRow; stacked?: boolean }) {
  const value = row[field.key]
  if (value === null || value === "") return <span className="muted">-</span>

  switch (field.kind) {
    case "datetime":
      return <When iso={String(value)} mode={stacked ? "stacked" : "both"} />
    case "email":
      return (
        <a href={`mailto:${value}`} className="ad-mail" onClick={(event) => event.stopPropagation()}>
          {value}
        </a>
      )
    case "score":
      return <span className="ad-score num">{score(value)}</span>
    case "select":
      return field.chip ? (
        <span className="ad-chip" data-tone={String(value)}>
          {optionLabel(field, String(value))}
        </span>
      ) : (
        <>{optionLabel(field, String(value))}</>
      )
    default:
      return <>{String(value)}</>
  }
}
