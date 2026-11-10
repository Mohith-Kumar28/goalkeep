import { weekTicks } from "../../service-page"
import type { ServicePageContent } from "../../service-page"
import architecture from "./architecture.svg?raw"
import diagnostic from "./diagnostic.svg?raw"
import handover from "./handover.svg?raw"
import integratedSystem from "./integrated-system.svg?raw"
import migration from "./migration.svg?raw"
import pipelines from "./pipelines.svg?raw"
import sign1 from "./sign-1.svg?raw"
import sign2 from "./sign-2.svg?raw"
import sign3 from "./sign-3.svg?raw"
import sign4 from "./sign-4.svg?raw"
import sign5 from "./sign-5.svg?raw"
import sign6 from "./sign-6.svg?raw"

export const content: ServicePageContent = {
  slug: "data-systems-and-workflows",
  service: "Data systems and workflows",
  meta: {
    title: "Data systems and workflows | Goalkeep",
    description:
      "Build a data stack that can grow with your organisation. We design cost-effective, fit-for-purpose systems, ETL workflows and reliable pipelines that collect, transform and connect data across tools—providing a strong foundation for unlocking actionable insights.",
  },
  tone: "blue",
  hero: {
    headline:
      'Build an integrated<br class="dc-br-d"> data system <em>that<br class="dc-br-d"> grows with you.</em>',
    lead: "We design and build integrated data systems that bring data entry, analysis and insight into one connected experience, shaped around your organisation's workflows.",
    primary: "Work with us",
    secondary: { label: "Read Apni Shala case study", href: "#case" },
    photos: [
      {
        src: "/design/277f6c1beb347d5810cdc7e70a59ad56.webp",
        alt: "A dashboard open on a laptop during a working session",
      },
      {
        src: "/design/bd7d6d0349cff3dd797ec319912bbbf5.webp",
        alt: "A Goalkeep team member talking through a framework in a working session",
      },
      {
        src: "/design/d9f25a2c090890697a8d9bf1806f663d.webp",
        alt: "A Goalkeep working session on the floor of a partner office",
      },
      {
        src: "/design/02adf370ce68ad12d02aaf2eb57276c3.webp",
        alt: "Goalkeep with a partner team after a workshop",
      },
    ],
  },
  signs: {
    heading: "Six signs your data system <em>might be holding you back.</em>",
    prompt: "Tap the ones that seem relatable to you.",
    cta: "Talk to us about these",
    verdicts: {
      none: {
        title: "Nothing tapped yet.",
        body: "Tap any note that rings true for you.",
      },
      few: {
        title: "Worth a conversation.",
        body: "Small gaps in your data system tend to widen if left unchecked.",
      },
      many: {
        title: "Your data system needs serious attention.",
        body: "This is exactly what we’re here to fix. Let’s connect.",
      },
    },
    signs: [
      {
        text: "Programme data is scattered across sheets, forms, folders and platforms.",
        icon: sign1,
      },
      {
        text: "Teams enter the same information more than once or manually combine it for every report.",
        icon: sign2,
      },
      {
        text: "Definitions, formats and calculations vary between programmes or locations.",
        icon: sign3,
      },
      {
        text: "Existing systems are slow, expensive, difficult to maintain or no longer fit your scale.",
        icon: sign4,
      },
      {
        text: "Essential system knowledge sits with one founder, MEL lead or technical team member.",
        icon: sign5,
      },
      {
        text: "Current tools cannot reliably support new programmes, locations, users or reporting needs.",
        icon: sign6,
      },
    ],
  },
  approach: {
    eyebrow: "our approach",
    rows: [
      {
        heading: "We start by mapping how your data <em>actually moves.</em>",
        body: "Before designing anything, we trace how information travels through your organisation today: who collects it, where it is stored, how it is cleaned and combined, and where it gets stuck. The result is a clear picture of your current data flows, bottlenecks and risks, so that we know the exact leakages in your system that need to be plugged.",
        photo: {
          src: "/design/26485cf520f6e178ab4bc2838551ca79.webp",
          alt: "A Goalkeep working session on the floor of a partner office",
        },
      },
      {
        heading:
          "Then we design and build <em>one connected, AI-integrated data system.</em>",
        body: "We design the architecture and data model around your programmes, terminology, and workflows, then build it to make sure data entry, storage, analysis and insight are all in one place. We favour an open-source stack, such as PostgreSQL or Supabase with GitHub and Vercel, but can work with whatever platform your organization is currently supported by.",
        photo: {
          src: "/design/46fd758db6cd80183d9d4f676d744baa.webp",
          alt: "Two partner team members working through data on a laptop",
        },
        actions: [
          {
            kind: "link",
            label: "Early-stage nonprofit? Explore Kickstarter 3.0",
            href: "/programs/kickstarter",
          },
        ],
      },
      {
        heading: "We stay until your team <em>owns the system.</em>",
        body: "A system creates value only when people use it. We test it with your users, migrate the historical data you need, train your team across levels, and set up data processes that are easy for you to adopt. We support you through documentation, maintenance support and a structured handover until your team is comfortable using the system.",
        photo: {
          src: "/design/28cd94a8513259340d1af6f7fc304ad1.webp",
          alt: "A Goalkeep training session with a partner team",
        },
      },
    ],
  },
  deliverables: {
    heading: "What you leave with <em>at the end of our engagement.</em>",
    items: [
      {
        label:
          "A diagnostic of your current data flows, tools, bottlenecks and risks",
        illustration: diagnostic,
      },
      {
        label: "A system architecture, data model and implementation roadmap",
        illustration: architecture,
      },
      {
        label: "One integrated system, from data entry to analysis and insight",
        illustration: integratedSystem,
      },
      {
        label:
          "A connected database with ETL processes and automated pipelines",
        illustration: pipelines,
      },
      {
        label:
          "Historical data migrated, with validation, access controls and audits",
        illustration: migration,
      },
      {
        label:
          "Training, documentation, maintenance support and a structured handover",
        illustration: handover,
      },
    ],
  },
  duration: {
    eyebrow: "indicative duration",
    heading: "Typically <em>six to twelve weeks.</em>",
    body: "For discovery, design and an initial build, depending on data complexity, migration requirements, integrations and the number of user workflows. An agreed maintenance and adoption period follows, depending on the complexity of the system.",
    ticks: weekTicks(14),
    spans: [
      {
        from: 5,
        to: 12,
        caption: "discovery, design and initial build",
        trail: "then maintenance and adoption",
      },
    ],
  },
  caseStudy: {
    kind: "live",
    href: "/case-studies",
    photo: {
      src: "/design/64c1c9c5b1e6936ba238b50ada299bd3.webp",
      alt: "The Apni Shala Foundation team standing together in their office",
    },
    title: "Apni Shala Foundation",
    body: "A handful of hero metrics on the weekly dashboard helped Apni Shala quickly identify student learning gaps that used to surface only at year-end previously.",
    tags: [
      { label: "Education", tone: "gold" },
      { label: "Identifying key metrics", tone: "blue" },
    ],
  },
  caseQuote: {
    text: "We end up capturing a lot of data, but it’s the first time we’ve stepped back to think of what are the key findings we really want our data to shed light on as an organisation. We are now at a place to be making less emotional, and more data-driven decisions.”",
    name: "Sangeeta Zombade",
    org: "Apni Shala Foundation",
    avatar: {
      src: "/design/c5dffd934cc128e6b99a13c2284dd7ae.webp",
      alt: "Sangeeta Zombade",
    },
  },
  contact: {
    heading:
      "Ready to build a data system <em>around how your organisation actually works?</em>",
    body: "We work with you to streamline your data system, design a workflow that fits how your organisation operates, and set up data processes that scale along with you.",
    ctas: ["Work with us"],
  },
  explore: {
    heading: "Explore our <em>other services.</em>",
    cards: [
      {
        title: "Impact and measurement strategy",
        body: "Turn your Theory of Change into a measurement framework your organisation can use. We clarify the outcomes that matter, the questions your data needs to answer, and put in place the strategy you need to make that happen.",
        href: "/services/impact-and-measurement-strategy",
        cta: "Explore",
        tone: "gold",
      },
      {
        title: "Dashboards and reporting",
        body: "Build dashboards that answer real questions, not simply display available data. We start with what questions you want your data to answer for you, and then build out a system that effectively showcases that.",
        href: "/services/dashboards-and-reporting",
        cta: "Explore",
        tone: "coral",
      },
      {
        title: "Data adoption and capacity-building",
        body: "Build a data-confident workforce across your organisation. We conduct trainings and capacity building workshops that impart practical, role-specific learning. The primary goal is to get people to integrate data in their everyday work, so that it becomes a habit rather than a one-off event.",
        href: "/services/data-adoption-and-capacity-building",
        cta: "Explore",
        tone: "teal",
      },
    ],
  },
}
