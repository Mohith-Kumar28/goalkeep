import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { tones } from '@/components/design'
import type { Tone } from '@/components/design'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/** One card that slides in from the right as it rises up the screen. A card in
 *  the right-hand column finishes a little later, so each row ripples in. */
function Slide({ children, late = false, wide = false }: { children: ReactNode; late?: boolean; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', late ? 'start 0.62' : 'start 0.72'] })
  const x = useTransform(scrollYProgress, [0, 1], [72, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  return (
    <motion.div ref={ref} className={wide ? 'ks-sc-cell ks-sc-wide' : 'ks-sc-cell'} style={reduced ? undefined : { x, opacity }}>
      {children}
    </motion.div>
  )
}

const Check = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#2F4A92" />
    <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Understand({ tone }: { tone: Tone }) {
  const ink = tones[tone].ink
  const notes = ['Which children are falling behind?', 'Where are volunteers needed next month?', 'What should funders see each quarter?']
  return (
    <>
      <p className="ks-sc-label" style={{ color: ink }}>What do we need our data to answer?</p>
      <div className="ks-sc-grid">
        {notes.map((note, i) => (
          <Slide key={note} late={i % 2 === 1} wide={i === 2}>
            <div className={i === 0 ? 'ks-sc-note is-picked' : 'ks-sc-note'}>
              {i === 0 && <span className="ks-sc-check"><Check /></span>}
              <p>{note}</p>
              <span className="ks-sc-lines" aria-hidden="true"><i /><i /></span>
            </div>
          </Slide>
        ))}
        <Slide wide>
          <div className="ks-sc-card">
            <p className="ks-sc-kicker" style={{ color: ink }}>Priority question</p>
            <p className="ks-sc-strong">Which children are falling behind, and how early can we tell?</p>
          </div>
        </Slide>
      </div>
    </>
  )
}

function Design({ tone }: { tone: Tone }) {
  const ink = tones[tone].ink
  const fields = ['Child name', 'Attendance today', 'Learning level']
  return (
    <>
      <p className="ks-sc-label" style={{ color: ink }}>Data entry</p>
      <div className="ks-sc-grid">
        {fields.map((field, i) => (
          <Slide key={field} late={i % 2 === 1}>
            <div className="ks-sc-card">
              <p className="ks-sc-field">{field}</p>
              <span className="ks-sc-input" aria-hidden="true" />
            </div>
          </Slide>
        ))}
        <Slide late>
          <div className="ks-sc-card ks-sc-save">
            <span>Save</span>
          </div>
        </Slide>
        <Slide wide>
          <div className="ks-sc-card">
            <p className="ks-sc-kicker" style={{ color: ink }}>Insight view · analysis</p>
            <div className="ks-sc-bars" aria-hidden="true">
              {[38, 56, 44, 78, 64].map((h, i) => (
                <i key={i} style={{ height: `${h}%`, opacity: i === 3 ? 1 : 0.45 }} />
              ))}
            </div>
            <p className="ks-sc-strong">The data shows us that student learning levels most increased when…</p>
          </div>
        </Slide>
      </div>
    </>
  )
}

function Build({ tone }: { tone: Tone }) {
  const ink = tones[tone].ink
  const tabs = ['Overview', 'Participants', 'Attendance', 'Reports']
  return (
    <>
      <p className="ks-sc-label" style={{ color: ink }}>your-programme.goalkeep</p>
      <div className="ks-sc-grid">
        {tabs.map((tab, i) => (
          <Slide key={tab} late={i % 2 === 1}>
            <div className={i === 0 ? 'ks-sc-card ks-sc-tab is-on' : 'ks-sc-card ks-sc-tab'}>
              <span className="ks-sc-dot" aria-hidden="true" />
              <p>{tab}</p>
            </div>
          </Slide>
        ))}
        <Slide wide>
          <div className="ks-sc-card">
            <p className="ks-sc-kicker" style={{ color: ink }}>Attendance by month</p>
            <svg viewBox="0 0 300 80" className="ks-sc-line" aria-hidden="true">
              <polyline points="0,62 50,50 100,56 150,36 200,42 250,20 300,12" fill="none" stroke="#2F9C8F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Slide>
      </div>
    </>
  )
}

function Adopt({ tone }: { tone: Tone }) {
  const ink = tones[tone].ink
  const people = [
    ['LD', 'Leadership'],
    ['PR', 'Programme'],
    ['FD', 'Field team'],
    ['ME', 'MEL'],
  ]
  return (
    <>
      <p className="ks-sc-label" style={{ color: ink }}>Team using the dashboard</p>
      <div className="ks-sc-grid">
        {people.map(([initials, person], i) => (
          <Slide key={person} late={i % 2 === 1}>
            <div className="ks-sc-card ks-sc-tab">
              <span className="ks-sc-avatar" style={{ background: tones[tone].bg, color: ink }}>{initials}</span>
              <p>{person}</p>
            </div>
          </Slide>
        ))}
        <Slide>
          <div className="ks-sc-card">
            <p className="ks-sc-kicker" style={{ color: '#6B6869' }}>Before</p>
            <p className="ks-sc-quote">“So many sheets. I don’t know which numbers to trust.”</p>
          </div>
        </Slide>
        <Slide late>
          <div className="ks-sc-card ks-sc-after" style={{ borderColor: ink }}>
            <p className="ks-sc-kicker" style={{ color: ink }}>After</p>
            <p className="ks-sc-quote">“The dashboard shows that our after-school study sessions increased student class participation by 22%.”</p>
          </div>
        </Slide>
      </div>
    </>
  )
}

const SCENES = [Understand, Design, Build, Adopt]

/** The phone version of each stage's illustration: real text in cards, two to a row. */
export function StageCards({ index, tone }: { index: number; tone: Tone }) {
  const Scene = SCENES[index]
  return (
    <div className="ks-sc" style={{ background: tones[tone].bg }}>
      <Scene tone={tone} />
    </div>
  )
}
