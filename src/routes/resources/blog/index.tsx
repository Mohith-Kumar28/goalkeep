import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/resources/blog/')({
  head: () => ({
    meta: [
      { title: 'Field notes — Goalkeep' },
      { name: 'description', content: 'Short pieces from projects in progress. No thought leadership.' },
    ],
  }),
  component: () => <PageStub eyebrow="Field notes" heading={<>What we&rsquo;re learning, written down.</>} />,
})
