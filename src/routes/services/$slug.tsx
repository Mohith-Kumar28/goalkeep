import { createFileRoute, notFound } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { ServicePage } from '@/components/design/services/service-page'
import { servicePages } from '@/content/design/services'
import type { ServiceSlug } from '@/content/design/service-page'

const isServiceSlug = (slug: string): slug is ServiceSlug => Object.hasOwn(servicePages, slug)

export const Route = createFileRoute('/services/$slug')({
  loader: ({ params }) => {
    if (!isServiceSlug(params.slug)) throw notFound()
    return servicePages[params.slug]
  },
  head: ({ loaderData }) => loaderData ? pageHead({ title: loaderData.meta.title, description: loaderData.meta.description, path: `/services/${loaderData.slug}` }) : {},
  component: ServiceRoute,
})

function ServiceRoute() {
  const content = Route.useLoaderData()
  return <ServicePage key={content.slug} content={content} />
}
