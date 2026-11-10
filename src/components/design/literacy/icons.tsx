import type { CSSProperties, ReactNode } from 'react'
import type { AiStep, GlanceIcon } from '@/content/design/literacy'

const glanceShapes: Record<GlanceIcon, ReactNode> = {
  people: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path d="M17 4a4 4 0 0 1 0 8" />
      <path d="M22 21a6 6 0 0 0-4-5.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  book: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5 5 0 0 1 6.4-.6l.4.3a5 5 0 0 0 3.2.9" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </>
  ),
}

const aiShapes: Record<AiStep['icon'], ReactNode> = {
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="m12 8 1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
}

function OutlineIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export const GlanceGlyph = ({ icon }: { icon: GlanceIcon }) => <OutlineIcon>{glanceShapes[icon]}</OutlineIcon>
export const AiGlyph = ({ icon }: { icon: AiStep['icon'] }) => <OutlineIcon>{aiShapes[icon]}</OutlineIcon>

export function CalendarBadgeIcon() {
  return (
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
      {glanceShapes.calendar}
    </svg>
  )
}

export function Tick({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    <svg aria-hidden="true" width="26" height="26" viewBox="0 0 28 28" style={style} className={className}>
      <path
        d="M 5 15 Q 9 18 11.5 22 Q 16 11 24 5"
        fill="none"
        stroke="#F6D83A"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
