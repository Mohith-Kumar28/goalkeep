import { SiteLink } from '@/components/design/site-link'
import { site } from '@/content/site'

export function SiteFooter() {
  return (
    <footer className="dc-footer">
      <div
        className="dc-shell"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SiteLink href="/" aria-label="Goalkeep home" style={{ alignSelf: 'flex-start' }}>
            <img
              src="/wordmark-ink.webp"
              alt="Goalkeep"
              width={673}
              height={160}
              style={{ height: 32, width: 'auto', display: 'block' }}
            />
          </SiteLink>
          <p style={{ margin: 0, fontSize: 15, color: 'rgba(20,19,26,0.72)', maxWidth: '44ch' }}>{site.tagline}</p>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(20,19,26,0.72)' }}>
          © {new Date().getFullYear()} Goalkeep
        </p>
      </div>
    </footer>
  )
}
