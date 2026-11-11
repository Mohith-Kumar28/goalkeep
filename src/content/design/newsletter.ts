import type { Html } from './service-page'
import type { Verify } from '../types'

/* Goalkeep sends each edition in two versions, one per audience, 85 to 90%
   the same (Nov 10 review). */
export type Audience = 'nonprofit' | 'funder'

/* Who the reader is (Nov 11). Intermediaries read the nonprofit version until
   Goalkeep sends one of their own. */
export type Reader = 'funder' | 'nonprofit' | 'intermediary'

export const readers: Array<{ id: Reader; label: string; version: Audience }> = [
  { id: 'funder', label: 'Funder', version: 'funder' },
  { id: 'nonprofit', label: 'Nonprofit', version: 'nonprofit' },
  { id: 'intermediary', label: 'Intermediary', version: 'nonprofit' },
]

export type Edition = {
  /** Sent with a "Subscribe to the next issue" sign-up, so the server emails this edition. */
  id: string
  month: string
  headline: Html
  lead: string
  /** Shown faded out under the lead, so the edition reads as cut off. */
  excerpt: string
  image: { src: string; width: number; height: number; alt: string }
  button: { bg: string; fg: string }
  /** Which side the cover sits on at desktop width. */
  imageSide: 'left' | 'right'
  /** The edition on Mailchimp's public archive, per audience version. */
  archive: Verify<Record<Audience, string>>
}

export const newsletter = {
  meta: {
    title: 'The Keep-Up newsletter | Goalkeep',
    description:
      'A monthly newsletter covering all things data in the social sector, for people who run, fund and support social sector programmes.',
  },
  hero: {
    headline: 'A monthly newsletter covering <em>all things data in the social sector.</em>',
    lead: 'For people who run, fund and support social sector programmes and are interested in learning about how to use data to deepen their impact.',
  },
  card: {
    heading: 'Get the next issue of <em>The Keep-Up</em>',
    note: 'One email at the end of each month. Unsubscribe in one click, any time.',
    thanksHeading: "You're on <em>the list.</em>",
    thanks: 'The next issue of The Keep-Up arrives at the end of the month.',
    another: 'Subscribe another email',
    audience: 'I am a',
    /** Shown on the card after a "Subscribe to the next issue" click. `{month}` is the edition's month. */
    edition: 'We’ll email you the full {month} edition straight away.',
    editionThanks: 'The full {month} edition is on its way to your inbox, and the next issue reaches you at the end of the month.',
  },
  editions: [
    {
      id: '2026-10',
      month: 'October 2026',
      headline: 'The hidden cost <em>of messy data</em>',
      lead: 'Almost every NGO I speak with wants to show measurable outcomes, and their funders want to see them too. Yet when it comes to setting aside a real budget for the systems that make those outcomes possible, it’s often the first thing to get cut.',
      excerpt:
        'I’ve seen that decision turn out to be far more expensive than it looks, quietly straining three things over time: your team’s hours, your budget, and how well your programs work. The tricky part is that most of these costs never show up as a line item. Your field teams end up filling in the same survey twice, and someone spends an afternoon fixing records.',
      image: {
        src: '/design/f3cfb0665b4db049bd57c4a659ed41dc.webp',
        width: 1600,
        height: 1073,
        alt: 'The Keep-Up, October 2026: Is your broken data system costing you more than you think? A cracked piggy bank spilling rupee coins and data sheets.',
      },
      button: { bg: '#F08A78', fg: '#14131A' },
      imageSide: 'left',
      archive: {
        verify: 'Matched from Mailchimp\'s public campaign archive: the 5 Nov 06:01 send (Kickstarter block) read as the nonprofit version, the 06:00 send (sponsor-a-seat DLP block) as the funder version. Rumit to confirm.',
        value: {
          nonprofit: 'https://mailchi.mp/goalkeep/the-keep-up-october-newsletter-17310147',
          funder: 'https://mailchi.mp/goalkeep/the-keep-up-october-newsletter',
        },
      },
    },
    {
      id: '2026-09',
      month: 'September 2026',
      headline: 'Why Charcha 2026 reinforced the need to <em>build organisational capacity</em>',
      lead: 'Across more than 40 sessions at Charcha 2026 in New Delhi, on livelihoods, skilling, health, CSR and AI, one thread kept surfacing: the sector has no shortage of data. What it is short on is the ability to turn that data into better decisions.',
      excerpt:
        'India’s social sector spends ₹27 lakh crore every year, and that figure is projected to grow around 10% a year through 2030. As the investment rises, the pressure to spend that money well grows with it, and the key question becomes how we get the best use out of every rupee that goes into programmes on the ground.',
      image: {
        src: '/design/37064629a9ddb7cebea73daa09faac7d.webp',
        width: 1600,
        height: 1073,
        alt: 'The Keep-Up, September 2026: India’s social sector isn’t short on data. It’s short on decisions made with data. A woman under a coral umbrella picks one bar chart out of a pile of falling paper.',
      },
      button: { bg: '#2F4A92', fg: '#FFFFFF' },
      imageSide: 'right',
      archive: {
        verify: 'Mailchimp\'s public archive has one version of this edition (sent 1 Oct, resent 5 Oct), so both audiences get it. Rumit to confirm.',
        value: {
          nonprofit: 'https://mailchi.mp/goalkeep/the-keep-up-september-newsletter',
          funder: 'https://mailchi.mp/goalkeep/the-keep-up-september-newsletter',
        },
      },
    },
    {
      id: '2026-08',
      month: 'August 2026',
      headline: 'Rethink your data strategy <em>before hiring</em>',
      lead: 'Hiring one “data person” rarely solves an organization’s data problem. In reality, data talent is not a single role but rather a spectrum of capabilities that are needed in order to design, manage, and use data effectively.',
      excerpt:
        'If your organization wants to become data-driven, focus less on a single role and more on building an enabling environment. That starts with being clear about the decisions your data needs to inform, the skills your teams already have, and the gaps a new hire should actually fill.',
      image: {
        src: '/design/f6a093abe91e215671ca809091784d3f.webp',
        width: 1600,
        height: 1289,
        alt: 'The Keep-Up, August 2026: Hiring for data, what’s your strategy? A hand fits a yellow puzzle piece into a grid of coloured puzzle pieces.',
      },
      button: { bg: '#F2C80F', fg: '#1E3266' },
      imageSide: 'left',
      archive: {
        verify: 'Mailchimp\'s public archive has one version of this edition (sent 27 Aug), so both audiences get it. Rumit to confirm.',
        value: {
          nonprofit: 'https://mailchi.mp/abc4373ad54d/the-keep-up-august-newsletter',
          funder: 'https://mailchi.mp/abc4373ad54d/the-keep-up-august-newsletter',
        },
      },
    },
  ] satisfies Array<Edition>,
  editionCta: 'Subscribe to the next issue',
  closing: {
    heading: 'Keep up with the latest <em>data opinions, trends, and tips.</em>',
    thanks: "You're on the list. The next issue arrives at the end of the month.",
  },
}
