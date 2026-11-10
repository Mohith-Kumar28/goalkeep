import { SiteLink } from '@/components/design/site-link'
import { banner } from '@/content/site'

export function AnnouncementBanner() {
  if (!banner.enabled) return null
  return (
    <div className="dc-banner" role="region" aria-label="Announcement">
      <p className="dc-shell">
        {banner.text}{' '}
        <SiteLink href={banner.link.to}>{banner.link.label}</SiteLink>
      </p>
    </div>
  )
}
