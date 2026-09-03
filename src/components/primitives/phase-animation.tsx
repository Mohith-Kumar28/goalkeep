import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * The short sequence that plays inside an open "what we do" panel.
 *
 * The brief asked for "5-7 second animation followed by two images". That's
 * the shape here: roughly 2.4s of abstract motion that says what the stage
 * does, then each photograph in turn, then a loop.
 *
 * The abstract stage is deliberately crude — flat rectangles and dots in the
 * band's own hue. A polished illustration would compete with the photographs
 * that follow it, and the photographs are the part that matters.
 */
export type PhaseKind = 'design' | 'build' | 'adopt'

const SKETCH_MS = 2400
const IMAGE_MS = 2200

export function PhaseAnimation({
  kind,
  images,
  active,
  ink,
  className,
}: {
  kind: PhaseKind
  images: Array<{ src: string; alt: string }>
  active: boolean
  /** Foreground colour of the open panel, so the sketch matches its ground. */
  ink: string
  className?: string
}) {
  const reduced = useReducedMotion()
  // 0 = sketch, 1 = first photograph, 2 = second photograph.
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!active) {
      setStage(0)
      return
    }
    // Reduced motion skips straight to the photographs — the sketch is pure
    // motion and has nothing to say as a still frame.
    if (reduced) {
      setStage(1)
      return
    }

    let step = 0
    setStage(0)
    const advance = () => {
      step = step === 2 ? 1 : step + 1
      setStage(step)
    }
    const first = window.setTimeout(advance, SKETCH_MS)
    const loop = window.setInterval(advance, IMAGE_MS)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(loop)
    }
  }, [active, reduced])

  return (
    <div className={cn('relative overflow-hidden rounded-[var(--r-md)]', className)}>
      {/* Stage 0 — the sketch. */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-[var(--ease-out)]"
        style={{ opacity: stage === 0 ? 1 : 0 }}
      >
        {active && !reduced && <Sketch kind={kind} ink={ink} />}
      </div>

      {/* Stages 1 and 2 — the photographs. */}
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out)]"
          style={{
            opacity: stage === index + 1 ? 1 : 0,
            transform: stage === index + 1 ? 'scale(1)' : 'scale(1.05)',
          }}
        />
      ))}
    </div>
  )
}

function Sketch({ kind, ink }: { kind: PhaseKind; ink: string }) {
  if (kind === 'design') return <DesignSketch ink={ink} />
  if (kind === 'build') return <BuildSketch ink={ink} />
  return <AdoptSketch ink={ink} />
}

/** Scattered fragments converge into one line — many sources, one question. */
function DesignSketch({ ink }: { ink: string }) {
  const shards = [
    { x: -120, y: -70, r: -22 },
    { x: 110, y: -90, r: 16 },
    { x: -150, y: 40, r: 9 },
    { x: 140, y: 60, r: -14 },
    { x: -40, y: -120, r: 28 },
    { x: 60, y: 110, r: -8 },
  ]

  return (
    <div className="absolute inset-0 grid place-items-center">
      {shards.map((shard, index) => (
        <motion.span
          key={index}
          className="absolute block rounded-[3px]"
          style={{ width: 56, height: 12, background: ink, opacity: 0.65 }}
          initial={{ x: shard.x, y: shard.y, rotate: shard.r, opacity: 0 }}
          animate={{ x: 0, y: (index - 2.5) * 17, rotate: 0, opacity: 0.85 }}
          transition={{ duration: 1.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  )
}

/** A cluttered grid sheds panels until only what matters is left. */
function BuildSketch({ ink }: { ink: string }) {
  const keep = new Set([4, 6, 9])

  return (
    <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2 p-6">
      {Array.from({ length: 12 }, (_, index) => (
        <motion.span
          key={index}
          className="block rounded-[4px]"
          style={{ background: ink }}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={
            keep.has(index)
              ? { opacity: 0.9, scale: 1.06 }
              : { opacity: 0, scale: 0.7 }
          }
          transition={{
            duration: 0.8,
            delay: 0.5 + index * 0.055,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  )
}

/** Pins land on a surface one by one — a team adopting the thing. */
function AdoptSketch({ ink }: { ink: string }) {
  const pins = [
    { top: '28%', left: '22%' },
    { top: '58%', left: '38%' },
    { top: '34%', left: '58%' },
    { top: '68%', left: '72%' },
    { top: '18%', left: '80%' },
  ]

  return (
    <div className="absolute inset-0">
      <span
        className="absolute inset-8 rounded-[var(--r-sm)]"
        style={{ background: ink, opacity: 0.16 }}
      />
      {pins.map((pin, index) => (
        <motion.span
          key={index}
          className="absolute block rounded-full"
          style={{ ...pin, width: 16, height: 16, background: ink }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.95 }}
          transition={{
            duration: 0.5,
            delay: 0.35 + index * 0.32,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      ))}
    </div>
  )
}
