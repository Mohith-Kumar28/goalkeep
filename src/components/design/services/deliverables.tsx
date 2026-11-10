import type { Deliverables } from '@/content/design/service-page'
import type { Tone } from '../tones'
import { AudienceTag } from './audience-tag'
import { Rich } from './rich'

export function DeliverablesSection({
  heading,
  items,
  tone,
  audienceTag,
}: Deliverables & { tone: Tone; audienceTag?: string }) {
  return (
    <section className="dc-band" style={{ background: '#FFFFFF', paddingTop: 56, paddingBottom: 64 }}>
      <div className="dc-shell">
        {audienceTag && (
          <p style={{ margin: '0 0 14px', textAlign: 'center' }}>
            <AudienceTag tone={tone}>{audienceTag}</AudienceTag>
          </p>
        )}
        <Rich as="h2" className="dc-h2" html={heading} style={{ margin: '0 auto', textAlign: 'center', maxWidth: '28ch' }} />
        <div
          className="dc-grid3 dc-deliv-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            columnGap: 40,
            rowGap: 40,
            marginTop: 40,
          }}
        >
          {items.map((item) => (
            <div
              key={item.label}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}
            >
              <div
                className="dc-tile"
                style={{ width: '100%', maxWidth: 340, borderRadius: 16, overflow: 'hidden' }}
                dangerouslySetInnerHTML={{ __html: item.illustration }}
              />
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.45, maxWidth: 340, textWrap: 'balance' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
