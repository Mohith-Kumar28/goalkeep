import { ArrowIcon, SiteLink } from '@/components/design'
import type { RelatedPost } from '@/content/design/blog'
import { Tag } from './tag'

function PostCard({ post }: { post: RelatedPost }) {
  const body = (
    <>
      <div className="dc-blog-card-img">
        <img src={post.photo.src} alt={post.photo.alt} />
      </div>
      <span className="dc-blog-card-meta">
        <Tag tone={post.tag.tone}>{post.tag.label}</Tag>
        <span className="dc-blog-card-time">{post.readTime}</span>
      </span>
      <span className="dc-blog-card-title">{post.title}</span>
    </>
  )
  return post.href ? (
    <SiteLink href={post.href} className="dc-blog-card dc-blog-card-link">
      {body}
    </SiteLink>
  ) : (
    <div className="dc-blog-card">{body}</div>
  )
}

export function RelatedPosts({ posts }: { posts: Array<RelatedPost> }) {
  return (
    <section className="dc-band dc-blog-more">
      <div className="dc-shell dc-blog-narrow">
        <div className="dc-blog-more-head">
          <h2 className="dc-h3">Keep reading</h2>
          <SiteLink href="/resources/blog" className="dc-tlink">
            All posts <ArrowIcon />
          </SiteLink>
        </div>
        <div className="dc-blog-grid">
          {posts.map((post) => (
            <PostCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
