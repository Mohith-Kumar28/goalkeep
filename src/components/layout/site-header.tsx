import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GkButton } from '@/components/primitives/gk-button'
import { nav } from '@/content/site'
import { cn } from '@/lib/utils'
import { Wordmark } from './wordmark'

/**
 * The header sits over a navy hero and then over cream for the rest of the
 * page, so it swaps its whole palette at the scroll threshold rather than
 * staying neutral. Before the threshold it is transparent with the white
 * wordmark; after it, cream with a hard ink rule and the ink wordmark.
 *
 * The threshold is 64px rather than "past the hero" on purpose: a header that
 * only changes at the very bottom of a full-height hero feels broken while
 * you're scrolling through it.
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
      /* While transparent, this chrome sits on the navy hero. Declaring that
         is what lets the contrast audit resolve the real backdrop instead of
         walking past it to the cream body. */
      data-ground={scrolled ? 'cream' : 'navy'}
      className={cn(
        'sticky top-0 z-40 transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
        scrolled
          ? 'border-b-2 border-[var(--gk-ink)] bg-[var(--gk-cream)]'
          : 'border-b-2 border-transparent bg-transparent',
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Link to="/" aria-label="Goalkeep, home" className="shrink-0">
          <Wordmark inverse={!scrolled} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'relative py-1 font-display font-bold transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                // The underline grows from the left on hover. It is the one
                // piece of chrome motion on the page.
                'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:origin-left after:scale-x-0',
                'after:bg-[var(--gk-yellow)] after:transition-transform after:duration-[var(--dur-base)] after:ease-[var(--ease-out)]',
                'hover:after:scale-x-100 focus-visible:after:scale-x-100',
                scrolled ? 'text-[var(--gk-ink)]' : 'text-white',
              )}
              activeProps={{ className: 'after:scale-x-100' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <GkButton
            to="/contact"
            variant={scrolled ? 'primary' : 'secondary'}
            className="!px-5 !py-3 !text-[length:var(--fs-sm)]"
          >
            Partner with us
          </GkButton>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className={cn(
            'grid size-11 place-items-center lg:hidden',
            scrolled || menuOpen ? 'text-[var(--gk-ink)]' : 'text-white',
          )}
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
            backgroundColor: 'var(--gk-yellow)',
            transform: `scaleX(${progress})`,
          }}
        />
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto bg-[var(--gk-cream)] lg:hidden"
        >
          <nav aria-label="Main" className="shell flex flex-col py-6">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="border-b-2 border-[var(--hairline)] py-5 font-display text-[length:var(--fs-xl)] font-extrabold text-[var(--gk-ink)]"
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
