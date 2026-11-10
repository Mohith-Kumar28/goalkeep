import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export type SnapOption = { label: ReactNode; base: string; tint: string }

/**
 * Phone replacement for a tab row: compact numbered options (marker left, text
 * right) over a swipe track. Scrolling the track selects the option, and
 * tapping an option scrolls the track to it.
 */
export function SnapTabs({
  label,
  options,
  panels,
}: {
  label: string
  options: Array<SnapOption>
  panels: Array<ReactNode>
}) {
  const reduced = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    const el = track.current
    if (!el) return
    const slide = el.children[active] as HTMLElement | undefined
    if (!slide) return
    const measure = () => setHeight(slide.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(slide)
    return () => observer.disconnect()
  }, [active])

  const onScroll = () => {
    const el = track.current
    if (!el || !el.clientWidth) return
    setActive(Math.min(panels.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))))
  }

  const go = (i: number) => {
    const el = track.current
    if (el)
      el.scrollTo({
        left: i * el.clientWidth,
        behavior: reduced ? 'auto' : 'smooth',
      })
  }

  return (
    <div className="ps-snap">
      <div className="ps-opts" role="tablist" aria-label={label}>
        {options.map((option, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            className="ps-opt"
            aria-selected={i === active}
            data-done={i < active}
            style={{ '--base': option.base, '--tint': option.tint } as CSSProperties}
            onClick={() => go(i)}
          >
            <span className="ps-opt-num" aria-hidden="true">
              {i + 1}
            </span>
            <span className="ps-opt-label">{option.label}</span>
          </button>
        ))}
      </div>
      <div ref={track} className="ps-track" onScroll={onScroll} style={{ height }}>
        {panels.map((panel, i) => (
          <div key={i} className="ps-slide" role="tabpanel" aria-hidden={i !== active}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  )
}
