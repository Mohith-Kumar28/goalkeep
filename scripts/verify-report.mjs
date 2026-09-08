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
  '- **The handover FAQ is unfinished.** "What happens after you leave?" is the',
  '  one answer the copy replacement left open — it says "Goalkeep to confirm',
  '  the specifics". It needs to name what handover actually includes:',
  '  documentation, training, and who to call.',
  '- **Logo permission** for all 27 partner marks. They now run at full colour',
  '  and a third larger than before, which makes the permission question more',
  '  pointed, not less.',
  '- **Testimonial permission and portraits.** The three audience quotes are now',
  '  attributed to named people at named organisations — Revathi Radhakrishnan',
  '  (Vanavil Trust), Shivangi Desai (Goonj) and Freya Ray (Dasra). Written',
  '  permission for each, and a portrait: until one arrives the card shows a',
  '  monogram, because a stock photograph of somebody else beside a named quote',
  '  is not a thing to ship.',
  '- **The CSR overhead answer** tells funders what Indian law says. Somebody',
  '  who can stand behind that reading should sign it off.',
  '',
  '## Back to Rumit',
  '',
  '- **A slip in the intermediary copy.** The body reads "what impact did the',
  '  funding we have to organization X create?" — "have" looks like it should',
  '  be "gave". Left verbatim rather than corrected silently.',
  '- **The hero card rotation.** The copy replacement specified the Baithak card',
  '  only. The other two cards in the rotation carry lines trimmed from Vanavil',
  '  and Apni Shala\'s own case-study cards in the same document. Either confirm',
  '  those, or the rotation drops to the single Baithak card.',
  '- **The numbers band is unchanged** ("keep this the same for now"), so it is',
  '  still the only place on the page carrying figures we cannot source — and',
  '  it is now the *only* place carrying figures at all, since the what-we-do',
  '  stat band and the case-study before/after numbers were both cut.',
  '- **Peepul has no photograph of its own.** Its case-study card runs the',
  '  generic dashboard frame until one arrives.',
  '- **DLP video.** The two video links came through without URLs. The numbers',
  '  band currently runs a slow crossfade through four real field photographs,',
  '  which is the closest thing to footage we can build from what we have.',
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
