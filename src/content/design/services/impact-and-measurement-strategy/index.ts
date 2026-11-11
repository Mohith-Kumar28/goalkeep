import { weekTicks } from '../../service-page'
import type { ServicePageContent } from '../../service-page'
import sign1 from './sign-1.svg?raw'
import sign2 from './sign-2.svg?raw'
import sign3 from './sign-3.svg?raw'
import sign4 from './sign-4.svg?raw'
import sign5 from './sign-5.svg?raw'
import sign6 from './sign-6.svg?raw'
import theoryOfChange from './theory-of-change.svg?raw'
import indicatorFramework from './indicator-framework.svg?raw'
import dataMethods from './data-methods.svg?raw'
import diagnosticAssessment from './diagnostic-assessment.svg?raw'
import reportingFramework from './reporting-framework.svg?raw'
import roadmap from './roadmap.svg?raw'

export const content: ServicePageContent = {
  slug: 'impact-and-measurement-strategy',
  service: 'Impact and measurement strategy',
  meta: {
    title: 'Impact and measurement strategy | Goalkeep',
    description: 'Turn your Theory of Change into a measurement framework your organisation can use.',
  },
  tone: 'gold',
  hero: {
    headline: "Give your Theory of<br class=\"dc-br-d\"> Change <em>a robust<br class=\"dc-br-d\"> measurement framework.</em>",
    lead: "We work with programme, MEL and leadership teams to clarify the outcomes that matter, the questions your data needs to answer, and the evidence required to answer them.",
    primary: 'Work with us',
    secondary: { label: 'Peepul case study', href: '/case-studies/peepul' },
    photos: [
      { src: "/design/svc-impact-banner-1.webp", alt: "Goalkeep team members talking with a partner on a lane during a field visit", position: "50% 40%" },
      { src: "/design/svc-impact-banner-2.webp", alt: "A Goalkeep facilitator helping a partner team at a laptop during a working session", position: "50% 35%" },
      { src: "/design/svc-impact-banner-3.webp", alt: "A partner team member in an orange kurta leaning over a table in a workshop", position: "45% 40%" },
      { src: "/design/svc-impact-banner-4.webp", alt: "A Goalkeep facilitator presenting to a partner team seated around laptops", position: "72% 35%" },
    ],
  },
  signs: {
    heading: "Six signs your MEL capabilities <em>might have fallen behind.</em>",
    prompt: 'Tap the ones that seem relatable to you.',
    cta: 'Talk to us about these',
    verdicts: {
      none: { title: 'Nothing tapped yet.', body: 'Tap any note that rings true for you.' },
      few: { title: 'Worth a conversation.', body: 'Small gaps in measurement tend to widen if left unchecked.' },
      many: { title: 'Your framework needs serious attention.', body: 'This is exactly what we’re here to fix. Let’s connect.' },
    },
    signs: [
      { text: "Your Theory of Change no longer reflects how your programmes have evolved.", icon: sign1 },
      { text: "Different programmes or teams use different definitions, indicators or methods for similar outcomes.", icon: sign2 },
      { text: "You collect considerable data but have a hard time getting a coherent organisation-wide picture of impact.", icon: sign3 },
      { text: "Measurement is driven mainly by reporting requirements rather than programme decisions and learning.", icon: sign4 },
      { text: "Leadership, teams or funders need stronger and more consistent evidence of progress.", icon: sign5 },
      { text: "A measurement framework exists on paper but has not been operationalised in everyday work.", icon: sign6 },
    ],
  },
  approach: {
    eyebrow: 'our approach',
    rows: [
      { heading: "Your Theory of Change is our starting point, <em>always.</em>", body: "Before we talk about indicators, tools or dashboards, we sit with your Theory of Change and ask whether it still describes the work your teams do today. Programmes tend to evolve quickly at times, and indicators and measurement frameworks are often left behind in the priority list of things to do. We come in to make sure your systems accurately still reflect your Theory of Change.", photo: { src: "/design/svc-impact-approach-1.webp", alt: "Hands writing on paper around a table during a working session", position: "50% 50%" } },
      { heading: "Then we learn how your teams <em>actually work with data.</em>", body: "We spend time with the people closest to the work, from leadership to programme and field teams, to understand how each one collects data, defines success and reports outcomes. We visit field offices where we can, because for our work, we need to understand how and why data travels through each level in the organization. This shows us where definitions overlap, where they have drifted apart, and what has stood in the way of alignment before.", photo: { src: "/design/svc-impact-approach-2.webp", alt: "A partner team member pointing at sticky notes on a wall during a workshop", position: "50% 40%" } },
      { heading: "We pin down the key questions, <em>then map what to measure.</em>", body: "With leadership and programme teams, we identify the key questions your data needs to answer, from day-to-day programme decisions to conversations with funders. We then map each question to a focused set of indicators, with clear definitions, data sources and collection methods, so you measure what you need and nothing more.", photo: { src: "/design/svc-impact-approach-3.webp", alt: "A Goalkeep facilitator presenting on a screen to a partner team", position: "60% 40%" } },
    ],
  },
  deliverables: {
    heading: "What you leave with <em>at the end of our engagement.</em>",
    items: [
      { label: "A refined programme-level or organisation-level Theory of Change", illustration: theoryOfChange },
      { label: "A prioritised outcome and indicator framework", illustration: indicatorFramework },
      { label: "Guidance on data methods, sampling, frequency and disaggregation", illustration: dataMethods },
      { label: "A diagnostic assessment of current tools and legacy data", illustration: diagnosticAssessment },
      { label: "A reporting framework for communicating learnings and insights", illustration: reportingFramework },
      { label: "A phased roadmap with clear ownership and next steps", illustration: roadmap },
    ],
  },
  duration: {
    eyebrow: 'indicative duration',
    heading: "Typically <em>six to eight weeks.</em>",
    body: "Depending on the number of programs in scope, the stakeholder groups involved, and the maturity of your existing framework.",
    ticks: weekTicks(10),
    spans: [{ from: 6, to: 8, caption: "most engagements land here" }],
    compact: true,
  },
  caseStudy: {
    kind: 'live',
    href: '/case-studies/peepul',
    photo: { src: "/design/adf7e6efd567e8191c6319f6ce9ebe1f.webp", alt: "Peepul and Goalkeep team members working through a dashboard around a table" },
    title: "Peepul",
    body: "Nineteen organisation-level indicators were brought together on a dashboard at Peepul for leadership to effectively monitor and assess organisation-level impact across 8 programs in 2 states.",
    tags: [
      { label: "Education", tone: "blue" },
      { label: "Building organizational impact dashboard", tone: 'teal' },
    ],
  },
  caseRoomy: true,
  contact: {
    heading: "Are you ready to build <em>a measurement framework your team can use?</em>",
    body: "We work with you to measure what matters, map your organisation's ToC to key indicators, and create a data strategy for your organisation that is both practical and effective.",
    ctas: ['Work with us'],
  },
  explore: {
    heading: "Explore our <em>other services.</em>",
    cards: [
      { title: "Data systems and workflows", body: "Build an integrated data system that is easier to use today and strong enough to grow with you. We bring data entry, analysis and insight into one connected system, shaped around your programmes, roles and workflows.", href: '/services/data-systems-and-workflows', cta: 'Explore', tone: 'blue' },
      { title: "Dashboards and reporting", body: "Build dashboards that answer real questions, not simply display available data. We start with what questions you want your data to answer for you, and then build out a system that effectively showcases that.", href: '/services/dashboards-and-reporting', cta: 'Explore', tone: 'coral' },
      { title: "Data adoption and capacity-building", body: "Build a data-confident workforce across your organisation. We conduct trainings and capacity building workshops that impart practical, role-specific learning. The primary goal is to get people to integrate data in their everyday work, so that it becomes a habit rather than a one-off event.", href: '/services/data-adoption-and-capacity-building', cta: 'Explore', tone: 'teal' },
    ],
  },
}
