import { useLayoutEffect, useReducer, useRef } from 'react'
import '@/styles/design-services.css'
import type { ServicePageContent } from '@/content/design/service-page'
import { ContactBand } from '../contact-band'
import { Cta } from '../cta'
import { DesignHero } from '../hero'
import { DesignPage } from '../design-page'
import { ApproachSection } from './approach'
import { AudienceSwitch } from './audience-switch'
import { CaseStudySection } from './case-study'
import { DeliverablesSection } from './deliverables'
import { DurationSection } from './duration'
import { ExploreServices } from './explore-services'
import { Rich } from './rich'
import { SixSignsSection } from './six-signs'
import { initialSigns, signsReducer } from './state'
import { replayAudienceSwap } from './swap'

export function ServicePage({ content }: { content: ServicePageContent }) {
  const [state, dispatch] = useReducer(signsReducer, initialSigns)
  const { tone, hero, audiences } = content
  /* The page-level fields are the nonprofit view; the funder view overrides them. */
  const view = audiences && state.audience === 'funder' ? audiences.funder : undefined
  const signs = view?.signs ?? { heading: content.signs.heading, items: content.signs.signs }
  const contact = view?.contact ?? content.contact
  const shown = useRef(state.audience)

  useLayoutEffect(() => {
    if (shown.current === state.audience) return
    shown.current = state.audience
    replayAudienceSwap()
  }, [state.audience])

  return (
    <DesignPage service={content.service}>
      <DesignHero
        theme={tone}
        headline={<Rich html={hero.headline} />}
        lead={hero.lead}
        photos={hero.photos}
        actions={
          <>
            <Cta intent={hero.primary} arrow>
              {hero.primary}
            </Cta>
            <Cta variant="secondary" href={hero.secondary.href}>
              {hero.secondary.label}
            </Cta>
          </>
        }
        actionsMarginTop={hero.tightActions ? 24 : 28}
      />
      {audiences && (
        <AudienceSwitch
          audiences={audiences}
          value={state.audience}
          onPick={(audience) => dispatch({ type: 'audience', audience })}
        />
      )}
      <div data-aud-swap>
        <SixSignsSection
          signs={content.signs}
          heading={signs.heading}
          items={signs.items}
          tone={tone}
          checked={state.checked}
          onToggle={(index) => dispatch({ type: 'toggle', index })}
          onSelect={(index) => dispatch({ type: 'select', index })}
        />

      </div>      <ApproachSection eyebrow={content.approach.eyebrow} rows={content.approach.rows} tone={tone} />
      <div data-aud-swap>
        <DeliverablesSection
          heading={content.deliverables.heading}
          items={view?.deliverables ?? content.deliverables.items}
        />

      </div>      <DurationSection duration={content.duration} tone={tone} />
      <div data-aud-swap>
        <CaseStudySection
          card={view?.caseStudy ?? content.caseStudy}
          quote={view ? view.caseQuote : content.caseQuote}
          roomy={content.caseRoomy}
          tone={tone}
        />

      </div>      <div data-aud-swap>
        <ContactBand
          heading={<Rich html={contact.heading} />}
          body={contact.body}
          ctas={content.contact.ctas.map((label) => ({ label }))}
        />

      </div>      <ExploreServices heading={content.explore.heading} cards={content.explore.cards} />
    </DesignPage>
  )
}
