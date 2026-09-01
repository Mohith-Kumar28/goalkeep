import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/programs/kickstarter')({
  head: () => ({
    meta: [
      { title: 'Kickstarter program — Goalkeep' },
      { name: 'description', content: 'Fixed-scope, fixed-price data foundations for early-stage NGOs.' },
    ],
  }),
  component: () => <PageStub eyebrow="Kickstarter program" heading={<>Data foundations for early-stage NGOs.</>} />,
})
