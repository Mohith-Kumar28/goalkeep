import type { ApproachRow } from '@/content/design/service-page'
import { tones } from '../tones'
import type { Tone } from '../tones'
import { Cta } from '../cta'
import { ArrowIcon } from '../icons'
import { SiteLink } from '../site-link'
import { Rich } from './rich'

function TextLink({ href, tone, children }: { href: string; tone: Tone; children: string }) {
  return (
    <SiteLink href={href} className="dc-tlink" style={{ color: tones[tone].ink }}>
      {children} <ArrowIcon />
    </SiteLink>
  )
}

export function ApproachSection({
  eyebrow,
  rows,
  tone,
}: {
  eyebrow: string
  rows: Array<ApproachRow>
  tone: Tone
}) {
  return (
    <section
      className="dc-band"
      style={{ background: tones[tone].bg, paddingTop: 56, paddingBottom: 56, position: 'relative', zIndex: 1 }}
    >
      <div className="dc-shell">
        <p className="dc-eyebrow" style={{ color: tones[tone].ink }}>
          {eyebrow}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, marginTop: 24 }}>
          {rows.map((row, i) => {
            const text = (
              <div>
                <Rich as="h3" className="dc-h3" html={row.heading} />
                <Rich as="p" html={row.body} style={{ margin: '20px 0 0', maxWidth: '48ch' }} />
                {row.link && (
                  <p style={{ margin: '16px 0 0' }}>
                    <TextLink href={row.link.href} tone={tone}>
                      {row.link.label}
                    </TextLink>
                  </p>
                )}
                {row.actions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, marginTop: 24 }}>
                    {row.actions.map((action) =>
                      action.kind === 'form' ? (
                        <Cta key={action.label} variant="primary" intent={action.label} arrow>
                          {action.label}
                        </Cta>
                      ) : (
                        <TextLink key={action.label} href={action.href} tone={tone}>
                          {action.label}
                        </TextLink>
                      ),
                    )}
                  </div>
                )}
              </div>
            )
            const image = (
              <div className="dc-alt-img" style={{ position: 'relative', height: 340 }}>
                <img
                  className="dc-photo"
                  src={row.photo.src}
                  alt={row.photo.alt}
                  style={row.photo.position ? { objectPosition: row.photo.position } : undefined}
                />
              </div>
            )
            const reversed = i % 2 === 1
            return (
              <div
                key={row.heading}
                className={reversed ? 'dc-alt dc-alt-rev' : 'dc-alt'}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
                  gap: 64,
                  alignItems: 'center',
                }}
              >
                {reversed ? image : text}
                {reversed ? text : image}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
