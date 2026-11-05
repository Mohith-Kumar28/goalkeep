import { Link, useRouterState } from '@tanstack/react-router'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GkButton } from '@/components/primitives/gk-button'
import { contactHref, nav } from '@/content/site'
import type { NavItem } from '@/content/site'
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
 *
 * Only the homepage has a navy hero under the header. Every other page opens
 * on cream, so there the header starts in its solid state - transparent with
 * the white wordmark, it was white on white until the first scroll (23 Sep
 * doc, on the Partner with us page).
 *
 * 21 Oct: the section links are plain anchors into the homepage, and
 * "Partner with us" goes to the contact form. November: Services and Programs
 * open menus of their pages, and below 1280px the whole nav moves into the
 * menu button, since seven items no longer fit beside the wordmark.
 */
export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [pastThreshold, setScrolled] = useState(false)
  const scrolled = pastThreshold || pathname !== '/'
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
          /* A hairline and a soft drop, not the 2px near-black rule this
             carried. "I don't like the black, man" applied to the chrome as
             much as to the cards. */
          ? 'border-b border-[var(--hairline)] bg-[var(--gk-cream)] shadow-[var(--shadow-xs)]'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Link to="/" aria-label="Goalkeep, home" className="shrink-0">
          <Wordmark inverse={!scrolled} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 xl:flex 2xl:gap-8">
          {nav.map((item) =>
            item.children ? (
              <NavMenu key={item.label} item={item} scrolled={scrolled} pathname={pathname} />
            ) : (
              <a key={item.to} href={item.to} className={linkClass(scrolled)}>
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden xl:block">
          <GkButton
            href={contactHref}
            variant={scrolled ? 'primary' : 'secondary'}
            className="!px-5 !py-3 !text-[length:var(--fs-sm)] whitespace-nowrap"
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
            'grid size-11 place-items-center xl:hidden',
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
          className="fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto bg-[var(--gk-cream)] xl:hidden"
        >
          <nav aria-label="Main" className="shell flex flex-col py-6">
            {nav.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-[var(--hairline)] py-5">
                  <p className="text-[length:var(--fs-xl)] font-bold text-[var(--gk-ink)]">{item.label}</p>
                  <ul className="mt-3 flex flex-col">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <a
                          href={child.to}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2 pl-4 text-[length:var(--fs-base)] font-semibold text-[var(--gk-ink)]"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-[var(--hairline)] py-5 text-[length:var(--fs-xl)] font-bold text-[var(--gk-ink)]"
                >
                  {item.label}
                </a>
              ),
            )}
            <div className="pt-6">
              <GkButton
                href={contactHref}
                variant="secondary"
                className="w-full"
                onClick={() => setMenuOpen(false)}
              >
                Partner with us
              </GkButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

const linkClass = (scrolled: boolean) =>
  cn(
    'relative py-1 font-display text-[length:var(--fs-sm)] font-bold whitespace-nowrap xl:text-[length:var(--fs-base)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]',
    // The underline grows from the left on hover. It is the one piece of
    // chrome motion on the page.
    'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:origin-left after:scale-x-0',
    'after:bg-[var(--gk-yellow)] after:transition-transform after:duration-[var(--dur-base)] after:ease-[var(--ease-out)]',
    'hover:after:scale-x-100 focus-visible:after:scale-x-100',
    scrolled ? 'text-[var(--gk-ink)]' : 'text-white',
  )

/**
 * A nav item with a menu of pages. Opens on hover for a pointer and on
 * click or Enter for everyone else; Escape, a click outside, or choosing a
 * page closes it.
 */
function NavMenu({ item, scrolled, pathname }: { item: NavItem; scrolled: boolean; pathname: string }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  /* Hover has already opened the menu by the time a mouse clicks, so a
     mouse click keeps it open instead of toggling it shut. */
  const mouseDown = useRef(false)
  const id = `nav-menu-${item.label.toLowerCase()}`

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(event) => event.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onPointerDown={(event) => (mouseDown.current = event.pointerType === 'mouse')}
        onClick={() => {
          const keepOpen = mouseDown.current
          mouseDown.current = false
          setOpen((v) => keepOpen || !v)
        }}
        className={cn(linkClass(scrolled), 'inline-flex items-center gap-1')}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={2.25}
          className={cn('size-4 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]', open && 'rotate-180')}
        />
      </button>
      {/* The pt bridges the gap to the button so the pointer can cross it. */}
      <div id={id} hidden={!open} className="absolute top-full -left-4 z-50 pt-3">
        <ul className="w-80 rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-2 shadow-[var(--shadow-md)]">
          {item.children?.map((child, i, all) => {
            const overview = i === all.length - 1
            const current = child.to === pathname
            return (
              <li key={child.to} className={cn(overview && 'mt-1 border-t border-[var(--hairline)] pt-1')}>
                <a
                  href={child.to}
                  onClick={() => setOpen(false)}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-2 rounded-[var(--r-md)] px-4 py-2.5 text-[length:var(--fs-sm)] text-[var(--gk-ink)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] hover:bg-[var(--gk-cream-deep)] focus-visible:bg-[var(--gk-cream-deep)] focus-visible:outline-none',
                    overview ? 'text-[var(--gk-navy)]' : 'font-semibold',
                    current && 'bg-[var(--gk-cream-deep)]',
                  )}
                >
                  {current && <span aria-hidden="true" className="absolute inset-y-2 left-1 w-[3px] rounded-full bg-[var(--gk-yellow)]" />}
                  {child.label}
                  {overview && <ArrowRight aria-hidden="true" className="size-4" />}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
