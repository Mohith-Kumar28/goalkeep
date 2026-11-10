import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { CaseStudiesListingPage } from '@/components/design/case-studies/listing-page'

export const Route = createFileRoute('/case-studies/')({
  head: () => pageHead({ title: 'Case studies | Goalkeep', description: 'Stories from the nonprofits, funders and ecosystem partners Goalkeep has worked with: where they started, how we approached the work together, and what is different now.', path: '/case-studies' }),
  component: CaseStudiesListingPage,
})
