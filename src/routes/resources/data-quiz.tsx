import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/resources/data-quiz')({
  head: () => ({
    meta: [
      { title: 'Data culture quiz — Goalkeep' },
      { name: 'description', content: 'A short, honest assessment of how your organization actually uses data.' },
    ],
  }),
  component: () => <PageStub eyebrow="Data culture quiz" heading={<>How does your team actually use data?</>} />,
})
