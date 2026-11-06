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
  marginTop: number
  rotate: number
}

export type Stage = {
  name: string
  tone: Tone
  /** Hex of the stage's accent: the number disc, the progress bar and the active tab border. */
  accent: string
  tagline: string
  body: string
}

export const kickstarter = {
  service: 'Data systems and workflows',
  meta: {
    title: 'Kickstarter 2.0 | Goalkeep',
    description:
      'Kickstarter is Goalkeep’s hands-on program for early-stage nonprofits that want to move from scattered information and manual reporting to a simple, integrated data system their teams can use.',
  },
  hero: {
    headline: 'Build the data backbone<br class="dc-br-d"> <em>your organisation<br class="dc-br-d"> needs to grow.</em>' satisfies Html,
    lead: 'Kickstarter is Goalkeep’s hands-on program for early-stage nonprofits that want to move from scattered information and manual reporting to a simple, integrated data system their teams can use.',
    badge: 'Kickstarter 2.0 · next cohort begins January 2027',
    primary: 'Apply for Kickstarter 2.0',
    secondary: 'Partner with us to support a cohort',
    photos: [
      { src: '/design/d9f25a2c090890697a8d9bf1806f663d.webp', alt: 'A Goalkeep working session on the floor of a partner office' },
      { src: '/design/3c1c275e978a7bbdbc2b4a398c8494ac.webp', alt: 'A partner team around a meeting-room table during a working session' },
      { src: '/design/46fd758db6cd80183d9d4f676d744baa.webp', alt: 'Two partner team members working through data on a laptop' },
      { src: '/design/d7e0a2f562f148853d7f839e7a34590d.webp', alt: 'Goalkeep with a partner team after a workshop' },
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
      src: '/design/c7fa18945afc05080e35a4e989719575.webp',
      alt: 'A programme session running in a village classroom',
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
    cta: 'Apply for Kickstarter 2.0',
    bubbles: [
      { text: 'Which is the updated student attendance sheet? I can see three versions.', tone: 'gold', side: 'left', maxWidth: 260, fontSize: 16, marginTop: 0, rotate: -2 },
      { text: 'Can someone double-check the Jan to March data again for the quarterly funder report?', tone: 'blue', side: 'right', maxWidth: 300, fontSize: 15, marginTop: 8, rotate: 1.5 },
      { text: 'We collect over 40 data fields for every child, but which ones actually help us track their progress?', tone: 'teal', side: 'left', maxWidth: 320, fontSize: 14, marginTop: -4, rotate: -1 },
      { text: 'Only Rishi knew how to operate the dashboard. Now that he’s left, how do we manage this?', tone: 'coral', side: 'left', maxWidth: 290, fontSize: 15, marginTop: 10, rotate: 2 },
      { text: 'Did anyone realize that the blood donation camp turnout has been dropping for 6 months straight? I only just realized.', tone: 'blue', side: 'right', maxWidth: 330, fontSize: 14, marginTop: -6, rotate: -1.5 },
      { text: 'Has anyone incorporated last year’s data insights into their lesson planning for this year?', tone: 'gold', side: 'left', maxWidth: 270, fontSize: 15, marginTop: 4, rotate: 1 },
      { text: 'It’s frustrating how we spend more time cleaning Excel sheets than using the data to get learnings and insights.', tone: 'coral', side: 'left', maxWidth: 320, fontSize: 14, marginTop: -8, rotate: -2.5 },
      { text: 'Which of our livelihood programs have the highest success rate? I’m having a hard time reading the data on this.', tone: 'teal', side: 'right', maxWidth: 320, fontSize: 14, marginTop: 4, rotate: 1.5 },
      { text: 'Are we effectively tracking parameters for mental health progress in the children’s program?', tone: 'gold', side: 'left', maxWidth: 280, fontSize: 15, marginTop: 8, rotate: 0.5 },
      { text: 'We built a full data dashboard last year. Has anyone even opened it since?', tone: 'blue', side: 'left', maxWidth: 250, fontSize: 16, marginTop: -2, rotate: -1.5 },
    ] satisfies Array<Bubble>,
  },
  stages: {
    eyebrow: 'how the program works',
    heading: 'Four stages, <em>one connected system.</em>' satisfies Html,
    cta: 'Apply for Kickstarter 2.0',
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
        body: 'We favour an open-source core, using technologies such as PostgreSQL or Supabase where appropriate, with tools for version control and hosting, chosen around your needs, budget, security requirements and ability to maintain it. With our AI-integrated build, you receive your working dashboard in 6–8 weeks, so that most of the time in the remaining 6 months can be spent on edits, iterations, testing, and ensuring your team actually uses the dashboard.',
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
        href: '#',
        photo: { src: '/design/8625ca604ea24fa43d1fd299a4c5afea.webp', alt: 'Two Baithak Foundation team members smiling during a session' },
        tags: [
          { label: 'Arts', tone: 'coral' },
          { label: 'Kickstarter cohort 1', tone: 'gold' },
        ],
        title: 'Baithak Foundation',
        body: 'Using a more accessible data system in programme and funder conversations.',
      },
      {
        kind: 'soon',
        tone: 'gold',
        tags: [
          { label: 'Education', tone: 'blue' },
          { label: 'Kickstarter cohort 1', tone: 'gold' },
        ],
        title: 'Vanavil Trust',
        body: 'Using timely information to identify and re-engage children who had dropped out.',
      },
      {
        kind: 'live',
        href: '#',
        photo: { src: '/design/64c1c9c5b1e6936ba238b50ada299bd3.webp', alt: 'The Apni Shala Foundation team standing together in their office' },
        tags: [
          { label: 'Education', tone: 'teal' },
          { label: 'Kickstarter cohort 1', tone: 'gold' },
        ],
        title: 'Apni Shala Foundation',
        body: 'Using a priority learning metric to identify student needs earlier and plan interventions.',
      },
    ] satisfies Array<CaseCard>,
  },
  contact: {
    heading: 'Ready to turn messy data into <em>a system you can actually get insights from?</em>' satisfies Html,
    body: 'Build a system that helps your team see what matters, act earlier and communicate your impact with confidence.',
    ctas: [{ label: 'Apply for the next cohort' }, { label: 'Speak to us about funding a cohort' }],
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
