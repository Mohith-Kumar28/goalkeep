import { pageMeta } from '@/content/page-meta'
import { site } from '@/content/site'

const MAX_DESCRIPTION = 160

const clip = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  const cut = flat.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

/**
 * Title, description, canonical URL and the Open Graph and Twitter tags that
 * must follow them. The canonical and og:url name the production domain, not
 * the host serving the request; og:image stays per-request, in the root.
 */
export const pageHead = (fallback: { title: string; description: string; path: string; socialTitle?: string }) => {
  const page = { ...fallback, ...pageMeta[fallback.path] }
  const description = clip(page.description, MAX_DESCRIPTION)
  const url = `${site.url}${page.path === '/' ? '' : page.path}`
  return {
    meta: [
      { title: page.title },
      { name: 'description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:title', content: page.socialTitle ?? page.title },
      { property: 'og:description', content: description },
      { name: 'twitter:title', content: page.socialTitle ?? page.title },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
