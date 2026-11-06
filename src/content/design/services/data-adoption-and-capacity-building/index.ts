import type { ServicePageContent } from '../../service-page'
import champions from './champions.svg?raw'
import confidence from './confidence.svg?raw'
import frameworks from './frameworks.svg?raw'
import routines from './routines.svg?raw'
import sustain from './sustain.svg?raw'
import vocabulary from './vocabulary.svg?raw'

export const content: ServicePageContent = {
  slug: 'data-adoption-and-capacity-building',
  service: 'Data adoption and capacity-building',
  meta: {
    title: 'Data adoption and capacity-building | Goalkeep',
    description:
      'We enable practical, role-specific data adoption that helps people use data in their everyday work, so it becomes a habit rather than a one-off event.',
  },
  tone: 'teal',
  hero: {
    headline:
      'Build a data-confident<br class="dc-br-d"> workforce <em>across all levels<br class="dc-br-d"> of your organisation.</em>',
    lead: 'We enable practical, role-specific data adoption that helps people use data in their everyday work, so it becomes a habit rather than a one-off event.',
    primary: 'Work with us',
    secondary: { label: 'Read Dasra case study', href: '#case' },
    photos: [
      {
        src: '/design/6616bb19d578b4407abaff9cbb89cc4b.webp',
        alt: 'A participant presenting during a data literacy session',
        position: '50% 45%',
      },
      {
        src: '/design/c7fa18945afc05080e35a4e989719575.webp',
        alt: 'A programme session running in a village classroom',
        position: '50% 45%',
      },
      {
        src: '/design/02adf370ce68ad12d02aaf2eb57276c3.webp',
        alt: 'Goalkeep with a partner team after a workshop',
        position: '50% 45%',
      },
      {
        src: '/design/d9f25a2c090890697a8d9bf1806f663d.webp',
        alt: 'A Goalkeep working session on the floor of a partner office',
        position: '50% 45%',
      },
    ],
  },
  signs: {
    heading: 'Six signs your team’s data confidence <em>needs a boost.</em>',
    prompt: 'Tap the ones that seem relatable to you.',
    cta: 'Talk to us about these',
    verdicts: {
      none: { title: 'Nothing tapped yet.', body: 'Tap any note that rings true for you.' },
      few: {
        title: 'Worth a conversation.',
        body: 'Small gaps in data confidence tend to widen if left unchecked.',
      },
      many: {
        title: 'Your team’s data capability needs serious attention.',
        body: 'This is exactly what we’re here to fix. Let’s connect.',
      },
    },
    signs: [
      'Teams have access to data or dashboards but use them inconsistently.',
      'People lack confidence interpreting, visualising or communicating data.',
      'Data capability varies widely across roles and sits with a few specialists.',
      'Previous training did not change day-to-day practice.',
      'Your organisation needs a shared vocabulary and stronger data-review routines.',
      'You’re supporting a cohort that wants to strengthen their MEL capabilities.',
    ],
  },
  approach: {
    eyebrow: 'ways to work with us',
    rows: [
      {
        heading: 'Direct workshops <em>with your organisation.</em>',
        body: 'Most teams that already have a system in place struggle primarily with getting their teams to engage with data. We conduct customised workshops on a range of skills including data interpretation, data analysis (quantitative and qualitative), data visualization, and data communication.',
        photo: {
          src: '/design/28cd94a8513259340d1af6f7fc304ad1.webp',
          alt: 'A Goalkeep training session with a partner team',
        },
      },
      {
        heading: 'MEL knowledge partner <em>for ecosystem programmes.</em>',
        body: 'We act as the MEL knowledge partner for programmes run by funders, intermediaries and ecosystem organisations. We co-design the curriculum and cohort experience, facilitate workshops, and provide training resources as well as mentorship support.',
        photo: {
          src: '/design/eebb759ffd603765b4f2ba7241923c37.webp',
          alt: 'Participants working through an exercise together during a cohort workshop',
        },
      },
      {
        heading: 'Goalkeep’s <em>Data Literacy Program.</em>',
        body: 'A cohort-based, train-the-trainer journey that helps nonprofit professionals build data confidence and strengthen capability across their teams. Organizations nominate two people from their teams to attend this program and become master trainers, so that they can enable data adoption among others in their organisations once the program ends.',
        photo: {
          src: '/design/d7e0a2f562f148853d7f839e7a34590d.webp',
          alt: 'Goalkeep with a partner team after a workshop',
        },
      },
    ],
  },
  deliverables: {
    heading: 'What you leave with <em>at the end of our engagement.</em>',
    items: [
      { label: 'Greater confidence analysing, visualising and communicating data', illustration: confidence },
      { label: 'Practical frameworks, templates and tools for everyday work', illustration: frameworks },
      { label: 'A shared data vocabulary across roles and teams', illustration: vocabulary },
      { label: 'Action plans and data-review routines linked to programme decisions', illustration: routines },
      { label: 'Internal trainers or data champions who can support colleagues', illustration: champions },
      { label: 'A plan for sustaining capability beyond the engagement', illustration: sustain },
    ],
  },
  duration: {
    eyebrow: 'indicative duration',
    heading: 'From a few hours <em>to a few months.</em>',
    body: 'Direct workshops run from four hours to three days. Custom learning journeys and ecosystem partnerships vary by cohort and scope, and the Data Literacy Program is a multi-month train-the-trainer journey.',
    range: [1, 3],
    weeks: 6,
    note: '',
  },
  caseStudy: {
    kind: 'live',
    href: '#',
    photo: {
      src: '/design/b43b8317ad39f1486378a584f20510c1.webp',
      alt: 'Cohort members working together around a table',
    },
    tags: [
      { label: 'Cross-sector', tone: 'blue' },
      { label: 'Operationalizing Theory of Change', tone: 'teal' },
    ],
    title: 'Dasra and SVP India',
    body: 'Conducted capacity building workshops to help 16 organizations in their cohort map their ToC to measurable indicators.',
    cta: 'Read the case study',
  },
  contact: {
    heading: 'Ready to build the skills and routines <em>that strengthen your data capacity?</em>',
    body: 'We work with funders and intermediaries to build capacity across the organisations they support, and with nonprofits directly to increase data adoption among their own teams.',
    ctas: ['Work with us'],
  },
  explore: {
    heading: 'Explore our <em>other services.</em>',
    cards: [
      {
        title: 'Impact and measurement strategy',
        body: 'Turn your Theory of Change into a measurement framework your organisation can use. We clarify the outcomes that matter, the questions your data needs to answer, and put in place the strategy you need to make that happen.',
        href: '/services/impact-and-measurement-strategy',
        cta: 'Explore',
        tone: 'gold',
      },
      {
        title: 'Data systems and workflows',
        body: 'Build an integrated data system that is easier to use today and strong enough to grow with you. We bring data entry, analysis and insight into one connected system, shaped around your programmes, roles and workflows.',
        href: '/services/data-systems-and-workflows',
        cta: 'Explore',
        tone: 'blue',
      },
      {
        title: 'Dashboards and reporting',
        body: 'Build dashboards that answer real questions, not simply display available data. We start with what questions you want your data to answer for you, and then build out a system that effectively showcases that.',
        href: '/services/dashboards-and-reporting',
        cta: 'Explore',
        tone: 'coral',
      },
    ],
  },
}

/** Not expressible in ServicePageContent: this page's two-bar duration ruler. */
export const durationRuler = {
  steps: ['4 hours', '1 day', '3 days', '1 month', '3 months', '6 months'],
  bars: [
    { label: 'Workshops', caption: 'direct workshops', from: 0, to: 3 },
    { label: 'Data Literacy Program', caption: 'multi-month train-the-trainer journey', from: 3, to: 6 },
  ],
}

/** Not expressible in ServicePageContent: extra links and CTAs on the approach rows. */
export const approachExtras = [
  { cta: 'Partner with us', tlink: { label: 'Fund an organisation you support', href: '#' } },
  { link: { label: 'Read the Dasra and SVP India case study', href: '#case' }, cta: 'Partner with us' },
  { cta: 'Explore the Data Literacy Program', tlink: { label: 'Fund a Data Literacy cohort', href: '#' } },
]

/** Not expressible in ServicePageContent: the case study pull quote. */
export const caseQuote = {
  text: 'It’s always inspiring to see how Goalkeep conducts their sessions. Their attention to detail is very high and the approach involved forming strong relationships with the participating NGOs, which is why we like having them as an MEL partner.”',
  name: 'Freya Ray',
  org: 'Dasra',
  avatar: { src: '/design/59e627a7360d535405630ac1f432bd30.webp', alt: 'Freya Ray' },
}
