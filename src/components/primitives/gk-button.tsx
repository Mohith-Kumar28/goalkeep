import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * Goalkeep buttons. Sentence case always.
 *
 * The v0 rule was "hover darkens to a -deep token, nothing ever scales". The
 * homepage feedback asked for the opposite — more depth, more response to the
 * cursor — so the primary is now a sticker: 2px ink outline, hard offset
 * shadow, and it presses *into* the page on click instead of just changing hue.
 *
 * `magnetic` makes the button lean toward the pointer within its own bounds.
 * It's used once per band at most; on everything it would be noise.
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'tertiary'

const base =
  'relative inline-flex items-center justify-center gap-2 ' +
  'font-display font-extrabold leading-none tracking-[-0.01em] ' +
  'text-[length:var(--fs-base)] focus-visible:outline-none group'

const sizing = 'rounded-[var(--r-pill)] px-6 py-4'

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--gk-blue)] text-white border-2 border-[var(--gk-ink)] ' +
    'shadow-[var(--shadow-pop-sm)] hover:bg-[var(--gk-blue-deep)]',
  secondary:
    'bg-[var(--gk-white)] text-[var(--gk-ink)] border-2 border-[var(--gk-ink)] ' +
    'shadow-[var(--shadow-pop-sm)] hover:bg-[var(--gk-yellow)]',
  ghost:
    'border-2 border-[var(--gk-ink)] text-[var(--gk-ink)] bg-transparent ' +
    'hover:bg-[var(--gk-ink)] hover:text-[var(--gk-cream)]',
  tertiary:
    'text-[var(--link-color)] hover:text-[var(--link-color-hover)] px-0 py-1 underline-offset-4 hover:underline',
}

const onDarkVariants: Record<Variant, string> = {
  primary:
    'bg-[var(--gk-yellow)] text-[var(--gk-ink)] border-2 border-[var(--gk-ink)] ' +
    'shadow-[var(--shadow-pop-sm)] hover:bg-[var(--gk-yellow-deep)]',
  secondary:
    'bg-[var(--gk-white)] text-[var(--gk-ink)] border-2 border-[var(--gk-ink)] ' +
    'shadow-[var(--shadow-pop-sm)] hover:bg-[var(--gk-cream-deep)]',
  ghost:
    'border-2 border-white/70 text-white bg-transparent hover:border-white hover:bg-white/12',
  tertiary: 'text-[var(--gk-yellow)] hover:text-white px-0 py-1 underline-offset-4 hover:underline',
}

/** The sticker press: slide into the shadow rather than shrink. */
const pressMotion =
  'transition-[transform,background-color,box-shadow,border-color,color] ' +
  'duration-[var(--dur-base)] ease-[var(--ease-pop)] ' +
  'hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[var(--shadow-pop)] ' +
  'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'

export function GkButton({
  to,
  href,
  variant = 'primary',
  onDark = false,
  withArrow = false,
  magnetic = false,
  className,
  children,
  ...rest
}: {
  to?: string
  href?: string
  variant?: Variant
  onDark?: boolean
  withArrow?: boolean
  magnetic?: boolean
  className?: string
  children: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const palette = onDark ? onDarkVariants : variants
  const isSticker = variant === 'primary' || variant === 'secondary'

  const classes = cn(
    base,
    variant !== 'tertiary' && sizing,
    variant !== 'tertiary' && isSticker && pressMotion,
    variant === 'ghost' &&
      'transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]',
    palette[variant],
    className,
  )

  // The magnet only ever pulls a third of the way to the pointer, and releases
  // on leave — a full-strength follow reads as a bug, not a flourish.
  const onMove = (event: React.PointerEvent) => {
    if (!magnetic || reduced || !ref.current) return
    const box = ref.current.getBoundingClientRect()
    setOffset({
      x: (event.clientX - (box.left + box.width / 2)) * 0.3,
      y: (event.clientY - (box.top + box.height / 2)) * 0.3,
    })
  }

  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={2.5}
          className="size-[1.1em] transition-transform duration-[var(--dur-base)] ease-[var(--ease-pop)] group-hover:translate-x-1"
        />
      )}
    </>
  )

  const inner = to ? (
    <Link to={to} className={classes} {...(rest as object)}>
      {content}
    </Link>
  ) : href ? (
    <a href={href} className={classes}>
      {content}
    </a>
  ) : (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )

  if (!magnetic) return inner

  return (
    <span
      ref={ref}
      className="inline-block"
      onPointerMove={onMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {inner}
    </span>
  )
}
