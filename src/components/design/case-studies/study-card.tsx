import { ArrowIcon } from '../icons'
import { SiteLink } from '../site-link'
import { tones } from '../tones'
import { audiences, caseStudyHref, sectors } from '@/content/design/case-studies'
import type { CaseStudy } from '@/content/design/case-studies'

export function StudyCard({ study, wide = false }: { study: CaseStudy; wide?: boolean }) {
  const { card } = study
  const sector = tones[sectors[study.sector].tone]
  return (
    <SiteLink href={caseStudyHref(study.slug)} className={`dc-cs-card dc-lift${wide ? ' dc-cs-wide' : ''}`}>
      <div className="dc-cs-cover">
        {card.cover.kind === 'photo' ? (
          <img src={card.cover.src} alt={card.cover.alt} style={{ objectPosition: card.cover.position }} />
        ) : (
          <div className="dc-cs-type">
            <StatFigure value={card.stat.value} label={card.stat.label} size={64} labelSize={16} />
          </div>
        )}
      </div>
      <div className="dc-cs-card-body">
        <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="dc-cs-tag" style={{ background: sector.bg, color: sector.ink }}>
            {sectors[study.sector].label}
          </span>
          <span className="dc-cs-tag" style={{ background: '#F1F4FA', color: '#2F4D9F' }}>
            {audiences[study.audience].tag}
          </span>
        </span>
        <span className="dc-cs-card-title">{card.title}</span>
        <span className="dc-cs-card-summary dc-cs-sum-desktop">{card.summary}</span>
        {card.mobileSummary && <span className="dc-cs-card-summary dc-cs-sum-mobile">{card.mobileSummary}</span>}
        <span className="dc-tlink" style={{ marginTop: 'auto', paddingTop: 6, alignSelf: 'flex-start' }}>
          Read case study <ArrowIcon />
        </span>
      </div>
    </SiteLink>
  )
}

export function StatFigure({
  value,
  label,
  size,
  labelSize,
}: {
  value: string
  label: string
  size: number
  labelSize: number
}) {
  return (
    <>
      <span style={{ fontSize: size, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
        {value}
      </span>
      <span
        style={{
          display: 'block',
          marginTop: size > 64 ? 10 : 8,
          fontSize: labelSize,
          lineHeight: 1.45,
          maxWidth: '26ch',
          color: size > 64 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.9)',
        }}
      >
        {label}
      </span>
    </>
  )
}
