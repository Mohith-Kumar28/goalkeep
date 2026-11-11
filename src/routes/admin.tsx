import { Outlet, createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { AdminShell } from "@/components/admin/shell"
import { adminSession, overview } from "@/server/admin/api"

/**
 * The admin area. Signed out, only /admin answers (with the login screen);
 * any deeper URL redirects there before its loader can run. With no
 * ADMIN_PASSWORD set, the whole area is a 404.
 */
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin | Goalkeep" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  beforeLoad: async ({ location }) => {
    const session = await adminSession()
    if (!session.enabled) throw notFound()
    if (!session.signedIn && location.pathname.replace(/\/$/, "") !== "/admin") throw redirect({ to: "/admin" })
    return { signedIn: session.signedIn }
  },
  loader: async ({ context }) => (context.signedIn ? overview() : null),
  component: AdminLayout,
})

function AdminLayout() {
  const data = Route.useLoaderData()
  if (!data) return <Outlet />
  const totals = Object.fromEntries(data.collections.map((c) => [c.id, c.total])) as Record<
    "contact" | "newsletter" | "quiz",
    number
  >
  return (
    <AdminShell totals={totals}>
      <Outlet />
    </AdminShell>
  )
}
