import { createFileRoute, notFound } from '@tanstack/react-router'
import { CaseStudyPage } from '@/components/design/case-studies/study-page'
import { getCaseStudy } from '@/content/design/case-studies'

export const Route = createFileRoute('/case-studies/$slug')({
  loader: ({ params }) => {
    const study = getCaseStudy(params.slug)
    if (!study) throw notFound()
    return study
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.org} case study | Goalkeep` }, { name: 'description', content: loaderData.intro }]
      : [],
  }),
  component: StudyRoute,
})

function StudyRoute() {
  const study = Route.useLoaderData()
  return <CaseStudyPage key={study.slug} study={study} />
}
