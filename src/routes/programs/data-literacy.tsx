import { createFileRoute } from '@tanstack/react-router'
import { PageView } from '@/components/pages/page-blocks'
import { dataLiteracyPage } from '@/content/programs'

export const Route = createFileRoute('/programs/data-literacy')({
  head: () => ({
    meta: [{ title: dataLiteracyPage.title }, { name: 'description', content: dataLiteracyPage.description }],
  }),
  component: () => <PageView page={dataLiteracyPage} />,
})
