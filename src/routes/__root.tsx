import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { site } from '@/content/site'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${site.name} — ${site.tagline}` },
      { name: 'description', content: site.description },
      { property: 'og:site_name', content: site.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: `${site.name} — ${site.tagline}` },
      { property: 'og:description', content: site.description },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'theme-color', content: '#2F4A92' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/goalkeep-icon.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/goalkeep-icon.png' },
    ],
  }),
  notFoundComponent: () => (
    <main className="shell band flex flex-col gap-5">
      <p className="eyebrow">
        404
      </p>
      <h1 className="h2 text-[var(--fg-1)]">
        That page isn&apos;t here.
      </h1>
      <p className="lead max-w-[52ch] text-[var(--fg-2)]">
        The link may be old, or we may have moved it. The honest answer is we
        don&apos;t know which.
      </p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--r-sm)] focus:bg-white focus:px-4 focus:py-2 focus:font-bold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
