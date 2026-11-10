import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import flowSvg from '@/content/design/literacy-flow.svg?raw'
import { Reveal } from '@/components/primitives/reveal'
import { literacyContent } from '@/content/design/literacy'
import { useIsMobile } from '../program-snap/use-is-mobile'
import { useScrollLit } from '../program-snap/use-scroll-lit'
import { Rich } from './rich'
import { useAutoCycle } from '../program-snap/use-auto-cycle'

const { who } = literacyContent
const CHECK_MS = 1900

export function WhoSection() {
  return (
    <section className="dc-band ps-band" style={{ background: '#FFFFFF', paddingTop: 48, paddingBottom: 56 }}>
      <div
        className="dc-shell dc-who"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <Reveal>
          <NominateCard />
        </Reveal>
        <div>
          <Reveal>
            <p className="dc-eyebrow" style={{ color: '#176059' }}>
              {who.eyebrow}
            </p>
            <h2 className="dc-h2" style={{ maxWidth: '26ch' }}>
              <Rich html={who.heading} />
            </h2>
          </Reveal>
          <FitChecklist />
        </div>
      </div>
    </section>
  )
}

function NominateCard() {
  const { nominate } = who
  const [leader, mel] = nominate.people
  const [flow, setFlow] = useState<'idle' | 'playing'>('idle')
  const mobile = useIsMobile()
  const idleBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = idleBox.current
    if (!mobile || flow === 'playing' || !el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFlow('playing')
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mobile, flow])

  return (
    <div
      className="dc-surface ps-nom"
      style={{
        padding: '32px 30px 30px',
        borderRadius: 20,
        boxShadow: '0 18px 44px rgba(20,19,26,0.10)',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          color: '#176059',
        }}
      >
        {nominate.label}
      </p>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {nominate.title}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 36px minmax(0,1fr)',
          alignItems: 'start',
          marginTop: 26,
          textAlign: 'center',
        }}
      >
        <Nominee person={leader} />
        <span
          aria-hidden="true"
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#2F9C8F',
            marginTop: 48,
          }}
        >
          +
        </span>
        <Nominee person={mel} />
      </div>
      {flow === 'idle' ? (
        <div
          ref={idleBox}
          style={{
            marginTop: 14,
            minHeight: 168,
            borderRadius: 16,
            background: '#F3F9F8',
            border: '1.5px dashed #9FD3CB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <button type="button" className="dc-flow-btn ps-desk" onClick={() => setFlow('playing')}>
            <span className="dc-flow-btn-ic" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z" />
              </svg>
            </span>
            <span>{nominate.flowButton}</span>
          </button>
        </div>
      ) : (
        <div
          className="dc-slide-up"
          style={{
            marginTop: 14,
            minHeight: 168,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: flowSvg }} />
          <p
            style={{
              margin: '6px 0 0',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: 'rgba(20,19,26,0.6)',
            }}
          >
            {nominate.flowCaption}
          </p>
        </div>
      )}
      <p
        style={{
          margin: '18px 0 0',
          fontSize: 16,
          lineHeight: 1.55,
          color: 'rgba(20,19,26,0.8)',
        }}
      >
        {nominate.together}
      </p>
    </div>
  )
}

function Nominee({ person }: { person: (typeof who.nominate.people)[number] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <img
        src={person.photo.src}
        alt={person.photo.alt}
        className="dc-portrait"
        style={{ objectPosition: person.photo.position }}
      />
      <span
        style={{
          fontSize: 13,
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: 4,
          background: person.tagBg,
          color: person.tagInk,
        }}
      >
        {person.tag}
      </span>
      <span style={{ fontSize: 15, lineHeight: 1.45 }}>{person.body}</span>
    </div>
  )
}

function FitChecklist() {
  const [cycled, pick] = useAutoCycle(who.signs.length, CHECK_MS)
  const mobile = useIsMobile()
  const { lit, register } = useScrollLit(who.signs.length, 0.7)

  return (
    <div
      role="group"
      aria-label={who.groupLabel}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 28,
        maxWidth: 640,
      }}
    >
      {who.signs.map((sign, i) => {
        const accent = who.accents[i % who.accents.length]
        const vars = {
          '--tint': accent.tint,
          '--base': accent.base,
          '--shadow': accent.shadow,
        } as CSSProperties
        return (
          <button
            key={sign}
            type="button"
            className="dc-chk"
            ref={register(i)}
            aria-pressed={mobile ? i < lit : i === cycled}
            style={vars}
            onMouseEnter={() => pick(i)}
            onClick={() => pick(i)}
          >
            <span className="dc-chk-dot" aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="dc-chk-label">{sign}</span>
          </button>
        )
      })}
    </div>
  )
}
