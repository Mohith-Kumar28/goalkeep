import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/careers')({
  head: () => pageHead({ title: 'Careers | Goalkeep', description: 'Open roles at Goalkeep, a data consultancy for the social sector.', path: '/careers' }),
  component: () => <PageStub eyebrow="Careers" heading={<>Come do the work with us.</>} />,
})
