import { SiteLink } from '@/components/design/site-link'
import { contactEmail, footerGroups, linkedinUrl, site } from '@/content/site'

function MailIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.54h.05c.53-1 1.82-2.04 3.75-2.04 4 0 4.75 2.63 4.75 6.05V21h-4v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.87 1.27-1.87 2.59V21h-4V9.75Z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="dc-footer">
      <div className="dc-shell dc-footer-grid">
        <div className="dc-footer-brand">
          <SiteLink href="/" aria-label="Goalkeep home" className="dc-footer-logo">
            <img src="/wordmark-ink.webp" alt="Goalkeep" width={673} height={160} />
          </SiteLink>
          <p>{site.tagline}</p>
          <div className="dc-footer-actions">
            <a href={`mailto:${contactEmail}`} className="dc-btn dc-btn-primary">
              <MailIcon />
              Email us
            </a>
            <a
              href={linkedinUrl}
              className="dc-btn dc-btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
          </div>
        </div>
        <nav aria-label="Footer" className="dc-footer-nav">
          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h2>{group.heading}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <SiteLink href={link.to}>{link.label}</SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="dc-shell dc-footer-base">
        <p>© {new Date().getFullYear()} Goalkeep</p>
      </div>
    </footer>
  )
}
