import { createFileRoute } from '@tanstack/react-router'
import { PageStub } from '@/components/layout/page-stub'

export const Route = createFileRoute('/programs/data-literacy')({
  head: () => ({
    meta: [
      { title: 'Data literacy program — Goalkeep' },
      { name: 'description', content: 'Hands-on training that helps teams at every level use the data they already collect.' },
    ],
  }),
  component: () => <PageStub eyebrow="Data literacy program" heading={<>Data skills for people who don&rsquo;t call themselves data people.</>} />,
})
