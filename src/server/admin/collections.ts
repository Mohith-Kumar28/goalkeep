import { contact } from "@/content/homepage"
import { newsletter, readers } from "@/content/design/newsletter"
import { detailOptions, personas } from "@/content/quiz"

/**
 * Everything the site collects, described once. The admin server functions,
 * the list, the detail view, the edit form and the CSV exports all read this,
 * so a new column is added here and nowhere else. Table and column names in
 * SQL come only from here, never from a request.
 */

export type FieldKind =
  | "text"
  | "email"
  | "longtext"
  | "select"
  | "datetime"
  | "score"
  | "answers"
  | "readonly"

export type Option = { value: string; label: string }

export type Field = {
  key: string
  label: string
  kind: FieldKind
  editable: boolean
  required?: boolean
  max?: number
  options?: Array<Option>
  /** A column of the list view. */
  list?: boolean
  searchable?: boolean
  /** A select shown as a small tag rather than plain text. */
  chip?: boolean
  /** Left out of the CSV exports. */
  noCsv?: boolean
}

export const COLLECTION_IDS = ["contact", "newsletter", "quiz"] as const
export type CollectionId = (typeof COLLECTION_IDS)[number]

export type Collection = {
  id: CollectionId
  label: string
  singular: string
  table: string
  /** The CSV download's file name. */
  file: string
  /** The field that names a record, in the list, the dialog and the feed. */
  title: string
  fields: Array<Field>
}

const asOptions = (values: ReadonlyArray<string>): Array<Option> =>
  values.map((value) => ({ value, label: value }))

const id: Field = { key: "id", label: "ID", kind: "readonly", editable: false }
const createdAt: Field = {
  key: "created_at",
  label: "Received",
  kind: "datetime",
  editable: false,
  list: true,
}
const userAgent: Field = { key: "user_agent", label: "Browser", kind: "readonly", editable: false, noCsv: true }

const contactServices = [contact.generalEnquiry, ...contact.serviceOptions]

export const collections: Record<CollectionId, Collection> = {
  contact: {
    id: "contact",
    label: "Enquiries",
    singular: "enquiry",
    table: "contact_submissions",
    file: "goalkeep-contact-enquiries.csv",
    title: "name",
    fields: [
      id,
      createdAt,
      { key: "name", label: "Name", kind: "text", editable: true, required: true, max: 120, list: true, searchable: true },
      { key: "email", label: "Email", kind: "email", editable: true, required: true, max: 200, list: true, searchable: true },
      { key: "organization", label: "Organization", kind: "text", editable: true, max: 200, list: true, searchable: true },
      { key: "service", label: "Interested in", kind: "select", editable: true, required: true, options: asOptions(contactServices), list: true, searchable: true },
      { key: "message", label: "Message", kind: "longtext", editable: true, required: true, max: 4000, searchable: true },
      userAgent,
    ],
  },
  newsletter: {
    id: "newsletter",
    label: "Newsletter",
    singular: "sign-up",
    table: "newsletter_signups",
    file: "goalkeep-newsletter-signups.csv",
    title: "email",
    fields: [
      id,
      createdAt,
      { key: "email", label: "Email", kind: "email", editable: true, required: true, max: 200, list: true, searchable: true },
      { key: "name", label: "Name", kind: "text", editable: true, max: 120, list: true, searchable: true },
      { key: "organization", label: "Organization", kind: "text", editable: true, max: 200, list: true, searchable: true },
      { key: "audience", label: "Reader", kind: "select", editable: true, options: readers.map((r) => ({ value: r.id, label: r.label })), list: true, chip: true },
      { key: "edition", label: "Edition", kind: "select", editable: true, options: newsletter.editions.map((e) => ({ value: e.id, label: e.month })) },
    ],
  },
  quiz: {
    id: "quiz",
    label: "Quiz responses",
    singular: "quiz response",
    table: "quiz_responses",
    file: "goalkeep-quiz-responses.csv",
    title: "name",
    fields: [
      id,
      createdAt,
      { key: "name", label: "Name", kind: "text", editable: true, required: true, max: 120, list: true, searchable: true },
      { key: "email", label: "Email", kind: "email", editable: true, required: true, max: 200, list: true, searchable: true },
      { key: "organization", label: "Organization", kind: "text", editable: true, required: true, max: 200, list: true, searchable: true },
      { key: "role", label: "Role", kind: "text", editable: true, required: true, max: 120, searchable: true },
      { key: "sector", label: "Sector", kind: "text", editable: true, required: true, max: 120, searchable: true },
      { key: "size", label: "Size", kind: "select", editable: true, required: true, options: asOptions(detailOptions.size) },
      { key: "budget", label: "Budget", kind: "select", editable: true, options: asOptions(detailOptions.budget) },
      // Scores and answers are derived from one another; editing one would leave the rest lying.
      { key: "band", label: "Persona", kind: "select", editable: false, options: personas.map((p) => ({ value: p.id, label: p.label })), list: true, chip: true },
      { key: "score_overall", label: "Overall", kind: "score", editable: false, list: true },
      { key: "score_data", label: "Data", kind: "score", editable: false },
      { key: "score_technology", label: "Technology", kind: "score", editable: false },
      { key: "score_process", label: "Process", kind: "score", editable: false },
      { key: "score_strategy", label: "Strategy", kind: "score", editable: false },
      { key: "answers", label: "Answers", kind: "answers", editable: false },
      { key: "region", label: "Region", kind: "readonly", editable: false },
      userAgent,
    ],
  },
}

export function collectionById(value: unknown): Collection | null {
  return typeof value === "string" && (COLLECTION_IDS as ReadonlyArray<string>).includes(value)
    ? collections[value as CollectionId]
    : null
}

export const listFields = (c: Collection) => c.fields.filter((f) => f.list)
export const csvFields = (c: Collection) => c.fields.filter((f) => !f.noCsv)
export const searchableFields = (c: Collection) => c.fields.filter((f) => f.searchable)

export type RecordRow = Record<string, string | number | null>
