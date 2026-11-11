import { createFileRoute } from '@tanstack/react-router'
import { requestIsAdmin } from '@/server/admin/auth'
import { collectionById } from '@/server/admin/collections'
import { collectionCsv } from '@/server/export'

export const Route = createFileRoute('/api/admin/export/$collection')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const collection = collectionById(params.collection.replace(/\.csv$/, ''))
        if (!collection || !(await requestIsAdmin(request))) {
          return new Response('Not found', { status: 404 })
        }
        return collectionCsv(collection)
      },
    },
  },
})
