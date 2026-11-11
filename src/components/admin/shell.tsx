import { Link, useRouter } from "@tanstack/react-router"
import { ExternalLink, LayoutDashboard, LogOut } from "lucide-react"
import type { ReactNode } from "react"
import { adminSignOut } from "@/server/admin/api"
import { COLLECTION_IDS, collections } from "@/server/admin/collections"
import type { CollectionId } from "@/server/admin/collections"
import { collectionIcons } from "./collection-icons"

export function AdminShell({ totals, children }: { totals: Record<CollectionId, number>; children: ReactNode }) {
  const router = useRouter()

  async function signOut() {
    await adminSignOut()
    await router.invalidate()
    await router.navigate({ to: "/admin" })
  }

  return (
    <div className="ad ad-app">
      <aside className="ad-side" data-ground="navy">
        <div className="ad-brand">
          <img src="/wordmark-white.webp" alt="Goalkeep" width={673} height={160} />
          <span>admin</span>
        </div>
        <nav className="ad-nav" aria-label="Admin">
          <Link to="/admin" activeOptions={{ exact: true }} className="ad-nav-link">
            <LayoutDashboard aria-hidden />
            Overview
          </Link>
          {COLLECTION_IDS.map((id) => {
            const Icon = collectionIcons[id]
            return (
              <Link key={id} to="/admin/$collection" params={{ collection: id }} className="ad-nav-link">
                <Icon aria-hidden />
                {collections[id].label}
                <span className="ad-nav-count num">{totals[id]}</span>
              </Link>
            )
          })}
        </nav>
        <div className="ad-side-foot">
          <a href="/" className="ad-nav-link" target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden />
            <span><span className="label-long">View </span>site</span>
          </a>
          <button type="button" className="ad-nav-link" onClick={signOut}>
            <LogOut aria-hidden />
            Sign out
          </button>
        </div>
      </aside>
      <div>
        <div className="ad-page">{children}</div>
      </div>
    </div>
  )
}
