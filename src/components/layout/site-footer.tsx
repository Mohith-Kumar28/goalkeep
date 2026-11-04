import { Link } from '@tanstack/react-router'
import { site } from '@/content/site'
import { Wordmark } from './wordmark'

/**
 * One thin line: the wordmark and tagline, then the copyright.
 *
 * 21 Oct: "the footer can just be… this thing that's there on the left… on
 * one thin line" while the homepage is the only page live. The three link
 * columns (`footerGroups` in site.ts) come back when the other pages do.
 *
 * The closing band and the contact form sit above, so the footer stays cream
 * and quiet - the receipt underneath the ending, not part of it.
 */
export function SiteFooter() {
  return (
    <footer className="ground-cream-deep border-t border-[var(--hairline)]">
      <div className="shell flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <Link to="/" aria-label="Goalkeep, home" className="shrink-0 self-start md:self-auto">
            <Wordmark />
          </Link>
          <p className="text-[length:var(--fs-sm)] text-[var(--fg-2)]">{site.tagline}</p>
        </div>
        <p className="shrink-0 text-[length:var(--fs-sm)] text-[var(--fg-2)]">
          © {new Date().getFullYear()} Goalkeep
        </p>
      </div>
    </footer>
  )
}
