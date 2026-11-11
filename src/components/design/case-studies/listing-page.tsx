import { useState } from 'react'
import { ContactBand, DesignPage } from '@/components/design'
import { useContactForm } from '../contact-form'
import { contact } from '@/content/homepage'
import { audienceFilters, caseStudies, quizHref, sectorFilters } from '@/content/design/case-studies'
import type { Audience, Filter, Sector } from '@/content/design/case-studies'
import '@/styles/design-case-studies.css'
import { Reveal } from '@/components/primitives/reveal'
import { ArrowIcon } from '../icons'
import { SiteLink } from '../site-link'
import { StudyCard } from './study-card'

export function CaseStudiesListingPage() {
  return (
    <DesignPage service={contact.generalEnquiry}>
      <ListingHero />
      <Listing />
      <ContactBand
        heading={
          <>
            Read something you found <em>relatable to your organization?</em>
          </>
        }
        headingMaxWidth="24ch"
        body="Most of these projects started with a short conversation about a problem. Tell us about yours."
        ctas={[{ label: 'Talk to us' }, { label: 'Take the data culture quiz', href: quizHref }]}
        paddingY={52}
        mark={false}
      />
    </DesignPage>
  )
}

function ListingHero() {
  return (
    <section
      className="dc-on-navy"
      style={{ background: '#2F4A92', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}
    >
      <div
        className="dc-shell dc-cs-listing-hero"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,520px)',
          gap: 56,
          alignItems: 'center',
          paddingTop: 76,
          paddingBottom: 72,
        }}
      >
        <div>
          <p className="dc-eyebrow">case studies</p>
          <h1
            className="dc-h1"
            style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0 }}
          >
            What changed, <em>and what it took to get there.</em>
          </h1>
          <p className="dc-hero-lead" style={{ margin: '22px 0 0' }}>
            Stories from the nonprofits, funders and ecosystem partners we have worked with: where they started, how we
            approached the work together, and what is different now.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 30 }}>
            <a className="dc-btn dc-btn-accent" href="#all">
              Browse all case studies <ArrowIcon />
            </a>
          </div>
        </div>
        <div className="dc-cs-hero-photos" style={{ position: 'relative', paddingBottom: 64 }}>
          <div style={{ marginLeft: '10%' }}>
            <img
              className="dc-cs-hero-main"
              src="/design/5fbbb99e8ba9fef7a76a4be484da22a4.webp"
              alt="A Goalkeep facilitator leading a session with the Peepul team"
              style={{
                width: '100%',
                height: 360,
                objectFit: 'cover',
                objectPosition: '50% 50%',
                display: 'block',
                borderRadius: 16,
                border: '3px solid #FFFFFF',
                boxShadow: '0 18px 40px rgba(20,19,26,0.28)',
              }}
            />
          </div>
          <span className="dc-cs-pair-cap" style={{ top: 18, right: 18 }}>
            Peepul
          </span>
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: '50%', zIndex: 2 }}>
            <span className="dc-cs-pair-cap" style={{ top: 16, left: 16, zIndex: 3 }}>
              Baithak Foundation
            </span>
            <img
              className="dc-cs-hero-small"
              src="/design/8625ca604ea24fa43d1fd299a4c5afea.webp"
              alt="Two Baithak Foundation team members smiling during a session"
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                objectPosition: '50% 35%',
                display: 'block',
                borderRadius: 14,
                border: '3px solid #FFFFFF',
                boxShadow: '0 18px 40px rgba(20,19,26,0.24)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Listing() {
  const [audience, setAudience] = useState<'all' | Audience>('all')
  const [sector, setSector] = useState<'all' | Sector>('all')
  const shown = caseStudies.filter(
    (study) => (audience === 'all' || study.audience === audience) && (sector === 'all' || study.sectorTags.includes(sector)),
  )
  const count = shown.length

  return (
    <section id="all" className="dc-band" style={{ background: '#FCFCFD', paddingTop: 48, paddingBottom: 72 }}>
      <div className="dc-shell">
        <div
          className="dc-cs-filters"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 24,
            paddingBottom: 24,
            borderBottom: '1px solid #E5E7EE',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <FilterRow label="Who it's for" filters={audienceFilters} value={audience} onChange={setAudience} />
            <FilterRow label="Sector" filters={sectorFilters} value={sector} onChange={setSector} />
          </div>
          <p aria-live="polite" style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'rgba(20,19,26,0.72)' }}>
            {count === 0 ? 'No case studies yet' : `Showing ${count} ${count === 1 ? 'case study' : 'case studies'}`}
          </p>
        </div>
        {count > 0 ? (
          <div className="dc-cs-grid dc-swipe" style={{ marginTop: 36 }}>
            {shown.map((study, i) => (
              <Reveal key={study.slug} delay={(i % 3) * 0.07} className={i === 0 && count % 3 === 1 ? 'dc-cs-wide-slot' : undefined}>
                <StudyCard study={study} wide={i === 0 && count % 3 === 1} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            onReset={() => {
              setAudience('all')
              setSector('all')
            }}
          />
        )}
      </div>
    </section>
  )
}

function FilterRow<TId extends string>({
  label,
  filters,
  value,
  onChange,
}: {
  label: string
  filters: Array<Filter<TId>>
  value: 'all' | TId
  onChange: (id: 'all' | TId) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
      <span className="dc-cs-filter-label">{label}</span>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className="dc-cs-chip"
          data-tone={filter.tone}
          aria-pressed={filter.id === value}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const form = useContactForm()
  return (
    <div
      className="dc-cs-empty"
      style={{
        marginTop: 36,
        padding: '44px 40px',
        borderRadius: 16,
        background: '#F7F5EF',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <span>
        <span style={{ display: 'block', fontSize: 22, fontWeight: 700 }}>We are still writing these up.</span>
        <span style={{ display: 'block', marginTop: 6, color: 'rgba(20,19,26,0.76)', maxWidth: '56ch' }}>
          We have worked in this space, and the case studies are on their way. Talk to us in the meantime and we will
          walk you through the work.
        </span>
      </span>
      <span style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="button" className="dc-btn dc-btn-primary" onClick={onReset}>
          Show all case studies
        </button>
        <SiteLink
          href="#contact"
          className="dc-btn"
          style={{ background: '#FFFFFF', color: '#2F4A92', borderColor: '#D3D7E2' }}
          onClick={() => form.open('Talk to us')}
        >
          Talk to us
        </SiteLink>
      </span>
    </div>
  )
}
