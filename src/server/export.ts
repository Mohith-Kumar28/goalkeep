/**
 * CSV downloads of the form tables, for Goalkeep to open in a spreadsheet.
 * Each URL needs `?token=` equal to the EXPORT_TOKEN secret; without it, or
 * with the wrong one, the route answers 404 as if it did not exist.
 */

const tables = {
  newsletter: {
    file: "goalkeep-newsletter-signups.csv",
    query:
      "SELECT id, created_at, email, name, organization, audience, edition FROM newsletter_signups ORDER BY id",
  },
  quiz: {
    file: "goalkeep-quiz-responses.csv",
    query:
      "SELECT id, created_at, name, email, organization, role, sector, size, budget, band, score_overall, score_data, score_technology, score_process, score_strategy, answers, region FROM quiz_responses ORDER BY id",
  },
}

export type ExportId = keyof typeof tables

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

const columnsOf = (query: string) =>
  query
    .slice("SELECT ".length, query.indexOf(" FROM "))
    .split(",")
    .map((column) => column.trim())

export async function exportCsv(request: Request, id: ExportId) {
  const { env } = await import("cloudflare:workers")
  const token = new URL(request.url).searchParams.get("token")
  if (!env.EXPORT_TOKEN || token !== env.EXPORT_TOKEN) {
    return new Response("Not found", { status: 404 })
  }

  const { file, query } = tables[id]
  const columns = columnsOf(query)
  const { results } = await env.DB.prepare(query).all()
  const lines = [
    columns.join(","),
    ...results.map((row) => columns.map((column) => cell(row[column])).join(",")),
  ]

  // The byte-order mark makes Excel read the file as UTF-8.
  return new Response(`\uFEFF${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  })
}
