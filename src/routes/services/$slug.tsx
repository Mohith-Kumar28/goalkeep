import { createFileRoute, notFound } from '@tanstack/react-router'
import { ServicePage } from '@/components/design/services/service-page'
import { PageView } from '@/components/pages/page-blocks'
import { servicePage } from '@/content/services'
import { servicePages } from '@/content/design/services'
import type { ServiceSlug } from '@/content/design/service-page'

const designPage = (slug: string) => servicePages[slug as ServiceSlug]

export const Route = createFileRoute('/services/$slug')({
  loader: ({ params }) => {
    const design = designPage(params.slug)
    if (design) return { design, page: undefined }
    const page = servicePage(params.slug)
    if (!page) throw notFound()
    return { design: undefined, page }
  },
  head: ({ loaderData }) => {
    const meta = loaderData?.design?.meta ?? loaderData?.page
    return {
      meta: meta ? [{ title: meta.title }, { name: 'description', content: meta.description }] : [],
    }
  },
  component: ServiceRoute,
})

function ServiceRoute() {
  const { design, page } = Route.useLoaderData()
  if (design) return <ServicePage key={design.slug} content={design} />
  return <PageView key={page.slug} page={page} />
}
