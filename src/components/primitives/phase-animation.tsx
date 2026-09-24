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
 *   Adopt — rebuilt after the 23 Sep review from Rumit's reference: five
 *   people side by side whose confidence with data climbs red → yellow →
 *   green. Design was reworked in the same review; see DesignSketch.
 *
 * Each sequence then resolves into the two photographs, as before.
 */
export type PhaseKind = 'design' | 'build' | 'adopt'

/** How long each sketch runs before the photographs take over. */
const SKETCH_MS: Record<PhaseKind, number> = {
  design: 6200,
  build: 6400,
  adopt: 5400,
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
   Design — subtracting the noise
   ==========================================================================*/

/*
 * 23 Sep review: the brainstorm board read "a little childish… too Canva
 * amateur" once the arrow, the bulb and the question mark landed at random.
 * Aditya's steer for what this stage actually is: organisations collect far
 * more than they can use, and the design work is deciding what *not* to look
 * at. So the board fills with everything a team collects, one question is
 * asked of it, most of it is struck off, and three notes are kept.
 *
 * Post-its on a whiteboard still carry the brainstorming, but they land on a
 * tidy grid and the whole thing moves in the same rhythm as Build.
 */
const FIELDS = [
  'Attendance',
  'Village',
  'Photos',
  'Session notes',
  'Test scores',
  'Phone type',
  'Weather',
  'Dropouts',
  'Travel time',
  'Mood check',
  'Parent income',
  'Water source',
  'Home visits',
  'Feedback forms',
  'Learning levels',
]
const DESIGN_COLS = 5
/** Indices into FIELDS that survive the question. */
const KEPT = [0, 7, 14]
const NOTE_FILLS = ['var(--gk-yellow-tint)', 'var(--gk-teal-tint)', 'var(--gk-coral-tint)']

function DesignSketch({ ink, accent }: { ink: string; accent: string }) {
  /* 0 — the board fills. 1 — the question. 2 — most notes struck off.
     3 — the three kept notes line up. */
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 1500),
      window.setTimeout(() => setPhase(2), 2400),
      window.setTimeout(() => setPhase(3), 3900),
    ]
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [])

  const rows = Math.ceil(FIELDS.length / DESIGN_COLS)
  const cellW = (100 - 12 - 2.5 * (DESIGN_COLS - 1)) / DESIGN_COLS
  const cellH = (100 - 34 - 3 * (rows - 1)) / rows

  return (
    <div className="absolute inset-0">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ opacity: 0.08 }}>
        <defs>
          <pattern id="gk-board-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0 L0 0 0 24" fill="none" stroke={ink} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gk-board-grid)" />
      </svg>

      {/* The question every note has to answer. */}
      <motion.p
        className="absolute inset-x-[6%] top-[7%] text-center text-[length:clamp(0.8125rem,1.2vw,1rem)] font-bold"
        style={{ color: ink }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 6 }}
        transition={{ duration: 0.4 }}
      >
        {phase >= 3 ? (
          <>
            Three things worth measuring. <span style={{ color: accent }}>The rest can wait.</span>
          </>
        ) : (
          <>
            Which of these will change a decision?
          </>
        )}
      </motion.p>

      {FIELDS.map((field, index) => {
        const slot = KEPT.indexOf(index)
        const kept = slot >= 0
        const col = index % DESIGN_COLS
        const row = Math.floor(index / DESIGN_COLS)
        const grid = {
          left: 6 + col * (cellW + 2.5),
          top: 22 + row * (cellH + 3),
          width: cellW,
          height: cellH,
        }
        const lined = {
          left: 8 + slot * 29.3,
          top: 36,
          width: 25,
          height: 34,
        }
        const box = phase >= 3 && kept ? lined : grid
        const struck = phase >= 2 && !kept

        return (
          <motion.div
            key={field}
            className="absolute flex items-center justify-center rounded-[3px] px-1.5 text-center shadow-[0_3px_8px_rgb(0_0_0_/_0.22)]"
            style={{ background: NOTE_FILLS[index % 3] }}
            initial={{ opacity: 0, scale: 0.7, rotate: index % 2 ? 3 : -3 }}
            animate={{
              left: `${box.left}%`,
              top: `${box.top}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
              opacity: phase >= 3 && !kept ? 0 : struck ? 0.35 : 1,
              scale: phase >= 3 && !kept ? 0.85 : 1,
              rotate: phase >= 3 ? 0 : index % 2 ? 1.5 : -1.5,
            }}
            transition={{
              duration: phase >= 3 ? 0.8 : 0.45,
              delay:
                phase === 0
                  ? index * 0.07
                  : phase === 2
                    ? (index % DESIGN_COLS) * 0.05 + Math.floor(index / DESIGN_COLS) * 0.08
                    : phase === 3 && kept
                      ? slot * 0.1
                      : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              className={cn(
                'font-bold leading-tight text-[var(--gk-ink)]',
                phase >= 3 && kept
                  ? 'text-[length:clamp(0.8125rem,1.3vw,1.0625rem)]'
                  : 'text-[length:clamp(0.5625rem,0.85vw,0.75rem)]',
              )}
            >
              {field}
            </span>

            {/* Struck off: a single pen line across the note. */}
            {!kept && (
              <svg
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-x-[8%] top-1/2 h-3 w-[84%] -translate-y-1/2"
              >
                <motion.path
                  d="M2 12 C 30 8, 60 9, 98 7"
                  fill="none"
                  stroke="var(--gk-ink)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: struck ? 1 : 0 }}
                  transition={{
                    duration: 0.3,
                    delay: struck ? (index % DESIGN_COLS) * 0.05 + Math.floor(index / DESIGN_COLS) * 0.08 : 0,
                  }}
                />
              </svg>
            )}

            {/* Kept: ticked in the stage accent, the way Build ticks its three. */}
            {kept && (
              <motion.span
                className="absolute -top-2.5 -right-2.5 grid size-6 place-items-center rounded-full"
                style={{ background: accent }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 0.3, delay: phase === 2 ? 0.9 + slot * 0.15 : 0 }}
              >
                <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
                  <path
                    d="M4 13l5.5 5.5L20 5"
                    fill="none"
                    stroke="var(--gk-ink)"
                    strokeWidth={3.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            )}
          </motion.div>
        )
      })}
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

   The panel is a plain rounded box now (no dissolve), so the padding is even. */
const COLS = 4
const ROWS = 3
const PAD_L = 6
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
   Adopt — five people, side by side
   ==========================================================================*/

/*
 * Rebuilt from Rumit's reference after the 23 Sep review: people across an
 * organisation, each with a bar for how confident they are using data, moving
 * from red through yellow to green as the adoption work lands.
 *
 * What the reference had and this doesn't: the hierarchy. "This hierarchy is
 * just not something Goalkeep wants to show" - so five people stand in one
 * row, none above another, and every one of them moves up.
 */
const PEOPLE_LEVELS = [
  [1, 2, 1, 2, 1],
  [2, 3, 2, 3, 3],
  [4, 5, 4, 4, 5],
]
const STAGE_LABELS = ['Before', 'During the programme', 'Six months on']
const MAX_LEVEL = 5

const levelColor = (level: number) =>
  level <= 1 ? 'var(--gk-coral-lift)' : level <= 3 ? 'var(--gk-yellow)' : 'var(--gk-teal-lift)'

function AdoptSketch({ ink }: { ink: string; accent: string }) {
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setBeat(1), 1700),
      window.setTimeout(() => setBeat(2), 3200),
    ]
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [])

  const levels = PEOPLE_LEVELS[beat]

  return (
    <div className="absolute inset-0 flex flex-col px-[7%] pt-[7%] pb-[6%]">
      <div className="flex items-baseline justify-between gap-4" style={{ color: ink }}>
        <span className="text-[length:var(--fs-xs)] font-bold tracking-[var(--tracking-label)] uppercase opacity-70">
          Confidence with data
        </span>
        <motion.span
          key={beat}
          className="text-[length:var(--fs-sm)] font-bold"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {STAGE_LABELS[beat]}
        </motion.span>
      </div>

      <div className="mt-[5%] flex flex-1 items-end justify-between gap-[5%]">
        {levels.map((level, person) => (
          <motion.div
            key={person}
            className="flex h-full flex-1 flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + person * 0.1 }}
          >
            {/* The bar: five steps, filling from the bottom. */}
            <div className="flex w-[46%] flex-1 flex-col-reverse gap-[5%]">
              {Array.from({ length: MAX_LEVEL }, (_, step) => (
                <motion.span
                  key={step}
                  className="block flex-1 rounded-[3px]"
                  animate={{
                    backgroundColor: step < level ? levelColor(level) : 'rgb(255 255 255 / 0.1)',
                  }}
                  transition={{ duration: 0.45, delay: person * 0.08 + step * 0.05 }}
                />
              ))}
            </div>

            {/* The person. */}
            <svg viewBox="0 0 40 40" className="mt-3 w-[62%] max-w-14" aria-hidden="true">
              <circle cx="20" cy="13" r="7.5" fill={ink} opacity={0.9} />
              <path d="M5 40c0-9 6.7-15 15-15s15 6 15 15" fill={ink} opacity={0.9} />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
