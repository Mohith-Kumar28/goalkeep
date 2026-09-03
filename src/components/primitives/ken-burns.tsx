import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * A slow crossfade through a set of photographs, each drifting as it plays.
 *
 * This stands in for the video background in the brief. A real video of field
 * work would be better, but a 14-second hold on a still with a 1.04→1.16 scale
 * reads as footage at a fraction of the weight, and every frame is a photograph
 * we actually own.
 *
 * Under reduced motion it renders the first frame only, with no timer running.
 */
export function KenBurns({
  images,
  interval = 6500,
  className,
  imageClassName,
}: {
  images: Array<{ src: string; alt: string }>
  interval?: number
  className?: string
  imageClassName?: string
}) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced || images.length < 2) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval,
    )
    return () => window.clearInterval(id)
  }, [reduced, images.length, interval])

  return (
    <div aria-hidden="true" className={cn('absolute inset-0 overflow-hidden', className)}>
      {images.map((image, i) => (
        <img
          key={image.src}
          src={image.src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-[var(--ease-out)]',
            imageClassName,
          )}
          style={{
            opacity: i === index ? 1 : 0,
            animation:
              reduced || i !== index
                ? undefined
                : `gk-kenburns ${interval + 2200}ms ease-out forwards`,
          }}
        />
      ))}
    </div>
  )
}
