import { createFileRoute } from '@tanstack/react-router'
import { LiteracyPage } from '@/components/design/literacy/literacy-page'
import { literacyContent } from '@/content/design/literacy'

export const Route = createFileRoute('/programs/data-literacy')({
  head: () => ({
    meta: [
      { title: literacyContent.meta.title },
      { name: 'description', content: literacyContent.meta.description },
    ],
  }),
  component: LiteracyPage,
})
