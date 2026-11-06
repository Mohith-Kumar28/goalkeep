import type { Html } from '@/content/design/service-page'

/** Renders authored markup from the content file; it never carries user input. */
export function Rich({ html }: { html: Html }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
