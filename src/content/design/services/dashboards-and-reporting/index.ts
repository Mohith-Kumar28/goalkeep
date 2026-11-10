import { monthTicks } from "../../service-page"
import type { ServicePageContent } from "../../service-page"
import filters from "./filters.svg?raw"
import fnContribution from "./fn-contribution.svg?raw"
import fnDecisions from "./fn-decisions.svg?raw"
import fnDefinitions from "./fn-definitions.svg?raw"
import fnFramework from "./fn-framework.svg?raw"
import fnPortfolio from "./fn-portfolio.svg?raw"
import fnRecord from "./fn-record.svg?raw"
import handover from "./handover.svg?raw"
import onboarding from "./onboarding.svg?raw"
import recurringReports from "./recurring-reports.svg?raw"
import reviewRoutines from "./review-routines.svg?raw"
import roleViews from "./role-views.svg?raw"
import sign1 from "./sign-1.svg?raw"
import sign2 from "./sign-2.svg?raw"
import sign3 from "./sign-3.svg?raw"
import sign4 from "./sign-4.svg?raw"
import sign5 from "./sign-5.svg?raw"
import sign6 from "./sign-6.svg?raw"
import funderSign1 from "./funder-sign-1.svg?raw"
import funderSign2 from "./funder-sign-2.svg?raw"
import funderSign3 from "./funder-sign-3.svg?raw"
import funderSign4 from "./funder-sign-4.svg?raw"
import funderSign5 from "./funder-sign-5.svg?raw"
import funderSign6 from "./funder-sign-6.svg?raw"

export const content: ServicePageContent = {
  slug: "dashboards-and-reporting",
  service: "Dashboards and reporting",
  meta: {
    title: "Dashboards and reporting | Goalkeep",
    description:
      "Design dashboards around the questions each team member needs answered. We translate role-specific decisions into clear views and reports, so leaders, programme teams and MEL staff see what matters—not endless charts and countless metrics.",
  },
  tone: "coral",
  hero: {
    headline:
      'Dashboards that enable<br class="dc-br-d"> better decisions, <em>not just<br class="dc-br-d"> display data.</em>',
    lead: "We design dashboards and reporting views for both nonprofits and funders. We start with what questions you want your data to answer for you, and then build out a system that effectively showcases that.",
    primary: "Work with us",
    secondary: { label: "See a case study", href: "#case" },
    tightActions: true,
    photos: [
      {
        src: "/design/6616bb19d578b4407abaff9cbb89cc4b.webp",
        alt: "A participant presenting during a data literacy session",
      },
      {
        src: "/design/d7e0a2f562f148853d7f839e7a34590d.webp",
        alt: "Goalkeep with a partner team after a workshop",
      },
      {
        src: "/design/a0ab5315386fbadd8443b0eaa8ffab2d.webp",
        alt: "Affinity mapping on coloured boards during a Goalkeep design workshop",
      },
      {
        src: "/design/46fd758db6cd80183d9d4f676d744baa.webp",
        alt: "Two partner team members working through data on a laptop",
      },
    ],
  },
  audiences: {
    nonprofit: {
      label: "Nonprofits",
      sub: "running programmes",
      tag: "For nonprofits",
    },
    funder: {
      label: "Funders",
      sub: "supporting a portfolio",
      tag: "For funders",
      signs: {
        heading:
          "Six signs your portfolio reporting <em>needs strengthening.</em>",
        items: [
          {
            text: "Information around grant applications is spread across reports, spreadsheets, and e-mails.",
            icon: funderSign1,
          },
          {
            text: "Grantees use different indicators and definitions, so building a consolidated portfolio evaluation system is a struggle.",
            icon: funderSign2,
          },
          {
            text: "Leadership and boards need a portfolio overview that keeps the context of individual organisations.",
            icon: funderSign3,
          },
          {
            text: "Non-financial support, such as capacity building and introductions, goes untracked alongside the grant.",
            icon: funderSign4,
          },
          {
            text: "Risks and opportunities for support surface too late to inform reviews, renewals or resource allocation.",
            icon: funderSign5,
          },
          {
            text: "You have evidence across your portfolio but find it hard to tell a clear, credible impact story.",
            icon: funderSign6,
          },
        ],
      },
      deliverables: [
        {
          label:
            "A portfolio measurement framework linked to your funding priorities",
          illustration: fnFramework,
        },
        {
          label:
            "Clear indicator definitions that allow for evaluation between grantees",
          illustration: fnDefinitions,
        },
        {
          label:
            "A structured record of grants, milestones, support provided and outcomes generated",
          illustration: fnRecord,
        },
        {
          label:
            "Portfolio dashboards that drill down from the aggregate to each grantee",
          illustration: fnPortfolio,
        },
        {
          label:
            "Decision-ready information for reviews, renewals and resource allocation",
          illustration: fnDecisions,
        },
        {
          label:
            "A clearer account of how you have contributed to grantee progress",
          illustration: fnContribution,
        },
      ],
      caseStudy: {
        kind: "soon",
        tone: "coral",
        title: "BAT",
        body: "Portfolio reporting case study to be added.",
        tags: [
          { label: "Funder", tone: "blue" },
          { label: "Case study in progress", tone: "coral" },
        ],
      },
      caseQuote: {
        text: "Most organizations need to shift their focus to learning rather than just monitoring. That’s the biggest change for us, and we hope to see that shift in the rest of the social sector as well.”",
        name: "Rutuja Chaphekar",
        org: "Forbes Marshall",
        avatar: {
          src: "/design/7d0c74b9e4b95e5d1d0d2b09698df14e.webp",
          alt: "Rutuja Chaphekar",
        },
      },
      contact: {
        heading:
          "Ready to communicate portfolio-wide impact <em>with clarity?</em>",
        body: "Design dashboards that make it easy to track progress and impact across your portfolio.",
      },
    },
  },
  signs: {
    heading: "Six signs your dashboards <em>might not be doing their job.</em>",
    prompt: "Tap the ones that seem relatable to you.",
    cta: "Talk to us about these",
    verdicts: {
      none: {
        title: "Nothing tapped yet.",
        body: "Tap any note that rings true for you.",
      },
      few: {
        title: "Worth a conversation.",
        body: "Small gaps in reporting tend to widen if left unchecked.",
      },
      many: {
        title: "Your reporting needs serious attention.",
        body: "This is exactly what we’re here to fix. Let’s connect.",
      },
    },
    signs: [
      {
        text: "Dashboards or reports exist, but people rarely use them.",
        icon: sign1,
      },
      {
        text: "Leadership, programme teams, MEL staff and funders need different levels of information.",
        icon: sign2,
      },
      {
        text: "Leadership lacks a reliable organisation-wide view, while programme teams depend on MEL for routine answers.",
        icon: sign3,
      },
      {
        text: "Reports take too long to prepare and still raise repeated questions about definitions or accuracy.",
        icon: sign4,
      },
      {
        text: "Numbers are displayed without a clear link to the decisions or actions they should inform.",
        icon: sign5,
      },
      {
        text: "The organisation finds it difficult to communicate progress and impact clearly.",
        icon: sign6,
      },
    ],
  },
  approach: {
    eyebrow: "our approach",
    rows: [
      {
        heading: "We start with the questions, <em>not the charts.</em>",
        body: "Many dashboards fail because they begin with whatever data happens to be available. We begin with what leadership, programme teams, MEL staff or funders need to understand, decide and do, and design every view around those questions.",
        photo: {
          src: "/design/bd7d6d0349cff3dd797ec319912bbbf5.webp",
          alt: "A Goalkeep team member talking through a framework in a working session",
        },
      },
      {
        heading: "We fix the foundations <em>underneath the dashboard.</em>",
        body: "A dashboard is only as trustworthy as the definitions, data sources and pipelines behind it. If the measurement framework or underlying data system is not reliable, we address those foundations as part of the engagement.",
        photo: {
          src: "/design/277f6c1beb347d5810cdc7e70a59ad56.webp",
          alt: "A dashboard open on a laptop during a working session",
        },
      },
      {
        heading: "We build for each role, <em>then help people use it.</em>",
        body: "Every role gets the dashboard view they need, with useful filters and drill-downs, and recurring reports are automated or simplified. We teach you how to onboard the people who will use the dashboard in the future and set up data-review routines that connect insight to action.",
        photo: {
          src: "/design/aba7e84d5587ede519db33fd05ffa819.webp",
          alt: "A facilitator presenting a dashboard on screen to a partner team",
        },
      },
    ],
  },
  deliverables: {
    heading: "What you leave with <em>at the end of our engagement.</em>",
    items: [
      {
        label: "Role-specific dashboards and reporting views",
        illustration: roleViews,
      },
      {
        label: "Useful filters by programme, location, group or time period",
        illustration: filters,
      },
      {
        label: "Automated or simplified recurring reports",
        illustration: recurringReports,
      },
      {
        label: "Onboarding and training for the people who use the dashboard",
        illustration: onboarding,
      },
      {
        label:
          "Data-review templates and routines that connect insight to action",
        illustration: reviewRoutines,
      },
      {
        label: "Documentation, maintenance support and a structured handover",
        illustration: handover,
      },
    ],
  },
  duration: {
    eyebrow: "indicative duration",
    heading: "Typically <em>3 to 4 months.</em>",
    body: "For dashboard design, build and testing within a wider measurement or data-systems engagement, depending on how ready the underlying data is and the number of user groups and views. An agreed maintenance and adoption period follows.",
    ticks: monthTicks(6),
    spans: [{ from: 2, to: 4, caption: "most engagements land here" }],
  },
  caseStudy: {
    kind: "soon",
    tone: "coral",
    title: "Vanavil Trust",
    body: "Using timely information to identify and re-engage children who had dropped out.",
    tags: [
      { label: "Education", tone: "blue" },
      { label: "Case study in progress", tone: "coral" },
    ],
  },
  contact: {
    heading:
      "Ready to turn your data <em>into answers your team can act on?</em>",
    body: "Design dashboards and reporting systems that are intuitive, insightful and easy to work with.",
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
        title: "Data systems and workflows",
        body: "Build an integrated data system that is easier to use today and strong enough to grow with you. We bring data entry, analysis and insight into one connected system, shaped around your programmes, roles and workflows.",
        href: "/services/data-systems-and-workflows",
        cta: "Explore",
        tone: "blue",
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
