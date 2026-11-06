import { Cta, ContactBand, DesignHero, DesignPage, CaseStudyCards, ExploreMore } from '@/components/design'
import { kickstarter } from '@/content/design/kickstarter'
import '@/styles/design-kickstarter.css'
import { ChangeBand } from './change-band'
import { FitBand } from './fit-band'
import { Glance } from './glance'
import { Rich } from './rich'
import { StagesBand } from './stages-band'
import { WhyBand } from './why-band'

export function KickstarterPage() {
  const { hero } = kickstarter
  return (
    <DesignPage service={kickstarter.service}>
      <DesignHero
        headline={<Rich html={hero.headline} />}
        lead={hero.lead}
        badge={
          <>
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {hero.badge}
          </>
        }
        actions={
          <>
            <Cta intent={hero.primary} arrow>
              {hero.primary}
            </Cta>
            <Cta variant="secondary" intent={hero.secondary}>
              {hero.secondary}
            </Cta>
          </>
        }
        photos={hero.photos}
        actionsMarginTop={20}
      />
      <Glance />
      <WhyBand />
      <FitBand />
      <StagesBand />
      <ChangeBand />
      <CaseStudyCards heading={<Rich html={kickstarter.caseStudies.heading} />} cards={kickstarter.caseStudies.cards} />
      <ContactBand
        heading={<Rich html={kickstarter.contact.heading} />}
        body={kickstarter.contact.body}
        ctas={kickstarter.contact.ctas}
        headingMaxWidth="22ch"
      />
      <ExploreMore cards={kickstarter.explore} />
    </DesignPage>
  )
}
