import { createFileRoute, notFound } from '@tanstack/react-router'
import { PageView } from '@/components/pages/page-blocks'
import { servicePage } from '@/content/services'

export const Route = createFileRoute('/services/$slug')({
  loader: ({ params }) => {
    const page = servicePage(params.slug)
    if (!page) throw notFound()
    return page
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }, { name: 'description', content: loaderData.description }] : [],
  }),
  component: ServicePage,
})

function ServicePage() {
  const page = Route.useLoaderData()
  return <PageView key={page.slug} page={page} />
}
