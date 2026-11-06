import { kickstarter } from '@/content/design/kickstarter'
import { Rich } from './rich'

const labelStyle = {
  margin: 0,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
} as const

const quoteStyle = { margin: '12px 0 0', fontSize: 28, lineHeight: 1.25, letterSpacing: '-0.012em' } as const

export function ChangeBand() {
  const { change } = kickstarter
  return (
    <section
      className="dc-on-navy dc-band"
      style={{
        background: '#2F4A92',
        color: '#FFFFFF',
        paddingTop: 64,
        paddingBottom: 72,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="dc-shell">
        <p className="dc-eyebrow">{change.eyebrow}</p>
        <div
          className="dc-change"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) 80px minmax(0,1fr)',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '16px 16px 16px 4px',
              padding: '28px 32px',
            }}
          >
            <p style={{ ...labelStyle, color: 'rgba(255,255,255,0.76)' }}>{change.beforeLabel}</p>
            <p style={{ ...quoteStyle, color: 'rgba(255,255,255,0.86)' }}>{change.before}</p>
          </div>
          <div className="dc-change-arrow" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="64" height="32" viewBox="0 0 64 32">
              <path d="M 4 18 Q 30 6 56 16" fill="none" stroke="#F6D83A" strokeWidth="5" strokeLinecap="round" />
              <path
                d="M 46 7 L 58 16 L 46 25"
                fill="none"
                stroke="#F6D83A"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              color: '#14131A',
              borderRadius: '16px 16px 4px 16px',
              padding: '28px 32px',
              boxShadow: '0 18px 40px rgba(20,19,26,0.28)',
            }}
          >
            <p style={{ ...labelStyle, color: '#7D5E0C' }}>{change.afterLabel}</p>
            <p style={quoteStyle}>
              <Rich html={change.after} />
            </p>
          </div>
        </div>
        <p style={{ margin: '48px 0 0', fontSize: 19, fontWeight: 700 }}>{change.outcomesLead}</p>
        <ul
          className="dc-outcomes"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '20px 0 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '20px 40px',
          }}
        >
          {change.outcomes.map((outcome) => (
            <li
              key={outcome}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                fontSize: 17,
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" style={{ flex: 'none', marginTop: 2 }}>
                <path
                  d="M 5 15 Q 9 18 11.5 22 Q 16 11 24 5"
                  fill="none"
                  stroke="#F6D83A"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
