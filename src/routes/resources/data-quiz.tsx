import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { QuizPage } from '@/components/design/quiz/page'
import { quizPage } from '@/content/design/quiz'

export const Route = createFileRoute('/resources/data-quiz')({
  head: () => pageHead({ title: quizPage.meta.title, description: quizPage.meta.description, path: '/resources/data-quiz' }),
  component: QuizPage,
})
