import { ContactBand, DesignPage } from '@/components/design'
import { contact } from '@/content/homepage'
import { audiences, caseStudies, sectors } from '@/content/design/case-studies'
import type { CaseStudy } from '@/content/design/case-studies'
import '@/styles/design-case-studies.css'
import { ArrowIcon, ChevronSideIcon } from '../icons'
import { SiteLink } from '../site-link'
import { tones } from '../tones'
import { Reveal } from '@/components/primitives/reveal'
import { StatFigure, StudyCard } from './study-card'
import { StudyArticle } from './study-article'

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const service = contact.serviceOptions.includes(study.service) ? study.service : contact.generalEnquiry
  const others = caseStudies.filter((other) => other.slug !== study.slug)
  return (
    <DesignPage service={service}>
      <StudyHeader study={study} />
      <StudyArticle study={study} />
      <ContactBand
        heading={
          <>
            Want to talk about <em>your organisation’s data?</em>
          </>
        }
        headingMaxWidth="26ch"
        body="Tell us a little about where you are, and we will get back to you."
        ctas={[{ label: 'Talk to us' }]}
        paddingY={36}
        compact
        mark={false}
      />
      <section className="dc-band" style={{ background: '#FFFFFF', paddingTop: 48, paddingBottom: 56 }}>
        <div className="dc-shell">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 16,
            }}
          >
            <h2 className="dc-h3" style={{ fontSize: 24 }}>
              More case studies
            </h2>
            <SiteLink href="/case-studies" className="dc-tlink">
              See all case studies <ArrowIcon />
            </SiteLink>
          </div>
          <div className="dc-cs-related dc-swipe">
            {others.map((other, i) => (
              <Reveal key={other.slug} delay={i * 0.07}>
                <StudyCard study={other} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </DesignPage>
  )
}

function StudyHeader({ study }: { study: CaseStudy }) {
  const { hero } = study
  return (
    <header style={{ background: '#FBF8F1', paddingTop: 24, paddingBottom: 32, borderBottom: '1px solid #ECE7DC' }}>
      <div className="dc-shell">
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700 }}>
          <SiteLink href="/case-studies" style={{ textDecoration: 'none' }}>
            Case studies
          </SiteLink>
          <span aria-hidden="true" style={{ display: 'inline-flex', color: 'rgba(20,19,26,0.4)' }}>
            <ChevronSideIcon direction="right" size={14} />
          </span>
          <span aria-current="page" style={{ color: 'rgba(20,19,26,0.7)' }}>
            {study.org}
          </span>
        </p>
        <div
          className="dc-cs-head-split"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,576px)',
            gap: 48,
            alignItems: 'center',
            marginTop: 22,
          }}
        >
          <div>
            <p style={{ margin: '0 0 14px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {study.sectorTags.map((id) => (
                <span key={id} className="dc-cs-tag" style={{ background: tones[sectors[id].tone].bg, color: tones[sectors[id].tone].ink }}>
                  {sectors[id].label}
                </span>
              ))}
              <span className="dc-cs-tag" style={{ background: '#F1F4FA', color: '#2F4D9F' }}>
                {audiences[study.audience].tag}
              </span>
              <span className="dc-cs-tag" style={{ background: '#F1F4FA', color: '#2F4D9F' }}>
                {study.service}
              </span>
            </p>
            <h1
              className="dc-cs-h1"
              style={{
                fontSize: 38,
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                margin: 0,
                color: '#14131A',
                textWrap: 'balance',
              }}
            >
              {study.headline.lead} <em>{study.headline.em}</em>
            </h1>
            <p className="dc-cs-intro">{study.intro}</p>
            <p
              style={{
                margin: '14px 0 0',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '6px 14px',
                fontSize: 13,
                fontWeight: 700,
                color: 'rgba(20,19,26,0.6)',
              }}
            >
              <span>{study.org}</span>
              <span aria-hidden="true">·</span>
              <span>{study.readTime} min read</span>
            </p>
          </div>
          <figure className="dc-cs-hero-fig-wrap" style={{ margin: 0 }}>
            {hero.kind === 'photo' ? (
              <img
                src={hero.src}
                alt={hero.alt}
                className="dc-cs-hero-fig"
                style={{
                  width: '100%',
                  height: 348,
                  objectFit: 'cover',
                  objectPosition: hero.position,
                  display: 'block',
                  borderRadius: 14,
                }}
              />
            ) : (
              <div
                className="dc-cs-hero-fig dc-cs-hero-stat"
                style={{
                  height: 348,
                  borderRadius: 14,
                  background: '#2F4A92',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '34px 38px',
                  color: '#FFFFFF',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: -80,
                    top: -80,
                    width: 260,
                    height: 260,
                    borderRadius: 999,
                    border: '40px solid rgba(255,255,255,0.12)',
                  }}
                />
                <StatFigure value={study.card.stat.value} label={study.card.stat.label} size={88} labelSize={19} />
              </div>
            )}
          </figure>
        </div>
      </div>
    </header>
  )
}
