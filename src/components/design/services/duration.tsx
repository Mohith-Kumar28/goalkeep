import type { Duration, RulerSpan } from "@/content/design/service-page"
import { tones } from "../tones"
import type { Tone } from "../tones"
import { Rich } from "./rich"
import { toneAccents } from "./service-tones"

const BRACKET =
  "M 4 22 Q 6 8 30 10 L 140 10 Q 150 10 150 2 Q 150 10 160 10 L 270 10 Q 294 8 296 22"

const UNITS = { wk: "Weeks", mo: "Months" } as const
const parseTick = (tick: string) => {
  const match = /^(wk|mo) (\d+)$/.exec(tick)
  return match
    ? { unit: match[1] as keyof typeof UNITS, n: match[2] }
    : undefined
}

const pct = (from: number, to: number, cells: number) => ({
  left: `calc(${from} / ${cells} * 100%)`,
  width: `calc(${to - from} / ${cells} * 100%)`,
})

function RulerRow({
  span,
  cells,
  tone,
  compact,
}: {
  span: RulerSpan
  cells: number
  tone: Tone
  compact: boolean
}) {
  const ink = tones[tone].ink
  const { base, hatch } = toneAccents[tone]
  const range = pct(span.from, span.to, cells)
  const headroom = compact ? 64 : 72
  return (
    <div>
      {span.label && (
        <p style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>
          {span.label}
        </p>
      )}
      <div
        className="dc-ruler-row"
        style={{
          position: "relative",
          paddingTop: headroom,
          marginBottom: compact ? 0 : 8,
        }}
      >
        <div
          className="dc-ruler-cap"
          style={{
            position: "absolute",
            ...range,
            top: 0,
            textAlign: "center",
            ["--mid" as string]: (span.from + span.to) / 2 / cells,
          }}
        >
          <span
            className="dc-ruler-caption"
            style={{
              display: "inline-block",
              fontSize: 15,
              fontWeight: 800,
              color: ink,
            }}
          >
            {span.caption}
          </span>
          <svg
            aria-hidden="true"
            width="100%"
            height="26"
            viewBox="0 0 300 26"
            preserveAspectRatio="none"
            style={{ display: "block", marginTop: 8 }}
          >
            <path
              d={BRACKET}
              fill="none"
              stroke="#14131A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div
          style={{
            position: "relative",
            height: 44,
            background: "#FFFFFF",
            borderRadius: 22,
            boxShadow: "inset 0 0 0 1px #E5E7EE",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `calc(${span.from} / ${cells} * 100%)`,
              background: "#D3D7E2",
              borderRadius: "22px 0 0 22px",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              ...range,
              top: 0,
              bottom: 0,
              background: base,
              borderRadius: 6,
            }}
          />
          {span.trail && span.to < cells && (
            <div
              style={{
                position: "absolute",
                ...pct(span.to, cells, cells),
                top: 0,
                bottom: 0,
                borderRadius: 6,
                background: `repeating-linear-gradient(135deg, ${hatch} 0 6px, transparent 6px 12px)`,
                opacity: 0.7,
              }}
            />
          )}
        </div>
        {span.trail && span.to < cells && (
          <span
            className="dc-ruler-trail"
            style={{
              position: "absolute",
              ...pct(span.to, cells, cells),
              top: headroom - 55,
              textAlign: "center",
              fontSize: 13,
              fontWeight: 700,
              color: ink,
            }}
          >
            {span.trail}
          </span>
        )}
      </div>
    </div>
  )
}

export function DurationSection({
  duration,
  tone,
}: {
  duration: Duration
  tone: Tone
}) {
  const cells = duration.ticks.length
  const ink = tones[tone].ink
  const parsed = duration.ticks.map(parseTick)
  const axis =
    parsed[0] && parsed.every((p) => p?.unit === parsed[0]?.unit)
      ? UNITS[parsed[0].unit]
      : undefined
  const inSpan = (i: number) =>
    duration.spans.some((span) => i >= span.from && i < span.to)
  return (
    <section
      className="dc-band"
      style={{ background: tones[tone].bg, paddingTop: 48, paddingBottom: 48 }}
    >
      <div
        className="dc-shell dc-split dc-duration"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,5fr) minmax(0,7fr)",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <p className="dc-eyebrow" style={{ color: ink }}>
            {duration.eyebrow}
          </p>
          <Rich as="h2" className="dc-h2" html={duration.heading} />
          <p style={{ margin: "16px 0 0", maxWidth: "48ch" }}>
            {duration.body}
          </p>
        </div>
        <div className="dc-ruler-wrap">
          <div className="dc-ruler" style={{ position: "relative" }}>
            {duration.spans.map((span) => (
              <RulerRow
                key={span.caption}
                span={span}
                cells={cells}
                tone={tone}
                compact={duration.compact ?? false}
              />
            ))}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cells}, minmax(0, 1fr))`,
                marginTop: 12,
              }}
            >
              {duration.ticks.map((tick, i) => (
                <span
                  key={tick}
                  style={{
                    fontSize: 13,
                    fontWeight: inSpan(i) ? 800 : 600,
                    color: inSpan(i) ? ink : "rgba(20,19,26,0.6)",
                    textAlign: "right",
                    paddingRight: 4,
                    borderRight: "1px solid #D3D7E2",
                  }}
                >
                  {parsed[i] ? (
                    <>
                      <span className="dc-tick-unit">{parsed[i]?.unit} </span>
                      {parsed[i]?.n}
                    </>
                  ) : (
                    tick
                  )}
                </span>
              ))}
            </div>
            {axis && <p className="dc-ruler-axis">{axis}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
