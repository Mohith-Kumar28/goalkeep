import { ArrowIcon, tones } from '@/components/design'
import { Reveal } from '@/components/primitives/reveal'
import { kickstarter } from '@/content/design/kickstarter'
import { SnapTabs } from '../program-snap/snap-tabs'
import { ApplyLink } from './apply-link'
import { Rich } from './rich'
import { StageCards } from './stage-cards'
import stage1 from './stage-1.svg?raw'
import stage2 from './stage-2.svg?raw'
import stage3 from './stage-3.svg?raw'
import stage4 from './stage-4.svg?raw'
import { useAutoCycle } from '../program-snap/use-auto-cycle'

const illustrations = [stage1, stage2, stage3, stage4]
const STEP_MS = 8000

export function StagesBand() {
  const { stages } = kickstarter
  const [step, pick] = useAutoCycle(stages.items.length, STEP_MS)
  const stage = stages.items[step]
  const ink = tones[stage.tone].ink
  const next = stages.items.at(step + 1)

  return (
    <section
      className="dc-band ps-band"
      style={{
        background: '#FFFFFF',
        paddingTop: 64,
        paddingBottom: 72,
        borderTop: '1px solid #E5E7EE',
      }}
    >
      <div className="dc-shell">
        <Reveal>
          <p className="dc-eyebrow">{stages.eyebrow}</p>
          <h2 className="dc-h2">
            <Rich html={stages.heading} />
          </h2>
        </Reveal>
        <div className="ps-desk">
          <div
            className="dc-stage-tabs"
            role="tablist"
            aria-label="Program stages"
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 12,
              marginTop: 32,
            }}
          >
            {stages.items.map((item, k) => {
              const on = k === step
              const filled = on || k < step
              return (
                <button
                  key={item.name}
                  type="button"
                  className="dc-stage-tab"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(k)}
                  style={{
                    background: on ? tones[item.tone].bg : '#FFFFFF',
                    borderColor: on ? item.accent : '#E5E7EE',
                    boxShadow: on ? '0 10px 24px rgba(20,19,26,0.08)' : 'none',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                      fontWeight: 800,
                      background: filled ? item.accent : '#F1F4FA',
                      color: filled ? '#FFFFFF' : 'rgba(20,19,26,0.6)',
                      flex: 'none',
                      transition: 'background-color 320ms, color 320ms',
                    }}
                  >
                    {k + 1}
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#14131A' }}>{item.name}</span>
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
              margin: '14px 0 36px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(step + 1) * 25}%`,
                background: stage.accent,
                borderRadius: 2,
                transition: 'width 520ms cubic-bezier(0.22,1,0.36,1), background-color 320ms',
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
              gap: 48,
              alignItems: 'center',
            }}
          >
            <div>
              <div dangerouslySetInnerHTML={{ __html: illustrations[step] }} />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  color: ink,
                }}
              >
                Stage {step + 1} of {stages.items.length}
              </p>
              <h3 className="dc-h3" style={{ marginTop: 8 }}>
                {stage.name}
              </h3>
              <p
                style={{
                  margin: '12px 0 0',
                  fontSize: 19,
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                  color: ink,
                }}
              >
                {stage.tagline}
              </p>
              <p style={{ margin: '14px 0 0', maxWidth: '52ch' }}>{stage.body}</p>
              <p style={{ margin: '24px 0 0' }}>
                {next && step < stages.items.length - 1 ? (
                  <button
                    type="button"
                    className="dc-tlink dc-tlink-btn"
                    onClick={() => pick(step + 1)}
                    style={{ color: tones[next.tone].ink }}
                  >
                    Next: {next.name} <ArrowIcon />
                  </button>
                ) : (
                  <ApplyLink className="dc-btn dc-btn-maroon" label={stages.cta}>
                    {stages.cta} <ArrowIcon />
                  </ApplyLink>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="ps-mob">
          <SnapTabs
            label="Program stages"
            options={stages.items.map((item) => ({
              label: item.name,
              base: item.accent,
              tint: tones[item.tone].bg,
            }))}
            panels={stages.items.map((item, k) => (
              <div key={item.name} className="ps-stage-panel">
                <p className="ps-stage-kicker" style={{ color: tones[item.tone].ink }}>
                  Stage {k + 1} of {stages.items.length}
                </p>
                <p className="ps-stage-tagline" style={{ color: tones[item.tone].ink }}>
                  {item.tagline}
                </p>
                <p style={{ margin: 0 }}>{item.body}</p>
                <StageCards index={k} tone={item.tone} />
                {k === stages.items.length - 1 && (
                  <p style={{ margin: '16px 0 0' }}>
                    <ApplyLink className="dc-btn dc-btn-maroon" label={stages.cta}>
                      {stages.cta} <ArrowIcon />
                    </ApplyLink>
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

