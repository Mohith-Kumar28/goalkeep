import type { ApproachRow } from '@/content/design/service-page'
import { tones } from '../tones'
import type { Tone } from '../tones'
import { Cta } from '../cta'
import { ClampText } from '../../primitives/clamp-text'
import { Reveal } from '../../primitives/reveal'
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
      className="dc-band dc-svc-band"
      style={{ background: tones[tone].bg, position: 'relative', zIndex: 1 }}
    >
      <div className="dc-shell">
        <p className="dc-eyebrow" style={{ color: tones[tone].ink }}>
          {eyebrow}
        </p>
        <div className="dc-approach-list">
          {rows.map((row, i) => {
            const text = (
              <div>
                <Rich as="h3" className="dc-h3" html={row.heading} />
                <ClampText className="dc-approach-body">
                  <Rich html={row.body} />
                </ClampText>
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
              <div className="dc-alt-img">
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
              <Reveal key={row.heading} className={reversed ? 'dc-alt dc-alt-rev' : 'dc-alt'}>
                {reversed ? image : text}
                {reversed ? text : image}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
