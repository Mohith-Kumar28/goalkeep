import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/resources/newsletter')({
  head: () => ({
    meta: [
      { title: 'Newsletter — Goalkeep' },
      { name: 'description', content: 'Occasional notes on data work in the social sector. No spam, no growth hacking.' },
    ],
  }),
  component: () => <PageStub eyebrow="Newsletter" heading={<>Occasional notes, from projects in progress.</>} />,
})
