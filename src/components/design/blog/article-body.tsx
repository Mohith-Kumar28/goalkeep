import { Rich } from '@/components/design/kickstarter/rich'
import { tones } from '@/components/design/tones'
import type { Article, ArticleBlock } from '@/content/design/blog'
import { Diagram } from './diagram'

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p>
          <Rich html={block.html} />
        </p>
      )
    case 'heading':
      return <h2>{block.text}</h2>
    case 'definitions':
      return (
        <div className="dc-blog-defs">
          {block.items.map((item) => (
            <div key={item.label} className="dc-blog-def" style={{ background: tones[item.tone].bg }}>
              <span className="dc-blog-def-label" style={{ color: tones[item.tone].ink }}>
                {item.label}
              </span>
              <span className="dc-blog-def-text">{item.text}</span>
            </div>
          ))}
        </div>
      )
    case 'diagram':
      return <Diagram id={block.id} />
    case 'quote':
      return <blockquote className="dc-blog-pq">{block.text}</blockquote>
    case 'placeholder':
      return (
        <div className="dc-blog-placeholder">
          <span className="dc-blog-placeholder-label">{block.label}</span>
          {block.text}
        </div>
      )
    case 'callout':
      return <p className="dc-blog-callout">{block.text}</p>
    case 'reading':
      return (
        <div className="dc-blog-reading">
          <span className="dc-blog-reading-label">{block.label}</span>
          <ul className="dc-blog-dots">
            {block.items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.title}</a> {item.source}
              </li>
            ))}
          </ul>
        </div>
      )
  }
}

export function ArticleBody({ article }: { article: Article }) {
  const { author } = article
  return (
    <div className="dc-blog-body-wrap">
      <article className="dc-blog-art">
        {article.body.map((block, index) => (
          <Block key={index} block={block} />
        ))}
        <div className="dc-blog-bio">
          <img src={author.photo} alt="" />
          <span>
            <span className="dc-blog-bio-name">{author.name}</span>
            <span className="dc-blog-bio-text">{author.bio}</span>
          </span>
        </div>
      </article>
    </div>
  )
}
