import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/custom-projects')({
  head: () => pageHead({ title: 'Custom projects | Goalkeep', description: 'Scoped data projects for mid-sized nonprofits: M&E systems, dashboards and the training to use them.', path: '/custom-projects' }),
  component: () => <PageStub eyebrow="Custom projects" heading={<>Built around the decision, not the tool.</>} />,
})
