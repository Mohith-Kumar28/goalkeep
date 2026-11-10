import { createFileRoute } from '@tanstack/react-router'
import { NewsletterPage } from '@/components/design/newsletter/page'
import { newsletter } from '@/content/design/newsletter'

export const Route = createFileRoute('/resources/newsletter')({
  head: () => ({
    meta: [{ title: newsletter.meta.title }, { name: 'description', content: newsletter.meta.description }],
  }),
  component: NewsletterPage,
})
