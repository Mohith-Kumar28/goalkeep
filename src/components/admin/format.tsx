import { collectionById } from "@/server/admin/collections"
import type { Collection, Field, RecordRow } from "@/server/admin/collections"

const stamp = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})
const stampThisYear = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
})
const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["day", 86_400],
  ["hour", 3600],
  ["minute", 60],
]

export function ago(iso: string) {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return "just now"
}

/** Local time, so the first render on the server (UTC) and the browser differ; hence suppressHydrationWarning. */
export function When({ iso, mode = "both" }: { iso: string; mode?: "both" | "relative" | "stacked" }) {
  const date = new Date(iso)
  const thisYear = date.getFullYear() === new Date().getFullYear()
  const absolute = (mode === "stacked" && thisYear ? stampThisYear : stamp).format(date)
  const rel = ago(iso)
  if (mode === "relative") {
    return (
      <time dateTime={iso} title={absolute} suppressHydrationWarning>
        {rel}
      </time>
    )
  }
  if (mode === "stacked") {
    return (
      <time dateTime={iso} suppressHydrationWarning>
        {absolute}
        <span className="ad-sub">{rel}</span>
      </time>
    )
  }
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {absolute} <span className="muted">({rel})</span>
    </time>
  )
}

export const optionLabel = (field: Field, value: string) =>
  field.options?.find((option) => option.value === value)?.label ?? value

export const titleOf = (collection: Collection, row: RecordRow) =>
  String(row[collection.title] ?? `#${row.id}`)

export const score = (value: unknown) => Number(value ?? 0).toFixed(1)

export function parseAnswers(raw: unknown): Array<number> {
  try {
    const parsed: unknown = JSON.parse(String(raw))
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : []
  } catch {
    return []
  }
}

export { collectionById }
