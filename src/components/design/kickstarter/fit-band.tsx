import type { CSSProperties } from 'react'
import { ArrowIcon, ctaClass } from '@/components/design'
import { tones } from '@/components/design/tones'
import { kickstarter } from '@/content/design/kickstarter'
import { Reveal } from '@/components/primitives/reveal'
import type { Tone } from '@/components/design/tones'
import { useScrollLit } from '../program-snap/use-scroll-lit'
import { ApplyLink } from './apply-link'
import { Rich } from './rich'

const accent: Record<Tone, { base: string; shadow: string }> = {
  gold: { base: '#EAC452', shadow: 'rgba(125,94,12,0.24)' },
  blue: { base: '#3F63C8', shadow: 'rgba(47,77,159,0.24)' },
  teal: { base: '#2F9C8F', shadow: 'rgba(23,96,89,0.24)' },
  coral: { base: '#E07A5F', shadow: 'rgba(156,69,42,0.24)' },
}

const bubbles = kickstarter.fit.bubbles.filter((bubble) => bubble.shown)

export function FitBand() {
  const { fit } = kickstarter
  const { lit, register } = useScrollLit(bubbles.length)
  const done = lit >= bubbles.length

  return (
    <section className="dc-band ps-band" style={{ background: '#FFFFFF', paddingTop: 64, paddingBottom: 64 }}>
      <div className="dc-shell ps-fit">
        <div className="ps-fit-side">
          <Reveal className="ps-fit-head">
            <h2 className="dc-h2">
              <Rich html={fit.heading} />
            </h2>
            <p style={{ margin: '20px 0 0', maxWidth: '40ch' }}>{fit.paragraphs[0]}</p>
          </Reveal>
          <div className="ps-fit-outro" data-on={done}>
            <p style={{ margin: 0, maxWidth: '40ch' }}>{fit.paragraphs[1]}</p>
            <div style={{ marginTop: 24 }}>
              <ApplyLink className={ctaClass('primary')} label={fit.cta}>
                {fit.cta}
                <ArrowIcon />
              </ApplyLink>
            </div>
          </div>
        </div>
        <div className="ps-fit-cloud" role="group" aria-label={fit.label}>
          {bubbles.map((bubble, i) => (
            <p
              key={bubble.text}
              ref={register(i)}
              className={`ps-bubble ps-bubble-${bubble.side}`}
              data-lit={i < lit}
              style={
                {
                  '--tint': tones[bubble.tone].bg,
                  '--base': accent[bubble.tone].base,
                  '--shadow': accent[bubble.tone].shadow,
                  '--rot': `${bubble.rotate}deg`,
                  maxWidth: bubble.maxWidth,
                  fontSize: bubble.fontSize,
                } as CSSProperties
              }
            >
              {bubble.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
