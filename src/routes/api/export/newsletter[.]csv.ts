import { createFileRoute } from '@tanstack/react-router'
import { exportCsv } from '@/server/export'

export const Route = createFileRoute('/api/export/newsletter.csv')({
  server: { handlers: { GET: ({ request }) => exportCsv(request, 'newsletter') } },
})
