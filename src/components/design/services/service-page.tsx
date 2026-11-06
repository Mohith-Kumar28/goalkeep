import { useReducer } from 'react'
import '@/styles/design-services.css'
import type { ServicePageContent } from '@/content/design/service-page'
import { ContactBand } from '../contact-band'
import { Cta } from '../cta'
import { DesignHero } from '../hero'
import { DesignPage } from '../design-page'
import { ApproachSection } from './approach'
import { AudienceSwitch } from './audience-switch'
import { AudienceTag } from './audience-tag'
import { CaseStudySection } from './case-study'
import { DeliverablesSection } from './deliverables'
import { DurationSection } from './duration'
import { ExploreServices } from './explore-services'
import { Rich } from './rich'
import { SixSignsSection } from './six-signs'
import { initialSigns, signsReducer } from './state'

export function ServicePage({ content }: { content: ServicePageContent }) {
  const [state, dispatch] = useReducer(signsReducer, initialSigns)
  const { tone, hero, audiences } = content
  /* The page-level fields are the nonprofit view; the funder view overrides them. */
  const view = audiences && state.audience === 'funder' ? audiences.funder : undefined
  const tag = audiences?.[state.audience].tag
  const signs = view?.signs ?? { heading: content.signs.heading, items: content.signs.signs }
  const contact = view?.contact ?? content.contact

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
        actionsMarginTop={28}
      />
      {audiences && (
        <AudienceSwitch
          audiences={audiences}
          value={state.audience}
          onPick={(audience) => dispatch({ type: 'audience', audience })}
        />
      )}
      <SixSignsSection
        signs={content.signs}
        heading={signs.heading}
        items={signs.items}
        tone={tone}
        checked={state.checked}
        onToggle={(index) => dispatch({ type: 'toggle', index })}
        audienceTag={tag}
      />
      <ApproachSection eyebrow={content.approach.eyebrow} rows={content.approach.rows} tone={tone} />
      <DeliverablesSection
        heading={content.deliverables.heading}
        items={view?.deliverables ?? content.deliverables.items}
        tone={tone}
        audienceTag={tag}
      />
      <DurationSection duration={content.duration} tone={tone} />
      <CaseStudySection
        card={view?.caseStudy ?? content.caseStudy}
        quote={view ? view.caseQuote : content.caseQuote}
        tone={tone}
        audienceTag={tag}
      />
      <ContactBand
        eyebrow={
          tag && (
            <p style={{ margin: '0 0 16px' }}>
              <AudienceTag tone={tone} onNavy>
                {tag}
              </AudienceTag>
            </p>
          )
        }
        heading={<Rich html={contact.heading} />}
        body={contact.body}
        ctas={content.contact.ctas.map((label) => ({ label }))}
      />
      <ExploreServices heading={content.explore.heading} cards={content.explore.cards} />
    </DesignPage>
  )
}
