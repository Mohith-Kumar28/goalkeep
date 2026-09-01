import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/what-we-do')({
  head: () => ({
    meta: [
      { title: 'What we do — Goalkeep' },
      { name: 'description', content: 'Design, build, adopt. How we scope data work for NGOs, foundations and impact organizations.' },
    ],
  }),
  component: () => <PageStub eyebrow="What we do" heading={<>Design, build, adopt.</>} />,
})
