import type {
  Audience,
  CaseStudy,
  Faq,
  FieldNote,
  Pillar,
  PullQuote,
  StatCard,
} from './types'

/**
 * Homepage copy.
 *
 * Cut from roughly 3,800 words to under 1,400 in September 2026. The feedback
 * was that the page reads text-centric and that a social-sector site has to
 * show the community it works with. Nothing distinctive was rewritten — the
 * voice ("what took longer than we said it would", "including the ones that
 * cost us the work") is the asset. It was shortened, not replaced.
 */

/* ============================================================
   1 · Hero — navy
   ============================================================ */

export const hero = {
  eyebrow: 'data work for the social sector',
  /* Client's line, used exactly as written in the feedback doc. */
  headlineLead: "MEL systems aren't just meant to measure impact, but also",
  /* Kept short and unbreakable so the hand-drawn squiggle underneath it can
     line up with a single run of text rather than a two-line block. */
  headlineHighlight: 'strengthen it.',
  /* The client's subheader, whole. The marker moves across the three phrases
     one at a time; the sentence itself never changes, so it stays readable at
     every point in the cycle. */
  leadSegments: [
    { text: 'We ' },
    { text: 'design', hue: 'var(--gk-yellow)' },
    { text: ', ' },
    { text: 'build', hue: 'var(--gk-teal)' },
    { text: ', and ' },
    { text: 'enable the adoption', hue: 'var(--gk-coral)' },
    { text: ' of data systems that deepen the impact of your programs.' },
  ],
  primaryCta: { label: 'Talk to us', to: '/contact' },
  secondaryCta: { label: 'See our work', to: '/case-studies' },
  marginalia: 'we start with\nthe decision,\nnot the tool',
  /** The Ken Burns plate behind the hero. Real Goalkeep photography. */
  backdrop: [
    { src: '/photos/hero-01-workshop.webp', alt: '' },
    { src: '/photos/hero-02-classroom.webp', alt: '' },
    { src: '/photos/hero-03-circle.webp', alt: '' },
    { src: '/photos/hero-04-pair.webp', alt: '' },
  ],
  /** Rotating proof card. One organisation, one number, one photograph. */
  proofCards: [
    {
      org: 'Baithak Foundation',
      image: '/photos/case-baithak.webp',
      imageAlt: 'A Baithak Foundation music session in progress',
      stat: '11 hrs → 40 min',
      line: 'monthly reporting cycle',
    },
    {
      org: 'Vanavil Trust',
      image: '/photos/case-vanavil.webp',
      imageAlt: 'Children studying in a Vanavil Trust classroom',
      stat: '9 weeks',
      line: 'from paper register to first baseline',
    },
    {
      org: 'Apni Shala Foundation',
      image: '/photos/case-apni-shala.webp',
      imageAlt: 'A student working on a craft activity at Apni Shala',
      stat: '4 formats → 1',
      line: 'shared indicator set across teams',
    },
  ],
}

/* ============================================================
   2 · Partners ticker — cream
   ============================================================ */

export const ticker = {
  /* Feedback: "Change top text only to: Partners who trust us (centred)". */
  heading: 'Partners who trust us',
}

/* ============================================================
   3 · What we do — cream, interactive
   ============================================================ */

export const whatWeDo = {
  eyebrow: 'what we do',
  headline: 'Design, build, adopt.',
  headlineTail: 'In that order, and usually more than once.',
  lead: 'Hover a stage to see what it actually looks like.',
  cta: { label: 'See how we scope a project', to: '/what-we-do' },
}

export const pillars: Array<Pillar> = [
  {
    index: '01',
    hue: 'blue',
    title: 'Design',
    body:
      'Paper logs, Excel, an inherited dashboard — we start by getting the foundations right.',
    bodyFull:
      'Most organizations have a systems design that is not adept at capturing data that actually feeds back into their program. So whether you’re working with manual data logs, excel sheets or an existing data dashboard, we help set your data foundations right.',
    handwritten: 'who is the data actually for?',
    marginalia: 'we ask this first, every time',
    images: [
      { src: '/photos/phase-design-a.webp', alt: 'Affinity mapping on coloured boards during a Goalkeep design workshop' },
      { src: '/photos/phase-design-b.webp', alt: 'A Goalkeep working session in progress on the floor of a partner office' },
    ],
  },
  {
    index: '02',
    hue: 'teal',
    title: 'Build',
    body:
      'Data was never meant to be this daunting. We build dashboards anyone can read without being walked through them.',
    bodyFull:
      'Data was never meant to be this daunting, complex being. We invest time in building intuitive dashboards that are easy to read and even easier to use, so that people across the org can navigate them comfortably.',
    /* The source doc drops a negation here ("should have all the possible
       data on it be intuitive"). Restored; flagged in VERIFY.md. */
    handwritten: 'not every number — just the ones that change a decision',
    marginalia: 'boring traffic-light rubric. works.',
    images: [
      { src: '/photos/phase-build-a.webp', alt: 'A partner dashboard open on a laptop in the field' },
      { src: '/photos/phase-build-b.webp', alt: 'A Goalkeep-built dashboard showing programme indicators' },
    ],
  },
  {
    index: '03',
    hue: 'coral',
    title: 'Adopt',
    body:
      'What’s the point of a dashboard nobody opens? We train your team until using it is just how Monday works.',
    bodyFull:
      'What’s the point of a shiny dashboard when no one in the organization is using it? A big focus of our work is to conduct trainings and workshops on enabling data adoption, so that people of every level of the org can use the data being collected to make better decisions.',
    handwritten: 'we hand over the keys, then we leave',
    images: [
      { src: '/photos/phase-adopt-a.webp', alt: 'A partner team working through a build session with Goalkeep' },
      { src: '/photos/phase-adopt-b.webp', alt: 'A Goalkeep facilitator walking a colleague through data on a phone' },
    ],
  },
]

export const whatWeDoStat: StatCard = {
  value: {
    figure: '4 hrs',
    sentence: 'saved every Monday by one MEL lead after we rebuilt their reporting flow.',
  },
  verify: 'Attribution and the real figure. Taken from the brand book example.',
}

/* ============================================================
   4 · Whom we do it for — coral tint
   ============================================================ */

export const audienceSection = {
  eyebrow: 'whom we do it for',
  headline: 'Three kinds of teams call us.',
  headlineTail: 'They call for very different reasons.',
  photoCredit: {
    value: 'Partner names and locations on the carousel captions',
    verify:
      'Confirm the organisation and city on every carousel caption before launch. The four case-study covers are named in Drive; the workshop and field frames are labelled generically until someone confirms which partner site they were shot at.',
  },
}

export const audiences: Array<Audience> = [
  {
    id: 'early-stage',
    label: 'Early-stage NGOs',
    challengeLead: 'Early-stage NGOs often struggle with',
    challengeBlanks: ['messy spreadsheets', 'reporting season', 'numbers nobody owns'],
    challengeTail:
      'Data is scattered, budgets are tight, and the impact you know you’re having is the hardest thing to prove. Having worked with 30+ early-stage NGOs, we have the tools to organise a broken data system.',
    circled: '30+ early-stage NGOs',
    photos: [
      { src: '/photos/org-vanavil.webp', alt: 'Children studying in a Vanavil Trust classroom', org: 'Vanavil Trust', location: 'Tamil Nadu' },
      { src: '/photos/org-apni-shala.webp', alt: 'A student working on a craft activity', org: 'Apni Shala Foundation', location: 'Mumbai' },
      { src: '/photos/org-classroom.webp', alt: 'A programme session running in a village classroom', org: 'Programme session', location: 'In the field' },
      { src: '/photos/phase-design-a.webp', alt: 'Affinity mapping on coloured boards during a design workshop', org: 'Design workshop', location: 'In session' },
      { src: '/photos/note-01.webp', alt: 'A partner team member speaking during a working session', org: 'Working session', location: 'In session' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'We didn’t need a dashboard. We needed to agree on what we were counting.',
          attribution: 'Dakshayini, Baithak Foundation',
        },
        verify:
          'BLOCKING — this quote is currently a placeholder attributed to a real, named person. Get Dakshayini’s actual words and written permission, or pull the attribution.',
      },
      name: 'Dakshayini',
      credentials: 'Baithak Foundation',
      photo: '/photos/testimonial-dakshayini.webp',
    },
    primaryCta: { label: 'See the Kickstarter program', to: '/programs/kickstarter' },
    secondaryCta: { label: 'Read the case studies', to: '/case-studies' },
  },
  {
    /* Renamed from 'mid-sized' per the feedback. */
    id: 'data-mature',
    label: 'Data mature nonprofits',
    challengeLead: 'Data mature nonprofits often struggle with',
    challengeBlanks: ['four versions of one number', 'one laptop holding the baseline', 'board decks that don’t match the field'],
    challengeTail:
      'You have an MEL lead. She’s excellent. She’s also the bottleneck — every number the board sees passes through her. If she leaves, the baseline leaves with her.',
    circled: 'the baseline leaves with her',
    photos: [
      { src: '/photos/org-baithak.webp', alt: 'A Baithak Foundation music session in progress', org: 'Baithak Foundation', location: 'Pune' },
      { src: '/photos/phase-build-a.webp', alt: 'A partner dashboard open on a laptop in the field', org: 'Live dashboard', location: 'In the field' },
      { src: '/photos/phase-build-b.webp', alt: 'Programme indicators on a partner dashboard', org: 'Indicator review', location: 'In session' },
      { src: '/photos/group-team.webp', alt: 'Goalkeep with a partner team after a workshop', org: 'Partner team', location: 'Post-workshop' },
      { src: '/photos/note-03.webp', alt: 'A facilitator presenting findings at a partner dashboard', org: 'Findings review', location: 'In session' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'For the first time, the number in the board deck matched the number in the field.',
          attribution: 'MEL lead, health nonprofit working in six states',
        },
        verify: 'Real quote and attribution, or written permission to run it anonymised.',
      },
      name: 'MEL lead',
      credentials: 'Health nonprofit, six states',
      photo: '/photos/note-01.webp',
    },
    primaryCta: { label: 'See custom projects', to: '/custom-projects' },
    secondaryCta: { label: 'Read the case studies', to: '/case-studies' },
  },
  {
    /* Renamed from 'funders' per the feedback. */
    id: 'intermediary',
    label: 'Intermediary partnerships',
    challengeLead: 'Intermediaries and funders often struggle with',
    challengeBlanks: ['30 reports, no portfolio view', 'indicators nobody collects', 'grantees guessing the ask'],
    challengeTail:
      'You fund 30 organisations and get 30 different reports. Half the indicators you ask for were never collected in the first place — so the honest fix usually starts with changing the ask.',
    circled: 'changing the ask',
    photos: [
      { src: '/photos/org-veruschka.webp', alt: 'A culinary training session at Veruschka Foundation', org: 'Veruschka Foundation', location: 'Mumbai' },
      { src: '/photos/group-lineup.webp', alt: 'A Goalkeep and partner team group photograph', org: 'Partner cohort', location: 'Convening' },
      { src: '/photos/phase-adopt-a.webp', alt: 'A partner team working through a build session', org: 'Adoption workshop', location: 'In session' },
      { src: '/photos/phase-adopt-b.webp', alt: 'A facilitator walking a colleague through data on a phone', org: 'Field handover', location: 'In the field' },
      { src: '/photos/note-02.webp', alt: 'A facilitator presenting to a partner group', org: 'Cohort session', location: 'In session' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'Our indicators were asking grantees for things they’d never collect. So we changed the ask.',
          attribution: 'Program officer, Indian foundation',
        },
        verify: 'Real quote and attribution, or written permission to run it anonymised.',
      },
      name: 'Program officer',
      credentials: 'Indian foundation',
      photo: '/photos/note-02.webp',
    },
    primaryCta: { label: 'Partner with us', to: '/partner-with-us' },
    secondaryCta: { label: 'Read the case studies', to: '/case-studies' },
  },
]

/* ============================================================
   5 · Proof — navy
   ============================================================ */

export const proof = {
  eyebrow: 'the short version',
  headline: 'Six years of this.',
  stats: [
    {
      value: { figure: 30, suffix: '+', sentence: 'early-stage NGOs we’ve worked with' },
      verify: 'The 30+ figure, quoted from the homepage feedback doc.',
    },
    {
      value: { figure: 27, suffix: '', sentence: 'organisations and the funders behind them' },
      verify: 'Counted from the logos on goalkeep.net. The site says “40+” elsewhere — settle on one.',
    },
    {
      value: { figure: 73, suffix: '%', sentence: 'of dashboards we audit aren’t opened twice' },
      verify: 'Source and sample size for the 73% figure — it appears in the brand book.',
    },
    {
      value: { figure: 4, suffix: '\u00A0hrs', sentence: 'back every Monday for one MEL lead' },
      verify: 'Attribution and the real figure.',
    },
  ],
}

/* ============================================================
   6 · Case studies — navy
   ============================================================ */

export const caseStudySection = {
  eyebrow: 'case studies',
  headline: 'What changed,',
  headlineTail: 'and what took longer than we said it would.',
  cta: { label: 'Read all case studies', to: '/case-studies' },
}

export const caseStudies: Array<CaseStudy> = [
  {
    slug: 'baithak-reporting',
    image: '/photos/case-baithak.webp',
    imageAlt: 'A Baithak Foundation music session in progress',
    tags: ['M&E'],
    title: 'Reporting rebuilt around one weekly question',
    stat: {
      value: '11 hrs → 40 min',
      verify: 'Real before/after figures, the organisation name, and permission to publish.',
    },
  },
  {
    slug: 'vanavil-baseline',
    image: '/photos/case-vanavil.webp',
    imageAlt: 'Children studying in a Vanavil Trust classroom',
    tags: ['Data strategy'],
    title: 'From a paper register to a baseline in nine weeks',
    stat: {
      value: '9 weeks',
      verify: 'Real timeline and permission to name the organisation.',
    },
  },
  {
    slug: 'apni-shala-indicators',
    image: '/photos/case-apni-shala.webp',
    imageAlt: 'A student working on a craft activity',
    tags: ['Capacity'],
    title: 'Four versions of one number became one shared set',
    stat: {
      value: '4 formats → 1',
      verify: 'Real figures and permission to name the organisation.',
    },
  },
  {
    slug: 'veruschka-grantee-form',
    image: '/photos/case-veruschka.webp',
    imageAlt: 'A culinary training session at Veruschka Foundation',
    tags: ['Data strategy'],
    title: 'A grantee form cut by half returned better data',
    stat: {
      value: '38 indicators → 17',
      verify: 'Real figures and permission to name the organisation.',
    },
  },
  {
    slug: 'the-dashboard-was-wrong',
    tags: ['Post-mortem'],
    inverse: true,
    title: 'The project where the dashboard was the wrong answer',
    body: 'We built it. Nobody opened it. Here’s what we’d do differently, and what we refunded.',
    stat: {
      value: 'Published in full',
      verify:
        'Whether Goalkeep will publish a failure case. This card is the page’s credibility keystone — push for it.',
    },
  },
]

/* ============================================================
   7 · FAQs — cream
   ============================================================ */

export const faqSection = {
  eyebrow: 'straight answers',
  headline: 'Questions we get in the first call.',
  lead: 'Including the ones that cost us the work.',
  aside: 'Still stuck? Write to us. Replies come from a person.',
}

/* Cut from seven long answers to five short ones. The long-form versions
   belong on /what-we-do and /contact, not in a homepage accordion. */
export const faqs: Array<Faq> = [
  {
    value: {
      question: 'What does this cost?',
      answer:
        'Scoped, not priced off a rate card. A short audit, a milestone-based build, or a retainer while your team learns. Kickstarter is our fixed-scope, fixed-price option for early-stage orgs. You get a number and a scope in writing before you commit.',
    },
    verify: 'Engagement shapes and the Kickstarter pricing model, with Manije.',
  },
  {
    value: {
      question: 'How long until we see something useful?',
      answer:
        'Audit findings in week two or three. A first working dashboard six to 10 weeks in. Adoption is the long part — budget three months for the build and a year for the habit.',
    },
    verify: 'Real timelines.',
  },
  {
    value: {
      question: 'We don’t have a data team. Is that a problem?',
      answer:
        'No — that’s most of our clients. We need one person who owns the answer to “is this number right”, even if data isn’t in their job title. If nobody can own that, we’ll say so early.',
    },
  },
  {
    value: {
      question: 'Do we get a dashboard at the end?',
      answer:
        'Often, not always. Sometimes the real fix is a cleaner form, a 20-line script, or one recurring meeting where three people look at the same number. We’ve built dashboards nobody opened, and we’d rather not do it again.',
    },
    verify: 'Confirm we’re comfortable saying this on the homepage.',
  },
  {
    value: {
      question: 'What happens to our data?',
      answer:
        'It stays yours. We work inside your systems and your accounts wherever possible. Where we need a copy we agree in writing what it holds, who can see it and when it’s deleted — and we don’t use client data to build anything for anyone else.',
    },
    verify:
      'LEGAL REVIEW REQUIRED before publishing. Every sentence here is a commitment.',
  },
]

/* ============================================================
   8 · Field notes — cream deep
   ============================================================ */

export const fieldNoteSection = {
  eyebrow: 'field notes',
  headline: 'What we’re learning, written down.',
  lead: 'Short pieces from projects in progress. No thought leadership.',
  cta: { label: 'Read all field notes', to: '/resources/blog' },
}

export const fieldNotes: Array<FieldNote> = [
  {
    slug: 'dashboards-not-opened-twice',
    date: '12 Aug 2026',
    readingTime: '4 min',
    title: '73% of the dashboards we audit aren’t opened twice',
    dek: 'Two years of audits, counted. What the survivors had in common.',
    tag: 'M&E',
    image: '/photos/note-03.webp',
    imageAlt: 'A facilitator presenting findings at a partner dashboard',
  },
  {
    slug: 'workflow-problems-in-a-data-costume',
    date: '28 Jul 2026',
    readingTime: '6 min',
    title: 'Most “data problems” are workflow problems in a data costume',
    dek: 'The fix was a 20-line script and a Tuesday standup.',
    tag: 'Field note',
    inverse: true,
    badge: 'Most read',
    image: '/photos/note-01.webp',
    imageAlt: 'A partner team member speaking during a working session',
  },
  {
    slug: 'three-questions-before-you-build',
    date: '09 Jul 2026',
    readingTime: '3 min',
    title: 'Three questions to ask before you build anything',
    dek: 'Who reopens this every week? What decision changes if the number does?',
    tag: 'Data strategy',
    image: '/photos/note-02.webp',
    imageAlt: 'A facilitator presenting to a partner group',
  },
]

/* ============================================================
   9 · Closing — navy
   ============================================================ */

export const closing = {
  eyebrow: 'one more thing',
  headlineLead: 'Tell us the',
  headlineKeyword: 'decision',
  headlineTail: 'you’re stuck on.',
  headlineSecondLine: 'We’ll tell you if data is even the problem.',
  primaryCta: { label: 'Start a conversation', to: '/contact' },
  secondaryCta: { label: 'Take the data culture quiz', to: '/resources/data-quiz' },
  marginalia: {
    value: 'replies come from\na person, usually\nwithin two days',
    verify: 'The response-time promise, with Manije.',
  },
}

export const honestStat: PullQuote = {
  value: {
    text: '73% of dashboards we audit aren’t opened twice.',
    attribution: 'Goalkeep audit sample, 2024–2026',
  },
  verify: 'Source and sample size for the 73% figure.',
}
