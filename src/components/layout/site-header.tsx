import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ChevronIcon, CloseIcon, MenuIcon } from '@/components/design/icons'
import { SiteLink } from '@/components/design/site-link'
import { contactHref, isLandingPage, nav, navChildFor } from '@/content/site'
import type { NavItem } from '@/content/site'

/**
 * The header of the 6 Nov design, on every page. Its colour is the page's
 * theme: the menu entry for the current page (site.ts) names it, and
 * design.css turns that into the background. A page with no entry is navy.
 */
export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const current = navChildFor(pathname)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: globalThis.KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  if (isLandingPage(pathname)) {
    return (
      <header className="dc-header" data-theme="navy">
        <div className="dc-shell dc-header-bar">
          <SiteLink href="/" aria-label="Goalkeep home" className="dc-logo">
            <img className="dc-logo-white" src="/wordmark-white.webp" alt="Goalkeep" width={673} height={160} />
          </SiteLink>
        </div>
      </header>
    )
  }

  return (
    <header className="dc-header" data-theme={current?.theme ?? 'navy'}>
      <div className="dc-shell dc-header-bar">
        <SiteLink href="/" aria-label="Goalkeep home" className="dc-logo">
          <img className="dc-logo-white" src="/wordmark-white.webp" alt="Goalkeep" width={673} height={160} />
          <img className="dc-logo-ink" src="/wordmark-ink.webp" alt="Goalkeep" width={673} height={160} />
        </SiteLink>

        <nav aria-label="Main" className="dc-navlinks">
          {nav.map((item) =>
            item.children ? (
              <NavMenu key={item.label} item={item} activeTo={current?.to} pathname={pathname} />
            ) : (
              <SiteLink
                key={item.label}
                href={item.to}
                className={isUnder(pathname, item.to) ? 'dc-nav-link is-active' : 'dc-nav-link'}
                aria-current={isUnder(pathname, item.to) ? 'page' : undefined}
              >
                {item.label}
              </SiteLink>
            ),
          )}
        </nav>

        <PartnerLink className="dc-btn dc-partner" />

        <button
          type="button"
          className="dc-menu-btn"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon size={24} /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="dc-mobile-nav">
          <nav aria-label="Main" className="dc-shell">
            {nav.map((item) =>
              item.children ? (
                <div key={item.label} className="dc-mobile-group">
                  <p>{item.label}</p>
                  {item.children.map((child) => (
                    <SiteLink
                      key={child.to}
                      href={child.to}
                      className="dc-mobile-sub"
                      aria-current={child.to === current?.to ? 'page' : undefined}
                      style={child.to === current?.to ? { background: child.tint } : undefined}
                    >
                      <span className="dc-dd-t">{child.label}</span>
                      <span className="dc-dd-d">{child.description}</span>
                    </SiteLink>
                  ))}
                </div>
              ) : (
                <SiteLink key={item.label} href={item.to} className="dc-mobile-link">
                  {item.label}
                </SiteLink>
              ),
            )}
            <div style={{ paddingTop: 20 }}>
              <PartnerLink className="dc-btn dc-btn-primary" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

function isUnder(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`)
}

/** The contact band of the page you are on if it has one, else the homepage's. */
function PartnerLink({ className }: { className: string }) {
  return (
    <a
      href={contactHref}
      className={className}
      onClick={(event) => {
        const local = document.getElementById('contact')
        if (!local) return
        event.preventDefault()
        local.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
        history.replaceState(null, '', '#contact')
      }}
    >
      Partner with us
    </a>
  )
}

/**
 * A nav item with a menu. Opens on mouse hover; a tap, click, Enter or Space
 * toggles it for touch and keyboard. Escape, a click outside or focus leaving
 * closes it.
 */
function NavMenu({ item, activeTo, pathname }: { item: NavItem; activeTo?: string; pathname: string }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  /* A mouse hover has already opened the menu by the time it clicks, so that
     click must not toggle it shut. */
  const mouseDown = useRef(false)
  const id = `nav-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`
  const containsCurrent = item.children?.some((child) => isUnder(pathname, child.to)) ?? false

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onTriggerKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown') return
    event.preventDefault()
    setOpen(true)
    requestAnimationFrame(() => root.current?.querySelector<HTMLAnchorElement>('.dc-dd a')?.focus())
  }

  return (
    <div
      ref={root}
      className="dc-nav-item"
      data-open={open}
      onPointerEnter={(event) => event.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && setOpen(false)}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={containsCurrent ? 'dc-nav-link is-active' : 'dc-nav-link'}
        aria-expanded={open}
        aria-controls={id}
        onPointerDown={(event) => (mouseDown.current = event.pointerType === 'mouse')}
        onKeyDown={onTriggerKey}
        onClick={() => {
          const keepOpen = mouseDown.current
          mouseDown.current = false
          setOpen((value) => keepOpen || !value)
        }}
      >
        {item.label}
        <ChevronIcon />
      </button>
      <div id={id} className="dc-dd">
        {item.children?.map((child) => {
          const isCurrent = child.to === activeTo
          return (
            <SiteLink
              key={child.to}
              href={child.to}
              aria-current={isCurrent ? 'page' : undefined}
              style={isCurrent ? { ['--dc-tint' as string]: child.tint } : undefined}
              onClick={() => setOpen(false)}
            >
              <span>
                <span className="dc-dd-t">{child.label}</span>
                <span className="dc-dd-d">{child.description}</span>
              </span>
            </SiteLink>
          )
        })}
      </div>
    </div>
  )
}
