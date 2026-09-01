import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { Audience, AudienceId } from '@/content/types'
import { GkButton } from './gk-button'
import { cn } from '@/lib/utils'

/**
 * "Whom we do it for."
 *
 * Desktop is a rail-plus-panel with a proper tablist (roving tabindex, arrow
 * keys, Home/End). Mobile is a disclosure list — not tabs, and not pills,
 * since pills are reserved for tags.
 *
 * The selection writes to the URL hash so a program officer can send a
 * colleague the exact paragraph that describes them.
 */
export function AudienceSelector({ audiences }: { audiences: Array<Audience> }) {
  const [active, setActive] = useState<AudienceId>(audiences[0].id)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const baseId = useId()

  // Deep link in, on mount only — we don't want to fight the user's scroll.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (audiences.some((a) => a.id === hash)) {
      setActive(hash as AudienceId)
    }
  }, [audiences])

  const select = (id: AudienceId) => {
    setActive(id)
    window.history.replaceState(null, '', `#${id}`)
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = audiences.length - 1
    let next: number | null = null

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
      next = index === last ? 0 : index + 1
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
      next = index === 0 ? last : index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last

    if (next !== null) {
      event.preventDefault()
      select(audiences[next].id)
      tabRefs.current[next]?.focus()
    }
  }

  return (
    <>
      {/* ---------- Desktop: rail + panel ---------- */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-6">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Who we work with"
          className="md:col-span-4 lg:col-span-3"
        >
          {audiences.map((audience, index) => {
            const selected = audience.id === active
            return (
              <button
                key={audience.id}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                id={`${baseId}-tab-${audience.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${audience.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(audience.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={cn(
                  'relative flex w-full items-start gap-3 py-5 pl-5 pr-4 text-left',
                  'transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
                  selected
                    ? 'text-[length:var(--fs-xl)] font-bold text-[var(--fg-1)]'
                    : 'text-[length:var(--fs-lg)] text-[var(--fg-2)] hover:text-[var(--fg-1)]',
                )}
              >
                {/* 2px coral marker + the single coloured dot. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-0 top-0 h-full w-[2px] origin-top',
                    'transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)]',
                    selected ? 'scale-y-100' : 'scale-y-0',
                  )}
                  style={{ backgroundColor: 'var(--band-accent)' }}
                />
                {selected && (
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] size-[10px] shrink-0 rounded-full"
                    style={{ backgroundColor: 'var(--band-accent)' }}
                  />
                )}
                <span className={cn(!selected && 'pl-[22px]')}>
                  {audience.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* min-height is locked by the grid so switching never jumps. */}
        <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
          {audiences.map((audience) => (
            <div
              key={audience.id}
              role="tabpanel"
              id={`${baseId}-panel-${audience.id}`}
              aria-labelledby={`${baseId}-tab-${audience.id}`}
              hidden={audience.id !== active}
            >
              <AudiencePanel audience={audience} />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Mobile: disclosure list ---------- */}
      <div className="md:hidden">
        {audiences.map((audience) => {
          const open = audience.id === active
          return (
            <div key={audience.id} className="border-t border-[var(--hairline)]">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${baseId}-m-${audience.id}`}
                onClick={() => select(audience.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="flex items-center gap-3">
                  {open && (
                    <span
                      aria-hidden="true"
                      className="size-[10px] shrink-0 rounded-full"
                      style={{ backgroundColor: 'var(--band-accent)' }}
                    />
                  )}
                  <span className="text-[length:var(--fs-lg)] font-bold text-[var(--fg-1)]">
                    {audience.label}
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  strokeWidth={1.75}
                  className={cn(
                    'size-5 shrink-0 text-[var(--fg-2)] transition-transform',
                    'duration-[var(--dur-base)] ease-[var(--ease-out)]',
                    open && 'rotate-180',
                  )}
                />
              </button>
              <div id={`${baseId}-m-${audience.id}`} hidden={!open} className="pb-8">
                <AudiencePanel audience={audience} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function AudiencePanel({ audience }: { audience: Audience }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-5 sm:items-center">
        <img
          src={audience.image}
          alt={audience.imageAlt}
          loading="lazy"
          decoding="async"
          width={480}
          height={480}
          className="aspect-square w-full rounded-[var(--r-md)] object-cover sm:col-span-2"
        />
        <p className="lead text-[var(--fg-1)] sm:col-span-3">
          {audience.relatability}
        </p>
      </div>

      {/* Charcoal on coral tint — AAA. Never coral text on coral tint. */}
      <figure
        className="rounded-[var(--r-md)] p-6 md:p-8"
        style={{ backgroundColor: 'var(--band-accent-tint)' }}
      >
        <blockquote className="pull-quote max-w-[38ch] text-[var(--gk-charcoal)]">
          “{audience.quote.value.text}”
        </blockquote>
        <figcaption
          className="mt-4 text-[length:var(--fs-sm)] text-[var(--fg-2)]"
          data-mono
        >
          — {audience.quote.value.attribution}
        </figcaption>
      </figure>

      <div className="flex flex-col gap-2">
        <p
          className="text-[length:var(--fs-xs)] font-extrabold uppercase tracking-[var(--tracking-eyebrow)] text-[var(--fg-2)]"
          data-mono
        >
          The common problem
        </p>
        <p className="max-w-[64ch] text-[var(--fg-1)]">{audience.problem}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <GkButton to={audience.primaryCta.to} variant="secondary">
          {audience.primaryCta.label}
        </GkButton>
        <GkButton to={audience.secondaryCta.to} variant="tertiary" withArrow>
          {audience.secondaryCta.label}
        </GkButton>
      </div>
    </div>
  )
}
