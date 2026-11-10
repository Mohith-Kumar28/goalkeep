import { createFileRoute } from '@tanstack/react-router'
import { CaseStudiesListingPage } from '@/components/design/case-studies/listing-page'

export const Route = createFileRoute('/case-studies/')({
  head: () => ({
    meta: [
      { title: 'Case studies | Goalkeep' },
      {
        name: 'description',
        content:
          'Stories from the nonprofits, funders and ecosystem partners Goalkeep has worked with: where they started, how we approached the work together, and what is different now.',
      },
    ],
  }),
  component: CaseStudiesListingPage,
})
