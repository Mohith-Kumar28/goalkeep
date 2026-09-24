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
      tag: 'Dashboards',
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
      tag: 'Theory of Change',
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
      tag: 'Indicator design',
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
  heading: 'Partners who',
  headingEm: 'trust us',
  /* Added in the copy replacement. */
  subline: 'Nonprofits, funders and intermediaries across India.',
}

/* ============================================================
   2b · Why we exist — beige
   ============================================================ */

/* Built from the "Why we exist" artifact Rumit shared after the 23 Sep call.
   Panel 01 is the artifact verbatim. Panels 02–04 exist in the artifact only
   as titles and one-line tags, so their body copy and figures here are drafts
   - the whole section is waiting on Aditya's approval, and every panel
   carries a verify note until then. */
export const whyWeExist = {
  eyebrow: 'why we exist',
  headlineLead: "India's social sector isn't short on data.",
  headlineEm: "It's short on decisions made with data.",
  /* The one word circled. 23 Sep: "circle one key word or one key two-word
     phrase" - a trial until the Canva highlight guide lands. */
  headlineCircle: 'decisions',
  lead: 'Every year, more capital flows into the Indian nonprofit sector. However, with little data flowing back into the decision-making layer, several organizations are missing a key opportunity to maximize program impact.',
  panels: [
    {
      value: {
        id: 'money',
        title: 'The money',
        tag: '₹27 lakh crore a year',
        body: "India's social sector currently spends ₹27 lakh crore annually, and is projected to grow at 10% every year through 2030. The money is coming in, but the key question is: are we using it in the best way possible?",
      },
      verify: 'Source footnotes 1–3 from the funder deck for the ₹27 lakh crore figure and the 10% projection.',
    },
    {
      value: {
        id: 'decisions',
        title: 'The decisions',
        tag: '5 in 100 use data',
        body: 'For every hundred organizations collecting data, only about five use it to change what they do next. The rest gather it for the reports that travel upward to funders.',
      },
      verify: 'Draft copy. The "5 in 100" figure and its source, from the funder deck.',
    },
    {
      value: {
        id: 'loop',
        title: 'The loop',
        tag: 'Proving, not improving',
        body: 'Evaluations are commissioned one at a time, to prove impact to a funder. Once the report is filed, what it found rarely makes its way back into how the program runs.',
      },
      verify: 'Draft copy — Aditya to approve.',
    },
    {
      value: {
        id: 'layer',
        title: 'The missing layer',
        tag: 'Decision infrastructure',
        body: 'What’s missing is the layer in between: the systems that turn what an organization collects into what it decides, week after week. As funding grows, that gap widens. It’s the layer Goalkeep builds.',
      },
      verify: 'Draft copy — Aditya to approve.',
    },
  ],
  spend: {
    label: 'Annual social sector spend in India',
    figure: '₹27 lakh crore',
    sub: 'Projected to grow at ~10% YoY until 2030.',
    pill: '+61% by FY30',
    bars: [
      { year: 'FY25', value: 27 },
      { year: 'FY26', value: 29.7 },
      { year: 'FY27', value: 32.7 },
      { year: 'FY28', value: 35.9 },
      { year: 'FY29', value: 39.5 },
      { year: 'FY30', value: 43.5 },
    ],
    note: 'Projection drawn at 10% annual growth on current sector spend.',
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
      'Most organizations have a systems design that is not adept at capturing data that actually feeds back into their program. So whether you’re working with manual data logs, excel sheets or an existing data dashboard, we help set your data foundations right.',
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

/* 23 Sep review. The section lost its eyebrow and headline - the tabs lead -
   and gained a fourth segment, Funders. Headers are two lines at most, bodies
   one paragraph, and the testimonial is image-led. All the copy below is
   placeholder until Aditya's content pass ("keep the placeholder content…
   we'll finalise"), and each testimonial photo is a stand-in from the bank,
   not yet the person quoted. */
export const audienceSection = {
  photoCredit: {
    value: 'Partner names and locations on the gallery captions',
    verify:
      'Confirm the organisation and city on every gallery caption before launch. The four case-study covers are named in Drive; the workshop and field frames are labelled generically until someone confirms which partner site they were shot at.',
  },
}

const PLACEHOLDER = 'Placeholder copy from the 23 Sep review — Aditya to replace.'

export const audiences: Array<Audience> = [
  {
    id: 'early-stage',
    label: 'Early-stage NGOs',
    header: 'Plenty of data, but no time to make sense of it?',
    body: {
      value: 'You don’t need a data team or expensive software to run on evidence. Our Kickstarter programme helps smaller organisations put the basic systems in place: measure what their Theory of Change says matters, use it to make better program decisions, and show that impact to funders.',
      verify: PLACEHOLDER,
    },
    photos: [
      { src: '/photos/org-vanavil.webp', alt: 'Children studying in a Vanavil Trust classroom', org: 'Vanavil Trust', location: 'Tamil Nadu' },
      { src: '/photos/org-apni-shala.webp', alt: 'A student working on a craft activity', org: 'Apni Shala Foundation', location: 'Mumbai' },
      { src: '/photos/org-classroom.webp', alt: 'A programme session running in a village classroom', org: 'Programme session', location: 'In the field' },
      { src: '/photos/phase-design-a.webp', alt: 'Affinity mapping on coloured boards during a design workshop', org: 'Design workshop', location: 'Mumbai' },
      { src: '/photos/note-01.webp', alt: 'A partner team member speaking during a working session', org: 'Working session', location: 'In session' },
      { src: '/photos/hero-03-circle.webp', alt: 'A floor-circle working session', org: 'Brainstorm', location: 'In the field' },
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
      photo: '/photos/org-vanavil.webp',
    },
    cta: { label: 'See our Kickstarter programme', to: '/programs/kickstarter' },
  },
  {
    id: 'data-mature',
    label: 'Data-mature nonprofits',
    header: 'Built the systems, ran the trainings, and still no one uses them?',
    body: {
      value: 'Adoption is the hard part. In our Data Literacy Programme we train the trainers: two people from your MEL team get the skills and toolkits to build a data culture across the organisation, so the systems you already built actually get used. The 42 MEL leads we’ve trained have gone on to train 700+ colleagues.',
      verify: PLACEHOLDER,
    },
    photos: [
      { src: '/photos/org-baithak.webp', alt: 'A Baithak Foundation music session in progress', org: 'Baithak Foundation', location: 'Pune' },
      { src: '/photos/phase-build-a.webp', alt: 'A partner dashboard open on a laptop in the field', org: 'Live dashboard', location: 'In the field' },
      { src: '/photos/group-team.webp', alt: 'Goalkeep with a partner team after a workshop', org: 'Partner team', location: 'Post-workshop' },
      { src: '/photos/note-03.webp', alt: 'A facilitator presenting findings at a partner dashboard', org: 'Findings review', location: 'In session' },
      { src: '/photos/hero-04-pair.webp', alt: 'Two facilitators reviewing a tablet', org: 'Data review', location: 'In the field' },
      { src: '/photos/phase-build-b.webp', alt: 'Programme indicators on a partner dashboard', org: 'Indicator review', location: 'In session' },
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
      photo: '/photos/note-02.webp',
    },
    cta: { label: 'See the Data Literacy Programme', to: '/programs/data-literacy' },
  },
  {
    id: 'intermediary',
    /* "Intermediaries" read as too narrow; this is from Aditya's written
       options ("Funding and ecosystem partners"), minus the funding half now
       that Funders is its own tab. Confirm with him. */
    label: 'Ecosystem partners',
    header: 'Building the capacity of the organisations you support?',
    body: {
      value: 'Capacity-building partners sit between funders and nonprofits, and are often asked what their support actually changed. We run data trainings across your partner cohort, so the organisations you work with learn to use data, not anecdotes, for their own decisions and for telling their impact story.',
      verify: PLACEHOLDER,
    },
    photos: [
      { src: '/photos/org-veruschka.webp', alt: 'A culinary training session at Veruschka Foundation', org: 'Veruschka Foundation', location: 'Mumbai' },
      { src: '/photos/group-lineup.webp', alt: 'A Goalkeep and partner team group photograph', org: 'Partner cohort', location: 'Convening' },
      { src: '/photos/phase-adopt-a.webp', alt: 'A partner team working through a build session', org: 'Adoption workshop', location: 'In session' },
      { src: '/photos/note-02.webp', alt: 'A facilitator presenting to a partner group', org: 'Cohort session', location: 'In session' },
      { src: '/photos/hero-01-workshop.webp', alt: 'An affinity-mapping wall during a workshop', org: 'Cohort workshop', location: 'Mumbai' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'The way they bond and form relationships with the participating NGOs is strong, and it is always a nice experience to partner with them.',
          attribution: 'Freya Ray, Dasra',
        },
      },
      name: 'Freya Ray',
      credentials: 'Dasra',
      photo: '/photos/group-lineup.webp',
    },
    cta: { label: 'Run a cohort with us', to: '/partner-with-us#ecosystem-partners' },
  },
  {
    id: 'funders',
    label: 'Funders',
    header: 'Want your grants to leave better decisions behind?',
    body: {
      value: 'Funders fund reports and evaluations, but rarely the systems that let a grantee act on what they find. We work directly with foundations and CSR teams to design portfolio-level indicators, and to fund data capacity inside the organisations they back, so every rupee comes back as evidence you can use.',
      verify: 'Placeholder copy. The Anaga/APF project is the reference engagement — Aditya to supply the line and a named quote.',
    },
    photos: [
      { src: '/photos/case-dashboard.webp', alt: 'A programme dashboard open on a laptop', org: 'Portfolio dashboard', location: 'In session' },
      { src: '/photos/hero-02-classroom.webp', alt: 'A village classroom session', org: 'Programme site', location: 'In the field' },
      { src: '/photos/phase-adopt-b.webp', alt: 'A facilitator walking a colleague through data on a phone', org: 'Field handover', location: 'In the field' },
      { src: '/photos/phase-design-b.webp', alt: 'A floor-circle working session', org: 'Grantee workshop', location: 'In session' },
      { src: '/photos/case-apni-shala.webp', alt: 'A student working on a craft activity', org: 'Apni Shala Foundation', location: 'Mumbai' },
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
    body: 'A dashboard that helped close a ₹25 lakh grant. What convinced the funder wasn’t the dashboard, but that every person on the team used it regularly.',
    image: '/photos/case-baithak.webp',
    imageAlt: 'A Baithak Foundation music session in progress',
  },
  {
    slug: 'vanavil-baseline',
    org: 'Vanavil Trust',
    sector: 'Education',
    intervention: 'Theory of Change in practice',
    body: 'From attendance data to assessing school programmes, Vanavil mapped their theory of change to key indicators that could give them a better glimpse of program gaps and successes.',
    image: '/photos/case-vanavil.webp',
    imageAlt: 'Children studying in a Vanavil Trust classroom',
  },
  {
    slug: 'peepul-leadership-dashboard',
    org: 'Peepul',
    sector: 'Education',
    intervention: 'Grant management systems',
    body: 'Nineteen organisation-level indicators and a leadership dashboard helped Peepul more effectively monitor their programs as they scaled to having 8 programs across 2 states.',
    image: '/photos/case-dashboard.webp',
    imageAlt: 'A programme dashboard open on a laptop',
  },
  {
    slug: 'apni-shala-indicators',
    org: 'Apni Shala Foundation',
    sector: 'Education',
    intervention: 'Capacity building',
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

/* Replacement content from the 23 Sep feedback doc, verbatim. Aditya is still
   reviewing these against his BD conversations; Q7 still needs the handover
   specifics. */
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
        'Often, yes; but the dashboard is only part of the picture. The most important step isn’t creating a new dashboard or collecting more data. It’s agreeing on what matters enough to measure, and then having the infrastructure in place to measure it accurately and easily. For instance, with Vanavil Trust, the biggest change wasn’t the new dashboard, it was that the team stopped asking “what more data should we add to our systems?” and started asking “how can we use our current dashboard to make better decisions?”.',
    },
  },
  {
    value: {
      question: 'Our budgets are really tight. Will you be able to help us?',
      answer:
        'Our Kickstarter program is designed for exactly this. It is meant for smaller organisations who need the basic systems in place, without a large financial commitment. We also reach out to funding organizations who help subsidize your place in the Kickstarter Cohort, so NGOs themselves usually have to bear only 50-75% of the total cost. Reach out to us and we’ll try and suggest what’s the best route forward for your organization.',
    },
    verify: 'The 50–75% cost share for NGOs in the subsidised Kickstarter cohort.',
  },
  {
    value: {
      question: 'Our funder treats MEL as an administrative overhead. How can we change their mind?',
      answer:
        'Come prepared to explain to them why it isn’t. India’s CSR rules cap administrative overheads at 5 percent of expenditure, but define these narrowly as general management of a company’s CSR function, explicitly excluding costs incurred for designing, implementing, monitoring and evaluating a project. MEL is no more overhead than a map is on a road trip. You still need to know if you’re headed the right way.',
    },
    verify:
      'The reading of the CSR overhead rule, with someone who can stand behind it — this answer tells funders what the law says.',
  },
  {
    value: {
      question: 'Should we just hire a data person instead?',
      answer:
        'You may well need to, but one hire alone usually changes very little. Data talent isn’t a single role, it’s a spectrum, from defining what to collect, to analysing it, to building and maintaining the systems underneath. Expecting one hire to cover all of it is often an unrealistic expectation. Bringing in outside help is a bit like hiring an architect before constructing a building - it can help bring you more clarity on what exactly sustaining this data system needs and what specific role you may want to hire for in the future.',
    },
  },
  {
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
