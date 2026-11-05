import { createFileRoute } from '@tanstack/react-router'
import { PageView } from '@/components/pages/page-blocks'
import { kickstarterPage } from '@/content/programs'

export const Route = createFileRoute('/programs/kickstarter')({
  head: () => ({
    meta: [{ title: kickstarterPage.title }, { name: 'description', content: kickstarterPage.description }],
  }),
  component: () => <PageView page={kickstarterPage} />,
})
