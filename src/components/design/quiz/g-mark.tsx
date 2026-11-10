import { marks, ring } from '@/content/design/quiz'
import type { DomainId } from '@/content/quiz'

const circumference = (r: number) => 2 * Math.PI * r
const TOP_C = circumference(ring.top.r)
const ORDER: Array<DomainId> = ['data', 'technology', 'process', 'strategy']

function Arc({ cx, cy, r, rot, len, color }: { cx: number; cy: number; r: number; rot: number; len: number; color: string }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={ring.top.width}
      strokeLinecap="round"
      strokeDasharray={`${len} ${circumference(r)}`}
      transform={`rotate(${rot} ${cx} ${cy})`}
    />
  )
}

/** The logo's ring, its four coloured arcs drawing in one after another. */
export function GMark() {
  const { top, whiteTop, bottom, segments } = ring
  return (
    <svg viewBox="0 0 282 428" aria-hidden="true">
      <Arc cx={top.cx} cy={top.cy} r={top.r} rot={whiteTop.rot} len={whiteTop.len} color="#fff" />
      <Arc cx={bottom.cx} cy={bottom.cy} r={bottom.r} rot={bottom.rot} len={bottom.len} color="#fff" />
      {ORDER.map((id, i) => (
        <circle
          key={id}
          className="dc-q-arc"
          cx={top.cx}
          cy={top.cy}
          r={top.r}
          fill="none"
          stroke={marks[id].mark}
          strokeWidth={top.width}
          strokeLinecap="round"
          strokeDasharray={`${segments[id].len} ${TOP_C}`}
          transform={`rotate(${segments[id].rot} ${top.cx} ${top.cy})`}
          style={{ ['--len' as string]: segments[id].len, animationDelay: `${0.15 + i * 0.12}s` }}
        />
      ))}
    </svg>
  )
}

/* The bounding box of one segment, so its icon can be cropped to the arc. */
function segmentBox(id: DomainId) {
  const { top, segments } = ring
  const seg = segments[id]
  const half = top.width / 2
  const start = seg.rot + 90 - 2.5
  const end = seg.rot + 90 + (seg.len / TOP_C) * 360 + 2.5
  const point = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180
    return [top.cx + r * Math.sin(a), top.cy - r * Math.cos(a)] as const
  }
  const xs: Array<number> = []
  const ys: Array<number> = []
  for (let d = start; d <= end; d++) {
    for (const r of [top.r - half, top.r + half]) {
      const [x, y] = point(d, r)
      xs.push(x)
      ys.push(y)
    }
  }
  for (const d of [start, end]) {
    const [x, y] = point(d, top.r)
    xs.push(x - half, x + half)
    ys.push(y - half, y + half)
  }
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
}

const boxes = Object.fromEntries(ORDER.map((id) => [id, segmentBox(id)])) as Record<DomainId, ReturnType<typeof segmentBox>>

export function PartIcon({ id }: { id: DomainId }) {
  const b = boxes[id]
  const { top, segments } = ring
  return (
    <svg viewBox={`${b.x.toFixed(1)} ${b.y.toFixed(1)} ${b.w.toFixed(1)} ${b.h.toFixed(1)}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Arc cx={top.cx} cy={top.cy} r={top.r} rot={segments[id].rot} len={segments[id].len} color={marks[id].mark} />
    </svg>
  )
}
