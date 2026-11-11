import { useEffect, useRef } from 'react'

type Source = { src: string; type: string }

/**
 * A muted background loop that keeps playing on phones. The static host
 * answers Range requests with the whole file, so a streamed video can stall
 * mid-loop on mobile; the clip is downloaded once and played from memory.
 * It plays only while on screen and resumes when it comes back.
 */
export function LoopVideo({
  sources,
  poster,
  className,
  width,
  height,
}: {
  sources: Array<Source>
  poster: string
  className?: string
  width?: number
  height?: number
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    const source = sources.find((s) => video.canPlayType(s.type) !== '') ?? sources[0]
    let objectUrl: string | null = null
    let visible = false
    let requested = false
    let ready = false
    let cancelled = false

    const play = () => {
      if (ready && visible && !document.hidden) void video.play().catch(() => {})
    }
    const load = async () => {
      try {
        const response = await fetch(source.src)
        if (!response.ok) throw new Error(String(response.status))
        const blob = await response.blob()
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
      } catch {
        if (cancelled) return
        video.src = source.src
      }
      ready = true
      play()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !requested) {
          requested = true
          void load()
        }
        if (visible) play()
        else video.pause()
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    const onVisibility = () => (document.hidden ? video.pause() : play())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [sources])

  return (
    <video
      ref={ref}
      className={className}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden="true"
    />
  )
}
