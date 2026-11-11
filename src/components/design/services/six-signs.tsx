import { useEffect, useRef } from 'react'
import type { Html, Sign, SixSigns } from '@/content/design/service-page'
import { tones } from '../tones'
import type { Tone } from '../tones'
import { Cta } from '../cta'
import { Reveal } from '../../primitives/reveal'
import { Rich } from './rich'
import { signTones, toneAccents } from './service-tones'

type Props = {
  signs: SixSigns
  heading: Html
  items: ReadonlyArray<Sign>
  tone: Tone
  checked: ReadonlyArray<number>
  onToggle: (index: number) => void
  onSelect: (index: number) => void
}

const PHONE = '(max-width: 760px)'

/** On a phone a note selects itself the first time its middle crosses the screen's middle.
 *  A tap still toggles it afterwards. */
function useScrollSelect(items: ReadonlyArray<Sign>, onSelect: (index: number) => void) {
  const listRef = useRef<HTMLDivElement>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const list = listRef.current
    const phone = window.matchMedia(PHONE)
    if (!list) return
    const seen = new Set<number>()
    let frame = 0
    const check = () => {
      frame = 0
      if (!phone.matches) return
      const mid = window.innerHeight / 2
      Array.from(list.children).forEach((note, index) => {
        if (seen.has(index)) return
        const box = note.getBoundingClientRect()
        if (box.top + box.height / 2 <= mid && box.bottom > 0) {
          seen.add(index)
          onSelectRef.current(index)
        }
      })
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    window.addEventListener('scroll', queue, { passive: true })
    phone.addEventListener('change', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      phone.removeEventListener('change', queue)
      cancelAnimationFrame(frame)
    }
  }, [items])

  return listRef
}

export function SixSignsSection({ signs, heading, items, tone, checked, onToggle, onSelect }: Props) {
  const listRef = useScrollSelect(items, onSelect)
  const count = checked.length
  const verdict = count >= 3 ? signs.verdicts.many : count >= 1 ? signs.verdicts.few : signs.verdicts.none
  const noteTones = signTones[tone]

  return (
    <section
      className="dc-band dc-svc-band"
      style={{ background: '#FFFFFF', position: 'relative', zIndex: 2 }}
    >
      <svg
        className="dc-arc dc-gutter-arc"
        aria-hidden="true"
        width="286"
        height="286"
        viewBox="0 0 286 286"
        style={{ position: 'absolute', left: -163, bottom: -143, pointerEvents: 'none' }}
      >
        <circle cx="143" cy="143" r="126" fill="none" stroke={toneAccents[tone].base} strokeWidth="34" />
      </svg>
      <Reveal>
      <div
        className="dc-shell dc-split"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
          gap: 48,
          alignItems: 'center',
        }}
      >
        <div className="dc-signs-intro">
          <Rich as="h2" className="dc-h2" html={heading} />
          <p className="dc-signs-prompt" style={{ margin: '16px 0 0', maxWidth: '40ch' }}>{signs.prompt}</p>
          <div
            className="dc-signs-cta"
            data-hidden={count < 2}
            style={{ height: 64, display: 'flex', alignItems: 'flex-end', visibility: count >= 2 ? 'visible' : 'hidden' }}>
            <Cta variant="primary" intent={signs.cta} arrow>
              {signs.cta}
            </Cta>
          </div>
          <div className="dc-signs-verdict" data-empty={count === 0} style={{ marginTop: 40 }}>
            <p style={{ margin: 0, fontSize: 19, fontWeight: 700, lineHeight: 1.35, maxWidth: '24ch' }}>{verdict.title}</p>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 15,
                lineHeight: 1.5,
                color: 'rgba(20,19,26,0.72)',
                maxWidth: '30ch',
              }}
            >
              {verdict.body}
            </p>
          </div>
        </div>
        <div ref={listRef} className="dc-notes dc-svc-notes">
          {items.map(({ text, icon }, i) => {
            const on = checked.includes(i)
            const noteTone = noteTones[i]
            const accent = toneAccents[noteTone]
            return (
              <button
                key={text}
                type="button"
                className="dc-note"
                aria-pressed={on}
                onClick={() => onToggle(i)}
                style={{
                  background: on ? tones[noteTone].bg : '#FFFFFF',
                  borderRadius: 14,
                  transform: on ? 'translateY(-4px) scale(1.02)' : 'none',
                  boxShadow: on
                    ? `0 16px 32px ${accent.shadow}`
                    : '0 1px 2px rgba(20,19,26,0.06), 0 8px 22px rgba(20,19,26,0.08)',
                  border: `1.5px solid ${on ? accent.base : '#E5E7EE'}`,
                }}
              >
                <span className="dc-note-ico-row">
                  <span
                    aria-hidden="true"
                    className="dc-note-ico"
                    style={{
                      background: on ? tones[noteTone].ink : tones[noteTone].bg,
                      color: on ? '#FFFFFF' : tones[noteTone].ink,
                      transition: 'background-color 320ms, color 320ms',
                    }}
                  >
                    <span style={{ display: 'flex' }} dangerouslySetInnerHTML={{ __html: icon }} />
                  </span>
                </span>
                <span className="dc-note-text" style={{ fontWeight: on ? 700 : 400 }}>{text}</span>
                <span aria-hidden="true" className="dc-note-check" data-on={on}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              </button>
            )
          })}
        </div>
      </div>
      </Reveal>
    </section>
  )
}
