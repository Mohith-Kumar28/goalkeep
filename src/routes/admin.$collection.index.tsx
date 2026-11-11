import { Link, createFileRoute, notFound, useRouterState } from "@tanstack/react-router"
import { Check, Download, Inbox, X } from "lucide-react"
import { useState } from "react"
import { RecordTable, SearchBox } from "@/components/admin/record-table"
import type { ListSearch } from "@/components/admin/record-table"
import { listRecords } from "@/server/admin/api"
import { collectionById } from "@/server/admin/collections"

export const Route = createFileRoute("/admin/$collection/")({
  validateSearch: (raw: Record<string, unknown>): ListSearch => {
    const page = Math.floor(Number(raw.page))
    return {
      page: page > 1 ? page : undefined,
      q: typeof raw.q === "string" && raw.q.trim() ? raw.q.trim().slice(0, 100) : undefined,
      sort: typeof raw.sort === "string" ? raw.sort : undefined,
      dir: raw.dir === "asc" || raw.dir === "desc" ? raw.dir : undefined,
    }
  },
  loaderDeps: ({ search }) => search,
  loader: ({ params, deps }) => {
    const collection = collectionById(params.collection)
    if (!collection) throw notFound()
    return listRecords({ data: { collection: collection.id, ...deps } })
  },
  head: ({ params }) => ({ meta: [{ title: `${collectionById(params.collection)?.label ?? "Admin"} | Goalkeep admin` }] }),
  component: CollectionPage,
})

function CollectionPage() {
  const { collection: id } = Route.useParams()
  const search = Route.useSearch()
  const result = Route.useLoaderData()
  const collection = collectionById(id)!
  const notice = useRouterState({ select: (s) => (s.location.state as { notice?: string }).notice })
  const [dismissed, setDismissed] = useState(false)
  const searching = Boolean(search.q)

  return (
    <>
      <header className="ad-head">
        <div>
          <h1>{collection.label}</h1>
          <p className="num">{result.total} in total</p>
        </div>
        <div className="ad-actions">
          <a className="dc-btn ad-btn-quiet" href={`/api/admin/export/${collection.id}.csv`} download>
            <Download aria-hidden />
            Download CSV
          </a>
        </div>
      </header>

      {notice && !dismissed && (
        <p className="ad-notice" role="status">
          <Check aria-hidden />
          {notice}
          <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss">
            <X aria-hidden style={{ width: 16, height: 16 }} />
          </button>
        </p>
      )}

      <div className="ad-toolbar">
        <SearchBox collection={collection} search={search} />
        {searching && (
          <span className="ad-toolbar-count num" aria-live="polite">
            {result.total} {result.total === 1 ? "match" : "matches"}
          </span>
        )}
      </div>

      <div className="ad-card">
        {result.rows.length === 0 ? (
          <div className="ad-empty">
            <Inbox aria-hidden style={{ width: 28, height: 28, color: "var(--gk-blue-deep)" }} />
            {searching ? (
              <>
                <h2>No {collection.label.toLowerCase()} match “{search.q}”</h2>
                <p>Search looks at names, emails, organizations and messages. Try fewer words or a different spelling.</p>
                <Link to="/admin/$collection" params={{ collection: collection.id }} className="dc-btn ad-btn-quiet">
                  Clear search
                </Link>
              </>
            ) : (
              <>
                <h2>No {collection.label.toLowerCase()} yet</h2>
                <p>When someone submits the form on the site, it shows up here straight away.</p>
              </>
            )}
          </div>
        ) : (
          <RecordTable collection={collection} result={result} search={search} />
        )}
      </div>
    </>
  )
}
