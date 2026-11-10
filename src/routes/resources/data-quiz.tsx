import { createFileRoute } from '@tanstack/react-router'
import { QuizPage } from '@/components/design/quiz/page'
import { quizPage } from '@/content/design/quiz'

export const Route = createFileRoute('/resources/data-quiz')({
  head: () => ({
    meta: [{ title: quizPage.meta.title }, { name: 'description', content: quizPage.meta.description }],
  }),
  component: QuizPage,
})
