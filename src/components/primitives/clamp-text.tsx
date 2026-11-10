import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * On phones (max-width 760px), text past `lines` lines is cut with a
 * "Read more" toggle. Wider screens always show it in full, and the toggle
 * only appears when the text actually overflows.
 */
export function ClampText({
  children,
  lines = 3,
  className,
  as: Tag = 'p',
}: {
  children: ReactNode
  lines?: number
  className?: string
  as?: 'p' | 'div'
}) {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [overflows, setOverflows] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Tag
        ref={ref as never}
        className={cn('gk-clamp', open && 'gk-clamp-open', className)}
        style={{ ['--gk-clamp-lines' as string]: lines }}
      >
        {children}
      </Tag>
      {(overflows || open) && (
        <button type="button" className="gk-clamp-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? 'Read less' : 'Read more'}
        </button>
      )}
    </>
  )
}
