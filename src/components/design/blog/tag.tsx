import type { ReactNode } from 'react'
import { tones } from '@/components/design/tones'
import type { Tone } from '@/components/design/tones'

export function Tag({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className="dc-blog-tag" style={{ background: tones[tone].bg, color: tones[tone].ink }}>
      {children}
    </span>
  )
}
