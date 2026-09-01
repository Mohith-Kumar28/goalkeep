import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/careers')({
  head: () => ({
    meta: [
      { title: 'Careers — Goalkeep' },
      { name: 'description', content: 'Open roles at Goalkeep, a data consultancy for the social sector.' },
    ],
  }),
  component: () => <PageStub eyebrow="Careers" heading={<>Come do the work with us.</>} />,
})
