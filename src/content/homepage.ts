import type {
  Audience,
  CaseStudy,
  Faq,
  FieldNote,
  Pillar,
  PullQuote,
  StatCard,
} from './types'

/* ============================================================
   1 · Hero
   ============================================================ */

export const hero = {
  eyebrow: 'Data work for the social sector',
  headlineLead: "Most NGOs don't have a data problem.",
  headlineTail: 'They have a',
  headlineEnd: 'problem.',
  /** Four real, different diagnoses — not synonyms. The rotation is
   *  content: this is the list of what we actually find when we open
   *  the hood. It resolves on "decision", the canonical line. */
  rotatingPhrases: ['decision', 'reporting', 'workflow', 'trust'],
  lead:
    "We're a small team in India. We build data systems with programme teams, not at them — then we hand over the keys.",
  primaryCta: { label: 'Partner with us', to: '/contact' },
  secondaryCta: { label: 'See our work', to: '/case-studies' },
  marginalia: 'also: reporting · workflow · trust',
  /* The three things every engagement moves through, shown as a set. */
  stages: [
    { label: 'Design', hue: 'blue' },
    { label: 'Build', hue: 'teal' },
    { label: 'Adopt', hue: 'coral' },
  ],
  panel: {
    stat: '73%',
    line: "of the dashboards we audit aren't opened twice.",
    kicker: 'We rebuild around the decision, not the tool.',
  },
}

/* ============================================================
   2 · Credibility ticker
   ============================================================ */

export const ticker = {
  eyebrow: 'Who we work with',
  line: {
    value: '27 organizations, and the funders who back them.',
    verify:
      'Counted from the logos currently on goalkeep.net. Confirm the real number — the site says "40+" elsewhere.',
  },
}

/* ============================================================
   3 · What we do — blue band
   ============================================================ */

export const whatWeDo = {
  eyebrow: 'What we do',
  headline: 'Design, build, adopt. In that order, and usually more than once.',
  lead: 'Most of the projects we undertake involve one or more of the following.',
  cta: { label: 'See how we scope a project', to: '/what-we-do' },
}

/**
 * Client's copy, kept verbatim. A tighter trim is offered alongside each in
 * VERIFY.md for their approval — we do not rewrite factual client copy
 * without being asked.
 */
export const pillars: Array<Pillar> = [
  {
    index: '01',
    hue: 'blue',
    title: 'Design',
    body:
      'Most orgs collect data that never makes it back into the programme. Paper logs, Excel, an inherited dashboard — we start by getting the foundations right.',
  },
  {
    index: '02',
    hue: 'teal',
    title: 'Build',
    body:
      'Data was never meant to be this daunting. We build dashboards anyone in the org can read without being walked through them.',
    marginalia: '(Boring traffic-light rubric. Works.)',
  },
  {
    index: '03',
    hue: 'coral',
    title: 'Adopt',
    body:
      'What’s the point of a dashboard nobody opens? We train your team until using it is just how Monday works.',
  },
]

export const whatWeDoStat: StatCard = {
  value: {
    figure: '4 hrs',
    sentence:
      'saved every Monday by one M&E lead after we rebuilt their reporting flow.',
  },
  verify: 'Attribution and the real figure. Taken from the brand book example.',
}

/* ============================================================
   4 · Whom we do it for — coral band
   ============================================================ */

export const audienceSection = {
  eyebrow: 'Whom we do it for',
  headline: 'Three kinds of teams call us. They call for different reasons.',
  lead: 'Pick the one that sounds like you.',
}

export const audiences: Array<Audience> = [
  {
    id: 'early-stage',
    label: 'Early-stage NGOs',
    image: '/photos/field-group.jpg',
    imageAlt: 'A group of women seated together in conversation',
    relatability:
      'You’re 14 people, three programs, and one spreadsheet only one person knows how to open.',
    problem:
      'Reporting season eats two weeks and produces numbers nobody quite trusts.',
    quote: {
      value: {
        text: "We didn't need a dashboard. We needed to agree on what we were counting.",
        attribution: 'Program director, early-stage education NGO, anonymized',
      },
      verify: 'Real quote and attribution, or permission to run it anonymized.',
    },
    primaryCta: { label: 'See the Kickstarter program', to: '/programs/kickstarter' },
    secondaryCta: { label: 'Read the full case study', to: '/case-studies' },
  },
  {
    id: 'mid-sized',
    label: 'Mid-sized nonprofits',
    image: '/photos/field-health.jpg',
    imageAlt: 'A community health worker with a family at a home visit',
    relatability:
      'You have an MEL lead. She’s excellent. She’s also the bottleneck — every number the board sees passes through her laptop.',
    problem:
      'Six field teams, four formats, one person reconciling them by hand. If she leaves, the baseline leaves with her.',
    quote: {
      value: {
        text: 'For the first time, the number in the board deck matched the number in the field.',
        attribution: 'MEL lead, health nonprofit working in six states, anonymized',
      },
      verify: 'Real quote and attribution, or permission to run it anonymized.',
    },
    primaryCta: { label: 'See custom projects', to: '/what-we-do' },
    secondaryCta: { label: 'Read the full case study', to: '/case-studies' },
  },
  {
    id: 'funders',
    label: 'Philanthropies and funding organizations',
    image: '/photos/field-community.jpg',
    imageAlt: 'Women gathered on the steps of a community building',
    relatability:
      'You fund 30 organizations. You get 30 different reports, and none of them add up to a portfolio view.',
    problem:
      'Half the indicators you ask for were never collected in the first place.',
    quote: {
      value: {
        text: "The honest answer was that our indicators were asking grantees for things they'd never collect. So we changed the ask.",
        attribution: 'Program officer, Indian foundation, anonymized',
      },
      verify: 'Real quote and attribution, or permission to run it anonymized.',
    },
    primaryCta: { label: 'Partner with us', to: '/contact' },
    secondaryCta: { label: 'Read the full case study', to: '/case-studies' },
  },
]

/* ============================================================
   5 · Case studies — teal band
   ============================================================ */

export const caseStudySection = {
  eyebrow: 'Case studies',
  headline: 'What changed, and what took longer than we said it would.',
  lead: 'Each one names the organization, the decision it changed, and the part we got wrong first.',
  cta: { label: 'Read all case studies', to: '/case-studies' },
}

export const caseStudies: Array<CaseStudy> = [
  {
    slug: 'jai-vakeel-reporting',
    image: '/photos/field-health.jpg',
    imageAlt: 'A community health worker with a family at a home visit',
    tags: ['M&E', 'Data strategy'],
    title: 'Jai Vakeel Foundation rebuilt its reporting around one weekly question',
    stat: {
      value: '11 hrs → 40 min monthly reporting cycle',
      verify: 'Real before/after figures and permission to publish them.',
    },
  },
  {
    slug: 'six-state-health-indicators',
    image: '/photos/field-group.jpg',
    imageAlt: 'A group of women seated together in conversation',
    tags: ['Capacity'],
    title: 'A six-state health team stopped keeping four versions of the same number',
    stat: {
      value: '4 formats → 1 shared indicator set',
      verify: 'Real figures and the organization name, or approval to anonymize.',
    },
  },
  {
    slug: 'funder-grantee-reporting',
    image: '/photos/field-community.jpg',
    imageAlt: 'Women gathered on the steps of a community building',
    tags: ['Data strategy'],
    title: 'A funder cut its grantee reporting form by half, and got better data',
    stat: {
      value: '38 indicators → 17',
      verify: 'Real figures and the funder name, or approval to anonymize.',
    },
  },
  {
    slug: 'paper-register-to-baseline',
    image: '/photos/field-meeting.jpg',
    imageAlt: 'A women’s group meeting outdoors, seated in a circle',
    tags: ['M&E', 'Field note'],
    title: 'An early-stage NGO went from a paper register to a baseline in nine weeks',
    stat: {
      value: '9 weeks from first call to first baseline',
      verify: 'Real timeline and organization.',
    },
  },
  {
    slug: 'the-dashboard-was-wrong',
    tags: ['Field note'],
    inverse: true,
    title: 'The project where the dashboard was the wrong answer',
    body: "We built it. Nobody opened it. Here's what we'd do differently, and what we refunded.",
    stat: {
      value: 'A post-mortem, published in full',
      verify:
        'Whether Goalkeep will publish a failure case. This card is the page’s credibility keystone — push for it. If declined, swap for a charcoal "how we work" card.',
    },
  },
]

/* ============================================================
   6 · FAQs — neutral band
   ============================================================ */

export const faqSection = {
  eyebrow: 'FAQs',
  headline: 'Questions we get in the first call.',
  lead: 'The honest answers, including the ones that cost us the work.',
  aside: 'Still stuck? Write to us. Replies come from a person.',
}

export const faqs: Array<Faq> = [
  {
    value: {
      question: 'What does this cost?',
      answer:
        'Projects are scoped, not priced off a rate card. Most of our work falls into three shapes: a short audit (two to three weeks, one fixed fee), a build (eight to 16 weeks, milestone-based), or a retainer for teams who want us around while they learn. Kickstarter is our fixed-scope, fixed-price option for early-stage organizations, because a bespoke quote is a bad use of a small team’s time. We’ll give you a number and a scope in writing before you commit to anything.',
    },
    verify: 'Durations, engagement shapes and the Kickstarter pricing model with Manije.',
  },
  {
    value: {
      question: 'How long until we see something useful?',
      answer:
        'You see the audit findings in week two or three — the honest picture of where your data breaks, before anything gets built. A first working dashboard usually lands six to 10 weeks in. Adoption is the long part: trainings, a reporting rhythm, and the habit of opening the thing on a Monday. Budget three months for the build and a year for the habit.',
    },
    verify: 'Real timelines.',
  },
  {
    value: {
      question: "We don't have a data team. Is that a problem?",
      answer:
        'No — that’s most of our clients. We don’t need you to have an analyst, a warehouse or a naming convention. What we do need is one person on your side who owns the answer to "is this number right," even if data isn’t in their job title. If nobody can own that, we’ll say so early, because a system with no owner stops working the month after we leave.',
    },
  },
  {
    value: {
      question: 'Do we get a dashboard at the end?',
      answer:
        "Often, but not always, and we'd rather say that up front. About a third of the time the real fix is smaller than a dashboard — a cleaner form, a 20-line script, one recurring 20-minute meeting where three people look at the same number. We've built dashboards nobody opened, and we'd rather not do it again. We rebuild around the decision, not the tool.",
    },
    verify: 'The "about a third" figure — either source it or soften the claim.',
  },
  {
    value: {
      question: 'What happens to our data, and who can see it?',
      answer:
        'Your data stays yours. We work inside your systems and your accounts wherever possible, so nothing needs to move. Where we do need a copy, we agree in writing what it contains, where it sits, who has access, and when it’s deleted — and we ask for the minimum, usually de-identified. We sign your data-sharing agreement rather than asking you to sign ours, and we don’t use client data to train anything or to build anything for anyone else.',
    },
    verify:
      'LEGAL REVIEW REQUIRED before publishing. Every sentence here is a commitment.',
  },
  {
    value: {
      question: 'What happens after you hand over?',
      answer:
        'Handover is a deliverable, not an email. You get documentation written for the person who does the job, not for an engineer: what each indicator means, where it comes from, what breaks it, and how to fix the three things most likely to break. We train at least two people, not one, so a resignation isn’t a crisis. Then we check in at 30 and 90 days, at no cost, to see what’s actually being used. If it isn’t being used, that’s our problem to look at, not yours.',
    },
    verify: 'The free 30/90-day check-in commitment.',
  },
  {
    value: {
      question: 'Do you work outside India?',
      answer:
        'Yes. We’re based in India and most of our work is here, which means we understand Indian reporting requirements, funder formats and field realities in a way a remote team wouldn’t. We’ve also worked with organizations and funders operating across South and Southeast Asia, remotely, with a few weeks on the ground when the project needs it. If you’re outside those regions, ask anyway — we’ll tell you honestly whether we’re the right team.',
    },
    verify: 'Which geographies to name.',
  },
]

/* ============================================================
   7 · Field notes — neutral band
   ============================================================ */

export const fieldNoteSection = {
  eyebrow: 'Field notes',
  headline: "What we're learning, written down.",
  lead: 'Short pieces from projects in progress. No thought leadership.',
  cta: { label: 'Read all field notes', to: '/resources/blog' },
}

export const fieldNotes: Array<FieldNote> = [
  {
    slug: 'dashboards-not-opened-twice',
    date: '12 Aug 2026',
    readingTime: '4 min',
    title: "73% of the dashboards we audit aren't opened twice",
    dek: 'Two years of audits, counted. What the survivors had in common.',
    tag: 'M&E',
  },
  {
    slug: 'workflow-problems-in-a-data-costume',
    date: '28 Jul 2026',
    readingTime: '6 min',
    title: 'Most "data problems" are workflow problems wearing a data costume',
    dek: 'The fix was a 20-line script and a Tuesday standup.',
    tag: 'Field note',
    inverse: true,
    badge: 'Most read',
  },
  {
    slug: 'three-questions-before-you-build',
    date: '09 Jul 2026',
    readingTime: '3 min',
    title: 'Three questions to ask before you build anything',
    dek: 'Who reopens this every week? What decision changes if the number does?',
    tag: 'Data strategy',
  },
  {
    slug: 'your-mel-lead-is-not-a-bottleneck',
    date: '21 Jun 2026',
    readingTime: '5 min',
    title: 'Your MEL lead is not a bottleneck. Your process is.',
    dek: 'What happens when one person holds the whole baseline.',
    tag: 'Capacity',
  },
  {
    slug: 'indicators-grantees-actually-collect',
    date: '02 Jun 2026',
    readingTime: '4 min',
    title: 'We asked 40 grantees which indicators they actually collect',
    dek: 'The gap between what funders ask for and what teams record.',
    tag: 'Data strategy',
  },
]

/* ============================================================
   8 · Closing
   ============================================================ */

export const closing = {
  headlineLead: 'Tell us the',
  headlineKeyword: 'decision',
  headlineTail: "you're stuck on.",
  headlineSecondLine: "We'll tell you if data is even the problem.",
  pullQuote: 'The honest answer first. Then the dashboard.',
  primaryCta: { label: 'Start a conversation', to: '/contact' },
  secondaryCta: { label: 'Take the data culture quiz', to: '/resources/data-quiz' },
  marginalia: {
    value: 'Replies come from a person, usually within two working days.',
    verify: 'The response-time promise, with Manije.',
  },
}

/** Field-note stat used as the section-6 pull-quote card. */
export const honestStat: PullQuote = {
  value: {
    text: "73% of dashboards we audit aren't opened twice.",
    attribution: 'Goalkeep audit sample, 2024–2026',
  },
  verify: 'Source and sample size for the 73% figure — it appears in the brand book.',
}
