import { tones } from '../tones'
import type { Tone } from '../tones'

/** What the export hard-codes per page colour besides the tint and ink pair. */
export const toneAccents = {
  gold: { base: '#EAC452', shadow: 'rgba(125,94,12,0.24)', hatch: '#F7DB63' },
  blue: { base: '#3F63C8', shadow: 'rgba(47,77,159,0.24)', hatch: '#8FA8E8' },
  teal: { base: '#2F9C8F', shadow: 'rgba(23,96,89,0.24)', hatch: '#5FC9BA' },
  coral: { base: '#E07A5F', shadow: 'rgba(156,69,42,0.24)', hatch: '#F0A58C' },
} as const satisfies Record<Tone, { base: string; shadow: string; hatch: string }>

/** The tint of each of the six sign notes, which the export cycles from the page colour. */
export const signTones = {
  gold: ['gold', 'blue', 'teal', 'coral', 'blue', 'gold'],
  blue: ['blue', 'teal', 'gold', 'coral', 'blue', 'teal'],
  teal: ['teal', 'gold', 'blue', 'coral', 'teal', 'gold'],
  coral: ['coral', 'blue', 'gold', 'teal', 'coral', 'blue'],
} as const satisfies Record<Tone, ReadonlyArray<Tone>>

export const toneStyle = (tone: Tone) => ({ ...tones[tone], ...toneAccents[tone] })
