import { SiteLink } from '@/components/design'
import { ChevronSideIcon } from '@/components/design/icons'
import type { Article } from '@/content/design/blog'
import '@/styles/design-blog.css'
import { ArticleBody } from './article-body'
import { NewsletterBand } from './newsletter-band'
import { RelatedPosts } from './related-posts'
import { Tag } from './tag'

export function ArticlePage({ article }: { article: Article }) {
  const { author, hero } = article
  return (
    <div className="dc">
      <div className="dc-blog-head">
        <div className="dc-shell dc-blog-narrow">
          <p className="dc-blog-crumb">
            <SiteLink href="/resources/blog">Blog</SiteLink>
            <span className="dc-blog-crumb-sep"><ChevronSideIcon direction="right" size={14} /></span>
            <span>{article.category.label}</span>
          </p>
          <div className="dc-blog-intro">
            <Tag tone={article.category.tone}>{article.category.label}</Tag>
            <h1 className="dc-blog-h1">{article.title}</h1>
            <p className="dc-blog-standfirst">{article.standfirst}</p>
            <div className="dc-blog-byline">
              <span className="dc-blog-author">
                <img src={author.photo} alt="" />
                <span>
                  <span className="dc-blog-author-name">{author.name}</span>
                  <span className="dc-blog-author-role">{author.role}</span>
                </span>
              </span>
              <span className="dc-blog-status">{article.status} · {article.readTime}</span>
            </div>
          </div>
          <figure className="dc-blog-hero">
            <img src={hero.src} alt={hero.alt} style={{ objectPosition: hero.objectPosition }} />
            <figcaption>{hero.caption}</figcaption>
          </figure>
        </div>
      </div>
      <ArticleBody article={article} />
      <RelatedPosts posts={article.related} />
      <NewsletterBand />
    </div>
  )
}
