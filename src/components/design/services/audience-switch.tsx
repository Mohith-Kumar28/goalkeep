import type { Audiences } from '@/content/design/service-page'
import type { Audience } from './state'

const icons: Record<Audience, string> = {
  nonprofit:
    '<path d="M3 21h18"></path><path d="M5 21V8l7-5 7 5v13"></path><path d="M9 21v-6h6v6"></path>',
  funder:
    '<circle cx="12" cy="12" r="9"></circle><path d="M15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.4 0-2.5-.6-3.1-1.6"></path><path d="M12 6v2M12 16v2"></path>',
}

export function AudienceSwitch({
  audiences,
  value,
  onPick,
}: {
  audiences: Audiences
  value: Audience
  onPick: (audience: Audience) => void
}) {
  const order: Array<Audience> = ['nonprofit', 'funder']
  return (
    <div className="dc-aud-sticky">
      <div className="dc-shell dc-aud-bar">
        <div role="radiogroup" aria-label="Show this page for" className="dc-aud-switch">
          <span
            aria-hidden="true"
            className="dc-aud-thumb"
            style={{ transform: `translateX(${value === 'funder' ? '100%' : '0%'})` }}
          />
          {order.map((audience) => {
            const on = audience === value
            return (
              <button
                key={audience}
                type="button"
                className="dc-aud-opt"
                role="radio"
                aria-checked={on}
                onClick={() => onPick(audience)}
                style={{ color: on ? '#2F4A92' : '#2F4D9F' }}
              >
                <span
                  aria-hidden="true"
                  className="dc-aud-ico"
                  style={{
                    background: on ? '#2F4A92' : 'rgba(255,255,255,0.75)',
                    color: on ? '#FFFFFF' : '#2F4D9F',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: icons[audience] }}
                  />
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.25 }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>{audiences[audience].label}</span>
                  <span className="dc-aud-sub" style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>{audiences[audience].sub}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
