import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArticlePage } from '@/components/design/blog/article-page'
import { articles } from '@/content/design/blog'

export const Route = createFileRoute('/resources/blog/$slug')({
  loader: ({ params }) => {
    if (!Object.hasOwn(articles, params.slug)) throw notFound()
    return articles[params.slug]
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: loaderData.meta.title }, { name: 'description', content: loaderData.meta.description }]
      : [],
  }),
  component: ArticleRoute,
})

function ArticleRoute() {
  const article = Route.useLoaderData()
  return <ArticlePage key={article.slug} article={article} />
}
