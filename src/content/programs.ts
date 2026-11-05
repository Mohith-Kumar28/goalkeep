import { caseStudies } from './homepage'
import { serviceTitle, toContact } from './pages'
import type { Page, Story } from './pages'

/**
 * Programs: the overview and the Kickstarter and Data Literacy Program pages.
 * Copy is the November programs doc, verbatim apart from typos.
 */

const homepageStory = (slug: string, body: string): Story => {
  const study = caseStudies.find((s) => s.slug === slug)
  if (!study) throw new Error(`No homepage case study "${slug}"`)
  return { ...study, body }
}

/* Vanavil is not on the homepage any more, so its card lives here. The
   tags follow the homepage vocabulary and are our first pass. */
export const vanavilStory: Story = {
  org: 'Vanavil Trust',
  sector: 'Education',
  intervention: 'Data collection & visualisation',
  body: 'Using timely information to identify and re-engage children who had dropped out.',
  image: '/photos/case-vanavil.webp',
  imageAlt: 'Children studying in a Vanavil Trust classroom',
}

export const programsPage: Page = {
  path: '/programs',
  title: 'Programs — Goalkeep',
  description:
    'Goalkeep’s programs help social-purpose organisations build the data systems and the data skills that make information useful.',
  contactService: serviceTitle('Data systems and workflows'),
  blocks: [
    {
      kind: 'hero',
      eyebrow: 'programs',
      headline: { lead: 'Build the systems and skills that', em: 'make data useful.' },
      lead: 'Goalkeep’s programs help social-purpose organisations strengthen two foundations of data use: the systems through which information flows and the capabilities people need to interpret and act on it.',
      highlight: 'two foundations of data use',
      links: [
        {
          label: 'For early-stage nonprofits',
          title: 'Kickstarter',
          to: '/programs/kickstarter',
          photo: { src: '/photos/aud-early-1.webp', alt: 'A facilitator presenting a dashboard on screen to a partner team' },
        },
        {
          label: 'For cohorts of organisations',
          title: 'Data Literacy Program',
          to: '/programs/data-literacy',
          photo: { src: '/photos/aud-mature-3.webp', alt: 'A Data Literacy Program cohort gathered in front of the programme banner' },
        },
      ],
    },
    {
      kind: 'programs',
      headline: { lead: 'Two programs,', em: 'one foundation each.' },
      opening: [
        'Whether your organisation is building its first reliable data system or strengthening data confidence across its workforce, our programs combine technical expertise, practical learning and sustained adoption support. We also partner with funders and intermediaries to run either program across their portfolios or cohorts.',
      ],
      cards: [
        {
          eyebrow: 'Kickstarter',
          title: 'Build the data backbone your organisation needs to grow',
          body: 'A hands-on program for early-stage nonprofits that need a simple, integrated and usable data system. Work with Goalkeep to identify what matters, organise how it is captured and build a system that turns everyday data into useful insights for your programs.',
          facts: [
            { label: 'How it runs', value: 'Hands-on with your team: understand, design, build and adopt.' },
            { label: 'Next cohort', value: 'January 2027' },
          ],
          cta: { label: 'Explore Kickstarter', to: '/programs/kickstarter' },
          photo: { src: '/photos/phase-build-a.webp', alt: 'A partner dashboard open on a laptop in the field' },
        },
        {
          eyebrow: 'Data Literacy Program',
          title: 'Build a data-confident workforce from within',
          body: 'A cohort-based, train-the-trainer program that equips organisational and MEL leaders to strengthen data literacy across their teams. Participants build foundational data skills, practise using AI responsibly and receive the resources and support to take the learnings back to improve the data culture in their respective organisations.',
          facts: [
            { label: 'How it runs', value: 'Cohort-based and train-the-trainer: two master trainers take the learning back.' },
            { label: 'Next cohort', value: 'December 2026' },
          ],
          cta: { label: 'Explore the Data Literacy Program', to: '/programs/data-literacy' },
          photo: { src: '/photos/aud-eco-5.webp', alt: 'Cohort members working through data together around a table' },
        },
      ],
    },
    {
      kind: 'prose',
      headline: { label: 'for funders and intermediaries', lead: 'Run either program across', em: 'your portfolio.' },
      paragraphs: [
        'We partner with funders and intermediaries to run either program across their portfolios or cohorts.',
        'For the Data Literacy Program, Goalkeep leads the learning design, delivery, mentorship and measurement while you make the program available to the organisations you support.',
      ],
      highlight: 'across their portfolios or cohorts',
      photo: { src: '/photos/aud-eco-2.webp', alt: 'A partner cohort group photograph at a convening' },
      note: 'one cohort, many organisations',
    },
    { kind: 'testimonial', audience: 'intermediary', tone: 'navy' },
    { kind: 'partners' },
    {
      kind: 'closing',
      mark: true,
      headline: { lead: 'Not sure which program', em: 'fits you?' },
      body: 'Tell us where your organisation is today, and we will suggest the right place to start.',
      primary: { label: 'Talk to us', to: toContact },
      secondary: { label: 'Take the data culture quiz', to: '/resources/data-quiz' },
    },
  ],
}

export const kickstarterPage: Page = {
  path: '/programs/kickstarter',
  title: 'Kickstarter — Goalkeep',
  description:
    'Kickstarter is Goalkeep’s hands-on program for early-stage nonprofits moving from scattered information to a simple, integrated data system their teams can use.',
  contactService: serviceTitle('Data systems and workflows'),
  blocks: [
    {
      kind: 'hero',
      eyebrow: 'Kickstarter',
      headline: { lead: 'Build the data backbone your organisation', em: 'needs to grow.' },
      lead: 'Kickstarter is Goalkeep’s hands-on program for early-stage nonprofits that want to move from scattered information and manual reporting to a simple, integrated data system their teams can use.',
      primary: { label: 'Apply for the Kickstarter', to: toContact, note: 'Next cohort begins January\u00a02027' },
      secondary: { label: 'Partner with us to support a cohort', to: toContact },
      highlight: 'a simple, integrated data system',
      photo: { src: '/photos/aud-early-1.webp', alt: 'A facilitator presenting a dashboard on screen to a partner team' },
    },
    {
      kind: 'prose',
      headline: { lead: 'Measuring impact should not depend on', em: 'the size of your organisation.' },
      highlight: 'long before they have the systems',
      photo: { src: '/photos/org-classroom.webp', alt: 'A programme session running in a village classroom' },
      note: 'the change comes first, the evidence later',
      paragraphs: [
        'Early-stage nonprofits are often creating meaningful change long before they have the systems needed to demonstrate it.',
        'Programme information may be spread across spreadsheets, forms, messages and individual team members. Founders spend time chasing updates, teams repeatedly clean and combine data only for reports, important patterns are noticed late, and communicating impact to funders depends on manually reconstructing the story. Meanwhile, little to none of the data is actually used to strengthen the programs and help team members move away from making decisions based on anecdotal evidence.',
        'Kickstarter helps organisations build this foundation of data-driven decision making early, before fragmented processes become expensive, complicated systems.',
      ],
    },
    {
      kind: 'checklist',
      headline: { lead: 'Kickstarter may be', em: 'right for you if' },
      items: [
        'Your programme data is scattered across multiple sheets, forms or people.',
        'Preparing a report requires repeatedly combining and cleaning information.',
        'You collect many data points but are unsure which ones matter most.',
        'Your team finds it difficult to see programme progress or identify problems early.',
        'Your founder or MEL lead is the only person who can make sense of the data.',
        'You need clearer evidence for strategy, programme reviews and funder conversations.',
        'You want a system that reflects your programme and workflows rather than a generic software product.',
        'You don’t just want a dashboard but also guidance on how to drive better data adoption among your team.',
      ],
    },
    {
      kind: 'steps',
      layout: 'rows',
      headline: { lead: 'Four stages, from your programme', em: 'to a system people use.' },
      intro: [
        'Together, we identify the questions you want your data to answer for you, prioritise what should be measured and build a custom system that brings data entry, management, analysis and insight into one connected experience.',
      ],
      steps: [
        {
          title: 'Understand',
          photo: { src: '/photos/aud-early-2.webp', alt: 'A partner team around a meeting-room table during a working session' },
          visual: 'understand',
          lead: 'We begin with your programme, people and decisions, not with technology.',
          body: [
            'Goalkeep works with leadership, programme, field and MEL team members to understand how the programme operates, how information currently moves and where the greatest friction lies. Together, we identify the questions the system must answer and the decisions those answers should support.',
          ],
        },
        {
          title: 'Design',
          photo: { src: '/photos/phase-design-b.webp', alt: 'Indicators and workflows mapped out on boards during a design session' },
          visual: 'design',
          lead: 'We translate the priority questions into a practical system design.',
          body: [
            'This includes refining the most important indicators, mapping data sources, establishing business rules, designing the data model and creating interactive prototypes of the data-entry and insight experience. Your team reviews the proposed workflows before the full system is built.',
          ],
        },
        {
          title: 'Build',
          photo: { src: '/photos/phase-build-b.webp', alt: 'A Goalkeep team member building a data system' },
          visual: 'build',
          lead: 'Goalkeep builds an integrated, customised system for entering, managing and using programme data.',
          body: [
            'We favour an open-source core, using technologies such as PostgreSQL or Supabase where appropriate, supported by tools for version control and hosting. The stack is selected according to the organisation’s needs, budget, security requirements and ability to maintain it.',
            'An AI-enabled delivery workflow helps us move more quickly from discovery to prototype and build. Goalkeep’s project team remains responsible for validating requirements, calculations, workflows and the quality of the finished system.',
          ],
        },
        {
          title: 'Adopt',
          photo: { src: '/photos/phase-adopt-training-b.webp', alt: 'A team being trained to use their new data system' },
          visual: 'adopt',
          lead: 'A system creates value only when people use it.',
          body: [
            'We train team members, conduct facilitated data reviews and help the organisation build routines for using information in programme and management conversations. We also provide documentation, maintenance support and a structured handover so that ownership can move to the organisation.',
          ],
        },
      ],
    },
    {
      kind: 'deliverables',
      headline: { lead: 'From finding the information', em: 'to acting on it.' },
      shift: {
        beforeLabel: 'Before Kickstarter',
        before: 'Where is the information, and who can put it together?',
        afterLabel: 'After Kickstarter',
        after: 'What is the information telling us, and what should we do next?',
      },
      intro: 'A well-used Kickstarter system can help your organisation:',
      items: [
        'Reduce the time spent consolidating data and preparing reports.',
        'Identify programme gaps and participant needs earlier.',
        'Give programme teams greater ownership of information.',
        'Make reviews more focused and action-oriented.',
        'Communicate progress and impact more confidently.',
        'Build a stronger foundation for organisational growth and funding.',
      ],
    },
    {
      kind: 'stories',
      headline: { lead: 'See what organisations have done with', em: 'a stronger data foundation.' },
      stories: [
        homepageStory('baithak-reporting', 'Using a more accessible data system in programme and funder conversations.'),
        vanavilStory,
        homepageStory('apni-shala-indicators', 'Using a priority learning metric to identify student needs earlier and plan interventions.'),
      ],
    },
    { kind: 'testimonial', audience: 'early-stage', tone: 'navy' },
    {
      kind: 'related',
      headline: { lead: 'Building skills', em: 'as well as systems?' },
      items: [
        {
          label: 'Data Literacy Program',
          title: 'Build a data-confident workforce from within',
          body: 'A cohort-based, train-the-trainer program that equips organisational and MEL leaders to strengthen data literacy across their teams.',
          to: '/programs/data-literacy',
        },
        {
          label: 'Service',
          title: 'Data systems and workflows',
          body: 'For organisations past the early stage: integrated custom systems that bring data entry, storage, analysis and insight into one connected experience.',
          to: '/services/data-systems-and-workflows',
        },
      ],
    },
    { kind: 'partners' },
    {
      kind: 'closing',
      headline: { lead: 'Ready to turn your messy data into a streamlined system', em: 'you can actually get insights from?' },
      body: 'Build a system that helps your team see what matters, act earlier and communicate your impact with confidence.',
      primary: { label: 'Apply for the next cohort', to: toContact },
      secondary: { label: 'Speak to Goalkeep about funding a cohort', to: toContact },
    },
  ],
}

export const dataLiteracyPage: Page = {
  path: '/programs/data-literacy',
  title: 'Data Literacy Program — Goalkeep',
  description:
    'A cohort-based, train-the-trainer program that builds data literacy, and the responsible use of AI, across social-purpose organisations.',
  contactService: serviceTitle('Data adoption and capacity-building'),
  blocks: [
    {
      kind: 'hero',
      eyebrow: 'Data Literacy Program',
      headline: { lead: 'Build a data\u2011confident workforce', em: 'at\u00a0your organisation.' },
      lead: 'The Data Literacy Program is Goalkeep’s cohort-based, train-the-trainer program for strengthening data capability across social-purpose organisations.',
      primary: { label: 'Register your interest', to: toContact, note: 'Next cohort begins December\u00a02026' },
      secondary: { label: 'Partner with us to support a cohort', to: toContact },
      highlight: 'train-the-trainer program',
      photo: { src: '/photos/aud-mature-1.webp', alt: 'A facilitator speaking at a Data Literacy Program session' },
    },
    {
      kind: 'prose',
      headline: { lead: 'Collecting more data has not automatically helped organisations', em: 'use it better.' },
      highlight: 'MEL or data specialists',
      photo: { src: '/photos/aud-mature-2.webp', alt: 'Participants working on laptops around a training table' },
      photoPosition: 'center 75%',
      note: 'practical, relevant, transferable',
      paragraphs: [
        'Many organisations now have dashboards, MIS platforms, surveys and reporting systems. Yet the ability to interpret and act on the information often remains concentrated with a small number of MEL or data specialists. Teams are often unsure how to separate an important pattern from a misleading one, turn an insight into a programme decision, communicate evidence and impact to different audiences, or judge when AI output can be trusted.',
        'Conventional training often fails because it is too technical, generic or disconnected from nonprofit work. The Data Literacy Program is designed to address these exact organisational gaps by teaching skills that are practical, relevant and transferable.',
      ],
    },
    {
      kind: 'checklist',
      headline: { lead: 'Designed for social-purpose organisations', em: 'that:' },
      items: [
        'Collect data but want it to inform more everyday decisions.',
        'Have dashboards or reports that are not being used consistently.',
        'Want data capability to extend beyond the MEL team.',
        'Need a shared language for discussing evidence across roles.',
        'Want to strengthen internal training, onboarding or manager-development processes.',
        'Are interested in using AI for data work without compromising privacy, accuracy or accountability.',
        'Can nominate two organisational leaders who will take the learning back to colleagues.',
      ],
      aside: {
        intro: 'The recommended model is for each organisation to nominate two master trainers:',
        people: [
          'One senior organisational or programme leader.',
          'One senior MEL, data, learning or evidence leader.',
        ],
        outro: 'Together, they combine organisational influence with measurement expertise and share ownership of the internal rollout.',
      },
    },
    {
      kind: 'steps',
      layout: 'bento',
      headline: { lead: 'Five skills for', em: 'working with evidence.' },
      intro: [
        'Participants build foundational skills in interpreting, analysing, visualising and communicating data. They then receive the curriculum, practice and mentorship to run the training inside their own organisation and help build these data literacy skills among their colleagues.',
      ],
      steps: [
        {
          title: 'Quantitative data analysis',
          visual: 'quantitative',
          body: ['Ask focused questions, work with numerical information and identify patterns that matter.'],
        },
        {
          title: 'Qualitative data analysis',
          visual: 'qualitative',
          body: ['Organise and interpret feedback, interviews, observations and other forms of qualitative evidence.'],
        },
        {
          title: 'Data interpretation',
          visual: 'interpretation',
          body: ['Read charts, indicators and dashboards carefully; identify what the evidence does and does not support.'],
        },
        {
          title: 'Data visualisation',
          visual: 'visualisation',
          body: ['Choose and design visual representations that make information easier to understand.'],
        },
        {
          title: 'Data communication',
          visual: 'communication',
          body: ['Translate evidence into clear messages and narratives for colleagues, partners and funders.'],
        },
      ],
    },
    {
      kind: 'steps',
      layout: 'flow',
      headline: { lead: 'Data literacy remains the core capability.', em: 'AI is an assistive layer.' },
      intro: [
        'The program also teaches participants how to bring everyday AI tools responsibly into their work, while keeping foundational data skills, verification and human judgement at the centre.',
        'Every skill follows the same three-part approach.',
      ],
      outro: 'The goal is not to automate unrelated organisational processes. AI use remains anchored in helping people work with data more thoughtfully and efficiently.',
      steps: [
        {
          title: 'Build the underlying capability',
          body: ['Participants first learn what good interpretation, analysis, visualisation or communication looks like.'],
        },
        {
          title: 'Use AI to strengthen the work',
          body: ['Participants explore how accessible AI tools can help organise information, support preliminary analysis, generate alternatives or communicate more efficiently.'],
        },
        {
          title: 'Verify through human judgement',
          body: ['Participants check AI-generated outputs against the underlying evidence, organisational context and intended purpose before using them.'],
        },
      ],
    },
    {
      kind: 'outcomes',
      headline: { lead: 'Capability that stays', em: 'inside the organisation.' },
      photo: { src: '/photos/phase-adopt-training-b.webp', alt: 'Participants working through a data exercise together at a Data Literacy Program session' },
      items: [
        {
          title: 'Better and more timely decisions',
          body: 'Managers and programme teams use data more consistently to recognise what is working, identify emerging problems and decide where attention or resources are needed.',
        },
        {
          title: 'Capability that is internally owned',
          body: 'Organisations can incorporate adapted learning into onboarding, annual training, programme reviews or manager development, reducing dependence on external trainers.',
        },
        {
          title: 'Responsible use of AI',
          body: 'Teams use AI to support selected data-related tasks while applying safeguards for privacy, accuracy, inclusion and human accountability.',
        },
        {
          title: 'Stronger organisational routines',
          body: 'Data interpretation becomes part of recurring programme reviews, coaching conversations, reporting and decision-making rather than a skill used only by specialists.',
        },
        {
          title: 'Learning that travels across the sector',
          body: 'Real organisational applications generate practical examples of where data and AI add value, where they fail and what other organisations should adapt or avoid.',
        },
      ],
    },
    {
      kind: 'stats',
      headline: { lead: 'Learning that', em: 'travels.' },
      stats: [
        { value: 42, label: 'participants trained' },
        { value: 700, suffix: '+', label: 'colleagues that participants have collectively trained at their organisations' },
        { value: 76, suffix: '%', label: 'of assessed participants improved in at least one data-literacy skill' },
      ],
      testimonial: 'data-mature',
    },
    {
      kind: 'related',
      headline: { lead: 'Need the system', em: 'as well as the skills?' },
      items: [
        {
          label: 'Kickstarter',
          title: 'Build the data backbone your organisation needs to grow',
          body: 'A hands-on program for early-stage nonprofits that need a simple, integrated and usable data system.',
          to: '/programs/kickstarter',
        },
        {
          label: 'Service',
          title: 'Data adoption and capacity-building',
          body: 'Direct workshops, MEL knowledge partnerships for ecosystem programmes, and custom learning journeys built around your own data.',
          to: '/services/data-adoption-and-capacity-building',
        },
      ],
    },
    {
      kind: 'faq',
      headline: { lead: 'Frequently asked', em: 'questions' },
      items: [
        {
          question: 'Is this a technical or software-training program?',
          answer: 'No. The program focuses on the ability to interpret, analyse, visualise, communicate and act on data. Participants do not need coding or advanced statistical experience.',
        },
        {
          question: 'Does Goalkeep train our whole organisation?',
          answer: 'Goalkeep develops the master trainers. The master trainers then adapt and take the learning to colleagues, with resources, mentorship and implementation support from Goalkeep.',
        },
        {
          question: 'Is AI now the main focus of the program?',
          answer: 'No. Foundational data literacy remains the central capability. AI is introduced where it can make data-related work faster or more accessible, with participants retaining responsibility for verification and final judgement.',
        },
        {
          question: 'Who should we nominate?',
          answer: 'Participants should have enough influence and organisational understanding to take the learning back to colleagues. The recommended pair is a senior organisational or programme leader and a senior MEL, data or evidence leader.',
        },
        {
          question: 'What commitment is required?',
          answer: 'Participants must attend the immersive learning experience, practise facilitation, conduct internal learning, apply the skills within a real organisational process and take part in mentorship and cohort reflection.',
        },
        {
          question: 'Can a funder or intermediary partner with Goalkeep on a cohort?',
          answer: 'Yes. Funders and ecosystem organisations can partner with Goalkeep to make the program available to nonprofit portfolios or cohorts while Goalkeep leads the learning design, delivery, mentorship and measurement.',
        },
      ],
    },
    { kind: 'partners' },
    {
      kind: 'closing',
      headline: { lead: 'Help data capability travel', em: 'beyond the MEL team.' },
      body: 'Equip leaders within your organisation to build confidence, strengthen everyday data use and enable colleagues across roles to become more data-driven in their decision making.',
      primary: { label: 'Register your interest', to: toContact },
      secondary: { label: 'Partner with Goalkeep to fund a cohort', to: toContact },
    },
  ],
}
