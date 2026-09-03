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
  '- **Logo permission** for all 27 partner marks. They now run at full colour',
  '  and a third larger than before, which makes the permission question more',
  '  pointed, not less.',
  '- **Dakshayini\'s testimonial.** The quote on the early-stage panel is a',
  '  placeholder attributed to a real, named person at a real organisation.',
  '  Either get her actual words in writing or pull the attribution. This is',
  '  the single most urgent item on this list.',
  '- **The failure case study.** The last card ("The project where the',
  '  dashboard was the wrong answer") is the page\'s credibility keystone. If',
  '  Goalkeep will not publish it, swap in a navy "how we work" card — but it',
  '  is worth pushing for, being the most on-brand thing the site could hold.',
  '',
  '## Back to Rumit',
  '',
  '- **A dropped negation in the feedback doc.** The Build handwritten line',
  '  reads "Your data dashboard should have all the possible data on it be',
  '  intuitive, focused, and easy to understand." That sentence is missing a',
  '  negation and a break. The site currently runs a short version of the',
  '  intended meaning — "not every number, just the ones that change a',
  '  decision" — which needs a yes or a rewrite.',
  '- **The Design phase note is cut off mid-sentence** ("then can the right 30%',
  '  be reserved for showing a simple "). The handwritten line in that panel is',
  '  ours, in voice, pending his version.',
  '- **The three blanks** in "Early-stage NGOs often struggle with ___, ___ and',
  '  ___" were filled in as "messy spreadsheets", "reporting season" and',
  '  "numbers nobody owns". His call.',
  '- **DLP video.** The two video links came through without URLs. The hero',
  '  currently runs a slow crossfade through four real field photographs, which',
  '  is the closest thing to footage we can build from what we have.',
  '',
  '## Photography',
  '',
  '- **The photographs are real and are Goalkeep\'s own** — supplied from the',
  '  Drive folder in September 2026. The four Unsplash stand-ins have been',
  '  deleted. Photos may now be captioned as real workshops and partner sites.',
  '  See `public/photos/CREDITS.md` for the mapping.',
  '- **Carousel captions need confirming.** The four case-study covers are',
  '  named in Drive (Apni Shala, Baithak, Vanavil, Veruschka) and their cities',
  '  are our best guess; the workshop and field frames are captioned',
  '  generically until someone confirms which partner site each was shot at.',
  '- **The AI-generated images were not used.** Five files in the Drive folders',
  '  begin "ChatGPT Image". A generated workshop photo on a social-sector site',
  '  is worse than no photo.',
  '- **The team portraits are real.** Missing: Manije Kelkar, Swapneel Rane and',
  '  Simran Adwani, who have no portrait on the current site.',
  '- **The wordmark is now the real one**, from the brand Drive, in an ink and',
  '  a white version. The hand-drawn TSX stand-in has been deleted.',
  '',
]

writeFileSync(new URL('../VERIFY.md', import.meta.url), lines.join('\n'))
console.log(`VERIFY.md written — ${rows.length} items outstanding`)
