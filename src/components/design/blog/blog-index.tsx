import { SiteLink } from '@/components/design'
import { articleList } from '@/content/design/blog'
import '@/styles/design-blog.css'
import { Reveal } from '@/components/primitives/reveal'
import '@/styles/design-case-studies.css'
import { Tag } from './tag'

export function BlogIndex() {
  return (
    <div className="dc">
      <section className="dc-band dc-blog-index">
        <div className="dc-shell dc-blog-narrow">
          <p className="dc-eyebrow">Blog</p>
          <h1 className="dc-h2">Notes on making data useful</h1>
          <div className="dc-blog-index-list dc-swipe">
            {articleList.map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.07}>
              <SiteLink href={`/resources/blog/${article.slug}`} className="dc-blog-card dc-blog-card-link dc-blog-index-card">
                <div className="dc-blog-card-img">
                  <img src={article.hero.src} alt={article.hero.alt} />
                </div>
                <span className="dc-blog-card-meta">
                  <Tag tone={article.category.tone}>{article.category.label}</Tag>
                  <span className="dc-blog-card-time">{article.readTime}</span>
                </span>
                <span className="dc-blog-card-title">{article.title}</span>
                <span className="dc-blog-card-desc">{article.standfirst}</span>
              </SiteLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
