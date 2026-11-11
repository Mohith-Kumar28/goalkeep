import { Link } from "@tanstack/react-router"
import { Download } from "lucide-react"
import { collections } from "@/server/admin/collections"
import type { OverviewResult } from "@/server/admin/api"
import { collectionIcons } from "./collection-icons"
import { When, titleOf } from "./format"

export function Overview({ data }: { data: OverviewResult }) {
  const feed = data.collections
    .flatMap((entry) => entry.latest.map((row) => ({ id: entry.id, row })))
    .sort((a, b) => String(b.row.created_at).localeCompare(String(a.row.created_at)))
    .slice(0, 10)

  return (
    <>
      <header className="ad-head">
        <div>
          <h1>Overview</h1>
          <p>Everything the site has collected, and what came in this week.</p>
        </div>
      </header>

      <div className="ad-tiles">
        {data.collections.map((entry) => {
          const collection = collections[entry.id]
          const Icon = collectionIcons[entry.id]
          return (
            <section key={entry.id} className="ad-card ad-tile" aria-label={collection.label}>
              <div className="ad-tile-top">
                <Icon aria-hidden />
                {collection.label}
              </div>
              <div className="ad-tile-total num">{entry.total}</div>
              <div className="ad-tile-week">
                <strong className="num">+{entry.lastWeek}</strong> in the last 7 days
              </div>
              <div className="ad-tile-links">
                <Link to="/admin/$collection" params={{ collection: entry.id }}>
                  View all
                </Link>
                <a href={`/api/admin/export/${entry.id}.csv`} download>
                  <Download aria-hidden style={{ width: 14, height: 14 }} />
                  CSV
                </a>
              </div>
            </section>
          )
        })}
      </div>

      <section className="ad-card" aria-labelledby="recent">
        <div className="ad-card-head">
          <h2 id="recent">Recent activity</h2>
        </div>
        {feed.length === 0 ? (
          <div className="ad-empty">
            <h2>Nothing yet</h2>
            <p>New enquiries, sign-ups and quiz responses will appear here as they come in.</p>
          </div>
        ) : (
          <ul className="ad-feed">
            {feed.map(({ id, row }) => {
              const collection = collections[id]
              const Icon = collectionIcons[id]
              return (
                <li key={`${id}-${row.id}`}>
                  <Link to="/admin/$collection/$id" params={{ collection: id, id: String(row.id) }}>
                    <span className="ad-feed-icon">
                      <Icon aria-hidden />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span className="ad-feed-title" style={{ display: "block" }}>
                        {titleOf(collection, row)}
                      </span>
                      <span className="ad-feed-sub" style={{ display: "block" }}>
                        {collection.singular[0].toUpperCase() + collection.singular.slice(1)}
                        {row.organization ? ` · ${row.organization}` : ""}
                      </span>
                    </span>
                    <When iso={String(row.created_at)} mode="relative" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
