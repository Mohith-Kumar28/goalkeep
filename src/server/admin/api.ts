import { createServerFn } from "@tanstack/react-start"
import { collectionById, collections, listFields, searchableFields } from "./collections"
import type { Collection, CollectionId, Field, RecordRow } from "./collections"
import { readSession, requireAdmin, signIn, signOut } from "./auth"

/**
 * The admin dashboard's server functions. Each one checks the session cookie
 * first. A collection id is resolved through the registry before it touches
 * SQL, so table and column names never come from a request.
 */

export const PAGE_SIZE = 25
const MAX_PAGE_SIZE = 100
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const parseCollection = (value: unknown): Collection => {
  const collection = collectionById(value)
  if (!collection) throw new Error("Unknown collection.")
  return collection
}

const parseId = (value: unknown) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) throw new Error("Unknown record.")
  return id
}

const db = async () => (await import("cloudflare:workers")).env.DB

export const adminSession = createServerFn({ method: "GET" }).handler(() => readSession())

export const adminSignIn = createServerFn({ method: "POST" })
  .validator((input: { password: string }) => ({
    password: typeof input.password === "string" ? input.password.slice(0, 200) : "",
  }))
  .handler(async ({ data }) => ({ ok: await signIn(data.password) }))

export const adminSignOut = createServerFn({ method: "POST" }).handler(() => signOut())

export type ListInput = {
  collection: CollectionId
  page?: number
  pageSize?: number
  q?: string
  sort?: string
  dir?: "asc" | "desc"
}

export type ListResult = {
  rows: Array<RecordRow>
  total: number
  page: number
  pageSize: number
  pageCount: number
}

/** `%`, `_` and the escape itself are plain characters in a search. */
const likePattern = (q: string) => `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`

export const listRecords = createServerFn({ method: "GET" })
  .validator((input: ListInput) => {
    const collection = parseCollection(input.collection)
    const sortable = collection.fields.find((f) => f.key === input.sort && f.kind !== "answers")
    return {
      collection,
      page: Math.max(1, Math.floor(Number(input.page)) || 1),
      pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(Number(input.pageSize)) || PAGE_SIZE)),
      q: typeof input.q === "string" ? input.q.trim().slice(0, 100) : "",
      sort: sortable?.key ?? "created_at",
      dir: input.dir === "asc" ? ("asc" as const) : ("desc" as const),
    }
  })
  .handler(async ({ data }): Promise<ListResult> => {
    await requireAdmin()
    const { collection, q, sort, dir, pageSize } = data
    const database = await db()

    const clauses: Array<string> = []
    const params: Array<string | number> = []
    if (q) {
      for (const field of searchableFields(collection)) {
        clauses.push(`${field.key} LIKE ? ESCAPE '\\'`)
        params.push(likePattern(q))
      }
      if (/^\d+$/.test(q)) {
        clauses.push("id = ?")
        params.push(Number(q))
      }
    }
    const where = clauses.length ? `WHERE ${clauses.join(" OR ")}` : ""

    const counted = await database
      .prepare(`SELECT COUNT(*) AS n FROM ${collection.table} ${where}`)
      .bind(...params)
      .first()
    const total = Number(counted?.n ?? 0)
    const pageCount = Math.max(1, Math.ceil(total / pageSize))
    const page = Math.min(data.page, pageCount)

    const columns = ["id", ...listFields(collection).map((f) => f.key)]
    const direction = dir === "asc" ? "ASC" : "DESC"
    const { results } = await database
      .prepare(
        `SELECT ${[...new Set(columns)].join(", ")} FROM ${collection.table} ${where}
         ORDER BY ${sort} ${direction}, id ${direction} LIMIT ? OFFSET ?`
      )
      .bind(...params, pageSize, (page - 1) * pageSize)
      .all()

    return { rows: results as Array<RecordRow>, total, page, pageSize, pageCount }
  })

export const getRecord = createServerFn({ method: "GET" })
  .validator((input: { collection: CollectionId; id: number | string }) => ({
    collection: parseCollection(input.collection),
    id: parseId(input.id),
  }))
  .handler(async ({ data }): Promise<RecordRow | null> => {
    await requireAdmin()
    return getRow(data.collection, data.id)
  })

export type UpdateResult =
  | { ok: true; row: RecordRow }
  | { ok: false; errors: Record<string, string> }

/** Returns the cleaned value, or the message to show beside the field. */
function cleanValue(field: Field, raw: unknown): { value: string | null } | { error: string } {
  const text = typeof raw === "string" ? raw.trim() : ""
  if (!text) return field.required ? { error: `${field.label} is required.` } : { value: null }
  if (field.max && text.length > field.max) {
    return { error: `${field.label} can be at most ${field.max} characters.` }
  }
  if (field.kind === "email") {
    return EMAIL.test(text) ? { value: text.toLowerCase() } : { error: "Enter a valid email address." }
  }
  if (field.kind === "select" && !field.options?.some((o) => o.value === text)) {
    return { error: `Choose one of the ${field.label.toLowerCase()} options.` }
  }
  return { value: text }
}

export const updateRecord = createServerFn({ method: "POST" })
  .validator((input: { collection: CollectionId; id: number | string; values: Record<string, unknown> }) => ({
    collection: parseCollection(input.collection),
    id: parseId(input.id),
    values: input.values,
  }))
  .handler(async ({ data }): Promise<UpdateResult> => {
    await requireAdmin()
    const { collection, id, values } = data
    const editable = new Map(collection.fields.filter((f) => f.editable).map((f) => [f.key, f]))

    const errors: Record<string, string> = {}
    const clean: Record<string, string | null> = {}
    for (const key of Object.keys(values)) {
      if (!editable.has(key)) errors[key] = "This field cannot be edited."
    }
    for (const field of editable.values()) {
      if (!(field.key in values)) continue
      const result = cleanValue(field, values[field.key])
      if ("error" in result) errors[field.key] = result.error
      else clean[field.key] = result.value
    }
    const keys = Object.keys(clean)
    if (Object.keys(errors).length || !keys.length) {
      return { ok: false, errors: Object.keys(errors).length ? errors : { _form: "Nothing to save." } }
    }

    const database = await db()
    try {
      const result = await database
        .prepare(`UPDATE ${collection.table} SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`)
        .bind(...keys.map((k) => clean[k]), id)
        .run()
      if (!result.meta.changes) return { ok: false, errors: { _form: "That record no longer exists." } }
    } catch (error) {
      if (error instanceof Error && /UNIQUE/i.test(error.message)) {
        return { ok: false, errors: { email: "Another sign-up already uses this email address." } }
      }
      throw error
    }

    const row = await getRow(collection, id)
    return row ? { ok: true, row } : { ok: false, errors: { _form: "That record no longer exists." } }
  })

async function getRow(collection: Collection, id: number) {
  const row = await (await db())
    .prepare(`SELECT ${collection.fields.map((f) => f.key).join(", ")} FROM ${collection.table} WHERE id = ?`)
    .bind(id)
    .first()
  return (row as RecordRow | null) ?? null
}

export const deleteRecord = createServerFn({ method: "POST" })
  .validator((input: { collection: CollectionId; id: number | string }) => ({
    collection: parseCollection(input.collection),
    id: parseId(input.id),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    await requireAdmin()
    const result = await (await db())
      .prepare(`DELETE FROM ${data.collection.table} WHERE id = ?`)
      .bind(data.id)
      .run()
    return { ok: result.meta.changes > 0 }
  })

export type OverviewResult = {
  collections: Array<{
    id: CollectionId
    total: number
    lastWeek: number
    latest: Array<RecordRow>
  }>
}

export const overview = createServerFn({ method: "GET" }).handler(async (): Promise<OverviewResult> => {
  await requireAdmin()
  const database = await db()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  return {
    collections: await Promise.all(
      Object.values(collections).map(async (collection) => {
        const [counts, latest] = await Promise.all([
          database
            .prepare(
              `SELECT COUNT(*) AS total, COALESCE(SUM(created_at >= ?), 0) AS week FROM ${collection.table}`
            )
            .bind(weekAgo)
            .first(),
          database
            .prepare(
              `SELECT ${["id", ...listFields(collection).map((f) => f.key)].join(", ")} FROM ${collection.table} ORDER BY created_at DESC, id DESC LIMIT 5`
            )
            .all(),
        ])
        return {
          id: collection.id,
          total: Number(counts?.total ?? 0),
          lastWeek: Number(counts?.week ?? 0),
          latest: latest.results as Array<RecordRow>,
        }
      })
    ),
  }
})
