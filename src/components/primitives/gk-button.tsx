import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Goalkeep buttons. Sentence case always.
 *
 * Hover darkens to the -deep token. Never scale, never glow — both are
 * explicitly banned by the brand book, which is why this deliberately does
 * not use the shadcn Button's default hover treatment.
 *
 * `onDark` is the hero/closing pair: white fill + charcoal label, which is
 * AAA on charcoal and on photography, and lets the page open and close with
 * the identical button.
 */
type Variant = 'primary' | 'secondary' | 'tertiary'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[var(--r-md)] ' +
  'font-sans font-bold text-[length:var(--fs-base)] leading-none ' +
  'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)] ' +
  'focus-visible:outline-none'

const sizing = 'px-5 py-3.5'

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--gk-blue-deep)] text-white hover:bg-[#263d7d] active:bg-[#1f3369]',
  secondary:
    'border-[1.5px] border-[var(--gk-charcoal)] text-[var(--gk-charcoal)] ' +
    'bg-transparent hover:bg-[var(--n-200)]',
  tertiary:
    'text-[var(--link-color)] hover:text-[var(--link-color-hover)] px-0 py-1 group',
}

const onDarkVariants: Record<Variant, string> = {
  primary:
    'bg-white text-[var(--gk-charcoal)] hover:bg-[var(--n-200)] active:bg-[var(--n-300)]',
  secondary:
    'border-[1.5px] border-white/70 text-white bg-transparent hover:bg-white/10 hover:border-white',
  tertiary: 'text-white hover:text-[var(--n-200)] px-0 py-1 group',
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
        /* 3px, not 8 — the only directional micro-motion on the page. */
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-4 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:translate-x-[3px]"
        />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cn(classes, 'group')}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={cn(classes, 'group')}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={cn(classes, 'group')} {...rest}>
      {content}
    </button>
  )
}
