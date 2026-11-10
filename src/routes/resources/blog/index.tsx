import { createFileRoute } from '@tanstack/react-router'
import { BlogIndex } from '@/components/design/blog/blog-index'

export const Route = createFileRoute('/resources/blog/')({
  head: () => ({
    meta: [
      { title: 'Blog | Goalkeep' },
      { name: 'description', content: 'Notes on making data useful for nonprofits.' },
    ],
  }),
  component: BlogIndex,
})
