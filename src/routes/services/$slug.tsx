import { createFileRoute, notFound } from '@tanstack/react-router'
import { ServicePage } from '@/components/design/services/service-page'
import { servicePages } from '@/content/design/services'
import type { ServiceSlug } from '@/content/design/service-page'

const isServiceSlug = (slug: string): slug is ServiceSlug => Object.hasOwn(servicePages, slug)

export const Route = createFileRoute('/services/$slug')({
  loader: ({ params }) => {
    if (!isServiceSlug(params.slug)) throw notFound()
    return servicePages[params.slug]
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: loaderData.meta.title }, { name: 'description', content: loaderData.meta.description }]
      : [],
  }),
  component: ServiceRoute,
})

function ServiceRoute() {
  const content = Route.useLoaderData()
  return <ServicePage key={content.slug} content={content} />
}
