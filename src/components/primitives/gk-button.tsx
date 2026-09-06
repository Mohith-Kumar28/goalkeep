import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Goalkeep buttons. Sentence case always.
 *
 * "The buttons you can go back to normality… I want that to have that formal
 * feel. These rounded ones are a little too casual… it doesn't have to have
 * this moving effect also."
 *
 * So: rectangles at 4px, a flat fill, and hover is a colour step — nothing
 * translates, nothing overshoots, nothing follows the pointer. The v2 sticker
 * (2px ink outline, hard offset shadow, magnetic pull) is gone entirely.
 *
 * `tertiary` is the plain text call to action the review asked for in place of
 * a button on the case-study cards.
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'tertiary'

const base =
  'group relative inline-flex items-center justify-center gap-2 ' +
  'font-sans font-bold leading-none tracking-[0.005em] ' +
  'text-[length:var(--fs-sm)] focus-visible:outline-none ' +
  'transition-[background-color,border-color,color] duration-[var(--dur-base)] ease-[var(--ease-out)]'

const sizing = 'rounded-[var(--r-btn)] px-7 py-[0.95rem] border'

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--gk-navy)] text-white border-[var(--gk-navy)] ' +
    'shadow-[var(--shadow-xs)] hover:bg-[var(--gk-navy-deep)] hover:border-[var(--gk-navy-deep)]',
  secondary:
    'bg-[var(--gk-white)] text-[var(--gk-navy)] border-[var(--hairline-strong)] ' +
    'shadow-[var(--shadow-xs)] hover:border-[var(--gk-navy)] hover:bg-[var(--gk-cream-deep)]',
  ghost:
    'bg-transparent text-[var(--gk-navy)] border-[var(--gk-navy)] ' +
    'hover:bg-[var(--gk-navy)] hover:text-white',
  tertiary: 'link-cta text-[length:var(--fs-base)]',
}

const onDarkVariants: Record<Variant, string> = {
  primary:
    'bg-[var(--gk-white)] text-[var(--gk-navy)] border-[var(--gk-white)] ' +
    'hover:bg-[var(--gk-cream-deep)] hover:border-[var(--gk-cream-deep)]',
  secondary:
    'bg-transparent text-white border-white/60 hover:border-white hover:bg-white/10',
  ghost: 'bg-transparent text-white border-white/40 hover:border-white hover:bg-white/10',
  tertiary: 'link-cta text-[length:var(--fs-base)] text-[var(--gk-yellow)] hover:text-white',
}

export function GkButton({
  to,
  href,
  variant = 'primary',
  onDark = false,
  withArrow = false,
  className,
  children,
  ...rest
}: {
  to?: string
  href?: string
  variant?: Variant
  onDark?: boolean
  withArrow?: boolean
  className?: string
  children: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const palette = onDark ? onDarkVariants : variants

  const classes = cn(
    base,
    variant !== 'tertiary' && sizing,
    palette[variant],
    className,
  )

  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={2.25}
          className="size-[1.05em] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:translate-x-[3px]"
        />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...(rest as object)}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}
