import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { LiteracyPage } from '@/components/design/literacy/literacy-page'
import { literacyContent } from '@/content/design/literacy'

export const Route = createFileRoute('/programs/data-literacy')({
  head: () => pageHead({ title: literacyContent.meta.title, description: literacyContent.meta.description, path: '/programs/data-literacy' }),
  component: LiteracyPage,
})
