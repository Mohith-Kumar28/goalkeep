import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { PageView } from '@/components/pages/page-blocks'
import { programsPage } from '@/content/programs'

export const Route = createFileRoute('/programs/')({
  head: () => pageHead({ title: programsPage.title, description: programsPage.description, path: '/programs' }),
  component: () => <PageView page={programsPage} />,
})
