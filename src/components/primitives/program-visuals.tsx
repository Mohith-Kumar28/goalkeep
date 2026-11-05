import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { createContext, useContext } from 'react'
import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export type VisualName =
  | 'understand'
  | 'design'
  | 'build'
  | 'adopt'
  | 'quantitative'
  | 'qualitative'
  | 'interpretation'
  | 'visualisation'
  | 'communication'

const EASE = [0.22, 1, 0.36, 1] as const
const STEP = 0.08

const STROKE = {
  navy: 'var(--gk-navy)',
  blue: 'var(--gk-blue)',
  teal: 'var(--gk-teal)',
  coral: 'var(--gk-coral)',
  yellow: 'var(--gk-yellow-deep)',
  ink: 'var(--gk-ink)',
  faint: 'var(--hairline-strong)',
  white: 'var(--gk-white)',
} as const

const FILL = {
  none: 'none',
  white: 'var(--gk-white)',
  blue: 'var(--gk-blue-tint)',
  teal: 'var(--gk-teal-tint)',
  coral: 'var(--gk-coral-tint)',
  yellow: 'var(--gk-yellow-tint)',
  navySolid: 'var(--gk-navy)',
  tealSolid: 'var(--gk-teal)',
  coralSolid: 'var(--gk-coral)',
  blueSolid: 'var(--gk-blue)',
} as const

type StrokeName = keyof typeof STROKE
type FillName = keyof typeof FILL

// Read by every stroke and fade so the 9 visuals stay plain `() => JSX` in the registry.
const ReducedContext = createContext(true)

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.55, delay: i * STEP, ease: EASE },
  }),
}

type FadeCustom = { i: number; dy: number }

const fadeVariants: Variants = {
  hidden: ({ dy }: FadeCustom) => ({ opacity: 0, y: dy }),
  shown: ({ i }: FadeCustom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * STEP, ease: EASE },
  }),
}

function D({
  d,
  c = 'navy',
  w = 2,
  fill = 'none',
  i = 0,
}: {
  d: string
  c?: StrokeName
  w?: number
  fill?: FillName
  i?: number
}) {
  const reduced = useContext(ReducedContext)
  const shared = {
    d,
    stroke: STROKE[c],
    strokeWidth: w,
    fill: FILL[fill],
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (reduced) return <path {...shared} />
  return <motion.path {...shared} variants={drawVariants} custom={i} />
}

function F({
  i = 0,
  dy = 0,
  children,
}: {
  i?: number
  dy?: number
  children: ReactNode
}) {
  const reduced = useContext(ReducedContext)
  if (reduced) return <g>{children}</g>
  return (
    <motion.g variants={fadeVariants} custom={{ i, dy }}>
      {children}
    </motion.g>
  )
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  const reduced = useContext(ReducedContext)
  const shared = {
    viewBox: '0 0 240 160',
    width: '100%',
    role: 'img' as const,
    'aria-label': label,
    style: { display: 'block' as const },
  }
  if (reduced) return <svg {...shared}>{children}</svg>
  return (
    <motion.svg
      {...shared}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
    >
      {children}
    </motion.svg>
  )
}

const rect = (x: number, y: number, w: number, h: number, r = 3) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`

const arrow = (x1: number, y1: number, x2: number, y2: number, head = 5) => {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const p = (t: number) =>
    `${(x2 - head * Math.cos(a + t)).toFixed(1)} ${(y2 - head * Math.sin(a + t)).toFixed(1)}`
  return `M${x1} ${y1}L${x2} ${y2}M${p(0.5)}L${x2} ${y2}L${p(-0.5)}`
}

const bubble = (x: number, y: number, w: number, h: number) =>
  `M${x + 4} ${y}H${x + w - 4}Q${x + w} ${y} ${x + w} ${y + 4}V${y + h - 4}Q${x + w} ${y + h} ${x + w - 4} ${y + h}H${x + 12}L${x + 5} ${y + h + 5}L${x + 6} ${y + h}Q${x} ${y + h} ${x} ${y + h - 4}V${y + 4}Q${x} ${y} ${x + 4} ${y}Z`

// Stand-in text: n bars, the last one shorter.
const lines = (x: number, y: number, w: number, n: number, gap = 6) =>
  Array.from({ length: n }, (_, k) => {
    const len = k === n - 1 && n > 1 ? w * 0.65 : w
    return `M${x} ${y + k * gap}H${x + len}`
  }).join('')

const questionMark = (x: number, y: number) =>
  `M${x - 6} ${y + 8}C${x - 6} ${y - 3} ${x + 8} ${y - 3} ${x + 8} ${y + 8}C${x + 8} ${y + 15} ${x + 1} ${y + 15} ${x + 1} ${y + 24}`

function Person({
  x,
  y,
  c,
  i,
  s = 1,
}: {
  x: number
  y: number
  c: StrokeName
  i: number
  s?: number
}) {
  const fill = c === 'blue' ? 'blue' : c === 'teal' ? 'teal' : 'coral'
  return (
    <>
      <D d={circle(x, y, 6.5 * s)} c={c} fill={fill} i={i} />
      <D
        d={`M${x - 13 * s} ${y + 28 * s}C${x - 13 * s} ${y + 8 * s} ${x + 13 * s} ${y + 8 * s} ${x + 13 * s} ${y + 28 * s}`}
        c={c}
        fill={fill}
        i={i + 1}
      />
    </>
  )
}

function Understand() {
  return (
    <Frame label="A magnifying glass over scattered forms converging into one clear view, with a question mark">
      <g transform="translate(16 24) rotate(-8)">
        <D d={rect(0, 0, 30, 38)} c="faint" fill="white" i={0} />
        <D d={lines(6, 10, 18, 3, 8)} c="faint" w={1.5} i={1} />
      </g>
      <g transform="translate(34 70) rotate(6)">
        <D d={rect(0, 0, 30, 38)} c="faint" fill="white" i={1} />
        <D d={lines(6, 10, 18, 3, 8)} c="faint" w={1.5} i={2} />
      </g>
      <g transform="translate(14 112) rotate(-4)">
        <D d={rect(0, 0, 30, 38)} c="faint" fill="white" i={2} />
        <D d={lines(6, 10, 18, 3, 8)} c="faint" w={1.5} i={3} />
      </g>
      <D d="M46 44C76 44 96 64 119 72" c="blue" w={1.5} i={3} />
      <D d="M64 90C88 90 102 84 119 79" c="blue" w={1.5} i={4} />
      <D d="M44 132C80 134 106 106 123 90" c="blue" w={1.5} i={5} />
      <D d={circle(150, 76, 30)} c="blue" fill="blue" i={5} />
      <g transform="translate(173 99) rotate(-45)">
        <D d={rect(-4, 0, 8, 32)} c="navy" fill="navySolid" i={6} />
      </g>
      <D d={questionMark(150, 62)} c="coral" w={2.5} i={7} />
      <F i={8}>
        <circle cx={151} cy={94} r={2.2} fill={STROKE.coral} />
      </F>
    </Frame>
  )
}

function Design() {
  return (
    <Frame label="A wireframe board with sticky notes beside a box-and-arrow data model sketch">
      <D d={rect(12, 12, 216, 136, 6)} c="faint" fill="white" i={0} />
      <g transform="translate(24 26) rotate(-4)">
        <D d={rect(0, 0, 42, 38, 2)} c="yellow" fill="yellow" i={1} />
        <D d={lines(7, 11, 28, 3, 8)} c="yellow" w={1.5} i={2} />
      </g>
      <g transform="translate(68 34) rotate(3)">
        <D d={rect(0, 0, 42, 38, 2)} c="coral" fill="coral" i={2} />
        <D d={lines(7, 11, 28, 3, 8)} c="coral" w={1.5} i={3} />
      </g>
      <g transform="translate(36 82) rotate(2)">
        <D d={rect(0, 0, 42, 38, 2)} c="blue" fill="blue" i={3} />
        <D d={lines(7, 11, 28, 3, 8)} c="blue" w={1.5} i={4} />
      </g>
      <D d="M118 30V132" c="faint" w={1.5} i={3} />
      <D d={rect(128, 28, 38, 24, 3)} c="navy" fill="white" i={4} />
      <D d="M128 38H166" c="navy" w={1.5} i={5} />
      <D d={rect(178, 28, 38, 24, 3)} c="navy" fill="white" i={5} />
      <D d="M178 38H216" c="navy" w={1.5} i={6} />
      <D d={rect(152, 98, 44, 26, 3)} c="navy" fill="white" i={6} />
      <D d="M152 108H196" c="navy" w={1.5} i={7} />
      <D d={arrow(166, 40, 177, 40)} c="blue" w={1.5} i={6} />
      <D d={arrow(147, 53, 163, 97)} c="blue" w={1.5} i={7} />
      <D d={arrow(197, 53, 185, 97)} c="blue" w={1.5} i={8} />
      <D
        d="M144 94C146 84 190 82 204 92C212 102 200 130 174 130C150 131 138 118 142 104C144 98 150 92 160 90"
        c="coral"
        w={2}
        i={9}
      />
    </Frame>
  )
}

function Build() {
  return (
    <Frame label="A database stack feeding a small dashboard whose blocks click into place">
      <D d="M22 38V112C22 123 82 123 82 112V38" c="navy" fill="blue" i={0} />
      <D d="M22 62C22 73 82 73 82 62" c="navy" w={1.5} i={1} />
      <D d="M22 88C22 99 82 99 82 88" c="navy" w={1.5} i={2} />
      <D d="M22 38C22 27 82 27 82 38C82 49 22 49 22 38Z" c="navy" fill="white" i={0} />
      <D d={arrow(90, 76, 119, 76, 6)} c="coral" w={2} i={4} />
      <D d={rect(126, 28, 102, 104, 6)} c="navy" fill="white" i={3} />
      <D d="M126 44H228" c="navy" w={1.5} i={4} />
      <F i={5} dy={-8}>
        <path
          d={rect(134, 52, 46, 34, 3)}
          fill={FILL.teal}
          stroke={STROKE.teal}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d="M142 80V70M151 80V62M160 80V68M169 80V58"
          fill="none"
          stroke={STROKE.teal}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </F>
      <F i={6} dy={-8}>
        <path
          d={rect(186, 52, 34, 34, 3)}
          fill={FILL.coral}
          stroke={STROKE.coral}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d="M203 69V58A11 11 0 0 1 213.5 72.5Z"
          fill={STROKE.coral}
          stroke={STROKE.coral}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d="M203 69L213.5 72.5A11 11 0 1 1 203 58"
          fill="none"
          stroke={STROKE.coral}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </F>
      <F i={7} dy={-8}>
        <path
          d={rect(134, 94, 86, 30, 3)}
          fill={FILL.blue}
          stroke={STROKE.blue}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d="M134 104H220M134 114H220M162 94V124"
          fill="none"
          stroke={STROKE.blue}
          strokeWidth={1.5}
        />
      </F>
    </Frame>
  )
}

function Adopt() {
  return (
    <Frame label="Three colleagues around a chart, reviewing it together, with a tick of approval">
      <D d={rect(78, 16, 84, 66, 5)} c="navy" fill="white" i={0} />
      <D d="M94 68V58M108 68V46M122 68V52M136 68V34" c="blue" w={5} i={1} />
      <D d="M90 70H148" c="faint" w={1.5} i={1} />
      <D d="M50 94C58 84 68 82 82 80" c="faint" w={1.5} i={2} />
      <D d="M190 94C182 84 172 82 158 80" c="faint" w={1.5} i={2} />
      <Person x={46} y={104} c="blue" i={2} />
      <Person x={120} y={106} c="teal" i={3} />
      <Person x={194} y={104} c="coral" i={4} />
      <D d={circle(158, 22, 13)} c="teal" fill="tealSolid" i={6} />
      <D d="M151.5 22.5L156.5 27.5L165 17" c="white" w={2.5} i={7} />
    </Frame>
  )
}

function Quantitative() {
  const tops = [104, 90, 96, 70, 52]
  return (
    <Frame label="A bar chart with one highlighted bar and a rising trend line">
      <D d="M28 18V132H218" c="faint" i={0} />
      {tops.map((top, k) => (
        <D
          key={top}
          d={rect(44 + k * 36, top, 24, 132 - top, 2)}
          c={k === 3 ? 'teal' : 'blue'}
          fill={k === 3 ? 'tealSolid' : 'blue'}
          i={1 + k}
        />
      ))}
      <D d={arrow(38, 98, 214, 40, 6)} c="coral" w={2.5} i={6} />
    </Frame>
  )
}

function Qualitative() {
  const rows = [
    { y: 18, c: 'blue' as const },
    { y: 62, c: 'teal' as const },
    { y: 106, c: 'coral' as const },
  ]
  const sources = [24, 62, 100]
  return (
    <Frame label="Speech bubbles being sorted into three tagged clusters">
      {sources.map((y, k) => (
        <g key={y}>
          <D d={bubble(14, y, 56, 26)} c="navy" fill="white" i={k} />
          <D d={lines(23, y + 9, 38, 2, 7)} c="faint" w={1.5} i={k + 1} />
        </g>
      ))}
      <D d={arrow(78, 37, 110, 31)} c="faint" w={1.5} i={3} />
      <D d={arrow(78, 75, 110, 119)} c="faint" w={1.5} i={4} />
      <D d={arrow(78, 113, 110, 75)} c="faint" w={1.5} i={5} />
      {rows.map(({ y, c }, k) => (
        <g key={y}>
          <D d={rect(118, y, 40, 12, 6)} c={c} fill={`${c}Solid`} i={4 + k} />
          <D d={bubble(118, y + 18, 46, 18)} c={c} fill={c} i={5 + k} />
          <D d={bubble(172, y + 18, 46, 18)} c={c} fill={c} i={6 + k} />
        </g>
      ))}
    </Frame>
  )
}

function Interpretation() {
  const pts: Array<[number, number]> = [
    [36, 112],
    [70, 100],
    [104, 106],
    [138, 62],
    [172, 78],
    [206, 50],
  ]
  return (
    <Frame label="A line chart with one point circled by hand, and a question mark turning into an exclamation mark">
      <D d="M24 18V134H222" c="faint" i={0} />
      <D
        d={`M${pts.map(([x, y]) => `${x} ${y}`).join('L')}`}
        c="blue"
        w={2.5}
        i={1}
      />
      {pts.map(([x, y], k) => (
        <F key={x} i={2 + k * 0.5}>
          <circle cx={x} cy={y} r={3} fill={STROKE.white} stroke={STROKE.blue} strokeWidth={2} />
        </F>
      ))}
      <D
        d="M122 60C123 44 152 42 154 60C156 76 130 80 125 66C122 58 128 50 140 47"
        c="coral"
        w={2.5}
        i={6}
      />
      <D d={questionMark(46, 26)} c="navy" i={7} />
      <F i={8}>
        <circle cx={47} cy={58} r={1.9} fill={STROKE.navy} />
      </F>
      <D d={arrow(66, 38, 92, 38)} c="faint" w={1.5} i={8} />
      <D d="M110 24V44" c="teal" w={2.5} i={9} />
      <F i={10}>
        <circle cx={110} cy={54} r={2.2} fill={STROKE.teal} />
      </F>
    </Frame>
  )
}

function Visualisation() {
  return (
    <Frame label="A messy table turning into a clean pie chart and bar chart">
      <g transform="rotate(-3 56 80)">
        <D d={rect(14, 30, 86, 100, 3)} c="faint" fill="white" i={0} />
        <D d="M14 52H100M14 66H100M14 90H100M14 108H100" c="faint" w={1.5} i={1} />
        <D d="M44 30L47 130M74 30L72 130" c="faint" w={1.5} i={2} />
      </g>
      <F i={3}>
        <path fill="none" d="M20 40H36M52 58H66M20 76H34M78 96H92M50 114H68" stroke={STROKE.navy} strokeWidth={2} strokeLinecap="round" />
        <path fill="none" d="M78 40H92" stroke={STROKE.coral} strokeWidth={2} strokeLinecap="round" />
        <path fill="none" d="M20 96H38" stroke={STROKE.coral} strokeWidth={2} strokeLinecap="round" />
      </F>
      <D d={arrow(108, 80, 132, 80, 6)} c="coral" w={2.5} i={4} />
      <D d="M172 64L172 36A28 28 0 0 1 193.4 82Z" c="blue" fill="blue" i={5} />
      <D d="M172 64L193.4 82A28 28 0 0 1 145.7 73.6Z" c="teal" fill="teal" i={6} />
      <D d="M172 64L145.7 73.6A28 28 0 0 1 172 36Z" c="coral" fill="coral" i={7} />
      <D d="M140 132H210" c="faint" w={1.5} i={7} />
      <D d="M148 132V118H160V132M166 132V104H178V132M184 132V112H196V132" c="blue" w={1.5} i={8} />
    </Frame>
  )
}

function Communication() {
  return (
    <Frame label="A slide with a headline and chart, with an arrow out to an audience">
      <D d={rect(12, 22, 118, 86, 5)} c="navy" fill="white" i={0} />
      <D d="M74 108V122M56 122H92" c="faint" i={1} />
      <D d={rect(24, 34, 58, 8, 2)} c="navy" fill="navySolid" i={1} />
      <D d="M24 50H60" c="faint" w={1.5} i={2} />
      <D d="M28 95V74M46 95V64M64 95V80M100 95V70" c="blue" w={9} i={3} />
      <D d="M82 95V54" c="teal" w={9} i={4} />
      <D d="M24 100H112" c="faint" w={1.5} i={3} />
      <D d={arrow(138, 64, 162, 64, 6)} c="coral" w={2.5} i={5} />
      {[40, 94].map((y, r) =>
        [176, 198, 220].map((x, k) => (
          <Person
            key={`${x}-${y}`}
            x={x}
            y={y}
            c={k === 1 ? 'teal' : 'blue'}
            i={6 + r + k}
            s={0.62}
          />
        )),
      )}
    </Frame>
  )
}

const VISUALS: Record<VisualName, () => ReactElement> = {
  understand: Understand,
  design: Design,
  build: Build,
  adopt: Adopt,
  quantitative: Quantitative,
  qualitative: Qualitative,
  interpretation: Interpretation,
  visualisation: Visualisation,
  communication: Communication,
}

/* On navy the drawings keep their colour logic: every hue they use is a
   token, so re-pointing the tokens inside the wrapper swaps the palette for
   the lifted one, boards become a translucent white and ink becomes white. */
const ON_DARK = {
  '--gk-navy': 'var(--gk-white)',
  '--gk-ink': 'var(--gk-white)',
  '--gk-blue': 'var(--gk-blue-lift)',
  '--gk-teal': 'var(--gk-teal-lift)',
  '--gk-coral': 'var(--gk-coral-lift)',
  '--gk-yellow-deep': 'var(--gk-yellow)',
  '--hairline-strong': 'rgb(255 255 255 / 0.35)',
  '--gk-white': 'rgb(255 255 255 / 0.10)',
  '--gk-blue-tint': 'rgb(143 168 232 / 0.28)',
  '--gk-teal-tint': 'rgb(95 201 186 / 0.28)',
  '--gk-coral-tint': 'rgb(240 165 140 / 0.28)',
  '--gk-yellow-tint': 'rgb(234 196 82 / 0.28)',
} as CSSProperties

export function ProgramVisual({
  name,
  className,
  onDark = false,
}: {
  name: VisualName
  className?: string
  onDark?: boolean
}) {
  const reduced = useReducedMotion()
  const Visual = VISUALS[name]
  return (
    <div className={className} style={onDark ? ON_DARK : undefined}>
      <ReducedContext.Provider value={reduced}>
        <Visual />
      </ReducedContext.Provider>
    </div>
  )
}
