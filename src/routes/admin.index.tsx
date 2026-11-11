import { createFileRoute, getRouteApi } from "@tanstack/react-router"
import { LoginScreen } from "@/components/admin/login"
import { Overview } from "@/components/admin/overview"

const layout = getRouteApi("/admin")

export const Route = createFileRoute("/admin/")({ component: AdminHome })

function AdminHome() {
  const data = layout.useLoaderData()
  return data ? <Overview data={data} /> : <LoginScreen />
}
