import { HeadContent, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestUrl } from "@tanstack/react-start/server"

import { SiteLink } from "@/components/design/site-link"
import { AnnouncementBanner } from "@/components/layout/announcement-banner"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { site } from "@/content/site"
import appCss from "../styles.css?url"

/**
 * The origin this page is actually being served from.
 *
 * Open Graph images have to be absolute — every scraper requires it — and the
 * absolute URL used to be built from `site.url`, hard-coded to the production
 * domain. While the site is previewed anywhere else, that points the scraper
 * at a host which does not have the card on it: goalkeep.net is still the old
 * WordPress site, so `https://goalkeep.net/og.jpg` returned a 404 and every
 * platform fell back to whatever logo it could scrape instead. The card was
 * never being fetched at all.
 *
 * Resolving the origin per request fixes the preview *and* survives the
 * cut-over to the real domain, which the hard-coded value would not have
 * needed a change for but the workers.dev preview always would.
 *
 * `createIsomorphicFn` keeps the server-only import out of the client bundle.
 * The client branch matters less than it looks — a scraper only ever reads the
 * server-rendered document — but it keeps the two renders identical, which is
 * what stops React complaining about a hydration mismatch in <head>.
 */
const getOrigin = createIsomorphicFn()
  .server(() => {
    try {
      return getRequestUrl().origin
    } catch {
      // Prerender and any other context with no live request.
      return site.url
    }
  })
  .client(() => window.location.origin)

/* Bumped whenever public/og.jpg is redrawn: WhatsApp, LinkedIn and Slack cache
   the preview by URL, so a new query string is what makes them fetch the new
   card. 2 = the 21 Oct hero (23 Oct). */
const OG_VERSION = 2

export const Route = createRootRoute({
  loader: () => ({ origin: getOrigin() }),
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? site.url
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: site.metaTitle },
        { name: "description", content: site.description },
        { property: "og:site_name", content: site.name },
        { property: "og:type", content: "website" },
        { property: "og:url", content: site.url },
        { property: "og:title", content: site.metaTitle },
        { property: "og:description", content: site.description },
        /*
         * Absolute, because every scraper requires it — and absolute against the
         * host actually serving the page, not a hard-coded one. See getOrigin
         * above. Regenerate the card itself with `pnpm og`.
         */
        { property: "og:image", content: `${origin}/og.jpg?v=${OG_VERSION}` },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:image:alt",
          content:
            "Goalkeep — Enabling social sector organisations to use data to scale impact. Alongside a case card for Apni Shala Foundation.",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: site.metaTitle },
        { name: "twitter:description", content: site.description },
        {
          "script:ld+json": {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            logo: `${site.url}/goalkeep-icon.png`,
            description: site.description,
          },
        },
        { name: "twitter:image", content: `${origin}/og.jpg?v=${OG_VERSION}` },
        { name: "theme-color", content: "#2F4A92" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/goalkeep-icon.png", type: "image/png" },
        { rel: "apple-touch-icon", href: "/goalkeep-icon.png" },
      ],
    }
  },
  notFoundComponent: () => (
    <div className="shell band flex flex-col gap-5">
      <p className="eyebrow">404</p>
      <h1 className="h2 text-[var(--fg-1)]">That page isn&apos;t here.</h1>
      <p className="lead max-w-[52ch] text-[var(--fg-2)]">
        The link may be old, or we may have moved it. The honest answer is we
        don&apos;t know which.
      </p>
      <SiteLink href="/" className="dc-btn dc-btn-primary self-start">
        Go to the homepage
      </SiteLink>
    </div>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const inAdmin = useRouterState({ select: (state) => state.location.pathname.startsWith("/admin") })
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-[var(--r-sm)] focus:bg-white focus:px-4 focus:py-2 focus:font-bold"
        >
          Skip to content
        </a>
        {!inAdmin && <AnnouncementBanner />}
        {!inAdmin && <SiteHeader />}
        <main id="main">{children}</main>
        {!inAdmin && <SiteFooter />}
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "Tanstack Router",
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
