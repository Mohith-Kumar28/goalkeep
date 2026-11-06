import { literacyContent } from '@/content/design/literacy'
import { GlanceGlyph } from './icons'

export function GlanceStrip() {
  return (
    <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EE' }}>
      <div
        className="dc-shell dc-glance"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
      >
        {literacyContent.glance.map((item) => (
          <div key={item.label} className="dc-glance-item">
            <span
              aria-hidden="true"
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: item.bg,
                color: item.ink,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <GlanceGlyph icon={item.icon} />
            </span>
            <span>
              <span
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: item.ink,
                }}
              >
                {item.label}
              </span>
              <span style={{ display: 'block', fontSize: 16, lineHeight: 1.45, marginTop: 4, color: '#14131A' }}>
                {item.body}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
