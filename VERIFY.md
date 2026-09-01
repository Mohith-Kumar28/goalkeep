# VERIFY — claims needing client sign-off

Generated from `src/content` by `pnpm verify:report`. Do not edit by hand:
clear the `verify` field on a content entry once it is confirmed, and this
list shrinks on its own.

**18 items outstanding.**

Nothing here is invented as fact. Every line is drafted in Goalkeep's
published voice with plausible, non-inflated stand-ins, and every one needs
a real number, a real name, or a permission before launch.

| # | Where | What the page currently says | What to confirm |
|---|---|---|---|
| 1 | `homepage.audiences.0.quote` | We didn't need a dashboard. We needed to agree on what we were counting. — Program director, early-stage education NGO,  | Real quote and attribution, or permission to run it anonymized. |
| 2 | `homepage.audiences.1.quote` | For the first time, the number in the board deck matched the number in the field. — MEL lead, health nonprofit working i | Real quote and attribution, or permission to run it anonymized. |
| 3 | `homepage.audiences.2.quote` | The honest answer was that our indicators were asking grantees for things they'd never collect. So we changed the ask. — | Real quote and attribution, or permission to run it anonymized. |
| 4 | `homepage.caseStudies.0.stat` | 11 hrs → 40 min monthly reporting cycle | Real before/after figures and permission to publish them. |
| 5 | `homepage.caseStudies.1.stat` | 4 formats → 1 shared indicator set | Real figures and the organization name, or approval to anonymize. |
| 6 | `homepage.caseStudies.2.stat` | 38 indicators → 17 | Real figures and the funder name, or approval to anonymize. |
| 7 | `homepage.caseStudies.3.stat` | 9 weeks from first call to first baseline | Real timeline and organization. |
| 8 | `homepage.caseStudies.4.stat` | A post-mortem, published in full | Whether Goalkeep will publish a failure case. This card is the page’s credibility keystone — push for it. If declined, swap for a charcoal "how we work" card. |
| 9 | `homepage.closing.marginalia` | Replies come from a person, usually within two working days. | The response-time promise, with Manije. |
| 10 | `homepage.faqs.0` | What does this cost? — Projects are scoped, not priced off a rate card. Most of our work falls into three shapes: a shor | Durations, engagement shapes and the Kickstarter pricing model with Manije. |
| 11 | `homepage.faqs.1` | How long until we see something useful? — You see the audit findings in week two or three — the honest picture of where  | Real timelines. |
| 12 | `homepage.faqs.3` | Do we get a dashboard at the end? — Often, but not always, and we'd rather say that up front. About a third of the time  | The "about a third" figure — either source it or soften the claim. |
| 13 | `homepage.faqs.4` | What happens to our data, and who can see it? — Your data stays yours. We work inside your systems and your accounts whe | LEGAL REVIEW REQUIRED before publishing. Every sentence here is a commitment. |
| 14 | `homepage.faqs.5` | What happens after you hand over? — Handover is a deliverable, not an email. You get documentation written for the perso | The free 30/90-day check-in commitment. |
| 15 | `homepage.faqs.6` | Do you work outside India? — Yes. We’re based in India and most of our work is here, which means we understand Indian re | Which geographies to name. |
| 16 | `homepage.honestStat` | 73% of dashboards we audit aren't opened twice. — Goalkeep audit sample, 2024–2026 | Source and sample size for the 73% figure — it appears in the brand book. |
| 17 | `homepage.ticker.line` | 27 organizations, and the funders who back them. | Counted from the logos currently on goalkeep.net. Confirm the real number — the site says "40+" elsewhere. |
| 18 | `homepage.whatWeDoStat` | 4 hrs — saved every Monday by one M&E lead after we rebuilt their reporting flow. | Attribution and the real figure. Taken from the brand book example. |

## Blocking before launch

- **The data-privacy FAQ answer needs legal review.** Every sentence in it is
  a commitment Goalkeep would be held to.
- **Logo permission.** The ticker footnote reads "Logos shown with
  permission", so that has to be true for all 27 marks.
- **The failure case study.** Card 5 ("The project where the dashboard was
  the wrong answer") is the page's credibility keystone. If Goalkeep will not
  publish it, swap in a charcoal "how we work" card — but it is worth pushing
  for, being the most on-brand thing the site could contain.

## Photography

- **The field photographs are stock, not Goalkeep's work.** Four Unsplash
  images stand in across the hero, the audience panels and the case-study
  cards. They are deliberately never captioned as a named organization or
  project, because they are not. **Replace them with Goalkeep's own field
  photography before launch.** See `public/photos/CREDITS.md`.
- **The team portraits are real** — Goalkeep's own people, pulled from
  goalkeep.net. Missing: Manije Kelkar, Swapneel Rane and Simran Adwani,
  who have no portrait on the current site.
- **Wordmark SVG.** The only file recoverable from the live site is a 13 KB
  JPG. `src/components/layout/wordmark.tsx` is a faithful stand-in built to
  the brand book's description, not the real mark.
