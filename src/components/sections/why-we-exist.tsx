import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { whyWeExist } from "@/content/homepage"
import { Annotate } from "@/components/primitives/doodles"
import { Reveal } from "@/components/primitives/reveal"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

/**
 * Why Goalkeep exists.
 *
 * Aditya's biggest gap in the 23 Sep review: the page says what Goalkeep does
 * and how, never why it needs to exist. Rumit's artifact answers it, and this
 * is that artifact built into the page, after the partner wall.
 *
 * Four steps on the left, one visual on the right. The steps advance on their
 * own and stop the moment someone picks one - after that the visitor is
 * driving. The heading is also the page's reference for heading weight: the
 * sentence set light, and only the turn of it in bold italic.
 */
const ADVANCE_MS = 7000

export function WhyWeExist() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [seen, setSeen] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const panels = whyWeExist.panels

  // Nothing advances until the band is on screen, or the first panel's
  // chart would have played out before anyone scrolled to it.
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!seen || pinned || reduced) return
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % panels.length),
      ADVANCE_MS
    )
    return () => window.clearTimeout(id)
  }, [seen, pinned, reduced, active, panels.length])

  const choose = (index: number) => {
    setPinned(true)
    setActive(index)
  }

  return (
    <section
      ref={ref}
      className="band relative"
      style={{ background: "var(--gk-beige)", color: "var(--fg-1)" }}
      aria-labelledby="why-heading"
    >
      <div className="shell">
        <Reveal>
          <p className="mb-5 text-[length:var(--fs-sm)] font-bold tracking-[0.14em] text-[var(--gk-navy)] uppercase">
            {whyWeExist.eyebrow}
          </p>
          <h2
            id="why-heading"
            className="h2 max-w-[30ch] text-[length:clamp(2rem,4vw,3.25rem)]"
          >
            {whyWeExist.headlineLead}
            <br />
            <em>
              <Circled text={whyWeExist.headlineEm} word={whyWeExist.headlineCircle} />
            </em>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[length:var(--fs-lg)] leading-relaxed">
            {whyWeExist.lead}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <ol
            className="flex min-w-0 flex-col gap-3 lg:col-span-5"
            role="tablist"
            aria-label="Why we exist"
          >
            {panels.map(({ value: panel }, index) => {
              const open = index === active
              return (
                <li key={panel.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={open}
                    aria-controls="why-panel"
                    onClick={() => choose(index)}
                    className={cn(
                      "w-full rounded-[var(--r-lg)] border bg-[var(--gk-white)] px-6 text-left md:px-8",
                      "transition-[border-color,padding,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)]",
                      open
                        ? "border-[var(--gk-navy)] py-7 shadow-[var(--shadow-sm)]"
                        : "border-[var(--gk-beige-deep)] bg-transparent py-5 hover:border-[var(--hairline-strong)]"
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="flex items-baseline gap-4">
                        <span className="text-[length:var(--fs-sm)] font-bold tracking-[0.08em] text-[var(--gk-navy)] tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[length:var(--fs-xl)] font-extrabold">
                          {panel.title}
                        </span>
                      </span>
                      {!open && (
                        <span className="hidden text-right text-[length:var(--fs-sm)] font-semibold text-[var(--fg-2)] sm:inline">
                          {panel.tag}
                        </span>
                      )}
                    </span>
                    <span
                      className="grid transition-[grid-template-rows,opacity] duration-[var(--dur-slow)] ease-[var(--ease-out)]"
                      style={{
                        gridTemplateRows: open ? "1fr" : "0fr",
                        opacity: open ? 1 : 0,
                      }}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-4 text-[length:var(--fs-base)] leading-relaxed">
                          {panel.body}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="min-w-0 lg:col-span-7">
            <div
              id="why-panel"
              role="tabpanel"
              data-ground="navy"
              className="relative h-[30rem] overflow-hidden rounded-[1.5rem] p-7 text-white md:h-[36rem] md:p-12"
              style={{ background: "var(--gk-navy)" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={panels[active].value.id}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <Visual id={panels[active].value.id} play={seen} />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-5 text-center text-[length:var(--fs-sm)] font-bold tracking-[0.12em] text-[var(--fg-2)] tabular-nums">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(panels.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Circles one word of a sentence, if the word is in it. */
function Circled({ text, word }: { text: string; word: string }) {
  const at = text.indexOf(word)
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <Annotate mark="oval" color="var(--gk-coral)" delay={0.6} inset="-12%">
        {word}
      </Annotate>
      {text.slice(at + word.length)}
    </>
  )
}

function Visual({ id, play }: { id: string; play: boolean }) {
  if (id === "money") return <SpendChart play={play} />
  if (id === "decisions") return <FiveInHundred />
  if (id === "loop") return <OpenLoop />
  return <MissingLayer />
}

const EASE = [0.22, 1, 0.36, 1] as const

function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[length:var(--fs-sm)] font-bold tracking-[0.12em] text-white/80 uppercase">
      {children}
    </p>
  )
}

/* 01 — the money. The artifact's chart: six years of spend, the last bar the
   one the whole panel is about. */
function SpendChart({ play }: { play: boolean }) {
  const { spend } = whyWeExist
  const max = Math.max(...spend.bars.map((bar) => bar.value))

  return (
    <div className="flex h-full flex-col">
      <PanelLabel>{spend.label}</PanelLabel>
      <p className="mt-3 text-[length:clamp(2.5rem,6vw,4.75rem)] leading-none font-black tracking-[-0.02em]">
        {spend.figure}
      </p>
      <p className="mt-4 text-[length:var(--fs-lg)] text-white/90">
        {spend.sub}
      </p>

      <span className="mt-8 inline-flex self-start rounded-full bg-[var(--gk-yellow)] px-4 py-1.5 text-[length:var(--fs-sm)] font-extrabold text-[var(--gk-ink)]">
        {spend.pill}
      </span>

      <div className="mt-4 flex h-[11rem] items-end gap-2 border-b border-white/25 md:h-[13rem] md:gap-4">
        {spend.bars.map((bar, index) => {
          const last = index === spend.bars.length - 1
          return (
            <div
              key={bar.year}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              <motion.span
                className="mb-2 hidden text-[length:var(--fs-xs)] font-extrabold whitespace-nowrap sm:block md:text-[length:var(--fs-sm)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: play ? 1 : 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
              >
                ₹{bar.value}L Cr
              </motion.span>
              <motion.span
                className="block w-full origin-bottom rounded-t-[10px]"
                style={{
                  height: `${(bar.value / max) * 78}%`,
                  background: last
                    ? "var(--gk-coral-tint)"
                    : "var(--gk-blue-lift)",
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: play ? 1 : 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + index * 0.1,
                  ease: EASE,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex gap-2 md:gap-4">
        {spend.bars.map((bar) => (
          <span
            key={bar.year}
            className="flex-1 text-center text-[length:var(--fs-xs)] font-bold text-white/75 md:text-[length:var(--fs-sm)]"
          >
            {bar.year}
          </span>
        ))}
      </div>
      <p className="mt-6 text-[length:var(--fs-xs)] text-white/65">
        {spend.note}
      </p>
    </div>
  )
}

/* 02 — the decisions. A hundred organisations; five of them light up. */
function FiveInHundred() {
  const lit = new Set([13, 38, 47, 72, 86])
  return (
    <div className="flex h-full flex-col">
      <PanelLabel>Organisations that act on their data</PanelLabel>
      <p className="mt-3 text-[length:clamp(2.5rem,6vw,4.75rem)] leading-none font-black tracking-[-0.02em]">
        5 in 100
      </p>
      <p className="mt-4 max-w-[36ch] text-[length:var(--fs-lg)] text-white/90">
        The rest collect it to report upward.
      </p>
      <div className="mt-8 grid max-w-[20rem] grid-cols-10 gap-2 md:gap-2.5">
        {Array.from({ length: 100 }, (_, i) => (
          <motion.span
            key={i}
            className="aspect-square rounded-full"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: 1,
              scale: 1,
              backgroundColor: lit.has(i)
                ? "var(--gk-yellow)"
                : "rgb(143 168 232 / 0.35)",
            }}
            transition={{
              duration: 0.3,
              delay: lit.has(i)
                ? 1.1 + [...lit].indexOf(i) * 0.12
                : (i % 10) * 0.02 + Math.floor(i / 10) * 0.03,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* 03 — the loop. Data goes up to the funder; the arrow back to the programme
   is the one that never finishes drawing. */
function OpenLoop() {
  const node =
    "absolute -translate-x-1/2 -translate-y-1/2 rounded-[var(--r-md)] px-4 py-2.5 text-center text-[length:var(--fs-sm)] font-extrabold whitespace-nowrap"
  return (
    <div className="flex h-full flex-col">
      <PanelLabel>Where the data goes</PanelLabel>
      <p className="mt-3 text-[length:clamp(2rem,4.6vw,3.5rem)] leading-[1.05] font-black tracking-[-0.02em]">
        Proving, not improving.
      </p>
      <div className="relative mt-8 aspect-[16/9] w-full max-w-[34rem] self-center">
        <svg
          viewBox="0 0 160 90"
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M40 70 C 40 30, 60 20, 80 20"
            stroke="var(--gk-blue-lift)"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          />
          <motion.path
            d="M80 20 C 100 20, 120 30, 120 70"
            stroke="var(--gk-blue-lift)"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
          />
          {/* The return leg: dashed, and it stops short. */}
          <motion.path
            d="M120 76 C 100 86, 60 86, 40 76"
            stroke="var(--gk-coral-lift)"
            strokeWidth="1.4"
            strokeDasharray="3 3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.55 }}
            transition={{ duration: 1.2, delay: 1.9, ease: EASE }}
          />
        </svg>
        <span
          className={node}
          style={{
            left: "25%",
            top: "78%",
            background: "var(--gk-white)",
            color: "var(--gk-navy)",
          }}
        >
          Programme data
        </span>
        <span
          className={node}
          style={{
            left: "50%",
            top: "22%",
            background: "var(--gk-yellow)",
            color: "var(--gk-ink)",
          }}
        >
          Report to funder
        </span>
        <span
          className={node}
          style={{
            left: "75%",
            top: "78%",
            background: "var(--gk-white)",
            color: "var(--gk-navy)",
          }}
        >
          Filed
        </span>
        <motion.span
          className="absolute top-[99%] left-1/2 -translate-x-1/2 text-[length:var(--fs-sm)] font-bold whitespace-nowrap text-[var(--gk-coral-lift)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          back into the programme?
        </motion.span>
      </div>
    </div>
  )
}

/* 04 — the missing layer. Money on top, data underneath, and the layer
   between them building itself in. */
function MissingLayer() {
  const layer =
    "flex items-center justify-between rounded-[var(--r-md)] px-5 py-4 text-[length:var(--fs-base)] font-extrabold"
  return (
    <div className="flex h-full flex-col">
      <PanelLabel>What's missing</PanelLabel>
      <p className="mt-3 text-[length:clamp(2rem,4.6vw,3.5rem)] leading-[1.05] font-black tracking-[-0.02em]">
        Decision infrastructure.
      </p>
      <div className="mt-9 flex max-w-[30rem] flex-col gap-3">
        <div className={layer} style={{ background: "rgb(255 255 255 / 0.1)" }}>
          Funding{" "}
          <span className="text-[length:var(--fs-sm)] font-semibold text-white/70">
            growing every year
          </span>
        </div>
        <div className="relative overflow-hidden rounded-[var(--r-md)] border-2 border-dashed border-white/35">
          <motion.div
            className="absolute inset-0 origin-left"
            style={{ background: "var(--gk-yellow)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
          />
          <motion.div
            className={cn(layer, "relative")}
            initial={{ color: "rgb(255 255 255 / 0.7)" }}
            animate={{ color: "var(--gk-ink)" }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            Systems for deciding{" "}
            <span className="text-[length:var(--fs-sm)] font-semibold">
              where Goalkeep works
            </span>
          </motion.div>
        </div>
        <div className={layer} style={{ background: "rgb(255 255 255 / 0.1)" }}>
          Data collected{" "}
          <span className="text-[length:var(--fs-sm)] font-semibold text-white/70">
            reports, evaluations
          </span>
        </div>
      </div>
    </div>
  )
}
