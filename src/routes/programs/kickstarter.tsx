import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { KickstarterPage } from '@/components/design/kickstarter/page'
import { kickstarter } from '@/content/design/kickstarter'

export const Route = createFileRoute('/programs/kickstarter')({
  head: () => pageHead({ title: kickstarter.meta.title, description: kickstarter.meta.description, path: '/programs/kickstarter' }),
  component: KickstarterPage,
})
