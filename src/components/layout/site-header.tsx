import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GkButton } from '@/components/primitives/gk-button'
import { nav } from '@/content/site'
import { cn } from '@/lib/utils'
import { Wordmark } from './wordmark'

/**
 * The header carries NO accent colour, ever.
 *
 * That's deliberate: sticky chrome sits over every band in turn, so a blue
 * CTA up here would inject a second hue into the coral and teal bands and
 * break the Single-Accent Viewport Rule. The CTA is a charcoal outline
 * instead — which is honest anyway, since it's "talk to us", not "buy".
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 64)
      const max = document.body.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
        scrolled
          ? 'bg-[var(--bg-2)] border-b border-[var(--hairline)]'
          : 'bg-transparent border-b border-transparent',
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Link to="/" aria-label="Goalkeep, home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'text-[var(--fg-1)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                'hover:text-[var(--n-900)]',
              )}
              activeProps={{ className: 'font-bold' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <GkButton to="/contact" variant="secondary">
            Partner with us
          </GkButton>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="grid size-11 place-items-center text-[var(--fg-1)] lg:hidden"
        >
          {menuOpen ? (
            <X aria-hidden="true" strokeWidth={1.75} className="size-6" />
          ) : (
            <Menu aria-hidden="true" strokeWidth={1.75} className="size-6" />
          )}
        </button>
      </div>

      {/* Scroll progress. A single hairline reads as progress; the earlier
          five-segment version read as a broken underline under the wordmark. */}
      <div aria-hidden="true" className="h-[2px] w-full bg-transparent">
        <div
          className="h-full origin-left transition-transform duration-[var(--dur-fast)] ease-out"
          style={{
            backgroundColor: 'var(--gk-blue)',
            transform: `scaleX(${progress})`,
          }}
        />
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto bg-[var(--bg-2)] lg:hidden"
        >
          <nav aria-label="Main" className="shell flex flex-col py-6">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="border-b border-[var(--hairline)] py-5 text-[length:var(--fs-xl)] font-bold text-[var(--fg-1)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-6">
              <GkButton to="/contact" variant="secondary" className="w-full">
                Partner with us
              </GkButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
