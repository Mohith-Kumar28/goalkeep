import { serviceTitle, toContact } from './pages'
import type { Block, Page, Story } from './pages'
import { vanavilStory } from './programs'

/**
 * The four service pages, one template. Copy, headings and section order are
 * the November services doc, verbatim apart from typos and British spelling;
 * nothing is added that the doc does not have.
 */

const peepulStory: Story = {
  org: 'Peepul',
  sector: 'Education',
  intervention: 'Designing Organizational Impact Framework',
  body: 'Nineteen organisation-level indicators and a leadership dashboard helped Peepul more effectively monitor their programs as they scaled to having 8 programs across 2 states.',
  image: '/photos/case-peepul.webp',
  imageAlt: 'Peepul and Goalkeep team members working through a dashboard around a table',
}

const apniShalaStory: Story = {
  org: 'Apni Shala Foundation',
  sector: 'Education',
  intervention: 'Identifying key metrics',
  body: 'A handful of metrics on the weekly dashboard helped Apni Shala identify student learning gaps that used to surface only at year-end.',
  image: '/photos/case-apni-shala.webp',
  imageAlt: 'The Apni Shala Foundation team standing together in their office',
}

const workWithUs = { label: 'Work with us', to: toContact }

const helpWhen = { lead: 'This service can', em: 'help when' }

const dashboardsDistinction: Block = {
  kind: 'prose',
  tone: 'navy',
  headline: { lead: 'An important', em: 'distinction' },
  highlight: 'standalone visual-design exercise',
  paragraphs: [
    'Dashboarding is not treated as a standalone visual-design exercise or a promise to simply deliver a set of charts. If the measurement framework, definitions or underlying data system are not reliable, Goalkeep addresses those foundations as part of the engagement. The dashboard is the visible layer of a larger process that makes the information trustworthy and useful.',
  ],
}

const dashboardsDuration: Block = {
  kind: 'duration',
  text: 'Dashboard design, build and testing commonly take 4–8 weeks within a wider measurement or data-systems engagement, followed by an agreed maintenance and adoption period. The duration depends on the readiness of the underlying data and the number of user groups and views.',
  weeks: [4, 8],
}

export const servicePages: Array<Page & { slug: string }> = [
  {
    slug: 'impact-and-measurement-strategy',
    path: '/services/impact-and-measurement-strategy',
    title: 'Impact and measurement strategy — Goalkeep',
    description: 'Turn your Theory of Change into a measurement framework your organisation can use.',
    contactService: serviceTitle('Impact and measurement strategy'),
    blocks: [
      {
        kind: 'hero',
        eyebrow: 'impact and measurement strategy',
        headline: { lead: 'Turn your Theory of Change into a measurement framework', em: 'your organisation can use.' },
        lead: 'Your organisation may already have a Theory of Change, logframes, surveys, indicators and years of programme data. But as programmes grow, these pieces do not always add up to a clear picture of organisational impact.',
        body: [
          'We work with programme, MEL and leadership teams to clarify the outcomes that matter, the questions the organisation needs its data to answer, and the evidence required to answer them. The result is a measurement framework that is technically sound, realistic to implement and useful to the people who must work with it. It also gives leadership a clearer way to show funders and partners what change your program is creating and why.',
        ],
        highlight: 'clear picture',
        photo: { src: '/photos/phase-design-a.webp', alt: 'Affinity mapping on coloured boards during a design workshop' },
      },
      {
        kind: 'checklist',
        headline: helpWhen,
        items: [
          'Your Theory of Change no longer reflects how your programmes have evolved.',
          'Different programmes or teams use different definitions, indicators or methods for similar outcomes.',
          'You collect considerable data but still cannot see a coherent organisation-wide picture of impact.',
          'Measurement is driven mainly by reporting requirements rather than programme decisions and learning.',
          'Leadership, teams or funders need stronger and more consistent evidence of progress.',
          'A measurement framework exists on paper but has not been operationalised in everyday work.',
        ],
      },
      {
        kind: 'deliverables',
        headline: { lead: 'What you may', em: 'leave with' },
        items: [
          'A refined programme-level or organisation-level Theory of Change.',
          'A prioritised outcome and indicator framework.',
          'Recommendations on methods, sampling, frequency and disaggregation.',
          'A diagnostic of current tools and legacy data.',
          'A learning and reporting framework.',
          'A phased implementation roadmap with ownership and next steps.',
        ],
        duration: 'Typically 6–8 weeks, depending on the number of programmes, stakeholder groups and the maturity of the existing framework.',
        weeks: [6, 8],
        visual: 'design',
      },
      { kind: 'stories', stories: [peepulStory] },
      {
        kind: 'closing',
        headline: { lead: 'Are you ready to build a measurement framework', em: 'your team can use?' },
        body: 'We work with you to measure what matters, map your organisation’s ToC to key indicators, and create a data strategy for your organisation that is both practical and effective.',
        primary: workWithUs,
      },
    ],
  },
  {
    slug: 'data-systems-and-workflows',
    path: '/services/data-systems-and-workflows',
    title: 'Data systems and workflows — Goalkeep',
    description: 'Build an integrated data system that is easier to use today and strong enough to grow with you.',
    contactService: serviceTitle('Data systems and workflows'),
    blocks: [
      {
        kind: 'hero',
        eyebrow: 'data systems and workflows',
        headline: { lead: 'Build an integrated data system that is easier to use today and', em: 'strong enough to grow with you.' },
        lead: 'As organisations grow, their data infrastructure often grows one tracker at a time. Information becomes spread across spreadsheets, forms, databases and dashboards. Teams repeat data entry, spend hours consolidating reports and depend on a small number of people to locate or interpret essential information.',
        body: [
          'Goalkeep designs and builds fully integrated custom data systems that bring data entry, storage, management, transformation, analysis and insight into one connected experience. The system is shaped around the organisation’s programmes, terminology, roles and workflows, rather than being a templatised product. For early-stage nonprofits, this direction can be delivered through Goalkeep’s AI-enabled Kickstarter: a structured pathway from programme logic and measurement priorities to a usable system for entering, managing and making sense of data.',
        ],
        highlight: 'one tracker at a time',
        photo: { src: '/photos/hero-04-pair.webp', alt: 'Two Goalkeep facilitators reviewing a data system on a tablet' },
      },
      {
        kind: 'checklist',
        headline: helpWhen,
        items: [
          'Programme data is scattered across sheets, forms, folders and platforms.',
          'Teams enter the same information more than once or manually combine it for every report.',
          'Definitions, formats and calculations vary between programmes or locations.',
          'Existing systems are slow, expensive, difficult to maintain or no longer fit the organisation’s scale.',
          'Essential system knowledge is concentrated with one founder, MEL lead or technical team member.',
          'Current tools cannot reliably support new programmes, locations, users or reporting needs.',
        ],
      },
      {
        kind: 'prose',
        tone: 'navy',
        headline: { lead: 'Technology', em: 'approach' },
        highlight: 'open-source data stack',
        paragraphs: [
          'We favour using an open-source data stack that your team is comfortable with. Depending on the need, the open-source core may include technologies such as PostgreSQL or Supabase for the database, supported by tools such as GitHub for version control and Vercel for hosting where appropriate. The exact stack is selected around the organisation’s workflows, budget, existing systems, security needs and ability to maintain it.',
        ],
      },
      {
        kind: 'deliverables',
        headline: { lead: 'What you may', em: 'leave with' },
        items: [
          'A diagnostic of current data flows, tools, bottlenecks and risks.',
          'A system architecture and implementation roadmap.',
          'A data model aligned with your programmes and reporting needs.',
          'A fully integrated custom system covering data entry, management, transformation, analysis and insight.',
          'A connected database, ETL processes and automated data pipelines.',
          'An agreed historical-data migration.',
          'Validation, error tracking, access controls and audit mechanisms appropriate to the engagement.',
          'User testing, training and a repeatable data-review process.',
          'Technical documentation, user guidance, maintenance support and a structured handover.',
        ],
        visual: 'build',
      },
      /* "[Apni Shala Case Study Card + testimonial of Sangeeta Zombade]" */
      { kind: 'stories', stories: [apniShalaStory], testimonial: 'early-stage' },
      {
        kind: 'duration',
        text: 'Typically 6–12 weeks for discovery, design and an initial build, followed by an agreed maintenance and adoption period. The duration varies with data complexity, migration requirements, integrations and the number of user workflows.',
        weeks: [6, 12],
      },
      {
        kind: 'closing',
        headline: { lead: 'Ready to build a data system around', em: 'how your organisation actually works?' },
        body: 'We work with you to streamline your data system, design a workflow that works for how your organisation operates, and set up data processes that scale along with you.',
        primary: workWithUs,
      },
    ],
  },
  {
    slug: 'dashboards-and-reporting',
    path: '/services/dashboards-and-reporting',
    title: 'Dashboards and reporting — Goalkeep',
    description: 'Build dashboards that answer real questions—not simply display available data.',
    contactService: serviceTitle('Dashboards and reporting'),
    blocks: [
      {
        kind: 'hero',
        eyebrow: 'dashboards and reporting',
        headline: { lead: 'Build dashboards that answer real questions—', em: 'not simply display available data.' },
        lead: 'Many dashboards fail because they begin with the data that happens to be available. The result may contain dozens of charts but still leave programme teams, leaders and funders unable to answer the questions that matter.',
        body: [
          'Goalkeep designs dashboards and reporting views for both funding organisations and nonprofits as part of a wider measurement and data-systems engagement. We first establish what people need to understand, decide and do; then ensure the definitions, data sources and pipelines underneath the dashboard can support those questions reliably.',
        ],
        highlight: 'happens to be available',
        photo: { src: '/photos/case-dashboard.webp', alt: 'A programme dashboard open on a laptop' },
      },
      {
        /* "There should be an option here to select one of two identifiers:
           funding organization or nonprofit. Basis that selection, they
           should see different content for the remainder of the page." */
        kind: 'audienceSwitch',
        prompt: 'Show the page for',
        options: [
          {
            id: 'nonprofits',
            label: 'For nonprofits',
            short: 'Nonprofits',
            blocks: [
              {
                kind: 'checklist',
                headline: helpWhen,
                items: [
                  'Dashboards or reports exist, but people rarely use them.',
                  'Leadership, programme teams, MEL staff and funders need different levels of information.',
                  'Leadership lacks a reliable organisation-wide view while programme teams depend on MEL for routine answers.',
                  'Reports take too long to prepare and still generate repeated questions about definitions or accuracy.',
                  'Numbers are displayed without a clear link to the decisions or actions they should inform.',
                  'The organisation finds it difficult to communicate progress and impact clearly.',
                ],
              },
              {
                kind: 'deliverables',
                headline: { lead: 'What you', em: 'leave with' },
                items: [
                  'Role-specific dashboards or reporting views.',
                  'Useful filters by programme, location, beneficiary group, time period or other relevant dimensions.',
                  'Automated or simplified recurring reports.',
                  'Onboarding and training for the people who will use the dashboard.',
                  'Data-review templates and routines that connect insight to action.',
                  'Documentation, maintenance support and handover.',
                ],
                visual: 'visualisation',
              },
              dashboardsDistinction,
              { kind: 'stories', stories: [vanavilStory] },
              dashboardsDuration,
              {
                kind: 'closing',
                headline: { lead: 'Ready to turn your data into answers', em: 'your team can act on?' },
                body: 'Design dashboards and reporting systems that are intuitive, insightful, and easy to work with.',
                primary: workWithUs,
              },
            ],
          },
          {
            id: 'funders',
            label: 'For funders',
            short: 'Funders',
            blocks: [
              {
                kind: 'checklist',
                headline: helpWhen,
                items: [
                  'Grant, milestone and results information is spread across reports, spreadsheets, emails and individual portfolio managers.',
                  'Grantees use different indicators and definitions, so building a portfolio view means repeated clarification.',
                  'Leadership and boards need a portfolio overview that keeps the context of individual organisations.',
                  'Non-financial support, such as capacity building, introductions and strategic guidance, goes untracked alongside the grant.',
                  'Risks and opportunities for support surface too late to inform reviews, renewals or resource allocation.',
                  'The organisation has evidence across its portfolio but finds it difficult to tell a clear, credible impact story.',
                ],
              },
              {
                kind: 'deliverables',
                headline: { lead: 'What you', em: 'leave with' },
                items: [
                  'A portfolio measurement framework linking funding priorities, grantee outcomes and leadership’s key questions.',
                  'Clear indicator definitions and reporting guidance that allow for differences between grantee programmes.',
                  'A structured record of grants, milestones, engagements, support provided and reported outcomes over time.',
                  'Portfolio dashboards for managers, leadership and boards, with drill-down from the aggregate view to individual grantees.',
                  'Decision-ready information for portfolio reviews, renewals, resource allocation and targeted capacity-building support.',
                  'A clearer account of how you have contributed to grantee progress.',
                ],
                visual: 'visualisation',
              },
              dashboardsDistinction,
              /* "Add BAT case study [to be provided]": it goes here once Goalkeep sends it. */
              dashboardsDuration,
              {
                kind: 'closing',
                headline: { lead: 'Ready to communicate portfolio-wide impact', em: 'with clarity?' },
                body: 'Design dashboards that make it easy to track progress and impact across your portfolio.',
                primary: workWithUs,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'data-adoption-and-capacity-building',
    path: '/services/data-adoption-and-capacity-building',
    title: 'Data adoption and capacity-building — Goalkeep',
    description: 'Build a data-confident workforce—not just a room of trained participants.',
    contactService: serviceTitle('Data adoption and capacity-building'),
    blocks: [
      {
        kind: 'hero',
        eyebrow: 'data adoption and capacity-building',
        headline: { lead: 'Build a data-confident workforce—', em: 'not just a room of trained participants.' },
        lead: 'Nonprofits are collecting more data than ever, but the confidence and capability to use it have not always grown at the same pace. Dashboards and reports may exist while teams remain uncertain about how to interpret them, ask useful questions or translate insight into action.',
        body: [
          'Many conventional data trainings are too technical, generic or disconnected from programme realities. Goalkeep creates practical, role-sensitive learning experiences that help people use data in their everyday work. We combine technical depth, adult-learning principles, nonprofit examples and hands-on application so learning can become a habit rather than a one-off event.',
        ],
        highlight: 'at the same pace',
        photo: { src: '/photos/phase-adopt-a.webp', alt: 'Participants working through data exercises together at a training session' },
      },
      {
        kind: 'checklist',
        headline: helpWhen,
        items: [
          'Teams have access to data or dashboards but use them inconsistently.',
          'People lack confidence interpreting, visualising or communicating data.',
          'Data capability varies widely across field, programme, MEL and leadership roles.',
          'Previous training did not change day-to-day practice.',
          'Data use is concentrated among a few specialists.',
          'The organisation needs a shared vocabulary and stronger data-review routines.',
          'A funder or intermediary wants to strengthen MEL capability across a portfolio, cohort or ecosystem.',
        ],
      },
      {
        kind: 'steps',
        layout: 'paths',
        headline: { lead: 'Ways to work', em: 'with Goalkeep' },
        steps: [
          {
            title: '1. Direct workshops with organisations',
            photo: { src: '/photos/hero-01-workshop.webp', alt: 'A Goalkeep facilitator leading a data workshop with an organisation' },
            body: [
              'Goalkeep delivers ready-to-run or customised workshops directly with an organisation. Topics may include interpreting data, visualisation, basic analysis, communicating with data, operationalising a Theory of Change or logframe, essential data design, data culture, data modelling, optimising pipelines, preparing dashboard-ready tables and the responsible use of AI.',
              'A custom workshop can be built around the organisation’s own dataset, dashboard, report, audience or decision-making routine so participants can immediately connect the learning to their work.',
            ],
            ctas: [
              { label: 'Partner with us', to: toContact },
              { label: 'Fund an organisation you support', to: toContact },
            ],
          },
          {
            title: '2. MEL knowledge partnership for ecosystem programmes',
            photo: { src: '/photos/aud-eco-1.webp', alt: 'A facilitator pointing out something on a worksheet to a participant' },
            body: [
              'Goalkeep acts as the MEL knowledge partner or contributor to programmes run by funders, intermediaries and other ecosystem organisations. We can co-design the programme architecture, curriculum, cohort experience and implementation structures; facilitate workshops; create resources; mentor participants; and provide train-the-trainer support. The partnership can be shaped around the MEL capability that the programme wants to build across its nonprofit partners.',
            ],
            ctas: [{ label: 'Partner with us', to: toContact }],
          },
          {
            title: '3. Goalkeep’s Data Literacy Program',
            photo: { src: '/photos/aud-mature-3.webp', alt: 'A Data Literacy Program cohort gathered in front of the programme banner' },
            body: [
              'Goalkeep’s own Data Literacy Program is a cohort-based, train-the-trainer journey designed to help nonprofit professionals build data confidence and strengthen capability across their teams. It combines immersive workshops with assessment, practical resources, mentorship and implementation support so participants can apply the learning and enable others within their organisations.',
            ],
            ctas: [
              { label: 'Explore Data Literacy Program', to: '/programs/data-literacy' },
              { label: 'Fund a Data Literacy cohort', to: toContact },
            ],
          },
        ],
      },
      {
        kind: 'deliverables',
        headline: { lead: 'What participants or partners', em: 'may leave with' },
        visual: 'adopt',
        items: [
          'Greater confidence in interpreting, analysing, visualising and communicating data.',
          'Practical frameworks, templates and tools that can be used in everyday work.',
          'A shared data vocabulary across roles and teams.',
          'Action plans and data-review routines that connect learning to programme decisions.',
          'Internal trainers or data champions who can support colleagues.',
          'A curriculum and resource set for a cohort or ecosystem programme.',
          'A plan for sustaining capability beyond the engagement.',
        ],
      },
      /* "[Testimonial from Homepage - of Freya Ray from Dasra]" */
      { kind: 'testimonial', audience: 'intermediary', tone: 'navy' },
      {
        kind: 'duration',
        text: 'Direct workshops may range from four hours to three days. Custom learning journeys and ecosystem partnerships vary by cohort and scope. Goalkeep’s Data Literacy Program is typically a multi-month train-the-trainer journey combining workshops, mentorship and implementation support.',
      },
      {
        kind: 'closing',
        headline: { lead: 'Ready to build the skills and routines that improve', em: 'your organisation’s data capacities?' },
        body: 'We work with funders and intermediaries to build organisational capacities across organisations they support and also with nonprofits directly to increase data adoption among their own teams.',
        primary: workWithUs,
      },
    ],
  },
]

