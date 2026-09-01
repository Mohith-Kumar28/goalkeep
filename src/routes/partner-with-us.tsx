import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/partner-with-us')({
  head: () => ({
    meta: [
      { title: 'Partner with us — Goalkeep' },
      { name: 'description', content: 'For philanthropies and funders: portfolio-level reporting that grantees can actually produce.' },
    ],
  }),
  component: () => <PageStub eyebrow="Partner with us" heading={<>Ask your grantees for data they already collect.</>} />,
})
