import { collections, csvFields } from "./admin/collections"
import type { Collection, CollectionId } from "./admin/collections"

/**
 * CSV downloads of the form tables, for Goalkeep to open in a spreadsheet.
 * Columns come from the admin collection registry. Each token URL needs
 * `?token=` equal to the EXPORT_TOKEN secret; without it, or with the wrong
 * one, the route answers 404 as if it did not exist. The signed-in admin
 * downloads the same files from /api/admin/export/<collection>.
 */

export type ExportId = CollectionId

/* A spreadsheet runs a cell that starts with one of these as a formula, and
   every value here was typed into a public form. */
const FORMULA = /^[=+\-@\t\r]/

function cell(value: unknown) {
  if (value === null || value === undefined) return ""
  if (typeof value === "number") return String(value)
  let text = String(value)
  if (FORMULA.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export async function collectionCsv(collection: Collection) {
  const { env } = await import("cloudflare:workers")
  const columns = csvFields(collection).map((field) => field.key)
  const { results } = await env.DB.prepare(
    `SELECT ${columns.join(", ")} FROM ${collection.table} ORDER BY id`
  ).all()
  const lines = [
    columns.join(","),
    ...results.map((row) => columns.map((column) => cell(row[column])).join(",")),
  ]

  // The byte-order mark makes Excel read the file as UTF-8.
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${collection.file}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  })
}

export async function exportCsv(request: Request, id: ExportId) {
  const { env } = await import("cloudflare:workers")
  const token = new URL(request.url).searchParams.get("token")
  if (!env.EXPORT_TOKEN || token !== env.EXPORT_TOKEN) {
    return new Response("Not found", { status: 404 })
  }
  return collectionCsv(collections[id])
}
