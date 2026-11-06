import type { ReactNode } from 'react'
import { useContactForm } from './contact-form'
import { ArrowIcon } from './icons'
import { SiteLink } from './site-link'

export type CtaVariant = 'accent' | 'secondary' | 'primary'

export const ctaClass = (variant: CtaVariant) =>
  `dc-btn ${variant === 'accent' ? 'dc-btn-accent' : variant === 'primary' ? 'dc-btn-primary' : 'dc-btn-sec-navy'}`

type CtaProps = {
  variant?: CtaVariant
  children: ReactNode
  /** Draws the trailing arrow. The design puts it on the main button only. */
  arrow?: boolean
} & ({ href: string; intent?: never } | { intent: string; href?: never })

/**
 * A button-styled link. With `intent` it jumps to #contact and opens the
 * form with that intent; with `href` it is a plain link.
 */
export function Cta({ variant = 'accent', children, arrow = false, href, intent }: CtaProps) {
  const form = useContactForm()
  const content = (
    <>
      {children}
      {arrow && <ArrowIcon />}
    </>
  )
  if (intent !== undefined) {
    return (
      <a href="#contact" className={ctaClass(variant)} onClick={() => form.open(intent)}>
        {content}
      </a>
    )
  }
  return (
    <SiteLink href={href} className={ctaClass(variant)}>
      {content}
    </SiteLink>
  )
}
