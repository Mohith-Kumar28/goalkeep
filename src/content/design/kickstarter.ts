import type { CaseCard } from '@/components/design/case-study-cards'
import type { ExploreCard } from '@/components/design/explore-more'
import type { HeroPhoto } from '@/components/design/hero'
import type { Tone } from '@/components/design/tones'
import type { Html } from './service-page'

export type GlanceItem = {
  id: 'who' | 'cohort' | 'build' | 'funders'
  label: string
  text: string
  tone: Tone
}

export type Bubble = {
  text: string
  tone: Tone
  side: 'left' | 'right'
  maxWidth: number
  fontSize: number
  rotate: number
  /** Rumit's cut to six: off bubbles stay in the data, so swapping one is flipping this flag. */
  shown: boolean
}

export type Stage = {
  name: string
  tone: Tone
  /** Hex of the stage's accent: the number disc, the progress bar and the active tab border. */
  accent: string
  tagline: string
  body: string
}

const APPLY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeTmJjM32EVQd52nKAsIB-pFzVyf-SZv2bKe1wMts0u_5QEKg/viewform'

export const kickstarter = {
  service: 'Data systems and workflows',
  applyUrl: APPLY_URL,
  meta: {
    title: 'Kickstarter 3.0 | Goalkeep',
    description:
      'Kickstarter is Goalkeep’s hands-on program for early-stage nonprofits that want to move from scattered information and manual reporting to a simple, integrated data system their teams can use.',
  },
  hero: {
    headline: 'Build the data backbone<br class="dc-br-d"> <em>your organisation<br class="dc-br-d"> needs to grow.</em>' satisfies Html,
    lead: 'Kickstarter is Goalkeep’s hands-on program for early-stage nonprofits that want to move from scattered information and manual reporting to a simple, integrated data system their teams can use.',
    badge: 'Kickstarter 3.0 · next cohort begins January 2027',
    primary: 'Apply for Kickstarter 3.0',
    secondary: 'Partner with us to support a cohort',
    photos: [
      { src: '/design/kickstarter-banner-1.webp', alt: 'Goalkeep and a partner team working together at a table' },
      { src: '/design/kickstarter-banner-2.webp', alt: 'A partner team in a Goalkeep working session' },
      { src: '/design/kickstarter-banner-3.webp', alt: 'Partner team members working through data together' },
      { src: '/design/kickstarter-banner-4.webp', alt: 'Goalkeep with a partner team after a workshop' },
    ] satisfies Array<HeroPhoto>,
  },
  glance: [
    { id: 'who', label: 'Who it’s for', text: 'Early-stage nonprofits ready to move beyond messy spreadsheets', tone: 'gold' },
    { id: 'cohort', label: 'Next cohort', text: 'Begins January 2027. Applications are now open!', tone: 'blue' },
    { id: 'build', label: 'What you build', text: 'A custom, integrated data system shaped around your programme', tone: 'teal' },
    { id: 'funders', label: 'For funders', text: 'Support a cohort for organisations in your portfolio', tone: 'coral' },
  ] satisfies Array<GlanceItem>,
  why: {
    eyebrow: 'why kickstarter exists',
    heading: 'Measuring impact should not depend on <em>the size of your organisation.</em>' satisfies Html,
    paragraphs: [
      'Early-stage nonprofits are often creating meaningful change long before they have the systems needed to demonstrate it. Programme information is spread across spreadsheets, forms, messages and individual team members, and important patterns are noticed late.',
      'Kickstarter helps you build a foundation for data-driven decision making early, before fragmented processes become expensive, complicated systems.',
    ],
    large: {
      src: '/design/kickstarter-why-vanavil.webp',
      alt: 'Vanavil Trust programme participants',
      caption: 'Vanavil Trust',
    },
    small: {
      src: '/design/46fd758db6cd80183d9d4f676d744baa.webp',
      alt: 'Two partner team members working through data on a laptop',
      caption: 'Apni Shala Foundation',
    },
  },
  fit: {
    label: 'Things early-stage nonprofit teams often say about their data',
    heading: 'Kickstarter may be right for you <em>if any of these sound familiar.</em>' satisfies Html,
    paragraphs: [
      'Each one is a sign your programme has outgrown its spreadsheets, and that your team needs a more robust system that reflects how you work and actually helps you use what data you collect.',
      'Kickstarter gives you more than just a dashboard. It helps build a decision infrastructure within your organization.',
    ],
    cta: 'Apply for Kickstarter 3.0',
    bubbles: [
      { text: 'Which is the updated student attendance sheet? I can see three versions.', tone: 'gold', side: 'left', maxWidth: 260, fontSize: 16, rotate: -2, shown: true },
      { text: 'Can someone double-check the Jan to March data again for the quarterly funder report?', tone: 'blue', side: 'right', maxWidth: 300, fontSize: 15, rotate: 1.5, shown: true },
      { text: 'We collect over 40 data fields for every child, but which ones actually help us track their progress?', tone: 'teal', side: 'left', maxWidth: 320, fontSize: 14, rotate: -1, shown: true },
      { text: 'Only Rishi knew how to operate the dashboard. Now that he’s left, how do we manage this?', tone: 'coral', side: 'left', maxWidth: 290, fontSize: 15, rotate: 2, shown: true },
      { text: 'Did anyone realize that the blood donation camp turnout has been dropping for 6 months straight? I only just realized.', tone: 'blue', side: 'right', maxWidth: 330, fontSize: 14, rotate: -1.5, shown: true },
      { text: 'Has anyone incorporated last year’s data insights into their lesson planning for this year?', tone: 'gold', side: 'left', maxWidth: 270, fontSize: 15, rotate: 1, shown: false },
      { text: 'It’s frustrating how we spend more time cleaning Excel sheets than using the data to get learnings and insights.', tone: 'coral', side: 'left', maxWidth: 320, fontSize: 14, rotate: -2.5, shown: false },
      { text: 'Which of our livelihood programs have the highest success rate? I’m having a hard time reading the data on this.', tone: 'teal', side: 'right', maxWidth: 320, fontSize: 14, rotate: 1.5, shown: false },
      { text: 'Are we effectively tracking parameters for mental health progress in the children’s program?', tone: 'gold', side: 'left', maxWidth: 280, fontSize: 15, rotate: 0.5, shown: false },
      { text: 'We built a full data dashboard last year. Has anyone even opened it since?', tone: 'blue', side: 'left', maxWidth: 250, fontSize: 16, rotate: -1.5, shown: true },
    ] satisfies Array<Bubble>,
  },
  stages: {
    eyebrow: 'how the program works',
    heading: 'Four stages, <em>one connected system.</em>' satisfies Html,
    cta: 'Apply for Kickstarter 3.0',
    items: [
      {
        name: 'Understand',
        tone: 'gold',
        accent: '#EAC452',
        tagline: 'We begin with your programme, people and decisions, not with technology.',
        body: 'We work with leadership, programme, and field team members to understand how the programme operates, how information currently moves and where the greatest friction lies. Together, we identify the questions the system must answer and the decisions those answers should support.',
      },
      {
        name: 'Design',
        tone: 'blue',
        accent: '#3F63C8',
        tagline: 'We translate the priority questions into a practical systems design.',
        body: 'This includes refining the most important indicators, mapping data sources, designing the data model and creating interactive prototypes of the data-entry and insight experience. Your team reviews the proposed workflows before the full system is built.',
      },
      {
        name: 'Build',
        tone: 'teal',
        accent: '#2F9C8F',
        tagline: 'We build an integrated, customised system for entering, managing and using programme data.',
        body: 'We favour open source platforms that enable version control, hosting, chosen around your needs, budget, security requirements and ability to maintain it. With our AI-integrated build, you receive your working dashboard in 6–8 weeks, so that most of the time in the remaining 6 months can be spent on edits, iterations, testing, and ensuring your team actually uses the dashboard.',
      },
      {
        name: 'Adopt',
        tone: 'coral',
        accent: '#E07A5F',
        tagline: 'We spend months conducting workshops, meetings, and trainings to help your teams use the system we built.',
        body: 'We train team members, run facilitated data reviews and help you build routines for using information in programme and leadership conversations. Documentation, maintenance support and a structured handover mean ownership moves to your organisation, so that you are not reliant on any external third-party for your data needs over the long-term.',
      },
    ] satisfies Array<Stage>,
  },
  change: {
    eyebrow: 'what changes after kickstarter',
    beforeLabel: 'Before, the question is often',
    before: '“Where is the information, and who can put it together?”',
    afterLabel: 'After, the conversation moves to',
    after: '“What is the information telling us, and <em>what should we do next?</em>”' satisfies Html,
    outcomesLead: 'A well-used Kickstarter system can help your organisation:',
    outcomes: [
      'Reduce the time spent consolidating data and preparing reports.',
      'Identify programme gaps and participant needs earlier.',
      'Give programme teams greater ownership of information.',
      'Make reviews more focused and action-oriented.',
      'Communicate progress and impact more confidently.',
      'Build a stronger foundation for organisational growth and funding.',
    ],
  },
  caseStudies: {
    heading: 'See what organisations have done <em>with a<br class="dc-br-d"> stronger data foundation.</em>' satisfies Html,
    cards: [
      {
        kind: 'live',
        href: '/case-studies/baithak',
        photo: { src: '/design/61c8bcfa7308cd56e5a1e5f6e2e2d521.webp', alt: 'Two Baithak Foundation team members smiling during a session' },
        tags: [
          { label: 'Arts', tone: 'coral' },
          { label: 'Education', tone: 'blue' },
          { label: 'Data collection and visualisation', tone: 'teal' },
        ],
        title: 'Baithak Foundation',
        body: 'Using a more accessible data system in programme and funder conversations.',
      },
      {
        kind: 'live',
        href: '/case-studies/vanavil',
        photo: { src: '/design/vanavil-cover.webp', alt: 'Vanavil Trust and Goalkeep at work' },
        tags: [
          { label: 'Livelihoods', tone: 'gold' },
          { label: 'Education', tone: 'blue' },
        ],
        title: 'Vanavil Trust',
        body: 'Using timely information to identify and re-engage children who had dropped out.',
      },
      {
        kind: 'live',
        href: '/case-studies',
        cta: 'See all case studies',
        photo: { src: '/design/64c1c9c5b1e6936ba238b50ada299bd3.webp', alt: 'The Apni Shala Foundation team standing together in their office' },
        tags: [
          { label: 'Education', tone: 'blue' },
          { label: 'Kickstarter cohort 1', tone: 'teal' },
        ],
        title: 'Apni Shala Foundation',
        body: 'Using a priority learning metric to identify student needs earlier and plan interventions.',
      },
    ] satisfies Array<CaseCard>,
  },
  contact: {
    heading: 'Ready to turn messy data into <em>a system you can actually get insights from?</em>' satisfies Html,
    body: 'Build a system that helps your team see what matters, act earlier and communicate your impact with confidence.',
    ctas: [{ label: 'Apply for the next cohort', href: APPLY_URL }, { label: 'Speak to us about funding a cohort' }],
  },
  explore: [
    {
      title: 'Data Literacy Program',
      body: 'Build a data-confident workforce from within. A cohort-based, train-the-trainer program that equips organisational and MEL leaders to strengthen data literacy across their teams.',
      href: '/programs/data-literacy',
      cta: 'Explore the program',
      tone: 'teal',
    },
    {
      title: 'Data systems and workflows',
      body: 'Past the early stage? We design and build custom data systems for growing organisations, shaped around your programmes, roles and workflows.',
      href: '/services/data-systems-and-workflows',
      cta: 'Explore the service',
      tone: 'blue',
    },
  ] satisfies Array<ExploreCard>,
}
