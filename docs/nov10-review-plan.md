# Goalkeep v5: Nov 10 review, complete plan

Every point from both source documents, read top to bottom, each with its source, status and owner.

**Sources.**
- **CL** is the change list doc ("Goalkeep website: change list for Mohith").
- **T hh:mm** is a timestamp in the full meeting transcript.
- **N** is the Gemini summary and next steps in the notes doc.

Both docs were re-downloaded on Nov 10 and match the copies in this folder. Neither has review comments. Three CL items are struck through, which means Rumit marked them done.

**Status values.**
- **DONE (commit)** means shipped and verified in the browser.
- **TODO (agent)** means in progress in wave 2.
- **BLOCKED (who)** means it needs input from someone.
- **HOLD** means the doc says not to do it yet.
- **WONTDO** means rejected, with the reason given.

**Commits.**
- `b0dce96`: Kickstarter 3.0.
- `e798f91`: wave 1.
- `5cee728`: the shared `ClampText` read-more component.

**Wave 2 owners.** Each owns separate files.
- **A.** Forms and email.
- **B.** Homepage.
- **C.** Service pages.
- **D.** Kickstarter and Data Literacy Program.
- **E.** Case studies, blog, About, footer links.
- **F.** SEO and the test runner.

---

## 1. Site-wide

| # | Point | Source | Status |
|---|---|---|---|
| 1.1 | Add the new pages: About, case studies listing, 4 case studies (Peepul, British Asian Trust, Vanavil, Baithak), data quiz | CL (struck) | DONE before this round. All 4 slugs exist. |
| 1.2 | Case studies menu and buttons go to `/case-studies`, not home. "Take the data culture quiz" goes to the quiz. | CL (struck), T 03:08 | DONE before this round. |
| 1.3 | Kickstarter 2.0 becomes 3.0 everywhere: badges, buttons, menu, titles, body | CL, T 04:23, N | DONE `b0dce96` |
| 1.4 | Never write "KC". Always the full name "Kickstarter". | CL, T 05:20, N | DONE. No "KC" anywhere in source. |
| 1.5 | Partner logos in two labelled rows, "Nonprofits" and "Funders & intermediaries". This replaces the single strip and supersedes CL's "group by domain" and the honeycomb idea. | CL, T 06:28 to 10:32, N | DONE `e798f91`. The grouping is provisional. |
| 1.6 | Partner logos on the homepage and the Data Literacy Program page | CL | DONE `e798f91` |
| 1.7 | Rumit confirms which logo goes in which row | CL, T 09:21, N (Rumit) | BLOCKED (Rumit). A provisional table is in the wave-1 report. Changing a row is one field per logo in `src/content/partners.ts`. |
| 1.8 | Decision infrastructure hexagon stands out: the red border shade as fill, with cream or light text that stays legible | CL ("one shade darker"), T 10:32 to 11:37, N | DONE `e798f91` (#B05440 with cream text, about 4.7:1 contrast). `scripts/recolor-hexagon.py` re-renders the video. |
| 1.9 | Standard footer on every page: nav links, email button, LinkedIn button | CL, T 18:12, N | DONE `e798f91` |
| 1.10 | Footer email and LinkedIn are real addresses | (found in wave 1) | BLOCKED (Rumit). `hello@goalkeep.net` and `linkedin.com/company/goalkeep` are guesses, set in `site.ts` as `contactEmail` and `linkedinUrl`. |
| 1.11 | Footer links lead to real pages, not stubs. `/careers`, `/custom-projects`, `/what-we-do` and `/contact` are empty placeholder pages. | (found in this audit) | DONE `e892c0c`. The footer links only to real pages. Careers and Custom projects are removed. Design, build, adopt now goes to `/#what-we-do` and Contact to `/#contact`. |
| 1.12 | Hamburger menu: the "Partner with us" button's text is unreadable | T 42:51, N | DONE `e798f91` |
| 1.13 | Tiny announcement strip at the top: one line plus an underlined link, which can be enabled, disabled and changed | CL (to decide), T 29:16, N | DONE `e798f91`. It ships off. Toggle `banner` in `src/content/site.ts`. |
| 1.14 | Remove the yellow highlight from case studies "everywhere" | CL, T 13:57, N | DONE everywhere (`e798f91` and `e892c0c`). The gold Education *category* tag is now blue on service cards. It stays gold on the case-study listing, where it is the sector colour and not a highlight. |
| 1.15 | Tighten padding. Sections feel very large, so make everything tighter and more compact. | CL, T 11:37 | DONE `e892c0c` on every page. Page heights at 390px dropped 25 to 45% (see 12). |
| 1.16 | Card sizes on different pages are too large, as are the big icons. Shrink them to minimise scroll. | CL (to decide), T 29:16 to 30:41 | DONE `e892c0c` |
| 1.17 | Scroll-reveal animations as on the homepage, consistent across the whole site | T 40:11 | DONE `e892c0c`. `Reveal` is used on every page. |
| 1.18 | Programs becomes Solutions in the menu | CL hold, T 20:38, N | HOLD |
| 1.19 | Repeated photos across pages (the Baithak photo three times) | CL hold, T 19:21 | HOLD (Rumit and Samuel are sending a photo map) |
| 1.20 | Data Literacy "Who the program is for" person 2 is Gayatri, captioned as a cohort MEL leader | CL hold, T 20:38 | HOLD (a replacement photo is coming) |
| 1.21 | SEO optimisation | CL (to decide) | DONE `e892c0c`. Every live route has a unique title, description, canonical URL, OG and Twitter tags. Also added: `public/sitemap.xml` (17 URLs) and Organization JSON-LD. The domain is goalkeep.net. |
| 1.22 | Blog page: "since there are no blogs, we probably won't put it live" | T 03:08 | DONE `e892c0c`. Blog links are hidden from the nav and footer until `VITE_BLOG_LIVE=true`. `/resources/blog` still loads. |

## 2. Homepage

| # | Point | Source | Status |
|---|---|---|---|
| 2.1 | Hero line: "Enabling social sector organisations to use data to scale impact." | CL, T 11:37 | DONE |
| 2.2 | All 3 banner cards look like the SVP Dasra card: organisation name on line 2, description in 3 lines | CL, T 11:37 to 12:58, N | DONE. Three lines at 390px. At 360px, Apni Shala and Peepul clamp at 3 lines with Read more. |
| 2.3 | Apni Shala card text (exact) | CL | DONE |
| 2.4 | Peepul card text (exact) | CL | DONE |
| 2.5 | "Teams and cohorts" becomes "teams and organisations" | CL, T 12:58 | DONE |
| 2.6 | Why we exist: text on the right of the picture garbled on phones | CL, T 13:57, N | DONE (the outcomes render as real text below 640px) |
| 2.7 | Mission line (short version) | CL, T 13:57 | DONE |
| 2.8 | Case studies: remove the yellow highlight | CL, T 13:57 | DONE |
| 2.9 | Who we work with labels: "Early stage nonprofits", "Mid-to-Large Nonprofits", "Funders" | CL, T 14:39 | DONE |
| 2.10 | Label colour: "it's blue for everything", so it should follow each tab's colour (dark blue, green or red), or plain black | CL, T 15:23 | DONE `e892c0c`. The "WHO WE DO IT FOR" label was the always-blue element. It is now black, as is the Talk to us text. |
| 2.11 | Funders text (exact) | CL | DONE |
| 2.12 | Our approach: text half always black on white, with animation only in the image area on hover | CL, T 15:23 to 16:54, N | DONE |
| 2.13 | Audience buttons: Early stage gets Kickstarter + Talk to us. Mid-large gets DLP + Talk to us. Intermediaries and funders get Partner with us. | CL, T 16:54, N | DONE |
| 2.14 | Open-source line (exact) | CL, T 16:54 | DONE in the FAQ and in What we do (`services.ts`) |
| 2.15 | Dashboard paragraph (exact) | CL, T 18:12 | DONE |
| 2.16 | FAQ question and answer (exact) | CL, T 18:12 | DONE |
| 2.17 | Mobile: the "short version" footage in landscape instead of vertical, with the 4 metrics two to a row | T 34:24 to 35:47 | DONE |
| 2.18 | Mobile: case-study cards swipe left and right | T 35:47 to 36:45, N | DONE |
| 2.19 | Mobile: text over 3 lines gets "read more" | T 35:47 | DONE `e892c0c` |
| 2.20 | Mobile: shrink large sections. What we do (1,953px) and Who we do it for (1,503px) are the tallest. | T 32:27 to 34:24, N | DONE `e892c0c`. What we do is a swipe row on phones, down from 1,953px to 686px. |
| 2.21 | Mobile: click-to-select sections get scroll-based selection, icon left with text right, four per screen, and no tap hint | T 36:45 to 38:58, N | DONE `e892c0c`. Who we do it for on phones is a compact icon-left list. Scrolling steps through the four options and tapping jumps to one. Desktop still switches on click. |
| 2.22 | Homepage and About mobile finished first, by Nov 11 5 PM | T 50:11 to 51:42, N | Wave 1 DONE, wave 2 continues |

## 3. Service pages (all four)

| # | Point | Source | Status |
|---|---|---|---|
| 3.1 | Impact: hero button "Read Peepul case study" becomes "Peepul case study". Remove "read" from every such button. | CL, CL hold, T 18:12, N | DONE (also Apni Shala and Dasra) |
| 3.2 | Impact: case-study tag 2 becomes "Building organizational impact dashboard" | CL | DONE |
| 3.3 | Impact: case-study summary (exact) | CL | DONE |
| 3.4 | Data systems: "Typically 3 to 4 months.", with the marks to match | CL, T 18:12 | DONE |
| 3.5 | Dashboards: Jishnu photo stretched | CL (struck) | DONE before this round (struck). Wave 1 found no stretching at any width. |
| 3.6 | Dashboards: marks wk 1 to wk 10 become months, 3 to 4. Check the funder variant. | CL | DONE (the funder variant shares the same section) |
| 3.7 | Data adoption: remove the "6 months" mark, ending at "3 months" | CL | DONE |
| 3.8 | "How long it takes": untidy and too large. Compress it to text on the left and the timeline on the right. | T 30:41 to 32:27 | DONE |
| 3.9 | Timeline is scroll-responsive on mobile | N (00:40) | DONE `e892c0c` |
| 3.10 | "What you leave with" on mobile: two per line, smaller | T 40:11, N | DONE |
| 3.11 | Approach sections on mobile: never two images in a row. Always image then text. | T 38:58 to 40:11, N | DONE `e892c0c` |
| 3.12 | Click-to-select sections on mobile (the nonprofit/funder toggle and any tabs): scroll-select, icon left with text right, 4 per screen, no tap hint | T 36:45 to 38:58, N | DONE `e892c0c`. The six signs are one-line icon rows that select on scroll, and the tap prompt is hidden on mobile. The nonprofit/funder toggle stays a pinned two-option bar. |
| 3.13 | Six-signs grids and other icon cards: big icons, shrink them on mobile | T 29:16 to 30:41 | DONE `e892c0c` |
| 3.14 | Read more for text over 3 lines on mobile | T 35:47 | DONE `e892c0c` |
| 3.15 | Case-study cards: no yellow highlight | T 13:57 | DONE `e892c0c` |

## 4. Kickstarter

| # | Point | Source | Status |
|---|---|---|---|
| 4.1 | Hero badge "Kickstarter 3.0 · next cohort begins January 2027" | CL | DONE |
| 4.2 | "Apply for Kickstarter 3.0" on the hero and after the last stage, both opening the application form | CL, T 19:21 | DONE (one `applyUrl`). BLOCKED (Rumit) for the public form link. |
| 4.3 | Stage 3 first sentence (exact). The rest stays. | CL | DONE |
| 4.4 | "remaining 6 months" becomes 8 months | CL hold, T 20:38 | HOLD |
| 4.5 | "What we lead with" (the transcript's mishearing of the **fit band**: "Kickstarter may be right for you if any of these sound familiar", 10 speech bubbles): reduce 10 to 6 | T 41:40, N (Rumit) | DONE `e892c0c`. 6 shown, and 4 kept in the data with `shown: false` (lesson planning, Excel cleaning, livelihood rate, mental-health tracking). BLOCKED (Rumit) for the final pick. |
| 4.6 | Fit band flow: first paragraph, then the bubbles light up one by one on scroll, then the second paragraph and CTA | T 41:40 to 42:51, N | DONE `e892c0c`. The bubbles light up with scroll position, not a timer. Reduced motion shows them statically. |
| 4.7 | Approach and why sections on mobile: alternate image and text, never two images together | T 38:58 | DONE `e892c0c` |
| 4.8 | "What changes after" cards (end of engagement): two per line on mobile, smaller | T 40:11, N | DONE `e892c0c` |
| 4.9 | Stages (understand, design, build, adopt) are fine as they are | T 41:40 | No change |
| 4.10 | Click-to-select on mobile becomes scroll-select (stages auto-cycle and tabs) | T 36:45 | DONE `e892c0c`. Stages use a swipe track that selects as it scrolls. |
| 4.11 | Shrink, read more, reveal, padding | 1.15 to 1.17, 2.19 | DONE `e892c0c` |

## 5. Data Literacy Program

| # | Point | Source | Status |
|---|---|---|---|
| 5.1 | Hero badge: "next cohort begins January 2027" | CL | DONE. The second "Begins December 2026" line is also fixed. |
| 5.2 | AI heading without "only" | CL | DONE |
| 5.3 | Partner logos, two rows | CL | DONE |
| 5.4 | Person 2 photo (Gayatri) | CL hold | HOLD |
| 5.5 | Click-to-select on mobile (the "Show me what happens after" flow, skills tabs), scroll-select, two per line, shrink, read more, reveal, padding | T 36:45 to 41:40 | DONE `e892c0c`. The skills tabs use the swipe-select pattern. The "what happens after" flow plays when scrolled into view. The who-it's-for checklist lights up on scroll. |

## 6. About

| # | Point | Source | Status |
|---|---|---|---|
| 6.1 | Mobile: don't open on the big founder image. Shrink it so 3 to 4 lines of text show, or put the image next to her sign-off. | T 44:23 to 46:42, N ("resize element") | DONE |
| 6.2 | Team grid two per line, smaller | T 44:23 | DONE |
| 6.3 | Tapping a person opens the bio below that card, not at the top | T 45:36 | DONE |
| 6.4 | Other About bands use space better on mobile, two per line where it fits | T 44:23 ("even this…") | DONE `e892c0c` |

## 7. Quiz

| # | Point | Source | Status |
|---|---|---|---|
| 7.1 | "A little bit about you" step: thin separator line between the field groups | T 43:52 | DONE (placement is a judgement call) |
| 7.2 | A shape must cover the semicircle behind it all the way through, not stop short | T 43:52 to 44:23 | DONE `e892c0c`. The g-mark back ring now runs exactly between its crossing points. No other quiz step has an arc. |
| 7.3 | On completion show only "Thank you, please check your email". No score on screen. | T 26:53 | DONE. This was already the case and has been re-verified: no score appears on screen. |
| 7.4 | The email is customised to one of 4 performance categories | T 26:53 to 28:10, N | DONE `e892c0c`. Four bands (Getting started, Emerging, Developing, Established) are in `src/content/quiz.ts`, and the email uses them. BLOCKED (Rumit) for the thresholds and copy, which are listed in VERIFY.md. |
| 7.5 | Quiz submitters are added to Mailchimp | T 28:10 to 29:16, N | DONE `e892c0c` |

## 8. Newsletter and Mailchimp

| # | Point | Source | Status |
|---|---|---|---|
| 8.1 | Every form submission (contact, partner, newsletter, quiz) goes into the Mailchimp audience | T 28:10 to 29:16, N | DONE `e892c0c`. `src/server/mailchimp.ts` handles contact, partner, quiz and newsletter signups, each tagged with its source. |
| 8.2 | Regular subscribe gets Mailchimp's confirm-your-email (double opt-in) | T 24:42 | DONE in code (members are added as `pending`). It goes live once the API key is set (8.5). |
| 8.3 | "Subscribe to keep reading" on a past edition sends that edition to the new subscriber | T 22:40 to 25:55, N | DONE `e892c0c`. All archive URLs were found in Mailchimp's public archive. Which October send is the nonprofit one and which the funder one is inferred and flagged in VERIFY.md. |
| 8.4 | Audience split: nonprofit and funder versions, 85 to 90% identical | T 22:40 to 23:37 | DONE `e892c0c`. A required Nonprofit / Funder choice on the card is stored and tagged. The bottom email-only form defaults to nonprofit. |
| 8.5 | Mailchimp developer access and an API key | T 21:46 to 22:40, 25:55, N (Rumit) | BLOCKED (Rumit) |
| 8.6 | Exact content and recipients for the flows | N (Rumit) | BLOCKED (Rumit) |

## 9. Mobile requests not tied to one page

| # | Point | Source | Status |
|---|---|---|---|
| 9.1 | Blogs and case studies as left/right swipe cards on mobile | T 35:47 to 36:45 | DONE `e892c0c` |
| 9.2 | Read more past 3 lines | T 35:47 | DONE `5cee728`, `e892c0c`. `ClampText` is used on the home, service, program, case-study and About pages. Linked cards use a CSS 4-line clamp instead, because tapping the card opens the full page. |
| 9.3 | Separate mobile copy, through a "mobile" column in the content doc (example: Baithak shows only its first line on mobile) | T 35:47 to 36:45 | DONE `e892c0c`. There is an optional `mobileSummary` field on case-study cards. |
| 9.4 | Increase scroll sensitivity | T 34:24 (Mohith's own suggestion) | WONTDO. It hijacks native scrolling and hurts accessibility. The same goal is met by shrinking sections. |
| 9.5 | Rumit's offer to send mobile HTML for every screen | T 50:11 | Not needed. Rumit dropped it in the same exchange. |

## 10. Process (no code)

- Launch Thursday morning, before Mani J leaves. Everything is due by Nov 11 at 5 PM. (T 46:42 to 51:42)
- Rumit approved ₹10K for freelance help. (T 51:42)
- Stay responsive on WhatsApp. Rumit compiles any further client changes. (T 52:39, N)
- Rumit shares the doc, notes and recording. (N) This is done, and both files are in this folder.

## 11. Repo health found during the audit

| # | Point | Status |
|---|---|---|
| 11.1 | `pnpm test` fails at startup: the Cloudflare Vite plugin rejects vitest's ssr `resolve.external` | DONE `e892c0c`. 4 of 4 tests pass. |
| 11.2 | `pnpm check:contrast` flags one screen-reader-only line in Why we exist, at 1.11:1 | DONE `e892c0c`. Palette and contrast both pass. |

## 12. Final verification (commit `e892c0c`)

- `pnpm typecheck`, `pnpm lint`, `pnpm test` (4/4) and `pnpm build` all pass. `pnpm check:design` reports palette PASS and contrast PASS.
- All 17 live routes were crawled at 390px and 1440px. Every one returned 200, with no console or page errors, no horizontal scroll, and no "Kickstarter 2.0", "KC" or "Read Peepul" anywhere.
- Page height at 390px, before and after:

| Page | Before (px) | After (px) |
|---|---|---|
| Kickstarter | 11,011 | 7,744 |
| Data Literacy | 14,969 | 10,693 |
| Impact service | 9,774 | 6,545 |
| Case studies | 4,996 | 2,902 |
| Peepul | 10,071 | 6,389 |
| About | 7,852 | 5,895 |

## 13. Still needed from people (nothing else is open)

| Who | What |
|---|---|
| Rumit | Mailchimp API key and list id: `wrangler secret put MAILCHIMP_API_KEY` and `MAILCHIMP_LIST_ID` |
| Rumit | The four quiz bands' thresholds and email copy (VERIFY.md) |
| Rumit | Which 6 Kickstarter bubbles to show |
| Rumit | The Kickstarter public application form URL (`applyUrl` in `src/content/design/kickstarter.ts`) |
| Rumit | The partner logo grouping (`kind` per logo in `src/content/partners.ts`) |
| Rumit | The real footer email and LinkedIn URL (`site.ts`) |
| Rumit | Whether the October 06:01 send is the nonprofit version and 06:00 the funder version |
| Rumit, Goalkeep | Hold items 1.18, 1.19, 1.20 and 4.4 |
| Mohith | Before deploy, run `wrangler d1 migrations apply goalkeep-site-v5 --remote` for `0005_audience_edition_band.sql` |
