import type { Html, Sign, SixSigns } from '@/content/design/service-page'
import { tones } from '../tones'
import type { Tone } from '../tones'
import { Cta } from '../cta'
import { AudienceTag } from './audience-tag'
import { Rich } from './rich'
import { signTones, toneAccents } from './service-tones'

type Props = {
  signs: SixSigns
  heading: Html
  items: ReadonlyArray<Sign>
  tone: Tone
  checked: ReadonlyArray<number>
  onToggle: (index: number) => void
  audienceTag?: string
}

export function SixSignsSection({ signs, heading, items, tone, checked, onToggle, audienceTag }: Props) {
  const count = checked.length
  const verdict = count >= 3 ? signs.verdicts.many : count >= 1 ? signs.verdicts.few : signs.verdicts.none
  const noteTones = signTones[tone]

  return (
    <section
      className="dc-band"
      style={{ background: '#FFFFFF', paddingTop: 56, paddingBottom: 64, position: 'relative', zIndex: 2 }}
    >
      <svg
        className="dc-arc dc-gutter-arc"
        aria-hidden="true"
        width="286"
        height="286"
        viewBox="0 0 286 286"
        style={{ position: 'absolute', left: -163, bottom: -143, pointerEvents: 'none' }}
      >
        <circle cx="143" cy="143" r="126" fill="none" stroke="#EAC452" strokeWidth="34" />
      </svg>
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
        <div>
          {audienceTag && (
            <p style={{ margin: '0 0 14px' }}>
              <AudienceTag tone={tone}>{audienceTag}</AudienceTag>
            </p>
          )}
          <Rich as="h2" className="dc-h2" html={heading} />
          <p style={{ margin: '16px 0 0', maxWidth: '40ch' }}>{signs.prompt}</p>
          <div style={{ height: 64, display: 'flex', alignItems: 'flex-end', visibility: count >= 2 ? 'visible' : 'hidden' }}>
            <Cta variant="primary" intent={signs.cta} arrow>
              {signs.cta}
            </Cta>
          </div>
          <div style={{ marginTop: 40 }}>
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
        <div
          className="dc-notes"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, padding: '8px 0' }}
        >
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
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 36 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: on ? tones[noteTone].ink : tones[noteTone].bg,
                      color: on ? '#FFFFFF' : tones[noteTone].ink,
                      transition: 'background-color 320ms, color 320ms',
                    }}
                  >
                    <span style={{ display: 'flex' }} dangerouslySetInnerHTML={{ __html: icon }} />
                  </span>
                </span>
                <span style={{ fontWeight: on ? 700 : 400 }}>{text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
