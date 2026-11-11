import { Link, useRouter } from "@tanstack/react-router"
import { AlertCircle, Check, ChevronRight, Mail, Pencil, Trash2, X } from "lucide-react"
import { useId, useState } from "react"
import type { FormEvent } from "react"
import { deleteRecord, updateRecord } from "@/server/admin/api"
import type { Collection, Field, RecordRow } from "@/server/admin/collections"
import { ConfirmDelete } from "./confirm-delete"
import { FieldValue } from "./field-value"
import { When, titleOf } from "./format"
import { QuizResult } from "./quiz-result"

type Draft = Record<string, string>

const draftOf = (collection: Collection, row: RecordRow): Draft =>
  Object.fromEntries(collection.fields.filter((f) => f.editable).map((f) => [f.key, String(row[f.key] ?? "")]))

export function RecordDetail({ collection, row }: { collection: Collection; row: RecordRow }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => draftOf(collection, row))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const title = titleOf(collection, row)
  const hasAnswers = collection.fields.some((f) => f.kind === "answers")
  const longtext = collection.fields.filter((f) => f.kind === "longtext")
  const aside = collection.fields.filter(
    (f) =>
      f.kind !== "longtext" &&
      f.kind !== "score" &&
      f.kind !== "answers" &&
      !(hasAnswers && f.chip && !f.editable) &&
      (editing || f.key !== collection.title)
  )
  const emailField = collection.fields.find((f) => f.kind === "email")
  const replies = longtext.length > 0

  function startEditing() {
    setDraft(draftOf(collection, row))
    setErrors({})
    setSaved(false)
    setEditing(true)
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (saving) return
    const changed = Object.fromEntries(
      Object.entries(draft).filter(([key, value]) => value !== String(row[key] ?? ""))
    )
    if (!Object.keys(changed).length) {
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      const result = await updateRecord({ data: { collection: collection.id, id: Number(row.id), values: changed } })
      if (result.ok) {
        setErrors({})
        setEditing(false)
        setSaved(true)
        await router.invalidate()
      } else {
        setErrors(result.errors)
      }
    } catch {
      setErrors({ _form: "Could not save. Check your connection and try again." })
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    setDeleting(true)
    try {
      const { ok } = await deleteRecord({ data: { collection: collection.id, id: Number(row.id) } })
      if (!ok) throw new Error("missing")
      await router.invalidate()
      await router.navigate({
        to: "/admin/$collection",
        params: { collection: collection.id },
        state: { notice: `Deleted ${collection.singular} “${title}”.` } as never,
      })
    } catch {
      setDeleting(false)
      setConfirming(false)
      setErrors({ _form: "Could not delete that record. It may already be gone." })
    }
  }

  const control = (field: Field) => (
    <EditControl
      field={field}
      value={draft[field.key] ?? ""}
      error={errors[field.key]}
      onChange={(value) => setDraft((d) => ({ ...d, [field.key]: value }))}
    />
  )

  return (
    <form onSubmit={save} noValidate>
      <nav className="ad-crumbs" aria-label="Breadcrumb">
        <Link to="/admin/$collection" params={{ collection: collection.id }}>
          {collection.label}
        </Link>
        <ChevronRight aria-hidden />
        <span aria-current="page">#{String(row.id)}</span>
      </nav>

      <header className="ad-head">
        <div>
          <h1>{title}</h1>
          <p>
            Received <When iso={String(row.created_at)} />
          </p>
        </div>
        <div className="ad-actions">
          {editing ? (
            <>
              <button key="cancel" type="button" className="dc-btn ad-btn-quiet" onClick={() => setEditing(false)} disabled={saving}>
                <X aria-hidden />
                Cancel
              </button>
              <button key="save" type="submit" className="dc-btn dc-btn-primary" disabled={saving}>
                <Check aria-hidden />
                {saving ? "Saving…" : "Save changes"}
              </button>
            </>
          ) : (
            <>
              {emailField && row[emailField.key] ? (
                <a
                  className="dc-btn ad-btn-quiet"
                  href={`mailto:${row[emailField.key]}${replies ? `?subject=${encodeURIComponent("Re: your Goalkeep enquiry")}` : ""}`}
                >
                  <Mail aria-hidden />
                  {replies ? "Reply by email" : "Email"}
                </a>
              ) : null}
              <button key="edit" type="button" className="dc-btn ad-btn-quiet" onClick={startEditing}>
                <Pencil aria-hidden />
                Edit
              </button>
              <button key="delete" type="button" className="dc-btn ad-btn-danger" onClick={() => setConfirming(true)}>
                <Trash2 aria-hidden />
                Delete
              </button>
            </>
          )}
        </div>
      </header>

      {saved && !editing && (
        <p className="ad-notice" role="status">
          <Check aria-hidden />
          Changes saved.
        </p>
      )}
      {errors._form && (
        <p className="ad-error ad-form-error" role="alert">
          <AlertCircle aria-hidden />
          {errors._form}
        </p>
      )}

      <div className="ad-detail">
        <div className="ad-stack">
          {longtext.map((field) => (
            <section key={field.key} className="ad-card" aria-label={field.label}>
              <div className="ad-card-head">
                <h2>{field.label}</h2>
              </div>
              {editing && field.editable ? (
                <div className="ad-form-fields">{control(field)}</div>
              ) : row[field.key] ? (
                <p className="ad-prose" style={{ margin: 0 }}>
                  {String(row[field.key])}
                </p>
              ) : (
                <p className="ad-prose muted" style={{ margin: 0 }}>
                  No {field.label.toLowerCase()} was left.
                </p>
              )}
            </section>
          ))}
          {hasAnswers && <QuizResult fields={collection.fields} row={row} />}
        </div>

        <section className="ad-card" aria-label="Details">
          <div className="ad-card-head">
            <h2>Details</h2>
          </div>
          {editing ? (
            <div className="ad-form-fields">
              {aside.map((field) =>
                field.editable ? (
                  <div key={field.key}>{control(field)}</div>
                ) : (
                  <div key={field.key} className="ad-field">
                    <span className="ad-label">{field.label}</span>
                    <span className={field.key === "user_agent" ? "ad-hint" : undefined}>
                      <FieldValue field={field} row={row} />
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <dl className="ad-dl">
              {aside.map((field) => (
                <div key={field.key}>
                  <dt>{field.label}</dt>
                  <dd className={field.key === "user_agent" ? "small" : undefined}>
                    <FieldValue field={field} row={row} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      </div>

      <ConfirmDelete
        open={confirming}
        onOpenChange={(open) => !deleting && setConfirming(open)}
        noun={collection.singular}
        name={title}
        busy={deleting}
        onConfirm={remove}
      />
    </form>
  )
}

function EditControl({
  field,
  value,
  error,
  onChange,
}: {
  field: Field
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const id = useId()
  const errorId = `${id}-error`
  const common = {
    id,
    value,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    "aria-required": field.required,
  }

  return (
    <div className="ad-field">
      <label className="ad-label" htmlFor={id}>
        {field.label}
        {field.required ? "" : " (optional)"}
      </label>
      {field.kind === "longtext" ? (
        <>
          <textarea {...common} className="ad-textarea" maxLength={field.max} onChange={(e) => onChange(e.target.value)} />
          {field.max && (
            <span className="ad-hint num">
              {value.length} / {field.max}
            </span>
          )}
        </>
      ) : field.kind === "select" ? (
        <select {...common} className="ad-select" onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">Not set</option>}
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {value && !field.options?.some((o) => o.value === value) && <option value={value}>{value}</option>}
        </select>
      ) : (
        <input
          {...common}
          className="ad-input"
          type={field.kind === "email" ? "email" : "text"}
          maxLength={field.max}
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className="ad-error" role="alert">
          <AlertCircle aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}
