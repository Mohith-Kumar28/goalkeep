import { createFileRoute } from '@tanstack/react-router'
import { PageView } from '@/components/pages/page-blocks'
import { programsPage } from '@/content/programs'

export const Route = createFileRoute('/programs/')({
  head: () => ({
    meta: [{ title: programsPage.title }, { name: 'description', content: programsPage.description }],
  }),
  component: () => <PageView page={programsPage} />,
})
