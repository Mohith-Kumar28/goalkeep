import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { whyWeExist } from '@/content/homepage'
import { cn } from '@/lib/utils'

/**
 * Why Goalkeep exists.
 *
 * A port of the approved artifact, "Goalkeep Why we exist (blue variation)",
 * which Rumit built from the funder deck and Aditya's framing: more money is
 * flowing into Indian philanthropy, almost none of it into the systems that
 * turn data into decisions, and Goalkeep sits in that gap.
 *
 * Markup, keyframes (styles/why-we-exist.css), timings, copy and colours are
 * the artifact's own. What changed is only what a fixed 1440px mock can't do
 * on a real page:
 *
 *   · The two diagram panels are drawn at the artifact's 680px and scaled to
 *     whatever width the panel actually has (ScaleBox), so every arrow, label
 *     and the loop's morph stay where the artifact put them.
 *   · Below lg the steps stack above the panel, and the decisions panel stacks
 *     its grid above its copy.
 *   · Nothing plays, and autoplay doesn't start, until the band is on screen.
 *
 * Autoplay advances on the artifact's per-panel durations and stops for good
 * the moment a visitor picks a step.
 */

/* The artifact's palette. Local to this section: it is the approved
   reference, and it isn't identical to the site tokens. */
const C = {
  ground: '#F7F5EF',
  ink: '#3F3D3E',
  ink2: '#4A4849',
  ink3: '#5F5C5D',
  muted: '#6B6869',
  navy: '#2F4486',
  panelNavy: '#2C3F86',
  panelPink: '#F6E2DF',
  line: '#DEDAD0',
  yellow: '#E6DE6A',
  coral: '#C96B58',
  coralSoft: '#E09A8C',
  blush: '#F5E3E0',
  bar: '#8FA3D6',
}

const DURATIONS = [11000, 11500, 17000, 20000]
const PANEL_BG = [C.panelNavy, C.panelPink, '#FFFFFF', C.panelNavy]

export function WhyWeExist() {
  const { chapters } = whyWeExist
  const ref = useRef<HTMLElement>(null)
  const [live, setLive] = useState(false)
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState(-1)
  const [picked, setPicked] = useState(false)
  // Bumped on every change so the panel remounts and its CSS animations
  // restart, even when the same panel is picked again.
  const [epoch, setEpoch] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true)
          setEpoch((e) => e + 1)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Autoplay.
  useEffect(() => {
    if (!live || picked) return
    const id = window.setTimeout(() => {
      setPrev(active)
      setActive((active + 1) % chapters.length)
      setEpoch((e) => e + 1)
    }, DURATIONS[active])
    return () => window.clearTimeout(id)
  }, [live, picked, active, epoch, chapters.length])

  // The clock the counting figures read (₹27, 5%). Runs for the first six
  // seconds of each panel, like the artifact's.
  useEffect(() => {
    if (!live) return
    const start = performance.now()
    let raf = 0
    const step = () => {
      const t = performance.now() - start
      setElapsed(t)
      if (t < 6000) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [live, epoch])

  const choose = (index: number) => {
    setPrev(active)
    setActive(index)
    setPicked(true)
    setEpoch((e) => e + 1)
  }

  const ease = (from: number, dur: number) => {
    const x = Math.min(1, Math.max(0, (elapsed - from) / dur))
    return 1 - Math.pow(1 - x, 3)
  }
  const showProgress = !picked
  const progressDur = `${(DURATIONS[active] / 1000 - 0.4).toFixed(1)}s`

  return (
    <section
      ref={ref}
      id="why-we-exist"
      className={cn('gk-why relative py-20 md:pt-[104px] md:pb-24', live && 'is-live')}
      style={{ background: C.ground, color: C.ink }}
      aria-labelledby="why-heading"
    >
      <div className="shell flex flex-col gap-12 md:gap-16">
        <header className="flex max-w-[1140px] flex-col gap-6">
          <p
            className="text-[length:var(--fs-sm)] font-extrabold tracking-[0.16em] uppercase"
            style={{ color: C.navy }}
          >
            {whyWeExist.eyebrow}
          </p>
          <h2
            id="why-heading"
            className="m-0 text-[length:clamp(2.125rem,4.2vw,3.75rem)] leading-[1.12] tracking-[-0.02em]"
            style={{ color: C.ink }}
          >
            <span className="block font-normal">{whyWeExist.headlineLead}</span>
            <span className="block font-bold italic">{whyWeExist.headlineEm}</span>
          </h2>
          <p
            className="m-0 max-w-[940px] text-[length:clamp(1.125rem,1.6vw,1.375rem)] leading-[1.5]"
            style={{ color: C.ink2 }}
          >
            {whyWeExist.lead}
          </p>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
          <nav
            aria-label="Why we exist, four steps"
            className="flex w-full shrink-0 flex-col gap-3 lg:w-[360px] xl:w-[400px]"
          >
            {chapters.map((chapter, index) =>
              index === active ? (
                <button
                  key={chapter.num}
                  type="button"
                  onClick={() => choose(index)}
                  aria-current="step"
                  className="relative flex w-full flex-col gap-2.5 overflow-hidden rounded-[20px] bg-white px-6 pt-6 pb-6 text-left md:px-7 md:pt-7"
                  style={{ border: `2px solid ${C.navy}`, color: C.ink }}
                >
                  <span className="flex items-baseline gap-3.5">
                    <span
                      className="text-sm font-extrabold tracking-[0.12em]"
                      style={{ color: C.navy }}
                    >
                      {chapter.num}
                    </span>
                    <span className="text-[length:clamp(1.375rem,2vw,1.625rem)] font-black">
                      {chapter.title}
                    </span>
                  </span>
                  <span
                    key={epoch}
                    className="gk-up mt-1 block text-[17px] leading-[1.55] font-normal"
                    style={{ color: C.ink2, animationDelay: '0.1s' }}
                  >
                    {chapter.body}
                  </span>
                </button>
              ) : (
                <button
                  key={chapter.num}
                  type="button"
                  onClick={() => choose(index)}
                  className="flex min-h-16 w-full items-center justify-between gap-4 rounded-[20px] bg-transparent px-6 py-[18px] text-left transition-colors hover:border-[#C9C4B8] md:px-7"
                  style={{ border: `2px solid ${C.line}`, color: C.ink }}
                >
                  <span className="flex items-baseline gap-3.5">
                    <span
                      className="text-sm font-extrabold tracking-[0.12em]"
                      style={{ color: C.muted }}
                    >
                      {chapter.num}
                    </span>
                    <span className="text-xl font-extrabold">{chapter.title}</span>
                  </span>
                  <span
                    className="hidden text-right text-sm font-bold sm:inline"
                    style={{ color: C.ink3 }}
                  >
                    {chapter.stat}
                  </span>
                </button>
              ),
            )}
          </nav>

          <div className="flex min-w-0 grow flex-col gap-4">
            <div
              className="relative box-border overflow-hidden rounded-[28px] px-5 py-8 md:px-12 md:py-11 lg:h-[620px]"
              style={{
                background: PANEL_BG[active],
                border: `1px solid ${PANEL_BG[active]}`,
                transition: 'background .5s ease',
              }}
            >
              <div key={epoch} className="h-full">
                {active === 0 && (
                  <MoneyPanel
                    money={Math.round(27 * ease(1000, 2400))}
                    progress={showProgress ? progressDur : null}
                  />
                )}
                {active === 1 && (
                  <DecisionsPanel
                    pct={Math.round(5 * ease(2900, 1200))}
                    progress={showProgress ? progressDur : null}
                  />
                )}
                {active === 2 && (
                  <LoopPanel morph={prev === 1} progress={showProgress ? progressDur : null} />
                )}
                {active === 3 && <LayerPanel progress={showProgress ? progressDur : null} />}
              </div>
            </div>
            <div className="flex min-h-12 items-center justify-between px-2">
              <span className="text-sm font-extrabold tracking-[0.12em]" style={{ color: C.muted }}>
                {chapters[active].num} / {String(chapters.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Shared pieces
   ------------------------------------------------------------------------- */

function Wipes({ first }: { first?: string }) {
  return (
    <>
      <div className="gk-wipe" style={first ? { background: first } : undefined} />
      <div className="gk-wipe2" />
    </>
  )
}

function Progress({ duration, delay = '0.8s' }: { duration: string | null; delay?: string }) {
  if (!duration) return null
  return <div className="gk-progress" style={{ animationDelay: delay, animationDuration: duration }} />
}

/**
 * Draws its children at the artifact's own size and scales them down to the
 * width available, so the diagrams keep their exact geometry.
 */
function ScaleBox({
  width,
  height,
  children,
}: {
  width: number
  height: number
  children: ReactNode
}) {
  const outer = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const node = outer.current
    if (!node) return
    const measure = () => setScale(Math.min(1, node.clientWidth / width))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [width])

  return (
    <div ref={outer} className="relative w-full" style={{ height: height * scale }}>
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

const px = (n: number) => `${n.toFixed(2)}s`

/* ---------------------------------------------------------------------------
   01 — The money
   ------------------------------------------------------------------------- */

const BAR_LABELS = ['FY25', 'FY26', 'FY27', 'FY28', 'FY29', 'FY30']
const AMOUNTS = BAR_LABELS.map((_, i) => 27 * Math.pow(1.1, i))
const TOP = AMOUNTS[AMOUNTS.length - 1]
const BARS = AMOUNTS.map((v, i) => ({
  value: `₹${Math.round(v * 10) / 10}L Cr`,
  label: BAR_LABELS[i],
  h: `${Math.round((v / TOP) * 220)}px`,
  fill: i === AMOUNTS.length - 1 ? C.blush : C.bar,
  delay: px(2.3 + i * 0.2),
  labelDelay: px(3.2 + i * 0.2),
}))

function MoneyPanel({ money, progress }: { money: number; progress: string | null }) {
  const { spend } = whyWeExist
  return (
    <>
      <Wipes />
      <Progress duration={progress} />
      <div className="flex h-full flex-col gap-9">
        <div className="flex flex-col gap-1.5">
          <div
            className="gk-up text-[13px] font-extrabold tracking-[0.14em] uppercase"
            style={{ color: '#AAB6DE', animationDelay: '0.9s' }}
          >
            {spend.label}
          </div>
          <div
            className="gk-reveal text-[length:clamp(2.75rem,6.4vw,5.25rem)] leading-[1.05] font-black tracking-[-0.02em] text-white tabular-nums"
            style={{ animationDelay: '1s' }}
          >
            ₹{money} lakh crore
          </div>
          <div
            className="gk-up text-[length:clamp(1.0625rem,1.5vw,1.25rem)] font-semibold"
            style={{ color: '#DDE3F4', animationDelay: '1.8s' }}
          >
            {spend.sub}
          </div>
        </div>

        <div className="flex grow flex-col gap-3.5">
          <div className="flex items-center justify-between gap-4">
            <div
              className="gk-pop shrink-0 rounded-full px-3.5 py-1.5 text-sm font-black"
              style={{ background: C.yellow, color: C.ink, animationDelay: '4.6s' }}
            >
              {spend.pill}
            </div>
          </div>
          <div className="relative flex h-[180px] items-end gap-2 [--why-bar-scale:0.78] md:h-[236px] md:gap-[22px] md:[--why-bar-scale:1]">
            {BARS.map((bar) => (
              <div key={bar.label} className="flex h-full grow basis-0 flex-col items-center justify-end gap-2">
                <span
                  className="gk-pop hidden text-sm font-extrabold whitespace-nowrap text-white sm:block"
                  style={{ animationDelay: bar.labelDelay }}
                >
                  {bar.value}
                </span>
                <div
                  className="gk-grow w-full rounded-t-[10px]"
                  style={{
                    height: `calc(${bar.h} * var(--why-bar-scale, 1))`,
                    background: bar.fill,
                    animationDelay: bar.delay,
                  }}
                />
              </div>
            ))}
          </div>
          <div
            className="gk-line -mt-3.5 h-0.5"
            style={{ background: C.bar, animationDelay: '2.1s' }}
          />
          <div className="flex gap-2 md:gap-[22px]">
            {BARS.map((bar) => (
              <span
                key={bar.label}
                className="gk-fade grow basis-0 text-center text-[13px] font-bold"
                style={{ color: '#AAB6DE', animationDelay: bar.delay }}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>
        <div className="gk-fade text-xs" style={{ color: '#92A0CE', animationDelay: '5s' }}>
          {spend.note}
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------------------
   02 — The decisions
   ------------------------------------------------------------------------- */

const LIT = [7, 23, 48, 66, 91]
const SQUARES = Array.from({ length: 100 }, (_, i) => {
  const r = Math.floor(i / 10)
  const c = i % 10
  const pop = px(0.9 + (r + c) * 0.05)
  const k = LIT.indexOf(i)
  if (k >= 0)
    return { cls: 'gk-sq-lit', delay: `${pop}, ${px(2.9 + k * 0.2)}, ${px(4.4 + k * 0.2)}` }
  return { cls: 'gk-sq', delay: pop }
})

/** The artifact's hand-drawn ring, reused around the 5% and in the morph. */
const RING =
  'M28 78 C18 30 120 8 186 34 C220 50 206 104 128 116 C62 124 20 104 24 70 C28 44 70 26 104 24'

function DecisionsPanel({ pct, progress }: { pct: number; progress: string | null }) {
  const d = whyWeExist.decisions
  return (
    <>
      <Wipes first={C.panelNavy} />
      <Progress duration={progress} />
      <div className="flex h-full flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
        <div className="grid w-full max-w-[400px] shrink-0 grid-cols-10 gap-1.5 md:gap-2">
          {SQUARES.map((sq, i) => (
            <div
              key={i}
              className={cn(sq.cls, 'aspect-[1.025] rounded-[7px] md:aspect-auto md:h-8')}
              style={{ background: '#E7CFCB', animationDelay: sq.delay }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[18px]">
          <div className="relative flex h-[120px] w-[200px] items-center justify-center">
            <svg
              width="220"
              height="130"
              viewBox="0 0 220 130"
              className="absolute top-[-5px] left-[-10px]"
              aria-hidden="true"
            >
              <path
                className="gk-drawslow"
                pathLength={1}
                d={RING}
                fill="none"
                stroke={C.coral}
                strokeWidth={6}
                strokeLinecap="round"
                style={{ animationDelay: '4.6s' }}
              />
            </svg>
            <span
              className="gk-pop relative text-[96px] leading-none font-black tabular-nums"
              style={{ color: C.ink, animationDelay: '2.8s' }}
            >
              {pct}%
            </span>
          </div>
          <div
            className="gk-up text-2xl leading-[1.3] font-extrabold"
            style={{ color: C.ink, animationDelay: '4.2s' }}
          >
            {d.claim}
          </div>
          <div
            className="gk-up text-[17px] leading-[1.5]"
            style={{ color: C.ink2, animationDelay: '4.6s' }}
          >
            {d.support}
          </div>
          <div
            className="gk-up flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-bold"
            style={{ color: C.ink2, animationDelay: '5s' }}
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="size-3.5 rounded" style={{ background: C.coral }} />
              Data-driven
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="size-3.5 rounded" style={{ background: '#E7CFCB' }} />
              Intuition-led
            </span>
          </div>
          <div className="gk-fade text-xs" style={{ color: '#8A7C79', animationDelay: '5.4s' }}>
            {d.note}
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------------------
   03 — The loop
   ------------------------------------------------------------------------- */

const GHOSTS = Array.from({ length: 100 }, (_, i) => {
  const r = Math.floor(i / 10)
  const c = i % 10
  return {
    fill: LIT.includes(i) ? 'transparent' : '#E7CFCB',
    delay: `${((18 - r - c) * 0.015).toFixed(3)}s`,
  }
})

/* The five lit squares of the decisions grid, each travelling to become one
   of the loop's boxes. Offsets in the artifact's 680px frame. */
const MORPHS: Array<{ left: number; top: number; dx: number; dy: number; sx: number; sy: number }> = [
  { left: 285.6, top: 70, dx: 38.0, dy: -40.0, sx: 6.4, sy: 2.88 },
  { left: 326.4, top: 230, dx: 224.2, dy: -26.0, sx: 6.4, sy: 3.38 },
  { left: 244.8, top: 310, dx: 78.8, dy: 62.0, sx: 6.4, sy: 3.25 },
  { left: 122.4, top: 150, dx: -25.8, dy: 54.0, sx: 6.4, sy: 2.88 },
]

function LoopPanel({ morph, progress }: { morph: boolean; progress: string | null }) {
  const lp = morph
    ? { cls: 'gk-fade', c: '0.95s', r: '0.95s', e: '0.95s', l: '0.95s' }
    : { cls: 'gk-pop', c: '1s', r: '2.7s', e: '3.9s', l: '5.4s' }
  const decisions = whyWeExist.decisions

  return (
    <>
      {!morph && <Wipes first={C.panelNavy} />}
      <Progress duration={progress} />
      <div className="relative flex h-full flex-col gap-6 md:gap-10">
        <ScaleBox width={680} height={440}>
          {morph && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 z-[5] h-[532px] w-[680px]"
            >
              <div className="absolute top-[70px] left-0 grid w-[400px] grid-cols-10 gap-2">
                {GHOSTS.map((g, i) => (
                  <div
                    key={i}
                    className="gk-gridout h-8 rounded-[7px]"
                    style={{ background: g.fill, animationDelay: g.delay }}
                  />
                ))}
              </div>
              <div
                className="gk-out absolute top-0 left-[448px] flex h-[532px] w-[232px] flex-col justify-center gap-[18px]"
                style={{ animationDelay: '0s' }}
              >
                <div className="relative flex h-[120px] w-[200px] items-center justify-center">
                  <svg width="220" height="130" viewBox="0 0 220 130" className="absolute top-[-5px] left-[-10px]">
                    <path d={RING} fill="none" stroke={C.coral} strokeWidth={6} strokeLinecap="round" />
                  </svg>
                  <span className="relative text-[96px] leading-none font-black" style={{ color: C.ink }}>
                    5%
                  </span>
                </div>
                <div className="text-2xl leading-[1.3] font-extrabold" style={{ color: C.ink }}>
                  {decisions.claim}
                </div>
                <div className="text-[17px] leading-[1.5]" style={{ color: C.ink2 }}>
                  {decisions.support}
                </div>
              </div>
              {MORPHS.map((m, i) => (
                <div
                  key={i}
                  className="gk-morph"
                  style={
                    {
                      left: m.left,
                      top: m.top,
                      '--dx': `${m.dx}px`,
                      '--dy': `${m.dy}px`,
                      '--sx': m.sx,
                      '--sy': m.sy,
                      animationDelay: '0.05s',
                    } as CSSProperties
                  }
                />
              ))}
              <div
                className="gk-gridout absolute top-[430px] left-[40.8px] h-8 w-[32.8px] rounded-[7px]"
                style={{ background: C.coral, animationDelay: '0.1s' }}
              />
            </div>
          )}

          <svg
            width="680"
            height="440"
            viewBox="0 0 680 440"
            className="overflow-visible"
            style={{ fontFamily: 'inherit' }}
            role="img"
            aria-label="A broken loop: data collection feeds reporting requirements, which feed evaluation reports. The loop breaks before limited learning, and breaks again before it gets back to data collection."
          >
            <defs>
              <mask id="gkBreakMask" maskUnits="userSpaceOnUse" x="0" y="0" width="680" height="440">
                <path className="gk-draw" pathLength={1} d="M235 388 H113 V282" fill="none" stroke="#FFFFFF" strokeWidth={16} style={{ animationDelay: '4.1s', animationDuration: '1.4s' }} />
              </mask>
              <mask id="gkBreakMask2" maskUnits="userSpaceOnUse" x="0" y="0" width="680" height="440">
                <path className="gk-draw" pathLength={1} d="M113 174 V46 H219" fill="none" stroke="#FFFFFF" strokeWidth={16} style={{ animationDelay: '5.9s', animationDuration: '1.4s' }} />
              </mask>
            </defs>
            <path className="gk-draw" pathLength={1} d="M445 46 H567 V148" fill="none" stroke="#4765B3" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: '2.1s' }} />
            <polygon className="gk-pop" points="556,150 567,166 578,150" fill="#4765B3" style={{ animationDelay: '2.9s' }} />
            <path className="gk-draw" pathLength={1} d="M567 274 V388 H461" fill="none" stroke="#4765B3" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: '3.1s' }} />
            <polygon className="gk-pop" points="463,377 447,388 463,399" fill="#4765B3" style={{ animationDelay: '3.9s' }} />
            <path mask="url(#gkBreakMask)" d="M235 388 H113 V282" fill="none" stroke={C.coralSoft} strokeWidth={6} strokeDasharray="12 9" strokeLinecap="round" strokeLinejoin="round" />
            <polygon className="gk-pop" points="102,284 113,268 124,284" fill={C.coralSoft} style={{ animationDelay: '5.4s' }} />
            <rect className="gk-fade" x="162" y="374" width="26" height="28" fill="#FFFFFF" style={{ animationDelay: '5s', animationDuration: '.1s' }} />
            <g className="gk-fade" style={{ animationDelay: '5.2s' }}>
              <circle className="gk-burst" cx="174" cy="388" r="12" fill="none" stroke={C.coralSoft} strokeWidth={3} />
            </g>
            <path className="gk-shake" d="M160 402 L170 374 M178 402 L188 374" stroke="#C0604F" strokeWidth={4} strokeLinecap="round" style={{ animationDelay: '5s' }} />
            <text className="gk-up" x="152" y="412" textAnchor="middle" fontSize="13" fontWeight="900" fill="#A94F3F" style={{ animationDelay: '5.3s' }}>
              <tspan x="152" dy="0">The loop breaks</tspan>
              <tspan x="152" dy="17">here</tspan>
            </text>
            <path mask="url(#gkBreakMask2)" d="M113 174 V46 H219" fill="none" stroke={C.coralSoft} strokeWidth={6} strokeDasharray="12 9" strokeLinecap="round" strokeLinejoin="round" />
            <polygon className="gk-pop" points="217,35 233,46 217,57" fill={C.coralSoft} style={{ animationDelay: '7.2s' }} />
            <rect className="gk-fade" x="100" y="97" width="26" height="26" fill="#FFFFFF" style={{ animationDelay: '6.6s', animationDuration: '.1s' }} />
            <g className="gk-fade" style={{ animationDelay: '6.8s' }}>
              <circle className="gk-burst" cx="113" cy="110" r="12" fill="none" stroke={C.coralSoft} strokeWidth={3} />
            </g>
            <path className="gk-shake" d="M99 105 L127 95 M99 123 L127 113" stroke="#C0604F" strokeWidth={4} strokeLinecap="round" style={{ animationDelay: '6.6s' }} />
            <text className="gk-up" x="136" y="116" fontSize="13" fontWeight="900" fill="#A94F3F" style={{ animationDelay: '6.9s' }}>
              and again here
            </text>

            <LoopBox cls={lp.cls} delay={lp.c} x={235} y={0} w={210} h={92} title={['Data collection']} titleY={32} sub={['NGOs often collect data to', 'meet reporting needs']} subY={56} />
            <LoopBox cls={lp.cls} delay={lp.r} x={462} y={166} w={210} h={108} title={['Reporting', 'requirements']} titleY={194} sub={['Focus is on accountability,', 'not learning']} subY={238} />
            <LoopBox cls={lp.cls} delay={lp.e} x={235} y={336} w={210} h={104} title={['Evaluation reports']} titleY={364} sub={['Decisions are made based on', 'post-facto reports and', 'historical snapshots']} subY={388} />
            <LoopBox cls={lp.cls} delay={lp.l} x={8} y={174} w={210} h={92} title={['Limited learning']} titleY={206} sub={['Data is an administrative burden,', 'not a strategic asset']} subY={230} broken />

            <text className="gk-up" x="340" y="205" textAnchor="middle" fontSize="24" fontWeight="400" fill={C.navy} style={{ animationDelay: '0.8s' }}>
              Proving impact,
            </text>
            <text className="gk-up" x="340" y="240" textAnchor="middle" fontSize="24" fontWeight="700" fontStyle="italic" fill={C.navy} style={{ animationDelay: '4.3s' }}>
              not improving it.
            </text>
          </svg>
        </ScaleBox>
        <div className="gk-up text-[15px] leading-[1.5]" style={{ color: C.ink2, animationDelay: '8.6s' }}>
          {whyWeExist.loopCaption}
        </div>
      </div>
    </>
  )
}

function LoopBox({
  cls,
  delay,
  x,
  y,
  w,
  h,
  title,
  titleY,
  sub,
  subY,
  broken = false,
}: {
  cls: string
  delay: string
  x: number
  y: number
  w: number
  h: number
  title: Array<string>
  titleY: number
  sub: Array<string>
  subY: number
  broken?: boolean
}) {
  const cx = x + w / 2
  return (
    <g className={cls} style={{ animationDelay: delay }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="16"
        fill="#FFFFFF"
        stroke={broken ? C.coralSoft : C.navy}
        strokeWidth={2}
        strokeDasharray={broken ? '7 5' : undefined}
      />
      {title.map((line, i) => (
        <text key={line} x={cx} y={titleY + i * 20} textAnchor="middle" fontSize="17" fontWeight="900" fill={C.ink}>
          {line}
        </text>
      ))}
      {sub.map((line, i) => (
        <text key={line} x={cx} y={subY + i * 14} textAnchor="middle" fontSize="11.5" fill={C.ink3}>
          {line}
        </text>
      ))}
    </g>
  )
}

/* ---------------------------------------------------------------------------
   04 — The missing layer
   ------------------------------------------------------------------------- */

const O = 0.7 // the artifact's layerOffset, in seconds
const at = (s: number) => `${(O + s).toFixed(2)}s`

const INPUTS = [
  { label: 'Capital', y: 22, curve: 'M150 45 C185 45 180 190 213 190', d: 0.2, c: 1 },
  { label: 'Programs', y: 106, curve: 'M150 129 C185 129 180 210 213 210', d: 0.35, c: 1.1 },
  { label: 'Tools', y: 190, curve: 'M150 213 C185 213 180 230 213 230', d: 0.5, c: 1.2 },
  { label: 'Talent', y: 274, curve: 'M150 297 C185 297 180 250 213 250', d: 0.65, c: 1.3 },
]
const SYSTEMS_CURVE = 'M150 381 C185 381 180 270 213 270'
const HEX = '300,130 386.6,180 386.6,280 300,330 213.4,280 213.4,180'

const OUTCOMES = [
  { lead: 'Enhanced', word: 'Scale', y: 60, fill: '#C3CEEC', to: 0.88, grow: 2.3, fill2: 11.3, sx: 68 },
  { lead: 'Increased', word: 'Funding', y: 160, fill: '#9DACDC', to: 0.8, grow: 2.45, fill2: 12.1, sx: 67 },
  { lead: 'Improved', word: 'Efficiency', y: 260, fill: '#FFFFFF', to: 1, grow: 2.6, fill2: 12.9, sx: 67 },
  { lead: 'Measurable', word: 'Outcomes', y: 360, fill: '#EAEFFB', to: 0.94, grow: 2.75, fill2: 13.7, sx: 81 },
]

function LayerPanel({ progress }: { progress: string | null }) {
  return (
    <>
      <Wipes />
      <Progress duration={progress} delay="0.4s" />
      <div className="relative flex h-full flex-col gap-3.5">
        <ScaleBox width={680} height={460}>
          <svg
            width="680"
            height="460"
            viewBox="0 0 680 460"
            className="overflow-visible"
            style={{ fontFamily: 'inherit' }}
            role="img"
            aria-label="Capital, programs, tools and talent are in place, but systems are missing, so decision infrastructure is incomplete and outcomes are held back. Goalkeep brings the missing systems piece. Decision infrastructure completes and outcomes grow to full: enhanced scale, increased funding, improved efficiency and measurable outcomes."
          >
            {INPUTS.map((input) => (
              <path key={input.label} className="gk-draw" pathLength={1} d={input.curve} fill="none" stroke="#9DB0E6" strokeWidth={1.8} style={{ animationDelay: at(input.c) }} />
            ))}
            <path className="gk-draw" pathLength={1} d={SYSTEMS_CURVE} fill="none" stroke={C.yellow} strokeWidth={3} style={{ animationDelay: at(7.3), animationDuration: '.9s' }} />
            <path className="gk-comet" pathLength={1} d={SYSTEMS_CURVE} fill="none" stroke={C.yellow} strokeWidth={7} strokeLinecap="round" style={{ animationDelay: at(7.3) }} />
            {INPUTS.map((input) => (
              <path key={`c-${input.label}`} className="gk-comet" pathLength={1} d={input.curve} fill="none" stroke={C.yellow} strokeWidth={6} strokeLinecap="round" style={{ animationDelay: at(8.1) }} />
            ))}
            {INPUTS.map((input) => (
              <g key={`p-${input.label}`} className="gk-left" style={{ animationDelay: at(input.d) }}>
                <rect x="0" y={input.y} width="150" height="46" rx="23" fill={C.blush} stroke={C.panelNavy} strokeWidth={1.8} />
                <text x="75" y={input.y + 29} textAnchor="middle" fontSize="16" fontWeight="700" fill={C.ink}>
                  {input.label}
                </text>
              </g>
            ))}

            {/* The empty slot, and the incomplete hexagon. */}
            <g className="gk-fade" style={{ animationDelay: at(1.2) }}>
              <g className="gk-out" style={{ animationDelay: at(6.9) }}>
                <rect className="gk-slot" x="0" y="358" width="150" height="46" rx="23" fill="none" stroke={C.coralSoft} strokeWidth={2} />
                <rect x="0" y="358" width="150" height="46" rx="23" fill="#35498F" stroke={C.coralSoft} strokeWidth={2.2} strokeDasharray="6 5" />
                <text className="gk-blink" x="75" y="389" textAnchor="middle" fontSize="22" fontWeight="900" fill="#F0A292">
                  ?
                </text>
              </g>
            </g>
            <g className="gk-fade" style={{ animationDelay: at(1.4) }}>
              <g className="gk-out" style={{ animationDelay: at(8.6) }}>
                <polygon points={HEX} fill="none" stroke="#7E8CC2" strokeWidth={2} strokeDasharray="6 6" />
                <text x="300" y="202" textAnchor="middle" fontSize="18" fontWeight="900" fill="#9BA8D6">
                  Decision
                </text>
                <text x="300" y="224" textAnchor="middle" fontSize="18" fontWeight="900" fill="#9BA8D6">
                  Infrastructure
                </text>
                <text className="gk-blink" x="300" y="254" textAnchor="middle" fontSize="13" fontWeight="800" fill="#F0A292">
                  incomplete
                </text>
              </g>
            </g>

            {OUTCOMES.map((o) => (
              <g key={o.word}>
                <text className="gk-fade" x="432" y={o.y} fontSize="14" fontWeight="800" fill="#FFFFFF" style={{ animationDelay: at(o.fill2) }}>
                  {o.lead}
                </text>
                <g className="gk-up" style={{ animationDelay: at(o.grow) }}>
                  <text className="gk-shiftx" x="432" y={o.y} fontSize="14" fontWeight="800" fill="#FFFFFF" style={{ animationDelay: at(o.fill2), '--sx': `${o.sx}px` } as CSSProperties}>
                    {o.word}
                  </text>
                </g>
                <rect className="gk-growx" x="432" y={o.y + 10} width="248" height="26" rx="13" fill="#3C4F95" style={{ animationDelay: at(o.grow) }} />
                <rect className="gk-growx" x="432" y={o.y + 10} width="99" height="26" rx="13" fill="#56679F" style={{ animationDelay: at(o.grow + 0.2) }} />
                <rect className="gk-barup" x="432" y={o.y + 10} width="248" height="26" rx="13" fill={o.fill} style={{ animationDelay: at(o.fill2), '--to': o.to } as CSSProperties} />
              </g>
            ))}

            {/* Goalkeep's piece arrives. */}
            <g className="gk-flash" style={{ animationDelay: at(6.95) }}>
              <rect x="0" y="358" width="150" height="46" rx="23" fill="none" stroke={C.yellow} strokeWidth={4} />
            </g>
            <g className="gk-rise" style={{ animationDelay: at(4.4) }}>
              <rect x="0" y="358" width="150" height="46" rx="23" fill={C.yellow} />
              <text x="75" y="387" textAnchor="middle" fontSize="16" fontWeight="800" fill={C.ink}>
                Systems
              </text>
            </g>
            <g className="gk-up" style={{ animationDelay: at(7.2) }}>
              <path d="M150 430 C132 432 118 424 110 412" fill="none" stroke={C.blush} strokeWidth={2} strokeLinecap="round" />
              <polygon points="104,400 118,414 106,417" fill={C.blush} />
              <text x="158" y="436" fontFamily="var(--font-hand)" fontSize="24" fontWeight="600" fill={C.blush}>
                what Goalkeep brings
              </text>
            </g>

            {/* The hexagon completes. */}
            <polygon className="gk-spin" points="300,114 400.5,172 400.5,288 300,346 199.5,288 199.5,172" fill="none" stroke={C.coralSoft} strokeWidth={1.5} strokeDasharray="4 8" style={{ animationDelay: `${at(10.4)}, ${at(10.4)}` }} />
            <g className="gk-fade" style={{ animationDelay: at(10.6) }}>
              <polygon className="gk-halo" points={HEX} fill="#F6C9BE" />
            </g>
            <polygon className="gk-fade" points={HEX} fill="#FBE3DD" style={{ animationDelay: at(9.4) }} />
            <polygon className="gk-drawslow" pathLength={1} points={HEX} fill="none" stroke={C.coralSoft} strokeWidth={3} strokeLinejoin="round" style={{ animationDelay: at(8.6) }} />
            <text className="gk-pop" x="300" y="190" textAnchor="middle" fontSize="18" fontWeight="900" fill={C.ink} style={{ animationDelay: at(9.6) }}>
              Decision
            </text>
            <text className="gk-pop" x="300" y="212" textAnchor="middle" fontSize="18" fontWeight="900" fill={C.ink} style={{ animationDelay: at(9.7) }}>
              Infrastructure
            </text>
            {['CLEAR METRICS', 'INTUITIVE SYSTEMS', 'USABLE INSIGHTS'].map((line, i) => (
              <text key={line} className="gk-up" x="300" y={240 + i * 18} textAnchor="middle" fontSize="11.5" fontWeight="800" letterSpacing="0.8" fill="#6F6C6D" style={{ animationDelay: at(9.9 + i * 0.15) }}>
                {line}
              </text>
            ))}
          </svg>
        </ScaleBox>
        <div className="gk-up text-[15px] leading-[1.5]" style={{ color: '#DDE3F4', animationDelay: at(14.4) }}>
          {whyWeExist.layerCaption}
        </div>
      </div>
    </>
  )
}
