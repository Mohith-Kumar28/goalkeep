import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About us — Goalkeep' },
      { name: 'description', content: 'Who we are, how we work, and the team behind Goalkeep. Practitioners, not vendors.' },
    ],
  }),
  component: () => <PageStub eyebrow="About us" heading={<>Practitioners, not vendors.</>} />,
})
