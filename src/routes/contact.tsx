import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Contact — Goalkeep' },
      { name: 'description', content: 'Tell us the decision you are stuck on. We will tell you if data is even the problem.' },
    ],
  }),
  component: () => <PageStub eyebrow="Contact" heading={<>Tell us the decision you&rsquo;re stuck on.</>} />,
})
