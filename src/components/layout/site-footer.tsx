import { Link } from '@tanstack/react-router'
import { footerGroups, site } from '@/content/site'
import { Wordmark } from './wordmark'

/** A coloured dot per column — the donut's atom, keeping the last band alive
 *  without competing with the closing above it. */
const FOOTER_HUES = ['var(--gk-blue)', 'var(--gk-teal)', 'var(--gk-coral)']

/**
 * The closing band above is the page's only dark surface, which is what makes
 * it land as an ending — so the footer stays light.
 */
export function SiteFooter() {
  return (
    <footer className="bg-[var(--bg-3)]">
      <div className="shell band">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="flex flex-col gap-4 md:col-span-4">
            <Link to="/" aria-label="Goalkeep, home">
              <Wordmark />
            </Link>
            <p className="max-w-[34ch] text-[length:var(--fs-sm)] text-[var(--fg-2)]">
              {site.tagline}
            </p>
          </div>

          {footerGroups.map((group, i) => (
            <nav
              key={group.heading}
              aria-label={group.heading}
              className="flex flex-col gap-3 md:col-span-2"
            >
              <h2 className="flex items-center gap-2 text-[length:var(--fs-sm)] font-extrabold text-[var(--fg-1)]">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: FOOTER_HUES[i % FOOTER_HUES.length] }}
                />
                {group.heading}
              </h2>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[length:var(--fs-sm)] text-[var(--fg-2)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:text-[var(--fg-1)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--hairline)] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[length:var(--fs-sm)] text-[var(--fg-2)]" data-mono>
            Goalkeep — data consultancy for the social sector. Mumbai, India.
          </p>
          <p className="text-[length:var(--fs-sm)] text-[var(--fg-2)]" data-mono>
            © {new Date().getFullYear()} Goalkeep
          </p>
        </div>
      </div>
    </footer>
  )
}
