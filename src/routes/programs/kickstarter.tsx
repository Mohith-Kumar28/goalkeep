import { createFileRoute } from '@tanstack/react-router'
import { KickstarterPage } from '@/components/design/kickstarter/page'
import { kickstarter } from '@/content/design/kickstarter'

export const Route = createFileRoute('/programs/kickstarter')({
  head: () => ({
    meta: [{ title: kickstarter.meta.title }, { name: 'description', content: kickstarter.meta.description }],
  }),
  component: KickstarterPage,
})
