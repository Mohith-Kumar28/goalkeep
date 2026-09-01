import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/case-studies/')({
  head: () => ({
    meta: [
      { title: 'Case studies — Goalkeep' },
      { name: 'description', content: 'What changed, and what took longer than we said it would. Data projects with NGOs and funders.' },
    ],
  }),
  component: () => <PageStub eyebrow="Case studies" heading={<>What changed, and what took longer than we said it would.</>} />,
})
