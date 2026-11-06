import type { ReactNode } from 'react'
import { tones } from '@/components/design/tones'
import { kickstarter } from '@/content/design/kickstarter'
import type { GlanceItem } from '@/content/design/kickstarter'

const icons: Record<GlanceItem['id'], ReactNode> = {
  who: (
    <>
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z" />
      <path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5z" />
    </>
  ),
  cohort: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  build: (
    <>
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7 12l3-3 3 2 4-4" />
    </>
  ),
  funders: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5 5 0 0 1 6.4-.6l.4.3a5 5 0 0 0 3.2.9" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </>
  ),
}

export function Glance() {
  return (
    <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EE' }}>
      <div
        className="dc-shell dc-glance"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
      >
        {kickstarter.glance.map((item, i) => {
          const tone = tones[item.tone]
          return (
            <div
              key={item.id}
              className="dc-glance-item"
              style={i > 0 ? { borderLeft: '1px solid #E5E7EE' } : undefined}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: tone.bg,
                  color: tone.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <svg
                  aria-hidden="true"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icons[item.id]}
                </svg>
              </span>
              <span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    color: tone.ink,
                  }}
                >
                  {item.label}
                </span>
                <span style={{ display: 'block', fontSize: 16, lineHeight: 1.45, marginTop: 4, color: '#14131A' }}>
                  {item.text}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
