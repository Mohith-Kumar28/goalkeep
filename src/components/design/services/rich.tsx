import type { Html } from '@/content/design/service-page'

/** Authored markup from the content modules; never user input. */
export function Rich({ html, as: Tag = 'span', ...rest }: { html: Html; as?: 'span' | 'p' | 'h2' | 'h3' } & React.ComponentProps<'span'>) {
  return <Tag {...(rest as object)} dangerouslySetInnerHTML={{ __html: html }} />
}
