import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { NewsletterPage } from '@/components/design/newsletter/page'
import { newsletter } from '@/content/design/newsletter'

export const Route = createFileRoute('/resources/newsletter')({
  head: () => pageHead({ title: newsletter.meta.title, description: newsletter.meta.description, path: '/resources/newsletter' }),
  component: NewsletterPage,
})
