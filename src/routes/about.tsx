import { createFileRoute } from "@tanstack/react-router"
import { pageHead } from '@/lib/seo'
import { AboutPage } from "@/components/design/about/page"

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title: 'About us | Goalkeep', description: 'Who we are, how we work, and the team behind Goalkeep. Practitioners, not vendors.', path: '/about' }),
  component: AboutPage,
})
