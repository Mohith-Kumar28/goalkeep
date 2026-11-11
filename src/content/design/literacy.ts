import type { ExploreCard } from '@/components/design/explore-more'
import type { HeroPhoto } from '@/components/design/hero'
import type { Html } from './service-page'

export type GlanceIcon = 'people' | 'calendar' | 'book' | 'handshake'

export type GlanceItem = {
  icon: GlanceIcon
  label: string
  body: string
  bg: string
  ink: string
}

export type Photo = { src: string; alt: string; position: string }

export type Nominee = {
  photo: Photo
  tag: string
  tagBg: string
  tagInk: string
  body: string
}

export type Accent = { tint: string; base: string }
export type ShadowAccent = Accent & { shadow: string }

export type Skill = {
  title: string
  stepLabel: Html
  body: string
  photo: Photo
  ink: string
  next?: { label: string; ink: string }
}

export type AiStep = { icon: 'layers' | 'sparkle' | 'shield'; ink: string; title: string; body: string }

export type Outcome = { title: string; body: string }

export type Stat = { value: string; label: string; bg: string; ink: string }

export type Faq = { question: string; answer: string }

export const literacyContent = {
  service: 'Data adoption and capacity-building',
  meta: {
    title: 'Data Literacy Program | Goalkeep',
    description:
      'A 3-day train-the-trainer workshop and 6-month mentorship program that builds data literacy across social-purpose organisations.',
  },
  hero: {
    headline: 'Build a <span class="dc-nowrap">data-confident</span><br class="dc-br-d"> workforce <em>within your<br class="dc-br-d"> organisation.</em>',
    lead: 'The Data Literacy Program is Goalkeep’s train-the-trainer program for strengthening data capability across social-purpose organisations. Over a 3-day workshop, participants build foundational skills in interpreting, analysing, visualising and communicating with data, so they can run trainings within their own organisation.',
    badge: 'Data Literacy Program · next cohort begins January 2027',
    primary: 'Register your interest',
    secondary: 'Partner with us to support a cohort',
    carouselLabel: 'Photos from the Data Literacy Program',
    photos: [
      {
        src: '/design/d43c2fc25ad89a097bc5db979c53f3e7.webp',
        alt: 'A Goalkeep facilitator taking the cohort through a practice case study',
        position: '50% 40%',
      },
      {
        src: '/design/dd081a31eb61514a11c455ca22f88d72.webp',
        alt: 'The cohort at work across round tables during the immersive',
        position: '50% 45%',
      },
      {
        src: '/design/992d142771d0325d8674bb9c49c2a7d9.webp',
        alt: 'A facilitator moving between tables while participants work on laptops',
        position: '50% 45%',
      },
      {
        src: '/design/36e36ae65224bdf44bbed50917d158fe.webp',
        alt: 'Participants celebrating together at the end of the immersive',
        position: '50% 50%',
      },
    ] satisfies Array<HeroPhoto>,
  },
  glance: [
    {
      icon: 'people',
      label: 'Who it’s for',
      body: 'Data-mature organisations that struggle with adoption',
      bg: '#FBF3DF',
      ink: '#7D5E0C',
    },
    {
      icon: 'calendar',
      label: 'Next cohort',
      body: 'Begins January 2027. Register your interest now.',
      bg: '#EAEFF9',
      ink: '#2F4D9F',
    },
    {
      icon: 'book',
      label: 'The format',
      body: '3-day immersive workshop followed by a 6-month mentorship program',
      bg: '#E7F2F0',
      ink: '#176059',
    },
    {
      icon: 'handshake',
      label: 'For funders',
      body: 'Make the program available to organisations in your portfolio',
      bg: '#FBEEE9',
      ink: '#9C452A',
    },
  ] satisfies Array<GlanceItem>,
  why: {
    eyebrow: 'why the program exists',
    heading: 'Collecting more data has not automatically <em>helped organisations use it for decision making.</em>',
    body: 'Many organisations now have dashboards, MIS platforms, and robust reporting systems. Yet the ability to interpret and act on the information often stays with a small number of MEL or data specialists at best. Teams are unsure how to separate important patterns from anecdotal evidence, use insights to inform programme decisions, or decide when AI output can and cannot be trusted when it comes to data.',
    leadIn: 'The Data Literacy Program teaches skills that are',
    qualities: ['practical', 'relevant', 'transferable'],
    main: {
      src: '/design/efd68632f92b93e81fcde539d1868e13.webp',
      alt: 'Participants working through an exercise on laptops at round tables',
      position: '50% 40%',
    } satisfies Photo,
    caption: 'Cohort 2 · October 2025',
    inset: {
      src: '/design/e0edfc40e2f0c2717a2fb7a428be4b74.webp',
      alt: 'Three participants laughing together over a phone between sessions',
      position: '50% 35%',
    } satisfies Photo,
  },
  who: {
    nominate: {
      label: 'Who you nominate',
      title: 'Each organisation nominates two team members.',
      people: [
        {
          photo: {
            src: '/design/1902fe5cbf2b337430404a6784530bdc.webp',
            alt: 'A senior programme leader making a point during a table discussion',
            position: '55% 30%',
          },
          tag: 'Program Leader',
          tagBg: '#FBF3DF',
          tagInk: '#7D5E0C',
          body: 'One senior organisational or programme leader',
        },
        {
          photo: {
            src: '/design/literacy-who-mel-member.webp',
            alt: 'A MEL team member in a pink kurta studying a worksheet with colleagues',
            position: '40% 30%',
          },
          tag: 'MEL team member',
          tagBg: '#EAEFF9',
          tagInk: '#2F4D9F',
          body: 'One mid-senior MEL team member',
        },
      ] satisfies [Nominee, Nominee],
      flowButton: 'Show me what happens after the Data Literacy Program',
      flowCaption: 'Colleagues across roles',
      together:
        'Together, they combine organisational influence with measurement expertise and share ownership of the internal rollout.',
    },
    eyebrow: 'who the program is for',
    heading: 'The program is designed for social impact organisations <em>that…</em>',
    groupLabel: 'Signs the program is a fit',
    signs: [
      'Collect data but want it to inform more everyday decisions.',
      'Have dashboards or reports that are not being used consistently.',
      'Want data capability to extend beyond the MEL teams.',
      'Need a shared language for discussing evidence across roles and programs.',
      'Want to strengthen data-centric internal training and onboarding for team members.',
      'Are interested in using AI for data work without compromising privacy, accuracy or accountability.',
      'Can nominate two team members who will take the learning back to their colleagues.',
    ],
    accents: [
      { tint: '#E7F2F0', base: '#2F9C8F', shadow: 'rgba(23,96,89,0.20)' },
      { tint: '#FBF3DF', base: '#EAC452', shadow: 'rgba(125,94,12,0.20)' },
      { tint: '#EAEFF9', base: '#3F63C8', shadow: 'rgba(47,77,159,0.20)' },
      { tint: '#FBEEE9', base: '#E07A5F', shadow: 'rgba(156,69,42,0.20)' },
    ] satisfies Array<ShadowAccent>,
  },
  skills: {
    eyebrow: 'what participants learn',
    heading: 'Five skills which they can use <em>for real organisational data.</em>',
    tabsLabel: 'Skills',
    cta: 'Register your interest',
    accents: [
      { tint: '#FBF3DF', base: '#EAC452' },
      { tint: '#EAEFF9', base: '#3F63C8' },
      { tint: '#E7F2F0', base: '#2F9C8F' },
      { tint: '#FBEEE9', base: '#E07A5F' },
      { tint: '#EAEFF9', base: '#2F4A92' },
    ] satisfies Array<Accent>,
    items: [
      {
        title: 'Quantitative data analysis',
        stepLabel: 'Quantitative<br> analysis',
        body: 'Ask focused questions, work with numerical information and identify patterns that matter.',
        photo: {
          src: '/design/4916e36c67501b53a47e423d7b67c14c.webp',
          alt: 'A participant working through numbers on a laptop',
          position: '50% 50%',
        },
        ink: '#7D5E0C',
        next: { label: 'Next: Qualitative data analysis', ink: '#2F4D9F' },
      },
      {
        title: 'Qualitative data analysis',
        stepLabel: 'Qualitative<br> analysis',
        body: 'Organise and interpret feedback, interviews, observations and other forms of qualitative evidence.',
        photo: {
          src: '/design/f2d967fac93a2eb560e6557367a55476.webp',
          alt: 'A participant grouping sticky notes on a coloured board',
          position: '50% 40%',
        },
        ink: '#2F4D9F',
        next: { label: 'Next: Data interpretation', ink: '#176059' },
      },
      {
        title: 'Data interpretation',
        stepLabel: 'Data<br> interpretation',
        body: 'Read charts, indicators and dashboards carefully, and identify what the evidence does and does not support.',
        photo: {
          src: '/design/649817726f784680ee90eb7c16871388.webp',
          alt: 'A facilitator walking the room through a dashboard on screen',
          position: '50% 35%',
        },
        ink: '#176059',
        next: { label: 'Next: Data visualisation', ink: '#9C452A' },
      },
      {
        title: 'Data visualisation',
        stepLabel: 'Data<br> visualisation',
        body: 'Choose and design visual representations that make information easier to understand.',
        photo: {
          src: '/design/696a7d0ce90e5c873db7b91ba88a336d.webp',
          alt: 'Participants building a visual map with sticky notes on coloured boards',
          position: '50% 40%',
        },
        ink: '#9C452A',
        next: { label: 'Next: Data communication', ink: '#2F4A92' },
      },
      {
        title: 'Data communication',
        stepLabel: 'Data<br> communication',
        body: 'Translate evidence into clear messages and narratives for colleagues, partners and funders.',
        photo: {
          src: '/design/literacy-skill-5-communication.webp',
          alt: 'Participants preparing how to communicate their findings',
          position: '50% 30%',
        },
        ink: '#2F4A92',
      },
    ] satisfies Array<Skill>,
  },
  ai: {
    eyebrow: 'how ai is integrated into the program',
    heading: 'Data literacy remains the core capability. <em>AI is an assistive layer.</em>',
    body: 'Participants learn to use everyday AI tools responsibly, keeping foundational data skills, verification and human judgement at the centre. Every skill follows the same three steps.',
    steps: [
      {
        icon: 'layers',
        ink: '#7D5E0C',
        title: 'Build the underlying capability',
        body: 'Learn what good interpretation, analysis, visualisation and communication look like.',
      },
      {
        icon: 'sparkle',
        ink: '#2F4D9F',
        title: 'Use AI to strengthen the work',
        body: 'Use accessible AI tools to organise information, start an analysis or communicate faster.',
      },
      {
        icon: 'shield',
        ink: '#176059',
        title: 'Verify through human judgement',
        body: 'Check AI outputs against the evidence, context and purpose before using them.',
      },
    ] satisfies Array<AiStep>,
    main: {
      src: '/design/7dc8597c98c55b84b13e9dd587f05f4d.webp',
      alt: 'Participants working on laptops around a training table',
      position: '40% 50%',
    } satisfies Photo,
    inset: {
      src: '/design/9fbc340e521b1cf818eae13ffc11cea5.webp',
      alt: 'Anand and a participant working through an analysis together on a laptop',
      position: '50% 40%',
    } satisfies Photo,
  },
  change: {
    eyebrow: 'what the program is designed to change',
    heading: 'From a skill held by specialists <em>to a habit across the organisation.</em>',
    strip: [
      {
        src: '/design/4ecae8a52c89c2ae3bbc0b797009cc5a.webp',
        alt: 'Participants raising their hands to answer a question during a session',
        position: '50% 45%',
      },
      {
        src: '/design/7cc855eb142b00043a34d0d556018974.webp',
        alt: 'Two participants smiling and waving at the camera',
        position: '50% 35%',
      },
      {
        src: '/design/2618a492826088fb3fd7fee05f134776.webp',
        alt: 'Participants and a facilitator working through an exercise at a table',
        position: '50% 45%',
      },
    ] satisfies Array<Photo>,
    outcomes: [
      {
        title: 'Better and more timely decisions',
        body: 'Managers and programme teams use data more consistently to recognise what is working, identify emerging problems and decide where attention or resources are needed.',
      },
      {
        title: 'Capability that is internally owned',
        body: 'Organisations build adapted learning into onboarding, annual training, programme reviews or manager development, reducing dependence on external trainers.',
      },
      {
        title: 'Responsible use of AI',
        body: 'Teams use AI to support selected data-related tasks while applying safeguards for privacy, accuracy, inclusion and human accountability.',
      },
      {
        title: 'Stronger organisational routines',
        body: 'Data interpretation becomes part of recurring programme reviews, leadership conversations, and reporting and decision-making.',
      },
    ] satisfies Array<Outcome>,
  },
  evidence: {
    eyebrow: 'evidence from previous cohorts',
    heading: 'Here’s what impact two DLP cohorts <em>have managed to create.</em>',
    stats: [
      { value: '42', label: 'participants trained', bg: '#FBF3DF', ink: '#7D5E0C' },
      {
        value: '700+',
        label: 'colleagues trained by participants at their own organisations',
        bg: '#EAEFF9',
        ink: '#2F4D9F',
      },
      {
        value: '76%',
        label: 'of assessed participants improved in at least one data-literacy skill',
        bg: '#E7F2F0',
        ink: '#176059',
      },
    ] satisfies Array<Stat>,
    quote: {
      text: 'In my 18 years of experience in research and M&E, I have never seen such a detailed training being conducted. I got confidence and a lot of resources to use, which we can easily contextualise to our organisation back in Punjab.',
      name: 'Perwinder Singh',
      organisation: 'Sanjhi Sikhiya',
      photo: {
        src: '/design/94dfd4886b4fe8fb071186a5e27057fc.webp',
        alt: 'Perwinder Singh',
        position: '50% 20%',
      } satisfies Photo,
    },
    mosaic: [
      {
        src: '/design/literacy-evidence-collage-1.webp',
        alt: 'The full cohort sitting and standing together for a group photo',
        position: '50% 50%',
      },
      {
        src: '/design/24da13a306cb6bcaa2e9899d44d262b2.webp',
        alt: 'Participants raising their hands with energy during a group activity',
        position: '50% 40%',
      },
      {
        src: '/design/3e42e3863c416fa19d194423a00dd732.webp',
        alt: 'A participant taking notes in a notebook during a session',
        position: '50% 45%',
      },
    ] satisfies [Photo, Photo, Photo],
  },
  faq: {
    eyebrow: 'frequently asked questions',
    heading: 'Questions organisations <em>ask before they nominate.</em>',
    photo: {
      src: '/design/c1c60b43105a3feca541a7e04eec05a8.webp',
      alt: 'A facilitator answering a question at a table during the immersive',
      position: '50% 40%',
    } satisfies Photo,
    items: [
      {
        question: 'Is this a technical or software-training program?',
        answer:
          'No. The program focuses on the ability to interpret, analyse, visualise, communicate and act on data. Participants do not need coding or advanced statistical experience.',
      },
      {
        question: 'Does Goalkeep train our whole organisation?',
        answer:
          'Goalkeep trains the two team members you nominate. They then adapt and take the learning to their colleagues, with resources, mentorship and implementation support from Goalkeep.',
      },
      {
        question: 'Is AI now the main focus of the program?',
        answer:
          'No. Foundational data literacy remains the central capability. AI is introduced where it can make data-related work faster or more accessible, with participants keeping responsibility for verification and final judgement.',
      },
      {
        question: 'Who should we nominate?',
        answer:
          'Nominate two team members with enough influence and organisational understanding to take the learning back to their colleagues. We recommend one programme leader and one mid-senior MEL team member.',
      },
      {
        question: 'What commitment is required?',
        answer:
          'Participants attend the immersive learning experience, practise facilitation, run internal learning sessions, apply the skills within a real organisational process and take part in mentorship and cohort reflection.',
      },
      {
        question: 'Can a funder or intermediary partner with Goalkeep on a cohort?',
        answer:
          'Yes. Funders and ecosystem organisations can partner with Goalkeep to make the program available to nonprofit portfolios or cohorts, while Goalkeep leads the learning design, delivery, mentorship and measurement.',
      },
    ] satisfies Array<Faq>,
  },
  contact: {
    heading: 'Help data capability travel <em>beyond the MEL team.</em>',
    body: 'Equip leaders within your organisation to build confidence, strengthen everyday data use and help colleagues across roles make more data-driven decisions.',
    ctas: ['Register your interest', 'Partner with Goalkeep to fund a cohort'],
  },
  explore: [
    {
      title: 'Kickstarter 3.0',
      body: 'Build the data backbone your organisation needs to grow. A hands-on program for early-stage nonprofits that need a simple, integrated and usable data system.',
      href: '/programs/kickstarter',
      cta: 'Explore the program',
      tone: 'gold',
    },
    {
      title: 'Data adoption and capacity-building',
      body: 'We also conduct custom trainings and capacity building workshops that impart practical, role-specific learning. The primary goal is to get people to integrate data in their everyday work, so that it becomes a habit rather than a one-off event.',
      href: '/services/data-adoption-and-capacity-building',
      cta: 'Explore the service',
      tone: 'teal',
    },
  ] satisfies Array<ExploreCard>,
}
