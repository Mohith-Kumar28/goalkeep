import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/custom-projects')({
  head: () => ({
    meta: [
      { title: 'Custom projects — Goalkeep' },
      { name: 'description', content: 'Scoped data projects for mid-sized nonprofits: M&E systems, dashboards and the training to use them.' },
    ],
  }),
  component: () => <PageStub eyebrow="Custom projects" heading={<>Built around the decision, not the tool.</>} />,
})
