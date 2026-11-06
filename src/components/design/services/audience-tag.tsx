import { tones } from '../tones'
import type { Tone } from '../tones'

/** "For nonprofits" / "For funders" pill. */
export function AudienceTag({ children, tone, onNavy = false }: { children: string; tone: Tone; onNavy?: boolean }) {
  return (
    <span
      className="dc-aud-tag"
      style={
        onNavy
          ? { background: 'rgba(255,255,255,0.12)', color: '#FFFFFF' }
          : { background: tones[tone].bg, color: tones[tone].ink }
      }
    >
      {!onNavy && (
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
      {children}
    </span>
  )
}
