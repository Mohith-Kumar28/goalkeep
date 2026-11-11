import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { RecordDetail } from "@/components/admin/record-detail"
import { getRecord } from "@/server/admin/api"
import { collectionById } from "@/server/admin/collections"

export const Route = createFileRoute("/admin/$collection/$id")({
  loader: async ({ params }) => {
    const collection = collectionById(params.collection)
    if (!collection) throw notFound()
    const row = await getRecord({ data: { collection: collection.id, id: params.id } })
    if (!row) throw notFound()
    return row
  },
  head: ({ params }) => ({ meta: [{ title: `${collectionById(params.collection)?.singular ?? "Record"} | Goalkeep admin` }] }),
  notFoundComponent: () => (
    <div className="ad-card ad-empty">
      <h2>That record is gone</h2>
      <p>It may have been deleted. Go back to the list to see what is left.</p>
      <Link to="/admin" className="dc-btn ad-btn-quiet">
        Back to the overview
      </Link>
    </div>
  ),
  component: RecordPage,
})

function RecordPage() {
  const { collection: id, id: recordId } = Route.useParams()
  const row = Route.useLoaderData()
  return <RecordDetail key={recordId} collection={collectionById(id)!} row={row} />
}
