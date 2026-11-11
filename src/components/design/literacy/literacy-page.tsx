import { ContactBand, Cta, DesignHero, DesignPage, ExploreMore } from '@/components/design'
import { literacyContent } from '@/content/design/literacy'
import '@/styles/design-literacy.css'
import '@/styles/design-programs.css'
import { AiSection } from './ai-section'
import { ChangeSection } from './change-section'
import { EvidenceSection } from './evidence-section'
import { FaqSection } from './faq-section'
import { GlanceStrip } from './glance-strip'
import { CalendarBadgeIcon } from './icons'
import { Rich } from './rich'
import { SkillsSection } from './skills-section'
import { WhoSection } from './who-section'
import { WhySection } from './why-section'

const { hero, contact, explore } = literacyContent

export function LiteracyPage() {
  return (
    <DesignPage service={literacyContent.service}>
      <DesignHero
        headline={<Rich html={hero.headline} />}
        lead={hero.lead}
        badge={
          <>
            <CalendarBadgeIcon />
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
        paddingTop={76}
        actionsMarginTop={20}
        photos={hero.photos}
        carouselLabel={hero.carouselLabel}
      />
      <GlanceStrip />
      <WhySection />
      <WhoSection />
      <SkillsSection />
      <AiSection />
      <ChangeSection />
      <EvidenceSection />
      <FaqSection />
      <ContactBand
        heading={<Rich html={contact.heading} />}
        body={contact.body}
        ctas={contact.ctas.map((label) => ({ label }))}
        headingMaxWidth="22ch"
        paddingY={52}
      />
      <div className="dc-literacy-explore">
        <ExploreMore cards={explore} />
      </div>
    </DesignPage>
  )
}
