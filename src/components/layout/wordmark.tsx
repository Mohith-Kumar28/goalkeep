import { cn } from '@/lib/utils'

/**
 * The wordmark: charcoal `goalkeep` with the five-segment donut nested in
 * the "g". The donut is never separated from the wordmark, so it lives only
 * here — never as a standalone badge, bullet, spinner or ornament.
 *
 * [VERIFY] This is a faithful stand-in built to the brand book's description.
 * Replace with the official SVG when the client supplies it — the only file
 * currently recoverable from the live site is a 13 KB JPG.
 */
export function Wordmark({
  className,
  inverse = false,
}: {
  className?: string
  inverse?: boolean
}) {
  const ink = inverse ? '#FFFFFF' : 'var(--gk-charcoal)'

  return (
    <span
      data-brand-mark=""
      className={cn(
        'inline-flex select-none items-center font-sans font-black tracking-[-0.03em]',
        className,
      )}
      style={{ color: ink, fontSize: '1.75rem', lineHeight: 1 }}
    >
      <span aria-hidden="true" className="relative inline-block">
        g
        {/* The five-segment donut, nested inside the bowl of the g. */}
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          className="absolute left-1/2 top-[0.56em] size-[0.52em] -translate-x-1/2"
        >
          {[
            { color: 'var(--gk-blue)', from: -90, to: -18 },
            { color: 'var(--gk-teal)', from: -18, to: 54 },
            { color: 'var(--gk-coral)', from: 54, to: 126 },
            { color: 'var(--gk-yellow)', from: 126, to: 198 },
            { color: 'var(--gk-charcoal)', from: 198, to: 270 },
          ].map((seg, i) => {
            const r = 15
            const w = 9
            const rad = (deg: number) => (deg * Math.PI) / 180
            const x1 = 20 + r * Math.cos(rad(seg.from))
            const y1 = 20 + r * Math.sin(rad(seg.from))
            const x2 = 20 + r * Math.cos(rad(seg.to))
            const y2 = 20 + r * Math.sin(rad(seg.to))
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={seg.color}
                strokeWidth={w}
                strokeLinecap="butt"
              />
            )
          })}
          <circle cx="20" cy="20" r="7" fill={inverse ? '#3F3D3E' : '#FAFAFA'} />
        </svg>
      </span>
      <span aria-hidden="true">oalkeep</span>
      <span className="sr-only">Goalkeep</span>
    </span>
  )
}
