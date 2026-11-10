import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/contact')({
  head: () => pageHead({ title: 'Contact | Goalkeep', description: 'Tell us the decision you are stuck on. We will tell you if data is even the problem.', path: '/contact' }),
  component: () => <PageStub eyebrow="Contact" heading={<>Tell us the decision you&rsquo;re stuck on.</>} />,
})
