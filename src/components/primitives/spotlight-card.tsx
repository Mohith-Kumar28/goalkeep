import { useRef, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/**
 * A card whose edge lights where the pointer is.
 *
 * Two layers, both driven off the pointer's position inside the card and both
 * purely additive light — nothing here moves, scales or tilts. That matters:
 * the review took the tilt and the magnetic pull off this page for being too
 * casual, and a card that leans when you approach it would put that straight
 * back. What it did single out as working was "the hover lighting up and the
 * translucent background", which is exactly this.
 *
 *   1. The lit border. A radial gradient painted across the whole card and
 *      then masked down to its 1px rim, so only the edge nearest the pointer
 *      is bright. The two-mask `exclude` composite is what punches the middle
 *      out: one mask covers the content box, one covers the border box, and
 *      subtracting the first from the second leaves the rim.
 *   2. A wide, very faint sheen across the surface, so the card reads as
 *      catching light rather than as an outline that switches on.
 *
 * Both fade rather than snap, and neither is constructed at all under reduced
 * motion. On a touch device the pointer never enters, so it simply never runs.
 */
export function SpotlightCard({
  children,
  /** Must match the card's own corner radius or the rim will not sit on it. */
  radius = "var(--r-lg)",
  /** How far the light reaches, in px. */
  reach = 220,
  className,
}: {
  children: ReactNode
  radius?: string
  reach?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [lit, setLit] = useState(false)

  const track = (event: React.PointerEvent) => {
    if (reduced || !ref.current) return
    const box = ref.current.getBoundingClientRect()
    setPos({ x: event.clientX - box.left, y: event.clientY - box.top })
  }

  // Both mask layers are declared long-hand for Safari, which still wants the
  // -webkit- prefixed composite keyword ("xor") rather than "exclude".
  const rimMask =
    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)"

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onPointerMove={track}
      onPointerEnter={() => setLit(true)}
      onPointerLeave={() => setLit(false)}
    >
      {children}

      {!reduced && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]"
            style={{
              borderRadius: radius,
              padding: 1,
              opacity: lit ? 1 : 0,
              background: `radial-gradient(${reach}px circle at ${pos.x}px ${pos.y}px, rgb(255 255 255 / 0.72), transparent 64%)`,
              WebkitMask: rimMask,
              WebkitMaskComposite: "xor",
              mask: rimMask,
              maskComposite: "exclude",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]"
            style={{
              borderRadius: radius,
              opacity: lit ? 1 : 0,
              background: `radial-gradient(${reach * 1.5}px circle at ${pos.x}px ${pos.y}px, rgb(255 255 255 / 0.08), transparent 58%)`,
            }}
          />
        </>
      )}
    </div>
  )
}
