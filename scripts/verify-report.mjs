/**
 * Generates VERIFY.md from the content tree.
 *
 * Every claim on the site that we could not source carries a `verify` note in
 * src/content. Generating the sign-off list from those notes means the list
 * can never drift from what the page actually says.
 *
 *   node --experimental-strip-types scripts/verify-report.mjs
 */
import { writeFileSync } from 'node:fs'

const modules = {
  homepage: await import('../src/content/homepage.ts'),
  partners: await import('../src/content/partners.ts'),
}

const rows = []

function walk(node, path) {
  if (node === null || typeof node !== 'object') return
  if (typeof node.verify === 'string' && 'value' in node) {
    const v = node.value
    const shown =
      typeof v === 'string'
        ? v
        : typeof v === 'object'
          ? Object.values(v).filter((x) => typeof x === 'string').join(' — ')
          : String(v)
    rows.push({ path, claim: shown, note: node.verify })
    return
  }
  for (const [k, child] of Object.entries(node)) {
    walk(child, path ? `${path}.${k}` : k)
  }
}

for (const [name, mod] of Object.entries(modules)) walk({ ...mod }, name)

const lines = [
  '# VERIFY — claims needing client sign-off',
  '',
  'Generated from `src/content` by `pnpm verify:report`. Do not edit by hand:',
  'clear the `verify` field on a content entry once it is confirmed, and this',
  'list shrinks on its own.',
  '',
  `**${rows.length} item${rows.length === 1 ? '' : 's'} outstanding.**`,
  '',
  'Nothing here is invented as fact. Every line is drafted in Goalkeep\'s',
  'published voice with plausible, non-inflated stand-ins, and every one needs',
  'a real number, a real name, or a permission before launch.',
  '',
  '| # | Where | What the page currently says | What to confirm |',
  '|---|---|---|---|',
  ...rows.map(
    (r, i) =>
      `| ${i + 1} | \`${r.path}\` | ${r.claim.replace(/\|/g, '\\|').slice(0, 120)} | ${r.note.replace(/\|/g, '\\|')} |`,
  ),
  '',
  '## Blocking before launch',
  '',
  '- **The data-privacy FAQ answer needs legal review.** Every sentence in it is',
  '  a commitment Goalkeep would be held to.',
  '- **Logo permission.** The ticker footnote reads "Logos shown with',
  '  permission", so that has to be true for all 27 marks.',
  '- **The failure case study.** Card 5 ("The project where the dashboard was',
  '  the wrong answer") is the page\'s credibility keystone. If Goalkeep will not',
  '  publish it, swap in a charcoal "how we work" card — but it is worth pushing',
  '  for, being the most on-brand thing the site could contain.',
  '',
  '## Photography',
  '',
  '- **The field photographs are stock, not Goalkeep\'s work.** Four Unsplash',
  '  images stand in across the hero, the audience panels and the case-study',
  '  cards. They are deliberately never captioned as a named organization or',
  '  project, because they are not. **Replace them with Goalkeep\'s own field',
  '  photography before launch.** See `public/photos/CREDITS.md`.',
  '- **The team portraits are real** — Goalkeep\'s own people, pulled from',
  '  goalkeep.net. Missing: Manije Kelkar, Swapneel Rane and Simran Adwani,',
  '  who have no portrait on the current site.',
  '- **Wordmark SVG.** The only file recoverable from the live site is a 13 KB',
  '  JPG. `src/components/layout/wordmark.tsx` is a faithful stand-in built to',
  '  the brand book\'s description, not the real mark.',
  '',
]

writeFileSync(new URL('../VERIFY.md', import.meta.url), lines.join('\n'))
console.log(`VERIFY.md written — ${rows.length} items outstanding`)
