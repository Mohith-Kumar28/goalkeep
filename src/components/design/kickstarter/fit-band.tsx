import { Cta } from '@/components/design'
import { tones } from '@/components/design/tones'
import { kickstarter } from '@/content/design/kickstarter'
import type { Tone } from '@/components/design/tones'
import { Rich } from './rich'
import { useAutoCycle } from './use-auto-cycle'

const LIT_MS = 1900

const accent: Record<Tone, { base: string; shadow: string }> = {
  gold: { base: '#EAC452', shadow: 'rgba(125,94,12,0.24)' },
  blue: { base: '#3F63C8', shadow: 'rgba(47,77,159,0.24)' },
  teal: { base: '#2F9C8F', shadow: 'rgba(23,96,89,0.24)' },
  coral: { base: '#E07A5F', shadow: 'rgba(156,69,42,0.24)' },
}

export function FitBand() {
  const { fit } = kickstarter
  const [lit, pick] = useAutoCycle(fit.bubbles.length, LIT_MS)

  return (
    <section className="dc-band" style={{ background: '#FFFFFF', paddingTop: 64, paddingBottom: 64 }}>
      <div
        className="dc-shell dc-split"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,7fr) minmax(0,5fr)',
          gap: 48,
          alignItems: 'center',
        }}
      >
        <div className="dc-cloud" role="group" aria-label={fit.label}>
          {fit.bubbles.map((bubble, i) => {
            const on = i === lit
            const tint = on ? tones[bubble.tone].bg : '#FFFFFF'
            const border = on ? accent[bubble.tone].base : '#E5E7EE'
            return (
              <button
                key={bubble.text}
                type="button"
                className={`dc-cb dc-cb-${bubble.side}`}
                aria-pressed={on}
                onMouseEnter={() => pick(i)}
                onClick={() => pick(i)}
                style={{
                  maxWidth: bubble.maxWidth,
                  fontSize: bubble.fontSize,
                  marginTop: bubble.marginTop,
                  background: tint,
                  color: on ? '#14131A' : 'rgba(20,19,26,0.62)',
                  borderColor: border,
                  boxShadow: on ? `0 14px 28px ${accent[bubble.tone].shadow}` : '0 2px 6px rgba(20,19,26,0.05)',
                  transform: `rotate(${bubble.rotate}deg) scale(${on ? 1.06 : 1})`,
                  fontWeight: on ? 700 : 400,
                }}
              >
                {bubble.text}
                <span aria-hidden="true" className="dc-cb-tail" style={{ background: tint, borderColor: border }} />
              </button>
            )
          })}
        </div>
        <div>
          <h2 className="dc-h2">
            <Rich html={fit.heading} />
          </h2>
          <p style={{ margin: '20px 0 0', maxWidth: '40ch' }}>{fit.paragraphs[0]}</p>
          <p style={{ margin: '16px 0 0', maxWidth: '40ch' }}>{fit.paragraphs[1]}</p>
          <div style={{ marginTop: 32 }}>
            <Cta variant="primary" intent={fit.cta} arrow>
              {fit.cta}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
