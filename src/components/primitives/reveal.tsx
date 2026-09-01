import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * The page's only entrance animation: opacity 0→1 with an 8px lift, on the
 * brand easing curve, fired once. Applied to band openers and card groups —
 * never to individual body paragraphs.
 *
 * `ease` is the brand token, never a spring: the brand book bans spring
 * physics and bounces outright.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const Component = motion[as]

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  )
}

/** Staggers children by 60ms without animating each paragraph separately. */
export function RevealGroup({
  children,
  className,
}: {
  children: Array<ReactNode>
  className?: string
}) {
  return (
    <div className={cn(className)}>
      {children.map((child, index) => (
        <Reveal key={index} delay={index * 0.06}>
          {child}
        </Reveal>
      ))}
    </div>
  )
}
