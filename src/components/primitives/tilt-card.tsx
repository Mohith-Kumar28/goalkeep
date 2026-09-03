import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * A card that leans away from the pointer on a 3D axis.
 *
 * Kept deliberately shallow — 9 degrees maximum. Past about 12 the card starts
 * to look like a novelty and the text inside it starts to distort. The sheen
 * that tracks the pointer does most of the work of selling the depth.
 */
export function TiltCard({
  children,
  className,
  max = 9,
  sheen = true,
  style,
}: {
  children: ReactNode
  className?: string
  max?: number
  sheen?: boolean
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, on: false })

  const onMove = (event: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const box = ref.current.getBoundingClientRect()
    const px = (event.clientX - box.left) / box.width
    const py = (event.clientY - box.top) / box.height
    setTilt({ x: (0.5 - py) * max * 2, y: (px - 0.5) * max * 2 })
    setGlare({ x: px * 100, y: py * 100, on: true })
  }

  const reset = () => {
    setTilt({ x: 0, y: 0 })
    setGlare((g) => ({ ...g, on: false }))
  }

  return (
    <div className={cn('[perspective:1200px]', className)} style={style}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {children}
        {sheen && !reduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: glare.on ? 1 : 0,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgb(255 255 255 / 0.22), transparent 55%)`,
            }}
          />
        )}
      </div>
    </div>
  )
}
