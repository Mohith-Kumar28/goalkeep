import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ListResult } from "@/server/admin/api"
import { listFields } from "@/server/admin/collections"
import type { Collection } from "@/server/admin/collections"
import { FieldValue } from "./field-value"
import { titleOf } from "./format"

export type ListSearch = { page?: number; q?: string; sort?: string; dir?: "asc" | "desc" }

/** The first and last page, and a window around the current one. */
function pageWindow(page: number, count: number) {
  const wanted = new Set([1, count, page - 1, page, page + 1])
  const pages = [...wanted].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b)
  return pages.flatMap((n, i) => (i > 0 && n - pages[i - 1] > 1 ? ["gap" as const, n] : [n]))
}

export function SearchBox({ collection, search }: { collection: Collection; search: ListSearch }) {
  const navigate = useNavigate()
  const [value, setValue] = useState(search.q ?? "")
  const latest = useRef(search.q ?? "")

  // Back/forward and the clear link change the URL; the box follows it.
  useEffect(() => {
    latest.current = search.q ?? ""
    setValue(search.q ?? "")
  }, [search.q])

  useEffect(() => {
    const trimmed = value.trim()
    if (trimmed === latest.current) return
    const timer = setTimeout(() => {
      latest.current = trimmed
      void navigate({
        to: "/admin/$collection",
        params: { collection: collection.id },
        search: { ...search, q: trimmed || undefined, page: undefined },
        replace: true,
      })
    }, 250)
    return () => clearTimeout(timer)
  }, [value, collection.id, navigate, search])

  return (
    <div className="ad-search" role="search">
      <Search aria-hidden />
      <input
        className="ad-input"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={`Search ${collection.label.toLowerCase()}`}
        aria-label={`Search ${collection.label.toLowerCase()}`}
      />
    </div>
  )
}

export function RecordTable({ collection, result, search }: { collection: Collection; result: ListResult; search: ListSearch }) {
  const navigate = useNavigate()
  const fields = listFields(collection)
  const sort = search.sort ?? "created_at"
  const dir = search.dir ?? "desc"
  const first = (result.page - 1) * result.pageSize + 1
  const last = first + result.rows.length - 1

  const open = (id: unknown) =>
    void navigate({ to: "/admin/$collection/$id", params: { collection: collection.id, id: String(id) } })

  return (
    <>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              {fields.map((field) => {
                const active = sort === field.key
                const next = active && dir === "desc" ? "asc" : "desc"
                const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown
                return (
                  <th key={field.key} aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : undefined}>
                    <Link
                      to="/admin/$collection"
                      params={{ collection: collection.id }}
                      search={{ ...search, sort: field.key, dir: next, page: undefined }}
                      className="ad-sort"
                    >
                      {field.label}
                      <Icon aria-hidden />
                    </Link>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr
                key={String(row.id)}
                onClick={(event) => {
                  if (!(event.target as Element).closest("a, button")) open(row.id)
                }}
              >
                {fields.map((field, index) => {
                  const isTitle = field.key === collection.title
                  return (
                    <td
                      key={field.key}
                      data-label={field.label}
                      className={[isTitle ? "is-title" : "", index >= 4 && !isTitle ? "m-hide" : ""].join(" ").trim() || undefined}
                    >
                      {isTitle ? (
                        <Link
                          to="/admin/$collection/$id"
                          params={{ collection: collection.id, id: String(row.id) }}
                          className="ad-title-link"
                        >
                          {titleOf(collection, row)}
                        </Link>
                      ) : (
                        <FieldValue field={field} row={row} stacked={field.kind === "datetime"} />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="ad-pager" aria-label="Pagination">
        <span className="num" aria-live="polite">
          Showing {first}–{last} of {result.total}
        </span>
        {result.pageCount > 1 && (
          <div className="ad-pager-nav">
            <PageLink collection={collection} search={search} page={result.page - 1} disabled={result.page <= 1} label="Previous page">
              <ChevronLeft aria-hidden />
            </PageLink>
            {pageWindow(result.page, result.pageCount).map((entry, i) =>
              entry === "gap" ? (
                <span key={`gap-${i}`} className="ad-gap" aria-hidden>
                  …
                </span>
              ) : (
                <PageLink
                  key={entry}
                  collection={collection}
                  search={search}
                  page={entry}
                  current={entry === result.page}
                  label={`Page ${entry}`}
                >
                  {entry}
                </PageLink>
              )
            )}
            <PageLink collection={collection} search={search} page={result.page + 1} disabled={result.page >= result.pageCount} label="Next page">
              <ChevronRight aria-hidden />
            </PageLink>
          </div>
        )}
      </nav>
    </>
  )
}

function PageLink({
  collection,
  search,
  page,
  current,
  disabled,
  label,
  children,
}: {
  collection: Collection
  search: ListSearch
  page: number
  current?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <Link
      to="/admin/$collection"
      params={{ collection: collection.id }}
      search={{ ...search, page: page > 1 ? page : undefined }}
      className="ad-page-btn num"
      aria-label={label}
      data-current={current ? "" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
    >
      {children}
    </Link>
  )
}
