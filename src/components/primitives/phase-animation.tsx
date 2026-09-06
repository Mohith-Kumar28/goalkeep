import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/**
 * The sequence that plays inside an open "what we do" panel.
 *
 * v2 played an abstract sketch here — converging shards, a shedding grid,
 * landing pins. The review liked that something moved but not what moved:
 * "the animation touch is nice, just that we'll need to figure out what the
 * animation should be exactly so that it makes a bit more sense for each of
 * these pieces." Both of the first two were then specified in detail, and
 * these are those specs built:
 *
 *   Design — "a board with little post-it things going on, a post-it being
 *   slapped and written, one being removed and replaced with something else…
 *   sticky notes, post-its, some sort of reference, and you can put a data
 *   sheet in there pinned to the board with a question mark… a little arrow,
 *   almost that handwriting effect, informal whiteboard brainstorming.
 *   Question mark, exclamation mark, light bulb."
 *
 *   Build — "add tick boxes in each of the three ones that get left… lots of
 *   boxes, the three get tick tick tick, and then each of those blocks morphs
 *   into three different parts of a dashboard: one becomes a pie chart, one a
 *   bar graph, and one a spreadsheet table."
 *
 *   Adopt — explicitly parked: "don't worry about this, keep it how it is,
 *   we'll come back to it." So the v2 sketch stands, restyled.
 *
 * Each sequence then resolves into the two photographs, as before.
 */
export type PhaseKind = 'design' | 'build' | 'adopt'

/** How long each sketch runs before the photographs take over. */
const SKETCH_MS: Record<PhaseKind, number> = {
  design: 6200,
  build: 6400,
  adopt: 4200,
}
const IMAGE_MS = 2600

export function PhaseAnimation({
  kind,
  images,
  active,
  ink,
  accent,
  photoMask,
  className,
  style,
}: {
  kind: PhaseKind
  images: Array<{ src: string; alt: string }>
  active: boolean
  /** Foreground of the open panel — white, on the navy the open row inverts to. */
  ink: string
  /** The stage's own hue. Carries the ticks, the charts and the sticky notes. */
  accent: string
  /**
   * The dissolve into the panel's ground. Applied to the photographs only —
   * the sketch is drawn art, and fading half of it away costs the thing the
   * sequence exists to show. See the note on the render below.
   */
  photoMask?: string
  className?: string
  style?: CSSProperties
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

    /*
     * The photo loop must not start until the sketch has finished. Chaining
     * the interval off the timeout rather than starting both at once is the
     * whole fix: run in parallel and the first interval tick lands mid-sketch
     * and cuts it off — which is what was happening to the build sequence,
     * where the ticks were still appearing when the first photograph faded up
     * over them.
     */
    let step = 0
    let loop: number | undefined
    setStage(0)

    const advance = () => {
      step = step === 2 ? 1 : step + 1
      setStage(step)
    }

    const first = window.setTimeout(() => {
      advance()
      loop = window.setInterval(advance, IMAGE_MS)
    }, SKETCH_MS[kind])

    return () => {
      window.clearTimeout(first)
      if (loop !== undefined) window.clearInterval(loop)
    }
  }, [active, reduced, kind])

  return (
    <div
      className={cn('relative overflow-hidden rounded-[var(--r-md)]', className)}
      style={style}
    >
      {/* Stages 1 and 2 — the photographs. No frame: they fade up out of the
          panel rather than arriving in a box, and the dissolve is applied
          here rather than to the whole panel. */}
      <div
        className="absolute inset-0"
        style={
          photoMask
            ? { maskImage: photoMask, WebkitMaskImage: photoMask }
            : undefined
        }
      >
        {images.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out)]"
            style={{
              opacity: stage === index + 1 ? 1 : 0,
              transform: stage === index + 1 ? 'scale(1)' : 'scale(1.04)',
            }}
          />
        ))}
      </div>

      {/* Stage 0 — the sketch, on top, and deliberately NOT masked.

          The dissolve is right for a photograph: it is a rectangle of
          unrelated content and it needs to stop being one. The sketch is the
          opposite — it is drawn art in the panel's own colours that already
          has no edges, so masking it only dims the half of the sequence
          nearest the copy. That is where the design board's first sticky note
          and the build sequence's pie chart both sit. */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-[var(--ease-out)]"
        style={{ opacity: stage === 0 ? 1 : 0 }}
      >
        {active && !reduced && <Sketch kind={kind} ink={ink} accent={accent} />}
      </div>
    </div>
  )
}

function Sketch({
  kind,
  ink,
  accent,
}: {
  kind: PhaseKind
  ink: string
  accent: string
}) {
  if (kind === 'design') return <DesignSketch ink={ink} accent={accent} />
  if (kind === 'build') return <BuildSketch ink={ink} accent={accent} />
  return <AdoptSketch ink={ink} accent={accent} />
}

/* ============================================================================
   Design — the brainstorm board
   ==========================================================================*/

/** Softens only the board's own ground, which is the sketch's one rectangle. */
const BOARD_FADE =
  'linear-gradient(to right, transparent 0%, rgb(0 0 0 / 0.35) 26%, #000 62%)'

/** Two ruled lines standing in for handwriting on a note. */
function NoteScrawl({ color, delay }: { color: string; delay: number }) {
  return (
    <svg viewBox="0 0 60 26" className="mt-1 w-full" aria-hidden="true">
      {[
        'M3 6c11-2 21-3 32-2c8 1 15 2 22 4',
        'M4 15c9-2 17-2 26-1c6 1 12 1 17 3',
        'M4 23c7-1 13-1 19-1',
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.75 }}
          transition={{ duration: 0.42, delay: delay + i * 0.16, ease: 'easeOut' }}
        />
      ))}
    </svg>
  )
}

/**
 * A post-it. Lands at an angle, is written on, and — if `replacedAt` is set —
 * is peeled off and replaced by a second note in the same slot.
 */
function StickyNote({
  x,
  y,
  rotate,
  fill,
  delay,
  replacedAt,
}: {
  x: string
  y: string
  rotate: number
  fill: string
  delay: number
  replacedAt?: number
}) {
  return (
    <motion.div
      className="absolute w-[27%] rounded-[2px] p-2 shadow-[0_4px_10px_rgb(0_0_0_/_0.25)]"
      style={{ left: x, top: y, background: fill, aspectRatio: '1 / 0.86' }}
      initial={{ scale: 0.5, rotate: rotate - 14, opacity: 0 }}
      animate={
        replacedAt
          ? {
              scale: [0.5, 1.04, 1, 1, 0.9],
              rotate: [rotate - 14, rotate, rotate, rotate, rotate + 22],
              opacity: [0, 1, 1, 1, 0],
              x: [0, 0, 0, 0, 26],
              y: [0, 0, 0, 0, 30],
            }
          : { scale: 1, rotate, opacity: 1 }
      }
      transition={
        replacedAt
          ? {
              duration: replacedAt + 0.6,
              delay,
              times: [0, 0.14, 0.3, 0.86, 1],
              ease: 'easeOut',
            }
          : { duration: 0.5, delay, ease: [0.34, 1.4, 0.64, 1] }
      }
    >
      <NoteScrawl color="rgb(20 19 26 / 0.55)" delay={delay + 0.3} />
    </motion.div>
  )
}

function DesignSketch({ ink, accent }: { ink: string; accent: string }) {
  const notes = [
    /* The middle note is the one that gets pulled off and swapped — "a post-it
       being slapped and written, one being removed and replaced". */
    { x: '13%', y: '12%', rotate: -5, fill: 'var(--gk-yellow)', delay: 0.15 },
    { x: '41%', y: '9%', rotate: 4, fill: 'var(--gk-teal-tint)', delay: 0.5, replacedAt: 2.1 },
    { x: '69%', y: '15%', rotate: -3, fill: 'var(--gk-coral-tint)', delay: 0.85 },
  ]

  return (
    <div className="absolute inset-0">
      {/* The board itself — a faint grid, the way a whiteboard photographs.
          This is the one piece of the sketch that is a full-panel rectangle
          and so the one piece that needs a soft edge of its own now that the
          sequence is no longer masked as a whole. The notes, the arrow and the
          bulb are shapes; they have no edges to hide. */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgb(255 255 255 / 0.04)',
          maskImage: BOARD_FADE,
          WebkitMaskImage: BOARD_FADE,
        }}
      >
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ opacity: 0.1 }}>
          <defs>
            <pattern id="gk-board-grid" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M26 0 L0 0 0 26" fill="none" stroke={ink} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gk-board-grid)" />
        </svg>
      </div>

      {notes.map((note) => (
        <StickyNote key={note.x} {...note} />
      ))}

      {/* The replacement note, into the slot the middle one vacates. */}
      <StickyNote x="43%" y="11%" rotate={-6} fill="var(--gk-yellow-tint)" delay={2.9} />

      {/* The pinned data sheet. A tiny spreadsheet, pinned, with a question
          mark beside it — "you can put a data sheet in there, pinned to the
          board with a question mark". */}
      <motion.div
        className="absolute left-[16%] top-[54%] w-[32%] rounded-[2px] bg-white/92 p-2 shadow-[0_4px_10px_rgb(0_0_0_/_0.25)]"
        initial={{ opacity: 0, y: 14, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.5, delay: 1.5, ease: [0.34, 1.4, 0.64, 1] }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full shadow-[0_1px_2px_rgb(0_0_0_/_0.4)]"
          style={{ background: 'var(--gk-coral)' }}
        />
        <div className="grid grid-cols-3 gap-[2px]">
          {Array.from({ length: 9 }, (_, i) => (
            <motion.span
              key={i}
              className="block h-[8px] rounded-[1px]"
              style={{ background: i < 3 ? accent : 'rgb(20 19 26 / 0.22)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 1.75 + i * 0.045 }}
            />
          ))}
        </div>
      </motion.div>

      {/* "?" — and the arrow that connects it to the sheet. */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 120 90"
        className="absolute left-[46%] top-[52%] h-[26%] w-[26%]"
        initial="hidden"
        animate="shown"
      >
        <motion.path
          d="M8 74C22 62 34 44 40 26"
          fill="none"
          stroke={ink}
          strokeWidth={3}
          strokeLinecap="round"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 0.8 } }}
          transition={{ duration: 0.55, delay: 2.4, ease: 'easeOut' }}
        />
        <motion.path
          d="M28 30l14-6l3 15"
          fill="none"
          stroke={ink}
          strokeWidth={3}
          strokeLinecap="round"
          variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 0.8 } }}
          transition={{ duration: 0.3, delay: 2.9, ease: 'easeOut' }}
        />
      </motion.svg>

      <motion.span
        aria-hidden="true"
        className="hand-lg absolute right-[22%] top-[50%] text-[length:clamp(2rem,4vw,3rem)]"
        style={{ color: accent }}
        initial={{ opacity: 0, scale: 0.5, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ duration: 0.45, delay: 3.3, ease: [0.34, 1.4, 0.64, 1] }}
      >
        ?
      </motion.span>

      {/* The light bulb lands last: the brainstorm arriving somewhere. */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 40 52"
        className="absolute right-[9%] bottom-[8%] h-[26%]"
        initial={{ opacity: 0, scale: 0.4, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 4.1, ease: [0.34, 1.4, 0.64, 1] }}
      >
        <path
          d="M20 4c-8 0-14 6-14 13c0 5 3 8 5 11c1 2 2 3 2 5h14c0-2 1-3 2-5c2-3 5-6 5-11c0-7-6-13-14-13z"
          fill="none"
          stroke={accent}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path d="M14 39h12M16 45h8" stroke={accent} strokeWidth={3} strokeLinecap="round" />
        <motion.g
          stroke={accent}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.35, 1] }}
          transition={{ duration: 1.1, delay: 4.6 }}
        >
          <path d="M2 12l4 2M38 12l-4 2M20 0v3" />
        </motion.g>
      </motion.svg>
    </div>
  )
}

/* ============================================================================
   Build — the boxes that get ticked, then become a dashboard
   ==========================================================================*/

/* Geometry, in percent of the panel. Stage A is a 4×3 grid of twelve; stage B
   is three panels across the middle. The three keepers travel between the two
   layouts, which is what makes the morph read as the *same* blocks becoming
   the dashboard rather than one thing replacing another.

   The left padding is much larger than the right because the panel dissolves
   into the row from its left edge — anything inside PAD_L would be drawn at
   partial opacity. */
const COLS = 4
const ROWS = 3
const PAD_L = 16
const PAD_R = 6
const GAP = 3
const CELL_W = (100 - PAD_L - PAD_R - GAP * (COLS - 1)) / COLS
const CELL_H = (100 - 16 - GAP * (ROWS - 1)) / ROWS

const PANEL_GAP = 4
const PANEL_W = (100 - PAD_L - PAD_R - PANEL_GAP * 2) / 3
const PANEL_H = 54
const PANEL_Y = 23

/** The three blocks that survive the cull, in reading order. */
const KEEPERS = [1, 6, 10]

const cellBox = (index: number) => ({
  left: PAD_L + (index % COLS) * (CELL_W + GAP),
  top: 8 + Math.floor(index / COLS) * (CELL_H + GAP),
  width: CELL_W,
  height: CELL_H,
})

const panelBox = (slot: number) => ({
  left: PAD_L + slot * (PANEL_W + PANEL_GAP),
  top: PANEL_Y,
  width: PANEL_W,
  height: PANEL_H,
})

function BuildSketch({ ink, accent }: { ink: string; accent: string }) {
  /* 0 — twelve blocks. 1 — nine drop away, three get ticked.
     2 — the three morph into pie, bars and table. */
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const a = window.setTimeout(() => setPhase(1), 1400)
    const b = window.setTimeout(() => setPhase(2), 3100)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [])

  return (
    <div className="absolute inset-0">
      {Array.from({ length: COLS * ROWS }, (_, index) => {
        const slot = KEEPERS.indexOf(index)
        const kept = slot >= 0
        const box = phase === 2 && kept ? panelBox(slot) : cellBox(index)

        return (
          <motion.div
            key={index}
            className="absolute overflow-hidden rounded-[3px]"
            style={{ border: '1px solid rgb(255 255 255 / 0.38)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              left: `${box.left}%`,
              top: `${box.top}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
              opacity: !kept && phase >= 1 ? 0 : kept && phase >= 1 ? 1 : 0.45,
              scale: !kept && phase >= 1 ? 0.7 : 1,
              backgroundColor:
                kept && phase >= 1 ? 'rgb(255 255 255 / 0.08)' : 'rgb(255 255 255 / 0.02)',
            }}
            transition={{
              duration: phase === 2 ? 0.85 : 0.55,
              delay:
                phase === 0
                  ? index * 0.045
                  : phase === 1 && !kept
                    ? index * 0.035
                    : phase === 2
                      ? slot * 0.12
                      : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* The tick. "Add tick boxes in each of the three ones that get
                left… tick, tick, tick." It marks the block, then hands over to
                the chart it becomes. */}
            {kept && (
              <motion.svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[42%] max-h-8 -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{
                  opacity: phase === 1 ? 1 : 0,
                  scale: phase === 1 ? 1 : 0.4,
                }}
                transition={{ duration: 0.35, delay: phase === 1 ? 0.5 + slot * 0.22 : 0 }}
              >
                <path
                  d="M4 13l5.5 5.5L20 5"
                  fill="none"
                  stroke={accent}
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}

            {kept && (
              <motion.div
                className="absolute inset-0 p-[8%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 2 ? 1 : 0 }}
                transition={{ duration: 0.5, delay: phase === 2 ? 0.55 + slot * 0.14 : 0 }}
              >
                {slot === 0 && <PieChart ink={ink} accent={accent} on={phase === 2} />}
                {slot === 1 && <BarChart ink={ink} accent={accent} on={phase === 2} />}
                {slot === 2 && <TableSheet ink={ink} accent={accent} on={phase === 2} />}
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

/** One block becomes a pie chart. */
function PieChart({ ink, accent, on }: { ink: string; accent: string; on: boolean }) {
  const R = 15.9155
  const C = 2 * Math.PI * R
  const slices = [
    { pct: 0.46, color: accent },
    { pct: 0.31, color: 'rgb(255 255 255 / 0.55)' },
    { pct: 0.23, color: 'rgb(255 255 255 / 0.25)' },
  ]
  let offset = 0

  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
      {slices.map((slice, i) => {
        const dash = slice.pct * C
        const node = (
          <motion.circle
            key={i}
            cx="20"
            cy="20"
            r={R}
            fill="none"
            stroke={slice.color}
            strokeWidth={8}
            strokeDasharray={`${dash} ${C}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 20 20)"
            initial={{ opacity: 0 }}
            animate={{ opacity: on ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.16 }}
          />
        )
        offset += dash
        return node
      })}
      <circle cx="20" cy="20" r={R - 5.4} fill="none" stroke={ink} strokeWidth={0.6} opacity={0.25} />
    </svg>
  )
}

/** One block becomes a bar graph. */
function BarChart({ ink, accent, on }: { ink: string; accent: string; on: boolean }) {
  const bars = [0.42, 0.68, 0.5, 0.92]

  return (
    <div className="flex h-full w-full items-end gap-[7%] pb-[10%]">
      {bars.map((height, i) => (
        <motion.span
          key={i}
          className="block flex-1 rounded-[1px]"
          style={{ background: i === bars.length - 1 ? accent : 'rgb(255 255 255 / 0.42)' }}
          initial={{ height: '0%' }}
          animate={{ height: on ? `${height * 100}%` : '0%' }}
          transition={{ duration: 0.55, delay: 0.12 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <span
        aria-hidden="true"
        className="absolute inset-x-[8%] bottom-[10%] h-px"
        style={{ background: ink, opacity: 0.3 }}
      />
    </div>
  )
}

/** One block becomes a spreadsheet table. */
function TableSheet({ ink, accent, on }: { ink: string; accent: string; on: boolean }) {
  return (
    <div className="flex h-full w-full flex-col gap-[6%]">
      {Array.from({ length: 4 }, (_unusedRow, row) => (
        <div key={row} className="flex flex-1 gap-[6%]">
          {Array.from({ length: 3 }, (_unusedCell, col) => (
            <motion.span
              key={col}
              className="block flex-1 rounded-[1px]"
              style={{
                background:
                  row === 0
                    ? accent
                    : col === 0
                      ? 'rgb(255 255 255 / 0.34)'
                      : 'rgb(255 255 255 / 0.16)',
                border: row === 0 ? 'none' : `0.5px solid ${ink}`,
              }}
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: on ? 1 : 0, scaleX: on ? 1 : 0.6 }}
              transition={{ duration: 0.3, delay: 0.1 + (row * 3 + col) * 0.04 }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/* ============================================================================
   Adopt — parked by the client, restyled only
   ==========================================================================*/

/** Pins land on a surface one at a time, then join up: a team adopting it. */
function AdoptSketch({ ink, accent }: { ink: string; accent: string }) {
  const pins = [
    { x: 22, y: 30 },
    { x: 40, y: 60 },
    { x: 60, y: 34 },
    { x: 74, y: 68 },
    { x: 82, y: 22 },
  ]

  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {pins.slice(0, -1).map((pin, i) => (
          <motion.line
            key={i}
            x1={pin.x}
            y1={pin.y}
            x2={pins[i + 1].x}
            y2={pins[i + 1].y}
            stroke={ink}
            strokeWidth={0.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.45 }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.3, ease: 'easeOut' }}
          />
        ))}
      </svg>
      {pins.map((pin, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-full"
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            width: 14,
            height: 14,
            marginLeft: -7,
            marginTop: -7,
            background: i === pins.length - 1 ? accent : ink,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: i === pins.length - 1 ? 1 : 0.8 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.28, ease: [0.34, 1.4, 0.64, 1] }}
        />
      ))}
    </div>
  )
}
