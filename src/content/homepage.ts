import type {
  Audience,
  CaseStudy,
  Faq,
  FieldNote,
  Pillar,
  PullQuote,
} from './types'

/**
 * Homepage copy.
 *
 * Replaced wholesale in September 2026 from "Goalkeep Homepage | Copy
 * Replacement". That document is now the source of truth for every string in
 * this file: where it gave a replacement the replacement is used verbatim,
 * where it said "keep same" the existing line stands, and where it said
 * "remove" the field is gone rather than commented out.
 *
 * Two consequences worth knowing before editing:
 *
 *   · The page has far fewer hard numbers than it did. The what-we-do stat
 *     band was cut, the case-study cards no longer lead on a before/after
 *     figure, and the hero card carries a sentence instead of a stat. The
 *     numbers band is the one place numbers still live.
 *   · The audience blocks changed shape. They used to open with a fill-in-the
 *     -blanks sentence; they now open with a question and run as prose, with
 *     one highlighted run per segment — the three colours the client marked in
 *     the doc.
 */

/* ============================================================
   1 · Hero — navy
   ============================================================ */

export const hero = {
  /* "Eyebrow: Remove". The headline, subheader and buttons keep same. */
  /* Client's line, used exactly as written in the feedback doc. */
  headlineLead: "MEL systems aren't just meant to measure impact, but also",
  /* Kept short and unbreakable so the hand-drawn squiggle underneath it can
     line up with a single run of text rather than a two-line block. */
  headlineHighlight: 'strengthen it.',
  /*
   * The subheader, typed.
   *
   * "Design, build and enable the adoption of getting typed out… and this one
   * will be 'enable the adoption of', then it'll make sense in the sentence."
   *
   * So the frame is `${typed.lead} ___ ${typed.tail}` and each phrase has to
   * complete it on its own. That is why the third phrase carries its own "of":
   * "We enable the adoption of data systems that…" only parses if the "of"
   * belongs to the phrase being typed.
   */
  typed: {
    lead: 'We',
    phrases: ['design', 'build', 'enable the adoption of'],
    tail: 'data systems that deepen the impact of your programs.',
  },
  primaryCta: { label: 'Talk to us', to: '/contact' },
  secondaryCta: { label: 'See our work', to: '/case-studies' },
  marginalia: 'we start with\nthe decision,\nnot the tool',
  /**
   * Goalkeep photography. No longer behind the hero — "let's remove the
   * background from here and keep a simple solid blue colour like in the
   * marketing materials, and keep this video in some other component's
   * background below". It runs behind the numbers band instead.
   */
  backdrop: [
    { src: '/photos/hero-01-workshop.webp', alt: '' },
    { src: '/photos/hero-02-classroom.webp', alt: '' },
    { src: '/photos/hero-03-circle.webp', alt: '' },
    { src: '/photos/hero-04-pair.webp', alt: '' },
  ],
  /**
   * The rotating proof card. One organisation, one outcome, one photograph.
   *
   * The before/after stat is gone — "11 hrs → 40 min / monthly reporting
   * cycle" became a sentence about what the number bought. Only the Baithak
   * card was specified in the copy doc; the other two carry the client's own
   * case-study lines from section 9 of the same document so nothing here is
   * written by us.
   */
  proofCards: [
    {
      org: 'Baithak Foundation',
      image: '/photos/case-baithak.webp',
      imageAlt: 'A Baithak Foundation music session in progress',
      line: {
        value:
          'Funding grant closed with the help of evidence pulled from their dashboard in seconds.',
      },
      to: '/case-studies',
    },
    {
      org: 'Vanavil Trust',
      image: '/photos/case-vanavil.webp',
      imageAlt: 'Children studying in a Vanavil Trust classroom',
      line: {
        value:
          'From attendance data to assessing school programmes, Vanavil mapped their theory of change to key indicators.',
        verify:
          'The copy doc replaced the Baithak card only. This line is trimmed from Vanavil’s own case-study card in the same document — confirm it should carry the hero rotation, or drop the rotation to the single Baithak card.',
      },
      to: '/case-studies',
    },
    {
      org: 'Apni Shala Foundation',
      image: '/photos/case-apni-shala.webp',
      imageAlt: 'A student working on a craft activity at Apni Shala',
      line: {
        value:
          'A handful of hero metrics on the weekly dashboard surfaced student learning gaps that used to wait for year-end.',
        verify:
          'As above — trimmed from Apni Shala’s case-study card, not specified for the hero.',
      },
      to: '/case-studies',
    },
  ],
}

/* ============================================================
   2 · Partners ticker — cream
   ============================================================ */

export const ticker = {
  /* Feedback: "Change top text only to: Partners who trust us (centred)". */
  heading: 'Partners who trust us',
  /* Added in the copy replacement. */
  subline: 'Nonprofits, funders and intermediaries we have worked with across India.',
}

/* ============================================================
   3 · What we do — cream, interactive
   ============================================================ */

export const whatWeDo = {
  eyebrow: 'what we do',
  headline: 'Most of the projects we take on',
  headlineTail: 'involve one or more of the following.',
  lead: 'Hover a stage to see what it actually looks like.',
  cta: { label: 'See how we scope a project', to: '/what-we-do' },
}

/*
 * The three stages carry the client's full paragraphs now. The short
 * card-length summaries the section used to open with are gone: the copy doc
 * replaced them with these, and running both would have meant two versions of
 * the same sentence living one field apart.
 */
export const pillars: Array<Pillar> = [
  {
    index: '01',
    hue: 'blue',
    title: 'Design',
    body:
      'Most organizations have a systems design that is not adept at capturing data that actually feeds back into their program. So whether you’re working with manual data logs, excel sheets or an existing data dashboard, we help set your data foundations right.',
    handwritten: 'If we collect this information, what action will it help us take?',
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
      'Data was never meant to be this daunting, complex being. We invest time in building intuitive dashboards that are easy to read and even easier to use, so that people across the org can navigate them comfortably, and not get overwhelmed by the data.',
    handwritten: 'Focus less on showing all the data, and more on showing the right data',
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
      'What’s the point of a shiny dashboard when no one in the organization is using it? A big focus of our work is to conduct trainings and workshops on enabling data adoption, so that people of every level of the org can use the data being collected to make better decisions.',
    handwritten:
      'Data adoption is a marathon you practise for every week, not a sprint you run once every few months.',
    images: [
      { src: '/photos/phase-adopt-a.webp', alt: 'A partner team working through a build session with Goalkeep' },
      { src: '/photos/phase-adopt-b.webp', alt: 'A Goalkeep facilitator walking a colleague through data on a phone' },
    ],
  },
]

/* "Stat band: Remove". The 4-hrs-every-Monday figure is gone from this
   section; the CTA it shared a row with survives on its own. */

/* ============================================================
   4 · Whom we do it for — pale blue
   ============================================================ */

export const audienceSection = {
  eyebrow: 'whom we do it for',
  headline: 'We’ve worked with three kinds of organizations.',
  headlineTail:
    'You may choose which one resonates most closely to you, and we’ll tell you how we helped them.',
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
    header:
      'Does your organization have a lot of data but it’s often a struggle for your teams to make sense of it and use it effectively?',
    body: [
      'Being able to use information to make better decisions shouldn’t only be for large organisations that already have the tech and the people in place. Our Kickstarter programme helps smaller organisations put the basic systems in place to measure their Theory of Change, use that information to improve the program-related decisions, and communicate that impact so they are in a position to attract better funding.',
      'Many small nonprofits assume that building an impact monitoring system requires complex software, dedicated data teams or significant technical expertise. It doesn’t.',
    ],
    highlight: {
      text: 'measure their Theory of Change, use that information to improve the program-related decisions, and communicate that impact so they are in a position to attract better funding.',
      hue: 'var(--gk-yellow)',
    },
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
          text: 'The fact that Goalkeep made us think about this is itself valuable.',
          attribution: 'Revathi Radhakrishnan, Vanavil Trust',
        },
      },
      name: 'Revathi Radhakrishnan',
      credentials: 'Vanavil Trust',
    },
    cta: { label: 'See our Kickstarter programme', to: '/programs/kickstarter' },
  },
  {
    id: 'data-mature',
    label: 'Data-mature nonprofits',
    header:
      'Has your organization built data systems that your teams just aren’t using, despite conducting several trainings?',
    body: [
      'Getting teams to adopt a system that they’re not used to is a challenge. Several organizations pour in a ton of resources on data trainings, MEL workshops, data reviews — just to realize that their adoption rate hasn’t moved much. That’s why, in our Data Literacy Program, we “train the trainers” — we will equip two members from your MEL team with the skills and toolkits they need to percolate an organization-wide data culture, so that the data systems you built actually get used and adopted by your teams.',
      'The 42 MEL leads we have trained so far have gone on to train 700+ people across their organizations.',
    ],
    highlight: {
      text: 'we will equip two members from your MEL team with the skills and toolkits they need to percolate an organization-wide data culture, so that the data systems you built actually get used and adopted by your teams.',
      hue: 'var(--gk-coral-lift)',
    },
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
          text: 'We constantly do trainings for tech and data, but we don’t do it as systematically as you all explain.',
          attribution: 'Shivangi Desai, Goonj',
        },
      },
      name: 'Shivangi Desai',
      credentials: 'Goonj',
    },
    cta: { label: 'See the Data Literacy Programme', to: '/programs/data-literacy' },
  },
  {
    id: 'intermediary',
    label: 'Intermediary partners',
    header:
      'Are you looking to build the capacities of your partner organizations that will enable them to scale their programs and deepen their impact?',
    body: [
      /* "the funding we have to organization X" is verbatim from the copy doc.
         Reads like a slip for "gave"; flagged rather than silently corrected. */
      'As an intermediary that usually sits in the middle of both funders and nonprofits, a question you need to answer often is probably this: what impact did the funding we have to organization X create? It’s not always the easiest to answer if the data systems in place are outdated, messy, and not effectively mapped to their theory of change.',
      'That’s where we step in, by conducting trainings with your partner orgs so that they learn to use data and not anecdotal evidence to drive both their impact communication and their internal decision making.',
    ],
    highlight: {
      text: 'what impact did the funding we have to organization X create? It’s not always the easiest to answer if the data systems in place are outdated, messy, and not effectively mapped to their theory of change.',
      hue: 'var(--gk-teal-lift)',
    },
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
          text: 'I have seen how much attention to detail Goalkeep gives to any program that they are part of. The way they bond and form relationships with the participating NGOs is strong and it is always a nice experience to partner with them.',
          attribution: 'Freya Ray, Dasra',
        },
      },
      name: 'Freya Ray',
      credentials: 'Dasra',
    },
    cta: { label: 'Partner with us', to: '/partner-with-us' },
  },
]

/* ============================================================
   5 · Proof — navy
   ============================================================ */

/* "Keep this the same for now." */
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
      value: { figure: 4, suffix: ' hrs', sentence: 'back every Monday for one MEL lead' },
      verify: 'Attribution and the real figure.',
    },
  ],
}

/* ============================================================
   6 · Case studies — cream
   ============================================================ */

export const caseStudySection = {
  eyebrow: 'case studies',
  headline: 'What changed,',
  headlineTail: 'and what it took to get there.',
  cta: { label: 'Read all case studies', to: '/case-studies' },
}

/*
 * Four cards, all named organisations, each led by what actually changed
 * rather than a before/after figure. The Veruschka card and the post-mortem
 * card ("Delete the post-mortem card") were both cut in the copy replacement.
 */
export const caseStudies: Array<CaseStudy> = [
  {
    slug: 'baithak-reporting',
    org: 'Baithak Foundation',
    tag: 'Kickstarter',
    body: 'A dashboard that helped close a ₹25 lakh grant. What convinced the funder wasn’t the dashboard, but that every person on the team used it regularly.',
    image: '/photos/case-baithak.webp',
    imageAlt: 'A Baithak Foundation music session in progress',
  },
  {
    slug: 'vanavil-baseline',
    org: 'Vanavil Trust',
    tag: 'Kickstarter',
    body: 'From attendance data to assessing school programmes, Vanavil mapped their theory of change to key indicators that could give them a better glimpse of program gaps and successes.',
    image: '/photos/case-vanavil.webp',
    imageAlt: 'Children studying in a Vanavil Trust classroom',
  },
  {
    slug: 'peepul-leadership-dashboard',
    org: 'Peepul',
    tag: 'Custom project',
    body: 'Nineteen organisation-level indicators and a leadership dashboard helped Peepul more effectively monitor their programs as they scaled to having 8 programs across 2 states.',
    image: '/photos/case-dashboard.webp',
    imageAlt: 'A programme dashboard open on a laptop',
  },
  {
    slug: 'apni-shala-indicators',
    org: 'Apni Shala Foundation',
    tag: 'Kickstarter',
    body: 'A handful of hero metrics on the weekly dashboard helped Apni Shala quickly identify student learning gaps that used to surface only at year-end previously.',
    image: '/photos/case-apni-shala.webp',
    imageAlt: 'A student working on a craft activity',
  },
]

/* ============================================================
   7 · FAQs — pale blue
   ============================================================ */

/* The heading is one plain sentence now. The eyebrow, the "Including the ones
   that cost us the work" line and the handwritten "Still stuck? Write to us"
   aside all went with the copy replacement — the doc gives this section one
   heading and seven questions, and the aside was dev-build copy repeating a
   promise the closing band already makes. */
export const faqSection = {
  headline: 'Questions we get in the first call.',
}

/* Seven questions, drafted for nonprofits with limited data maturity, tight
   budgets and a real need to show the impact of their programmes. The pricing
   and timeline commitments the old set made are gone. */
export const faqs: Array<Faq> = [
  {
    value: {
      question: 'We don’t have a data team. Is that a problem?',
      answer:
        'No, and that describes most of the organisations we work with. Some of the strongest data practitioners in nonprofits come from programme teams, because they already understand the context, the constraints and the decisions the data needs to inform. What matters is that someone in the organisation is willing to own the answer to “is this number right”, even if data isn’t in their job title.',
    },
  },
  {
    value: {
      question: 'We already collect a lot of data. Why would we need help?',
      answer:
        'Most organisations we meet have no shortage of data. The difficulty is that it was collected to report upward rather than to decide anything. Before adding a new indicator, it helps to ask: who will look at this, and what decision will it change? If there isn’t a good answer, it isn’t free to collect.',
    },
  },
  {
    value: {
      question: 'Do we get a dashboard at the end?',
      answer:
        'Often, but the dashboard is rarely the point. With Vanavil Trust, the biggest change wasn’t the dashboard, it was that the team stopped asking “what data should we collect” and started asking “what information will actually help us make better decisions”. The most important step isn’t choosing the right software or collecting more data. It’s agreeing on what matters enough to measure.',
    },
  },
  {
    value: {
      question: 'Our budget is small. Where do we start?',
      answer:
        'Our Kickstarter program is designed for exactly this. It is meant for smaller organisations who need the basic systems in place, without a large upfront commitment. More generally, most guidance suggests setting aside 5 to 10 percent of a project budget for MEL. The number matters less than the habit: decide what MEL needs before the rest of the budget is locked, not after.',
    },
  },
  {
    value: {
      question: 'Our funder treats MEL as overhead. What do we say?',
      answer:
        'Come prepared to explain why it isn’t. India’s CSR rules cap administrative overheads at 5 percent of expenditure, but define these narrowly as general management of a company’s CSR function, explicitly excluding costs incurred for designing, implementing, monitoring and evaluating a project. MEL is no more overhead than a map is on a road trip. You still need to know if you’re headed the right way.',
    },
    verify:
      'The reading of the CSR overhead rule, with someone who can stand behind it — this answer tells funders what the law says.',
  },
  {
    value: {
      question: 'Should we just hire a data person instead?',
      answer:
        'You may well need to, but a hire alone usually changes very little. Data talent isn’t a single role, it’s a spectrum, from defining what to collect, to analysing it, to building and maintaining the systems underneath. Expecting one hire to cover all of it is unrealistic. Bringing in outside help is a bit like hiring an architect before constructing a building. The goal isn’t to outsource ownership, it’s to get specialised expertise at the moments it matters.',
    },
  },
  {
    /* Verbatim from the copy doc, bracket and closing note included. That
       answer is unfinished — it is the one question the document left open —
       and running it as written keeps the gap visible on the page instead of
       hiding it behind a plausible-sounding half-answer. Replace the whole
       string once Goalkeep says what handover includes. */
    value: {
      question: 'What happens after you leave?',
      answer:
        '[Goalkeep to confirm the specifics.] The intent, in Goalkeep’s own words, is that people at every level of the organisation can use the data being collected to make better decisions once we’re gone. Worth stating here what handover actually includes: documentation, training, and who to call.',
    },
    verify:
      'BLOCKING — this answer is a placeholder and currently reads as one on the page. Goalkeep to confirm what handover actually includes: documentation, training, and who to call.',
  },
]

/* ============================================================
   8 · Field notes — cream deep
   ============================================================ */

/* "Keep same." */
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

/* The eyebrow and the second headline line ("Sub: remove") are gone. What is
   left is one sentence and two buttons. */
export const closing = {
  /* Split three ways so the highlighter lands on one short word. `.marker` is
     an inline-block and cannot break across lines, so a marked phrase set at
     display size has to be short enough to survive a 360px viewport. */
  headlineLead: 'Make your next program decision with more',
  headlineKeyword: 'clarity',
  headlineTail: 'and certainty.',
  primaryCta: { label: 'Talk to us', to: '/contact' },
  secondaryCta: { label: 'Take our data culture quiz', to: '/resources/data-quiz' },
  marginalia: {
    value: 'Replies come from\na person, usually\nwithin 24 hours',
    verify: 'The 24-hour response-time promise, with Manije.',
  },
}

export const honestStat: PullQuote = {
  value: {
    text: '73% of dashboards we audit aren’t opened twice.',
    attribution: 'Goalkeep audit sample, 2024–2026',
  },
  verify: 'Source and sample size for the 73% figure.',
}
