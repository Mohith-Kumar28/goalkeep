import type { CSSProperties } from 'react'
import { ArrowIcon, Cta } from '@/components/design'
import { ClampText } from '@/components/primitives/clamp-text'
import { Reveal } from '@/components/primitives/reveal'
import { literacyContent } from '@/content/design/literacy'
import { SnapTabs } from '../program-snap/snap-tabs'
import { Rich } from './rich'
import { useAutoCycle } from '../program-snap/use-auto-cycle'

const { skills } = literacyContent
const STEP_MS = 8000

export function SkillsSection() {
  const [step, pick] = useAutoCycle(skills.items.length, STEP_MS)
  const skill = skills.items[step]
  const accent = skills.accents[step]

  return (
    <section
      className="dc-band ps-band"
      style={{
        background: '#FFFFFF',
        paddingTop: 48,
        paddingBottom: 56,
        borderTop: '1px solid #E5E7EE',
      }}
    >
      <div className="dc-shell">
        <Reveal>
          <p className="dc-eyebrow" style={{ color: '#176059' }}>
            {skills.eyebrow}
          </p>
          <h2 className="dc-h2">
            <Rich html={skills.heading} />
          </h2>
        </Reveal>
        <div className="ps-desk">
          <div
            className="dc-skill-tabs"
            role="tablist"
            aria-label={skills.tabsLabel}
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: 12,
              marginTop: 32,
            }}
          >
            {skills.items.map((item, k) => {
              const tabAccent = skills.accents[k]
              return (
                <button
                  key={item.title}
                  type="button"
                  className="dc-stage-tab"
                  role="tab"
                  aria-selected={k === step}
                  data-done={k < step}
                  style={
                    {
                      '--tint': tabAccent.tint,
                      '--base': tabAccent.base,
                    } as CSSProperties
                  }
                  onClick={() => pick(k)}
                >
                  <span className="dc-stage-num" aria-hidden="true">
                    {k + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      lineHeight: 1.25,
                      color: '#14131A',
                    }}
                  >
                    <Rich html={item.stepLabel} />
                  </span>
                </button>
              )
            })}
          </div>
          <div
            aria-hidden="true"
            style={{
              height: 4,
              background: '#F1F4FA',
              borderRadius: 2,
              margin: '12px 0 28px',
              overflow: 'hidden',
            }}
          >
            <div
              className="dc-skill-progress"
              style={{
                width: `${((step + 1) / skills.items.length) * 100}%`,
                background: accent.base,
              }}
            />
          </div>
          <div
            key={step}
            className="dc-panel dc-slide-in"
            role="tabpanel"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,6fr) minmax(0,5fr)',
              gap: 64,
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={skill.photo.src}
                alt={skill.photo.alt}
                style={{
                  width: '100%',
                  height: 420,
                  objectFit: 'cover',
                  objectPosition: skill.photo.position,
                  display: 'block',
                  borderRadius: 20,
                }}
              />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: skill.ink,
                }}
              >
                Skill {step + 1} of {skills.items.length}
              </p>
              <h3 className="dc-h3" style={{ marginTop: 8 }}>
                {skill.title}
              </h3>
              <p
                style={{
                  margin: '14px 0 0',
                  fontSize: 21,
                  lineHeight: 1.5,
                  maxWidth: '40ch',
                }}
              >
                {skill.body}
              </p>
              <p style={{ margin: '28px 0 0' }}>
                {skill.next ? (
                  <button
                    type="button"
                    className="dc-tlink"
                    onClick={() => pick(step + 1)}
                    style={{
                      background: 'none',
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: skill.next.ink,
                    }}
                  >
                    {skill.next.label} <ArrowIcon />
                  </button>
                ) : (
                  <Cta variant="primary" intent={skills.cta} arrow>
                    {skills.cta}
                  </Cta>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="ps-mob">
          <SnapTabs
            label={skills.tabsLabel}
            options={skills.items.map((item, k) => ({
              label: <Rich html={item.stepLabel} />,
              base: skills.accents[k].base,
              tint: skills.accents[k].tint,
            }))}
            panels={skills.items.map((item, k) => (
              <div key={item.title}>
                <img
                  src={item.photo.src}
                  alt={item.photo.alt}
                  className="ps-skill-photo"
                  style={{ objectPosition: item.photo.position }}
                />
                <p className="ps-stage-kicker" style={{ color: item.ink, marginTop: 12 }}>
                  Skill {k + 1} of {skills.items.length}
                </p>
                <ClampText lines={3}>{item.body}</ClampText>
                {!item.next && (
                  <p style={{ margin: '16px 0 0' }}>
                    <Cta variant="primary" intent={skills.cta} arrow>
                      {skills.cta}
                    </Cta>
                  </p>
                )}
              </div>
            ))}
          />
        </div>
      </div>
    </section>
  )
}
