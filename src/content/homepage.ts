import type { CaseStudySlug } from './design/case-studies'
import type {
  Audience,
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
  /* 1 Nov: the headline now says what Goalkeep does, not what data is for.
     Same shape as before - a light lead and a bold-italic ending. */
  headlineLead: 'Enabling social sector organisations to use data to',
  headlineHighlight: 'scale impact.',
  /*
   * The subheader, typed.
   *
   * 21 Oct call: "the typing line basically starts with a static line which
   * is 'we work with funders, nonprofits and ecosystem partners to' and then
   * these three things are typed and changed."
   *
   * The frame is `${typed.lead} ___${typed.tail}`, so each phrase has to finish
   * the sentence on its own. The tail is just the full stop.
   */
  typed: {
    lead: 'We work with funders, nonprofits, and ecosystem partners to',
    phrases: [
      'build systems that scale with them',
      'turn data into decisions',
      'increase data adoption among their teams and organisations',
    ],
    tail: '.',
  },
  /* The homepage launches alone, so both buttons stay on the page: "the talk
     to us will lead down to the contact form below" and "see our work can lead
     to the case studies on the page for now". */
  primaryCta: { label: 'Talk to us', to: '#contact' },
  secondaryCta: { label: 'See our work', to: '#case-studies' },
  /**
   * The case cards. One organisation, one outcome, one photograph.
   *
   * 21 Oct doc: "All 3 case studies are early stage orgs - we risk pegging
   * ourselves agency for only that target audience", so the second and third
   * cards were replaced with Dasra and SVP India's cohort work and Peepul. The
   * photographs are the ones pasted into the doc. There is no "read case
   * study" link any more - there is no page for it to open yet.
   */
  proofCards: [
    /* 23 Oct: Baithak's line ran to two lines and left a white gap under it,
       so Apni Shala's card from the case studies takes its place. */
    {
      org: 'Apni Shala Foundation',
      tag: 'Identifying key metrics',
      image: '/photos/case-apni-shala.webp',
      imageAlt: 'The Apni Shala Foundation team standing together in their office',
      line: {
        value:
          'A handful of metrics on the weekly dashboard helped Apni Shala identify student learning gaps that used to surface only at year-end.',
      },
    },
    {
      org: 'Dasra and SVP India',
      tag: 'Operationalizing Theory of Change',
      image: '/photos/aud-eco-5.webp',
      imageAlt: 'Cohort members working together around a table',
      line: {
        value:
          'Conducted capacity building workshops to help 16 organizations in their cohort map their ToC to measurable indicators.',
      },
    },
    {
      org: 'Peepul',
      tag: 'Designing Organizational Impact Framework',
      image: '/photos/case-peepul.webp',
      imageAlt: 'Peepul and Goalkeep team members working through a dashboard around a table',
      line: {
        value:
          '19 organisation-level indicators and a leadership dashboard helped Peepul effectively monitor their programs as they scaled.',
      },
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
  /* 21 Oct: "it's too much information overload happening in this section",
     so the homepage carries this - a header, a paragraph and the last of the
     four illustrations. The four-step story below is kept for the About page
     ("keep the full narrative on a separate page"). */
  mission: {
    headlineLead: 'Our mission is to make data useful',
    headlineEm: 'to the people creating impact.',
    body: 'Social-sector organisations collect a great deal of data, but too little of it goes back into making better programmatic decisions. Goalkeep builds people-friendly systems and capabilities that turn scattered information into useful insight—so teams can make better decisions, communicate impact clearly and deepen the change they create.',
  },
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
   3 · What we do — white, four services
   ============================================================ */

/* 21 Oct: Design / Build / Adopt "reads more like an approach… it's not
   really a what we do". This is the new section: one headline and the four
   services Goalkeep can be engaged for, copy from the review doc. */
export const whatWeDo = {
  eyebrow: 'what we do',
  headline: 'We enable organisations to',
  headlineTail: 'measure, communicate and deepen their impact with confidence.',
}

export type Service = {
  /** The short label over the card, e.g. "01 / Strategy". */
  label: string
  title: string
  body: string
}

export const services: Array<Service> = [
  {
    label: 'Strategy',
    title: 'Impact and measurement strategy',
    body: 'Sharpen your Theory of Change and turn it into a practical measurement framework. We enable teams to identify the decisions that matter, define measurable outcomes and indicators, and develop frameworks that can actually be used.',
  },
  {
    label: 'Systems',
    title: 'Data systems and workflows',
    body: 'Build a data stack that can grow with your organisation. We design cost-effective, fit-for-purpose systems, ETL workflows and reliable pipelines that collect, transform and connect data across tools—providing a strong foundation for unlocking actionable insights.',
  },
  {
    label: 'Dashboards',
    title: 'Dashboards and reporting',
    body: 'Design dashboards around the questions each team member needs answered. We translate role-specific decisions into clear views and reports, so leaders, programme teams and MEL staff see what matters—not endless charts and countless metrics.',
  },
  {
    label: 'Adoption',
    title: 'Data adoption and capacity-building',
    body: 'We build data confidence through role-specific training and practical team routines. From field staff and MEL specialists to executive leadership, we enable organizations to navigate data without overwhelm and make smarter decisions every day.',
  },
]

/* ============================================================
   3b · Our approach — white, interactive
   ============================================================ */

/* The old "what we do", renamed and moved below "who we do it for". */
export const approach = {
  eyebrow: 'our approach',
  headline: 'Every data system we design centres around two questions:',
  headlineTail: 'who will use it, and what decisions should it help them make?',
}

/*
 * 21 Oct doc: each stage now has a one-line heading and new copy. The
 * illustrations and photographs stay as they were ("keep the illustrations
 * the same for now").
 */
export const pillars: Array<Pillar> = [
  {
    index: '01',
    hue: 'blue',
    title: 'Design',
    heading: 'Start with the decision, not the dashboard.',
    body:
      'Are you collecting data because it is useful—or because it has always been collected? What decision should each metric inform? We start with the outcomes you want to move and the actions people need to take, then design the measurement framework, questions and views that support them.',
    images: [
      { src: '/photos/phase-design-a.webp', alt: 'Affinity mapping on coloured boards during a Goalkeep design workshop' },
      { src: '/photos/phase-design-b.webp', alt: 'A Goalkeep working session in progress on the floor of a partner office' },
    ],
  },
  {
    index: '02',
    hue: 'teal',
    title: 'Build',
    heading: 'Build once, and let your system scale with you.',
    body:
      'Has every new request created another tracker, sheet or dashboard? We replace the pile-up with streamlined, cost-effective pipelines and systems that are clean, fast, maintainable and designed to grow with your organisation.',
    images: [
      { src: '/photos/phase-build-a.webp', alt: 'A partner dashboard open on a laptop in the field' },
      { src: '/photos/phase-build-b.webp', alt: 'A Goalkeep-built dashboard showing programme indicators' },
    ],
  },
  {
    index: '03',
    hue: 'coral',
    title: 'Adopt',
    heading: 'Make data part of how people work.',
    body:
      'Will the system be used once the launch is over? Technology creates value only when people have the confidence and capability to use it. Our data literacy curriculum, role-based training and team routines help everyone—from field staff to MEL teams and leaders—use data in practice.',
    images: [
      /* 23 Sep: "use more photographs of training sessions… that visibly show
         an organisation adopting data." 23 Oct: the projector still is out
         ("not looking nice") - the Data Literacy Programme table session and
         the Dasra and SVP India cohort photo from the hero, people talking it
         through in both. */
      { src: '/photos/phase-adopt-training-b.webp', alt: 'Participants working through a data exercise together at a Data Literacy Programme session' },
      { src: '/photos/aud-eco-5.webp', alt: 'Cohort members working together around a table' },
    ],
  },
]

/* "Stat band: Remove". The 4-hrs-every-Monday figure is gone from this
   section; the CTA it shared a row with survives on its own. */

/* ============================================================
   4 · Whom we do it for — pale blue
   ============================================================ */

/* 30 Sep content doc: final copy for all four segments, the client's own
   photographs, and no captions on the gallery - "just plain image scroller is
   fine". 21 Oct: new copy for every segment, a real funder testimonial, and
   every button leads to the contact form - there are no programme pages to
   send anyone to yet ("talk to us… partner with us here is fine"). */
export const audienceSection = {
  eyebrow: 'who we do it for',
}

export const audiences: Array<Audience> = [
  {
    id: 'early-stage',
    label: 'Early stage nonprofits',
    header: 'Lots of data, but no clear way to',
    headerEm: 'make sense of it?',
    body: {
      value: 'Your data may live across forms, spreadsheets and individual trackers, making it slow to understand progress or communicate impact. We help bring it together in a practical, affordable system that reduces manual effort, makes change visible over time and grows with your organisation.',
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
    ctas: [{ label: 'Explore Kickstarter program', to: '/programs/kickstarter' }, { label: 'Talk to us', to: '#contact' }],
  },
  {
    id: 'data-mature',
    label: 'Mid-to-Large Nonprofits',
    header: 'Looking to improve insights and increase adoption of',
    headerEm: 'your data systems?',
    body: {
      value: 'You may already collect large volumes of data, but two problems persist: people do not use it, and the growing stack of trackers, dashboards and analyses becomes complex, slow and expensive. We streamline pipelines and systems, then build the skills and routines that help teams use the resulting insight.',
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
    ctas: [{ label: 'Explore Data Literacy program', to: '/programs/data-literacy' }, { label: 'Talk to us', to: '#contact' }],
  },
  {
    id: 'intermediary',
    label: 'Ecosystem partners and Intermediaries',
    header: 'Looking to build the MEL capacities of',
    headerEm: 'organisations at scale?',
    body: {
      value: 'Build MEL capacity across the nonprofit organisations in your network or cohort. Goalkeep can serve as an MEL knowledge partner, co-design learning journeys, facilitate cohort programmes and provide train-the-trainer support.',
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
    ctas: [{ label: 'Partner with us', to: '/partner-with-us' }],
  },
  {
    id: 'funders',
    label: 'Funders',
    header: 'Looking to develop stronger measurement practices and better communicate',
    headerEm: 'portfolio-wide impact?',
    body: {
      value: 'Understand and communicate portfolio-level impact while strengthening grantees’ ability to use data. We support portfolio measurement and reporting, run tailored capacity-building programmes, and foster practices to ensure consistent, reliable, and timely data flows.',
    },
    /* 21 Oct doc: three of the five photographs swapped for cohort and
       facilitation shots. */
    photos: [
      { src: '/photos/case-dashboard.webp', alt: 'A programme dashboard open on a laptop' },
      { src: '/photos/aud-eco-1.webp', alt: 'A facilitator pointing out something on a worksheet to a participant' },
      { src: '/photos/phase-adopt-b.webp', alt: 'A facilitator walking a colleague through data on a phone' },
      { src: '/photos/hero-04-pair.webp', alt: 'Two facilitators reviewing a tablet' },
      { src: '/photos/aud-eco-3.webp', alt: 'Two participants discussing their work at laptops' },
    ],
    testimonial: {
      quote: {
        value: {
          text: 'Most organizations need to shift their focus to learning rather than just monitoring. That’s the biggest change for us, and we hope to see that shift in the rest of the social sector as well.',
          attribution: 'Rutuja Chaphekar, Forbes Marshall',
        },
      },
      name: 'Rutuja Chaphekar',
      credentials: 'Forbes Marshall',
      photo: '/photos/aud-funder-testimonial.webp',
    },
    ctas: [{ label: 'Partner with us', to: '/partner-with-us' }],
  },
]

/* ============================================================
   5 · Proof — navy
   ============================================================ */

/* 30 Sep content doc: new headline and four figures, supplied by Goalkeep.
   4 Nov: Goalkeep revised three of them (910 unchanged). */
export const proof = {
  eyebrow: 'the short version',
  headline: 'Six years of helping organizations to measure, communicate, and deepen their impact with confidence.',
  stats: [
    { value: { figure: 910, suffix: '+', sentence: 'people trained' } },
    { value: { figure: 100, suffix: '+', sentence: 'organisations partnered with' } },
    { value: { figure: 50, suffix: '%', sentence: 'reduction in average time spent on reporting' } },
    { value: { figure: 64, suffix: '%', sentence: 'net promoter score' } },
  ],
}

/* ============================================================
   6 · Case studies — cream
   ============================================================ */

export const caseStudySection = {
  eyebrow: 'case studies',
  headline: 'What changed,',
  headlineTail: 'and what it took to get there.',
  /* 21 Oct: no "Read all case studies" button - the homepage launches on its
     own, so there is nothing for it to open yet. */
}

/*
 * 11 Nov: "only the 4 readable case study cards will exist". Each card is its
 * study's own - photograph, sector tags and link come from the study page's
 * data. Peepul and Baithak keep the homepage's own paragraph; the other two
 * use their study's card summary.
 */
export const caseStudies: Array<{ slug: CaseStudySlug; body?: string }> = [
  { slug: 'peepul' },
  { slug: 'baithak' },
  { slug: 'british-asian-trust' },
  { slug: 'vanavil' },
]

/* ============================================================
   7 · FAQs — pale blue
   ============================================================ */

/* The heading is one plain sentence: a light lead and a bold-italic end.
   23 Oct: "just change that to frequently asked questions". */
export const faqSection = {
  headline: 'Frequently asked',
  headlineEm: 'questions.',
}

/* 21 Oct doc: "KEEP ONLY FAQs in this updated table". Five questions, answers
   verbatim. A blank line in an answer starts a new paragraph.

   The metrics answer opens "Yes.", which only reads against a yes/no
   question, so it keeps the earlier wording of that question rather than the
   doc's "What metrics should we communicate?". */
export const faqs: Array<Faq> = [
  {
    value: {
      question: 'We collect a lot of data, but people are not using it properly. Will you be able to help?',
      answer:
        'Yes. We help identify which data is useful, reduce duplication and manual effort, connect scattered sources, and create workflows that make information easier to analyse, communicate and act on.',
    },
  },
  {
    value: {
      question: 'What software do you use?',
      answer:
        'We favour using an open-source data stack that your team is comfortable with.\n\nDepending on the need, the open-source core may include technologies such as PostgreSQL or Supabase for the database, supported by tools such as GitHub for version control and Vercel for hosting where appropriate. The exact stack is selected around the organisation’s workflows, budget, existing systems, security needs and ability to maintain it.',
    },
  },
  {
    value: {
      question: 'Will you help us figure out what metrics will truly communicate our impact?',
      answer:
        'Yes. We don’t begin with a generic list of metrics. We start with your Theory of Change, the outcomes you are working towards and the questions your programme teams, leadership and funders need the evidence to answer.\n\nWe then review what you already collect and help you prioritise a focused set of indicators, with clear definitions, calculations and data sources. Each metric must pass three tests: does it reflect the change you are trying to create, is it feasible and responsible to collect, and will it help someone learn, decide or communicate more clearly?',
    },
    verify: 'Question wording: the doc has "What metrics should we communicate?", but the answer starts "Yes." - kept the earlier yes/no wording. Confirm with Rumit.',
  },
  {
    value: {
      question: 'Our teams do not see the value of data. How do we help them use it?',
      answer:
        'During our engagement, we address two questions. First, does the data answer questions people genuinely have and help them make decisions they are responsible for? If not, you may want to consider redesigning it. Second, do people have the confidence and skills to use it? Role-based training, guided data reviews and regular team routines help increase data use across all levels in your organization.',
    },
  },
  {
    value: {
      question: 'Will our internal team be able to maintain and build on what you deliver?',
      answer:
        'Yes, absolutely. Our goal is always long-term sustainability, not dependency. We bring the expertise of designing measurement frameworks, data architectures, and dashboards and work alongside your team throughout the engagement. Through dedicated capacity building and knowledge transfer, we ensure your internal team is equipped to own, maintain, and build on every system and asset we deliver.',
    },
  },
]

/* ============================================================
   8 · Field notes — cream deep
   ============================================================ */

/* 21 Oct: off the homepage until the blog is written ("keep it saved…
   keep it removed for now"). Nothing renders this at the moment. */
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

/* One sentence and two actions. 21 Oct: the data culture quiz button became
   a newsletter sign-up that "flips into a box where someone can type and
   submit an email". */
export const closing = {
  /* 23 Sep doc: "full emboldened, except for the phrase 'clarity and
     certainty.'". 23 Oct, reversed: "it's opposite" - the lead is light and
     "clarity and certainty" is bold, "because that's what you want to
     emphasize". Set like every other headline on the page. */
  headlineLead: 'Make your next program decision with more',
  headlineEm: 'clarity and certainty.',
  primaryCta: { label: 'Talk to us', to: '#contact' },
  newsletter: {
    label: 'Subscribe to our newsletter',
    placeholder: 'Your email address',
    submit: 'Subscribe',
    done: 'Thanks - you’re subscribed.',
  },
}

/* ============================================================
   10 · Contact — cream
   ============================================================ */

/* 21 Oct: "a normal form… crisp and modern". The fields, labels and button
   are goalkeep.net's own contact form, all five required as they are there;
   the dropdown options are the four services. The heading and lead are ours. */
export const contact = {
  eyebrow: 'talk to us',
  headline: 'Tell us about',
  headlineEm: 'the decision you’re stuck on.',
  lead: 'Leave a few details and we’ll get back to you.',
  fields: {
    name: 'Name',
    email: 'Email',
    organization: 'Organization Name',
    service: 'How can we assist you?',
    message: 'Do you have a message for us?',
    messagePlaceholder: 'Write down your message here',
  },
  /* 23 Oct: the dropdown lists the four services from "what we do" and
     nothing else, as Rumit asked in the 21 Oct call. */
  /** The four services, then the two ways to back a program. */
  serviceOptions: [...services.map((service) => service.title), 'Sponsor a Kickstarter program', 'Fund a Data Literacy cohort'],
  /** What forms outside a service page send: the server accepts it beside the four titles. */
  generalEnquiry: 'General enquiry',
  submit: 'Send',
  done: {
    title: 'Thanks - we’ve got your message.',
    body: 'Someone from the Goalkeep team will write back to you shortly.',
  },
}

export const honestStat: PullQuote = {
  value: {
    text: '73% of dashboards we audit aren’t opened twice.',
    attribution: 'Goalkeep audit sample, 2024–2026',
  },
  verify: 'Source and sample size for the 73% figure.',
}
