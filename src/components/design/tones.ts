/** Tint and ink pairs the export uses for chips and cards. */
export const tones = {
  gold: { bg: '#FBF3DF', ink: '#7D5E0C' },
  blue: { bg: '#EAEFF9', ink: '#2F4D9F' },
  teal: { bg: '#E7F2F0', ink: '#176059' },
  coral: { bg: '#FBEEE9', ink: '#9C452A' },
} as const

export type Tone = keyof typeof tones
