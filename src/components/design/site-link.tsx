import { useNavigate } from '@tanstack/react-router'
import type { ComponentProps, MouseEvent } from 'react'

/* Hrefs here come from content data, not route literals, so the router's
   typed `to` cannot check them. A path with a hash stays a plain anchor,
   which is what the old header did for the homepage sections. */
const isRoutePath = (href: string) => href.startsWith('/') && !href.startsWith('//') && !href.includes('#')

export function SiteLink({ href, onClick, ...rest }: ComponentProps<'a'> & { href: string }) {
  const navigate = useNavigate()
  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
    if (event.defaultPrevented || modified || rest.target || !isRoutePath(href)) return
    event.preventDefault()
    void navigate({ to: href as never })
  }
  return <a href={href} onClick={handle} {...rest} />
}
