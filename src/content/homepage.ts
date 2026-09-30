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
  headlineLead: 'Data isn’t just meant to measure impact, but also',
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
    /* Reframed after the 23 Sep doc ("one of the intro sentences reads as
       generic"): the old tail, "…that deepen the impact of your programs",
       could be any consultancy's. This one says what's different - the
       systems get used. Placeholder until Aditya's copy pass. */
    tail: 'data systems your teams actually use to run better programs.',
  },
  primaryCta: { label: 'Talk to us', to: '/contact' },
  secondaryCta: { label: 'See our work', to: '/case-studies' },
  /**
   * Goalkeep photography. No longer behind the hero — "let's remove the
   * background from here and keep a simple solid blue colour like in the
   * marketing materials, and keep this video in some other component's
   * background below". It runs behind the numbers band instead.
   */
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
      tag: 'Data Systems Design',
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
      tag: 'Operationalizing Theory of Change',
      image: '/photos/case-vanavil.webp',
      imageAlt: 'Children studying in a Vanavil Trust classroom',
      line: {
        value:
          'We helped Vanavil map their theory of change to three distinct, measurable indicators.',
      },
      to: '/case-studies',
    },
    {
      org: 'Apni Shala Foundation',
      tag: 'Identifying Hero Metrics',
      image: '/photos/case-apni-shala.webp',
      imageAlt: 'A student working on a craft activity at Apni Shala',
      line: {
        value:
          'A handful of hero metrics introduced on the weekly dashboard surfaced student learning gaps that used to only appear at year-end.',
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
  heading: 'Partners who',
  headingEm: 'trust us',
  /* Added in the copy replacement. */
  subline: 'Nonprofits, funders and intermediaries across India.',
}

/* ============================================================
   2b · Why we exist — beige
   ============================================================ */

/* Verbatim from the approved "Why we exist (blue variation)" artifact.
   After the 28 Sep review: "money" reads "investment" throughout, and the
   on-page source footnote placeholders are gone. `sources` still records
   what needs checking. */
export const whyWeExist = {
  eyebrow: 'why we exist',
  headlineLead: "India's social sector isn't short on data.",
  headlineEm: "It's short on decisions made with data.",
  lead: 'Since reporting is the primary use case for data in the social sector, very little flows back down to inform day-to-day decision making in NGOs. To add to that, most teams are overwhelmed by the sheer volume of data circulating in their organizations to make much sense of them. As a result, the sector is missing a key opportunity to maximize social impact.',
  chapters: [
    {
      num: '01',
      title: 'The investment',
      stat: '₹27 lakh crore a year',
      body: "India's social sector currently spends ₹27 lakh crore annually, and this is projected to grow at 10% every year through 2030. The investment is coming in, but the key question is: are we using it in the best way possible?",
    },
    {
      num: '02',
      title: 'The decisions',
      stat: '5 in 100 are data-driven',
      body: "Only about 5% of everyday decisions in the sector are driven by data. Program strategy and budget calls still run largely on intuition, which begs us to ask: what kind of impact potential is untapped when we’re spending over $250 billion on gut-feel and anecdotal evidence?",
    },
    {
      num: '03',
      title: 'The loop',
      stat: 'Data flows upwards and out',
      body: 'Data gets collected primarily to meet funder requirements, flows into impact reports and evaluations, and rarely finds its way back into the program. As more investment flows in, it becomes more important than ever for teams to embrace data adoption and use it for programmatic learning and insights.',
    },
    {
      num: '04',
      title: 'The missing layer',
      stat: 'Incomplete decision infrastructure',
      body: "In the last two decades, India's nonprofits have made steady progress in capital, talent, tools, and programs. But without a robust data system, the decision infrastructure remains incomplete. That's where we come in: to design systems that teams own, trust, and use to inform their decisions.",
    },
  ],
  spend: {
    label: 'Annual social sector spend in India',
    sub: 'Projected to grow at ~10% YoY until 2030.',
    pill: '+61% by FY30',
  },
  decisions: {
    claim: 'of everyday decisions in the sector are driven by data.',
    support: 'The other 95 run largely on intuition. The data exists, but very little of it is being channeled effectively.',
  },
  sources: {
    value: '₹27 lakh crore annual spend, 10% growth to 2030, 5% of decisions data-driven, $250 billion',
    verify: 'Source footnotes 1–4 from the funder deck. Removed from the page in the 28 Sep review; still unsourced.',
  },
}

/* ============================================================
   3 · What we do — cream, interactive
   ============================================================ */

export const whatWeDo = {
  eyebrow: 'what we do',
  headline: 'Most of the projects we take on',
  headlineTail: 'involve one or more of the following.',
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
      'Most organizations have a systems design that is optimized to capture data volumes as compared to using that data effectively. So whether you’re working with manual data logs, excel sheets or an existing data dashboard, we help set your data foundations right with one key question: what decision should this data help inform?',
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
      'Data was never meant to be this daunting, complex being. We invest time in building intuitive dashboards that are easy to read and even easier to use, so that people across the organization can navigate them comfortably, without getting overwhelmed by the data.',
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
      'What’s the point of investing in data systems when no one in the organization is using it? Probably the biggest part of our work focuses on capacity building and on enabling data adoption among teams, so that people at every level of the organization can learn how to work with data.',
    images: [
      /* 23 Sep: "use more photographs of training sessions… that visibly show
         an organisation adopting data." Both are stills from the Data
         Literacy Programme films. */
      { src: '/photos/phase-adopt-training-a.webp', alt: 'A Goalkeep trainer walking a Data Literacy Programme cohort through the manual' },
      { src: '/photos/phase-adopt-training-b.webp', alt: 'Participants working through a data exercise together at a Data Literacy Programme session' },
    ],
  },
]

/* "Stat band: Remove". The 4-hrs-every-Monday figure is gone from this
   section; the CTA it shared a row with survives on its own. */

/* ============================================================
   4 · Whom we do it for — pale blue
   ============================================================ */

/* 30 Sep content doc: final copy for all four segments (Funders keeps its
   placeholder testimonial), the client's own photographs for the first three
   galleries and testimonials, and no captions on the gallery - "just plain
   image scroller is fine". */
export const audienceSection = {
  eyebrow: 'who we do it for',
}

export const audiences: Array<Audience> = [
  {
    id: 'early-stage',
    label: 'Early-stage NGOs',
    header: 'Lots of data, but no clear way to make sense of it?',
    body: {
      value: 'You don’t need a data team or expensive software to know whether your program is working. Our Kickstarter program is specifically designed to help early-stage NGOs put one reliable data system in place. We streamline your data input processes, develop a working dashboard, and identify a handful of key metrics to help you collectively map your Theory of Change in a way that is measurable and accurate.',
    },
    photos: [
      { src: '/photos/aud-early-1.webp', alt: 'A facilitator presenting a dashboard on screen to a partner team' },
      { src: '/photos/aud-early-2.webp', alt: 'A partner team around a meeting-room table during a working session' },
      { src: '/photos/org-classroom.webp', alt: 'A programme session running in a village classroom' },
      { src: '/photos/phase-design-a.webp', alt: 'Affinity mapping on coloured boards during a design workshop' },
      { src: '/photos/group-team.webp', alt: 'Goalkeep with a partner team after a workshop' },
      { src: '/photos/hero-03-circle.webp', alt: 'A floor-circle working session' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'We end up capturing a lot of data, but it’s the first time we’ve stepped back to think of what are the key findings we really want our data to shed light on as an organisation. We are now at a place to be making less emotional, and more data-driven decisions.',
          attribution: 'Sangeeta Zombade, Apni Shala Foundation',
        },
      },
      name: 'Sangeeta Zombade',
      credentials: 'Apni Shala Foundation',
      photo: '/photos/aud-early-testimonial.webp',
    },
    cta: { label: 'Explore our Kickstarter program', to: '/programs/kickstarter' },
  },
  {
    id: 'data-mature',
    label: 'Data-mature nonprofits',
    header: 'Systems in place, but struggling to build a culture of data adoption?',
    body: {
      value: 'Adoption is truly the hard part. In our Data Literacy Program we train the trainers: two people from your MEL team get the skills and toolkits to build a data culture across your organisation, so the systems you already built actually get used. The 42 MEL leads we’ve trained have gone on to train 700+ colleagues.',
    },
    photos: [
      { src: '/photos/aud-mature-1.webp', alt: 'A facilitator speaking at a Data Literacy Program session' },
      { src: '/photos/aud-mature-2.webp', alt: 'Participants working on laptops around a training table' },
      { src: '/photos/note-01.webp', alt: 'A partner team member speaking during a working session' },
      { src: '/photos/aud-mature-3.webp', alt: 'A Data Literacy Program cohort gathered in front of the programme banner' },
      { src: '/photos/hero-04-pair.webp', alt: 'Two facilitators reviewing a tablet' },
      { src: '/photos/aud-mature-4.webp', alt: 'A participant making a point during a table discussion' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'In my 18 years of experience in research and M&E, I have never seen such a detailed training being conducted. I got confidence and a lot of resources to use, which we can easily contextualize to our organization back in Punjab.',
          attribution: 'Perwinder Singh, Sanjhi Sikhiya',
        },
      },
      name: 'Perwinder Singh',
      credentials: 'Sanjhi Sikhiya',
      photo: '/photos/aud-mature-testimonial.webp',
    },
    cta: { label: 'Explore the Data Literacy Program', to: '/programs/data-literacy' },
  },
  {
    id: 'intermediary',
    label: 'Ecosystem partners',
    header: 'Looking to build the MEL capacities of organisations at scale?',
    body: {
      value: 'We work alongside you as the MEL capacity building partner for your cohort and incubator organizations. Through a series of workshops, each organisation learns how to effectively map its theory of change: working out what to track, how to track it, and how to use what it learns in its day-to-day work.',
    },
    photos: [
      { src: '/photos/aud-eco-1.webp', alt: 'A facilitator pointing out something on a worksheet to a participant' },
      { src: '/photos/aud-eco-2.webp', alt: 'A partner cohort group photograph at a convening' },
      { src: '/photos/aud-eco-3.webp', alt: 'Two participants discussing their work at laptops' },
      { src: '/photos/aud-eco-4.webp', alt: 'A participant placing sticky notes on a chart-paper wall' },
      { src: '/photos/aud-eco-5.webp', alt: 'Cohort members working together around a table' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'It’s always inspiring to see how Goalkeep conducts their sessions. Their attention to detail is very high and the approach involved forming strong relationships with the participating NGOs, which is why we like having them as an MEL partner.',
          attribution: 'Freya Ray, Dasra',
        },
      },
      name: 'Freya Ray',
      credentials: 'Dasra',
      photo: '/photos/aud-eco-testimonial.webp',
    },
    cta: { label: 'Partner with us', to: '/partner-with-us#ecosystem-partners' },
  },
  {
    id: 'funders',
    label: 'Funding Organizations',
    header: 'Are you looking to develop a more robust framework to evaluate grant applications?',
    body: {
      value: 'Funders often receive grant applications from organizations with varying submission assets and outcome parameters. Having a system that streamlines their work, impact, compliance criteria, and financial health can help you evaluate NGOs with more clarity, and help make more well-rounded investment decisions.',
    },
    photos: [
      { src: '/photos/case-dashboard.webp', alt: 'A programme dashboard open on a laptop' },
      { src: '/photos/hero-02-classroom.webp', alt: 'A village classroom session' },
      { src: '/photos/phase-adopt-b.webp', alt: 'A facilitator walking a colleague through data on a phone' },
      { src: '/photos/phase-design-b.webp', alt: 'A floor-circle working session' },
      { src: '/photos/case-apni-shala.webp', alt: 'A student working on a craft activity' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'For the first time, our grantees’ numbers told us something we could act on.',
          attribution: 'Programme lead, funding partner',
        },
        verify: 'Placeholder quote — no funder testimonial exists yet. Replace with a real, named quote before launch.',
      },
      name: 'Programme lead',
      credentials: 'Funding partner (placeholder)',
      photo: '/photos/hero-04-pair.webp',
    },
    cta: { label: 'Partner with us', to: '/partner-with-us#funders' },
  },
]

/* ============================================================
   5 · Proof — navy
   ============================================================ */

/* 30 Sep content doc: new headline and four new figures, supplied by
   Goalkeep. */
export const proof = {
  eyebrow: 'the short version',
  headline: 'Six years of helping organizations to measure, communicate, and deepen their impact with confidence.',
  stats: [
    { value: { figure: 910, suffix: '+', sentence: 'people trained' } },
    { value: { figure: 75, suffix: '%', sentence: 'reduction in average time spent on reporting' } },
    { value: { figure: 2.5, suffix: 'x', sentence: 'increase in data systems adoption' } },
    { value: { figure: 90, suffix: '%', sentence: 'of partner organizations now using data to make decisions' } },
  ],
}

/* ============================================================
   6 · Case studies — cream
   ============================================================ */

export const caseStudySection = {
  eyebrow: 'case studies',
  headline: 'What changed,',
  headlineTail: 'and what it took to get there.',
  /* Highlighted, as a trial of the paper-highlighter treatment on a short
     phrase - see headlineCircle in whyWeExist. */
  headlineMark: 'what it took',
  cta: { label: 'Read all case studies', to: '/case-studies' },
}

/*
 * Four cards, all named organisations, each led by what actually changed
 * rather than a before/after figure. The Veruschka card and the post-mortem
 * card ("Delete the post-mortem card") were both cut in the copy replacement.
 */
/* 23 Sep: programme names ("Kickstarter", "Custom project") meant nothing to
   a visitor, so each card carries two tags instead - the sector, and the work
   done. Tag vocabulary from the call: sectors Education, Livelihoods,
   Disability, Health, Arts; interventions Data collection & visualisation,
   Theory of Change in practice (for "operationalising", which isn't widely
   understood), Grant management systems, Capacity building. Which card gets
   which is a first pass for Goalkeep to correct. */
export const caseStudies: Array<CaseStudy> = [
  {
    slug: 'baithak-reporting',
    org: 'Baithak Foundation',
    sector: 'Arts',
    intervention: 'Data collection & visualisation',
    body: 'A real-time data system that we built for Baithak Foundation played a pivotal role in closing a ₹25 lakh grant. What convinced the funder wasn’t just the dashboard metrics, but that every person on the team also used that data regularly.',
    image: '/photos/case-baithak.webp',
    imageAlt: 'A Baithak Foundation music session in progress',
  },
  {
    slug: 'vanavil-baseline',
    org: 'Vanavil Trust',
    sector: 'Education',
    intervention: 'Operationalizing Theory of Change',
    body: 'From attendance data to assessing school programmes, Vanavil mapped their theory of change to key indicators that could give them a better glimpse of program gaps and successes.',
    image: '/photos/case-vanavil.webp',
    imageAlt: 'Children studying in a Vanavil Trust classroom',
  },
  {
    slug: 'peepul-leadership-dashboard',
    org: 'Peepul',
    sector: 'Education',
    intervention: 'Designing Organizational Impact Framework',
    body: 'Nineteen organisation-level indicators and a leadership dashboard helped Peepul more effectively monitor their programs as they scaled to having 8 programs across 2 states.',
    image: '/photos/case-peepul.webp',
    imageAlt: 'A teacher marking a number line on a classroom blackboard',
  },
  {
    slug: 'apni-shala-indicators',
    org: 'Apni Shala Foundation',
    sector: 'Education',
    intervention: 'Identifying key metrics',
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
  headline: 'Questions we get',
  headlineEm: 'in the first call.',
}

/* Q1-Q3 from the 23 Sep feedback doc; Q4-Q7 replaced in the 30 Sep content
   doc. */
export const faqs: Array<Faq> = [
  {
    value: {
      question: 'We don’t have a data team. Is that a problem?',
      answer:
        'No, and that describes most of the organisations we work with. Some of the strongest data practitioners in nonprofits come from program teams, because they already understand the context, the constraints and the decisions the data needs to inform. Also, we understand that having a data team is a tough ask when you’re working with limited budgets, and our engagements are designed to cater to both data mature and early stage nonprofits who have never streamlined their data systems before.',
    },
  },
  {
    value: {
      question: 'We already collect a lot of data. Why would we need help?',
      answer:
        'Most organisations we meet have no shortage of data. The difficulty is that it is either (a) the data is being collected only to report upward (to donors and funders) rather than to decide anything about your programs and/or (b) even if you are trying to use data to deepen your impact, there is so much data without a clear systems design to sustain it that your team ends up getting overwhelmed, and hence barely using the data at all. That’s where we come in, to help you organize the mess, slap on a new coat of paint, and teach you how to get your organization to lean in to using more data in their decision making.',
    },
  },
  {
    value: {
      question: 'Do we get a data dashboard at the end of our engagement with you?',
      answer:
        'Often, yes; but the dashboard is only part of the picture. The most important step isn’t creating a new dashboard or collecting more data. It’s agreeing on what matters enough to measure, and then having the infrastructure in place to measure it accurately and easily.',
    },
  },
  {
    value: {
      question: 'What software do you use?',
      answer:
        'Whatever your team can run without us. We don’t start with a tool, we start with the questions your team needs answered, then build in software you can maintain yourselves. For many organisations that means Google Sheets and a simple dashboard. For some partners, we’ve built pipelines using custom tools and AI platforms too.',
    },
  },
  {
    value: {
      question: 'Will you help us figure out what metrics will truly communicate our impact?',
      answer:
        'Yes, and it’s where we always begin. We run a key questions exercise across your organisation, from founders to field staff, asking what decisions people make and what information would help them make those decisions better. We then map your theory of change to a focused set of indicators. The test we apply to every metric is simple: if we collect this, what action will it help us take?',
    },
  },
  {
    value: {
      question: 'We already have dashboards and people don’t use them. Why make more?',
      answer:
        'Dashboards usually go unused because they were built to report upward, not to answer the questions the people using them actually have. Often the fix is streamlining what already exists: fewer indicators, views designed for each role, and data that flows back to the teams who collect it. Then we train people at every level until using the dashboard is simply part of how your organization functions on a week-to-week basis. We know that data adoption is the hard part, and it’s the part we spend most of our time focusing on.',
    },
  },
  {
    value: {
      question: 'We have a team that makes reports regularly. Why do we need your service?',
      answer:
        'Most nonprofit data goes into donor reports and very little of it feeds internal decisions. We help turn the data your team already collects into something your programs can act on regularly, and factor into program decisions they make. When the underlying system works, credible reporting follows as a byproduct, and your team spends less time assembling reports and more time using what’s in them.',
    },
  },
]

/* ============================================================
   8 · Field notes — cream deep
   ============================================================ */

/* "Keep same." */
export const fieldNoteSection = {
  eyebrow: 'field notes',
  headline: 'What we’re learning,',
  headlineEm: 'written down.',
  /* 23 Sep doc: "clarify what this section is for and how it's positioned."
     It is the practitioner's shelf - short, specific notes for program and
     MEL teams, not company news or opinion pieces. Placeholder wording. */
  lead: 'Short, practical notes for program and MEL teams, from the work we’re doing right now: what worked, what didn’t, and what we’d do differently.',
  cta: { label: 'Read all field notes', to: '/resources/blog' },
}

/* Sectors are a first pass for Goalkeep to correct, like the case-study tags. */
export const fieldNotes: Array<FieldNote> = [
  {
    slug: 'dashboards-not-opened-twice',
    date: '12 Aug 2026',
    readingTime: '4 min',
    title: '73% of the dashboards we audit aren’t opened twice',
    dek: 'Two years of audits, counted. What the survivors had in common.',
    sector: 'Cross-sector',
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
    sector: 'Livelihoods',
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
    sector: 'Education',
    tag: 'Data strategy',
    image: '/photos/aud-eco-3.webp',
    imageAlt: 'Two participants discussing their work at laptops',
  },
]

/* ============================================================
   9 · Closing — navy
   ============================================================ */

/* The eyebrow and the second headline line ("Sub: remove") are gone. What is
   left is one sentence and two buttons. */
export const closing = {
  /* 23 Sep doc: "full emboldened, except for the phrase 'clarity and
     certainty.' - all white, no highlight". */
  headlineLead: 'Make your next program decision with more',
  headlineQuiet: 'clarity and certainty.',
  primaryCta: { label: 'Talk to us', to: '/contact' },
  secondaryCta: { label: 'Take our data culture quiz', to: '/resources/data-quiz' },
}

export const honestStat: PullQuote = {
  value: {
    text: '73% of dashboards we audit aren’t opened twice.',
    attribution: 'Goalkeep audit sample, 2024–2026',
  },
  verify: 'Source and sample size for the 73% figure.',
}
