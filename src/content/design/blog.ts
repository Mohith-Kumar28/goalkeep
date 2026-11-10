import type { Tone } from '@/components/design/tones'
import type { Html } from './service-page'

export type DiagramId = 'extraction-circulation'

export type Definition = { label: string; text: string; tone: Tone }

/** `html` fields carry authored markup (links, emphasis) and are rendered with <Rich>. */
export type ArticleBlock =
  | { type: 'paragraph'; html: Html }
  | { type: 'heading'; text: string }
  | { type: 'definitions'; items: Array<Definition> }
  | { type: 'diagram'; id: DiagramId }
  | { type: 'quote'; text: string }
  | { type: 'placeholder'; label: string; text: string }
  | { type: 'callout'; text: string }
  | { type: 'reading'; label: string; items: Array<{ href: string; title: string; source: string }> }

export type RelatedPost = {
  title: string
  tag: { label: string; tone: Tone }
  readTime: string
  photo: { src: string; alt: string }
  /** A post that has no page yet renders as a card without a link. */
  href?: string
}

export type Article = {
  slug: string
  meta: { title: string; description: string }
  category: { label: string; tone: Tone }
  title: string
  standfirst: string
  author: { name: string; role: string; photo: string; bio: string }
  /** Shown before the read time in the byline row. */
  status: string
  readTime: string
  hero: { src: string; alt: string; caption: string; objectPosition: string }
  body: Array<ArticleBlock>
  related: Array<RelatedPost>
}

const IDR_MEGHALAYA = 'http://idronline.org/article/health/is-meghalaya-learning-to-read-its-own-health-data'

const whichWayDoesYourDataTravel: Article = {
  slug: 'which-way-does-your-data-travel',
  meta: {
    title: 'Which way does your data travel? | Goalkeep',
    description:
      'Most nonprofits don’t have a data collection problem. They have a data circulation problem: information flows up to leadership and out to funders, but rarely comes back to the people who collected it.',
  },
  category: { label: 'Data culture', tone: 'teal' },
  title: 'Which way does your data travel?',
  standfirst:
    'Most nonprofits don’t have a data collection problem. They have a data circulation problem: information flows up to leadership and out to funders, but rarely comes back to the people who collected it.',
  author: {
    name: 'Manije Kelkar',
    role: 'Founder & Director',
    photo: '/design/6d381336750276a362aa07133f2c7f9c.webp',
    bio: 'Manije founded Goalkeep in 2020, after more than a decade of helping social-sector organisations strengthen their measurement and data systems.',
  },
  status: 'Draft for review',
  readTime: '5 min read',
  hero: {
    src: '/design/c7fa18945afc05080e35a4e989719575.webp',
    alt: 'Vanavil Trust teachers at a dashboard launch session',
    caption: 'Teachers at Vanavil Trust during the launch of their learning dashboard.',
    objectPosition: '50% 50%',
  },
  body: [
    {
      type: 'paragraph',
      html: 'Most nonprofits we work with are not short on data. Field teams fill in forms every week, programme managers compile monthly trackers, and leadership signs off on reports that go out to funders every quarter. What many organisations are short on is data that comes back to the people who produced it.',
    },
    {
      type: 'paragraph',
      html: 'A recent report by Sambodhi and Dasra put a number to this: of every 100 data points a nonprofit collects, only 18 support an internal decision. The rest travel one way, upward and out.',
    },
    { type: 'paragraph', html: 'Two words help describe the difference.' },
    {
      type: 'definitions',
      items: [
        {
          label: 'Extraction',
          text: 'Data is taken from the field, used elsewhere, and never fed back into the programme that produced it.',
          tone: 'coral',
        },
        {
          label: 'Circulation',
          text: 'Data moves back to the people who generated it, so it stays useful to them too.',
          tone: 'teal',
        },
      ],
    },
    {
      type: 'paragraph',
      html: 'This isn’t about how much data an organisation collects. It is about which direction that data is allowed to travel.',
    },
    { type: 'diagram', id: 'extraction-circulation' },
    { type: 'heading', text: 'When the room is built, but the numbers aren’t there yet' },
    {
      type: 'paragraph',
      html: `Meghalaya has spent the last five years building serious health data infrastructure: regular review meetings, a real-time maternal health app and modern dashboards. On paper, this is what data-driven governance looks like. Yet <a href="${IDR_MEGHALAYA}">a recent piece in IDR</a> argues that the state has built the room without yet filling it with fully reliable numbers, because frontline health workers are stretched across multiple reporting systems and rarely get anything useful back from what they enter.`,
    },
    {
      type: 'paragraph',
      html: 'The article’s core point is that this is a failure upstream, in how the system was designed, and not a failure of the people at the frontline. Strong data systems are not built by the top tier alone. They are built when leadership, programme teams, field workers and data managers all help shape what gets measured, how it is collected and why it matters.',
    },
    {
      type: 'placeholder',
      label: 'Goalkeep example to come',
      text: 'A moment from our own work where someone at the field level received something useful back from the data, and changed their approach because of it.',
    },
    { type: 'heading', text: 'Why extraction quietly breaks trust' },
    {
      type: 'paragraph',
      html: 'When data only moves upward, field staff have no way to answer basic questions about their own work. They can’t tell whether they are ahead of or behind target, which areas need attention, or which parts of their programme delivery are working, because the system was never designed to include them in that loop.',
    },
    {
      type: 'quote',
      text: 'When data only moves upward, the people closest to the work start to see it as something done to them, not something that serves them.',
    },
    {
      type: 'paragraph',
      html: 'Over time, that erodes both data quality and trust. When data flows back, it changes. A field officer can look at their own numbers and know which village still needs a visit, which activity is behind schedule and what to prioritise this week, without waiting for someone above them to notice.',
    },
    { type: 'heading', text: 'What a good data culture actually looks like' },
    {
      type: 'paragraph',
      html: 'A good data culture isn’t measured by how much data an organisation collects. It is measured by how many directions that data moves in. Circulation, not volume, is the real marker of a system that works.',
    },
    {
      type: 'callout',
      text: 'So here is a question to take back to your team: when was the last time data flowed back to the person who first entered it?',
    },
    {
      type: 'reading',
      label: 'Further reading',
      items: [
        { href: IDR_MEGHALAYA, title: 'Is Meghalaya learning to read its own health data?', source: 'IDR' },
        {
          href: 'https://idronline.org/article/monitoring-evaluation/its-time-to-rethink-mel/',
          title: 'It’s time to rethink MEL',
          source: 'IDR, based on a Sambodhi and Dasra report',
        },
      ],
    },
  ],
  related: [
    {
      title: 'The hidden cost of messy data systems',
      tag: { label: 'Data systems', tone: 'blue' },
      readTime: '6 min read',
      photo: { src: '/design/237964aaf24cc9a78fdd47ed3db6bba9.webp', alt: 'A programme dashboard open on a laptop' },
    },
    {
      title: 'How a shared MEL framework across 8 programmes helped Peepul assess organisation-wide impact',
      tag: { label: 'Case study', tone: 'gold' },
      readTime: '4 min read',
      photo: {
        src: '/design/adf7e6efd567e8191c6319f6ce9ebe1f.webp',
        alt: 'Peepul and Goalkeep team members working through a dashboard',
      },
      href: '/case-studies/peepul',
    },
  ],
}

/** Add a second article here and the blog index and the post route both pick it up. */
export const articles: Record<string, Article> = {
  [whichWayDoesYourDataTravel.slug]: whichWayDoesYourDataTravel,
}

export const articleList: Array<Article> = Object.values(articles)

export const newsletterBand = {
  eyebrow: 'the keep-up',
  heading: 'Get new posts and The Small Fix <em>in your inbox every month.</em>' satisfies Html,
  body: 'Our monthly newsletter for nonprofit and MEL teams: what we are learning, and one practical tip you can use that week.',
  placeholder: 'you@organisation.org',
}
