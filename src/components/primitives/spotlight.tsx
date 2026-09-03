import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * A soft light that follows the pointer across a dark band.
 *
 * This is the one place a radial gradient is allowed. It is pure white at very
 * low alpha over navy, so it lifts the ground without introducing a hue — the
 * palette check skips it because nothing here is opaque.
 */
export function Spotlight({
  className,
  size = 620,
  strength = 0.16,
}: {
  className?: string
  size?: number
  strength?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0.4, y: 0.3, on: false })

  useEffect(() => {
    if (reduced) return
    const node = ref.current?.parentElement
    if (!node) return

    const onMove = (event: PointerEvent) => {
      const box = node.getBoundingClientRect()
      setPos({
        x: (event.clientX - box.left) / box.width,
        y: (event.clientY - box.top) / box.height,
        on: true,
      })
    }
    const onLeave = () => setPos((p) => ({ ...p, on: false }))

    node.addEventListener('pointermove', onMove, { passive: true })
    node.addEventListener('pointerleave', onLeave)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 hidden overflow-hidden transition-opacity duration-700 lg:block',
        className,
      )}
      style={{ opacity: pos.on ? 1 : 0.55 }}
    >
      <div
        className="absolute"
        style={{
          width: size,
          height: size,
          left: `calc(${pos.x * 100}% - ${size / 2}px)`,
          top: `calc(${pos.y * 100}% - ${size / 2}px)`,
          background: `radial-gradient(circle, rgb(255 255 255 / ${strength}), transparent 62%)`,
          transition: 'left 600ms cubic-bezier(0.22,1,0.36,1), top 600ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </div>
  )
}
