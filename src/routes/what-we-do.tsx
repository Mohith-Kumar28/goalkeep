import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/what-we-do')({
  head: () => pageHead({ title: 'What we do | Goalkeep', description: 'Design, build, adopt. How we scope data work for NGOs, foundations and impact organizations.', path: '/what-we-do' }),
  component: () => <PageStub eyebrow="What we do" heading={<>Design, build, adopt.</>} />,
})
