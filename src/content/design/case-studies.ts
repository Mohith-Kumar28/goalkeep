import type { Tone } from '@/components/design/tones'

export type CaseStudySlug = 'peepul' | 'british-asian-trust' | 'vanavil' | 'baithak'

export type Sector = 'edu' | 'health' | 'cp' | 'liv' | 'arts'
export type Audience = 'np' | 'fund' | 'eco'

/** Filter chips and tags share these tables, so a label cannot drift between the two. */
export const sectors: Record<Sector, { label: string; tone: Tone }> = {
  edu: { label: 'Education', tone: 'gold' },
  health: { label: 'Health', tone: 'teal' },
  cp: { label: 'Child protection', tone: 'coral' },
  liv: { label: 'Livelihoods', tone: 'blue' },
  arts: { label: 'Arts', tone: 'teal' },
}

export const audiences: Record<Audience, { chip: string; tag: string }> = {
  np: { chip: 'Nonprofits', tag: 'Nonprofit' },
  fund: { chip: 'Funders', tag: 'Funder' },
  eco: { chip: 'Ecosystem partners', tag: 'Ecosystem partner' },
}

export type Photo = {
  src: string
  alt: string
  /** CSS object-position; the design crops most photos at "50% 50%". */
  position?: string
}

export type Bullet = {
  /** Bold lead-in. Only some studies use it. */
  lead?: string
  text: string
}

export type ApproachStep = {
  title: string
  body: string
  /** A step awaiting its photo shows its text alone until the photo arrives. */
  image: ({ kind: 'photo' } & Photo) | { kind: 'placeholder'; label: string }
}

export type OutcomeCard = {
  tone: Exclude<Tone, 'coral'>
  title: string
  items: Array<string>
}

export type Testimonial = {
  quote: string
  name: string
  role: string
  photo: Photo
  /** Quote font size in px: the design sets long quotes smaller. */
  size: 23 | 26
  /** Gives the photo the wider column. */
  wide?: boolean
}

export type CaseStudy = {
  slug: CaseStudySlug
  org: string
  sectorTags: Array<Sector>
  audience: Audience
  service: string
  /** The listing card, and the "More case studies" cards on each study. */
  card: {
    title: string
    summary: string
    /** Shorter text for phones; when set it replaces `summary` under 760px. */
    mobileSummary?: string
    stat: { label: string; value: string }
    /** A study with no photo yet shows its stat on the card instead. */
    cover: ({ kind: 'photo' } & Photo) | { kind: 'stat' }
  }
  readTime: number
  /** `em` is the italic run at the end of the h1. */
  headline: { lead: string; em: string }
  intro: string
  /** A stat card stands in for the photo, and shows `card.stat`. */
  hero: ({ kind: 'photo' } & Photo) | { kind: 'stat' }
  background: {
    aside: ({ kind: 'photo'; quote: string; darker?: boolean } & Photo) | { kind: 'panel'; quote: string }
    paragraphs: Array<string>
    points: Array<Bullet>
  }
  steps: Array<ApproachStep>
  outcomes: { lead: string; cards: Array<OutcomeCard> }
  reinforced: Array<string>
  testimonial?: Testimonial
}

export const caseStudies: Array<CaseStudy> = [
  {
    slug: 'peepul',
    org: 'Peepul',
    sectorTags: ['edu'],
    audience: 'np',
    service: 'Impact and measurement strategy',
    card: {
      title: 'One shared MEL framework across Peepul’s 8 programmes',
      summary:
        'Common definitions, organisation-level indicators and a leadership dashboard brought eight programmes in two states into one picture.',
      stat: {
        value: '19',
        label: 'organisation-level indicators agreed across 8 programmes',
      },
      cover: {
        kind: 'photo',
        src: '/design/peepul-cover.webp',
        alt: 'Peepul and Goalkeep team members working through a dashboard around a table',
        position: '50% 50%',
      },
    },
    readTime: 4,
    headline: {
      lead: 'How a shared MEL framework across 8 programmes helped Peepul',
      em: 'assess organisation-wide impact',
    },
    intro:
      'As Peepul expanded across eight programmes in two states, every programme could explain its own work, but bringing those stories together into one organisation-level picture of impact had become difficult. Goalkeep worked with the leadership team to turn their Theory of Change into a shared measurement framework and a leadership dashboard.',
    hero: {
      kind: 'photo',
      src: '/design/peepul-cover.webp',
      alt: 'Peepul and Goalkeep team members working through a dashboard around a table',
      position: '50% 50%',
    },
    background: {
      aside: {
        kind: 'photo',
        src: '/design/peepul-background.webp',
        alt: 'A Goalkeep team member talking a Peepul colleague through a dashboard',
        position: '50% 35%',
        quote:
          'The challenge wasn’t a lack of data. It was creating a shared organisational language without losing what each programme had built.',
      },
      paragraphs: [
        'Peepul partners with state governments to transform learning in public schools, by making classrooms more engaging and strengthening the systems that support teachers and schools.',
        'As the organisation grew, leadership began facing a different challenge. While individual programmes could clearly communicate their own work and outcomes, it had become increasingly difficult to bring those stories together into one organisation-level picture of impact. This created practical challenges for the organisation:',
      ],
      points: [
        {
          text: 'Similar concepts were being defined differently across programmes.',
        },
        {
          text: 'Programme dashboards and evaluation studies provided valuable insights individually, but could not easily be brought together into an organisation-level view.',
        },
        {
          text: 'Leadership found it difficult to consistently communicate Peepul’s overall impact to governments, funders and other stakeholders.',
        },
      ],
    },
    steps: [
      {
        title: '1. Building Deep Context Across All Eight Programmes',
        body: 'We visited all eight programmes and spoke with nearly twenty stakeholders across leadership and programme teams. Previous attempts at alignment had stalled because programme teams questioned the value of standardising an impact framework, so we needed to see first-hand how different teams were collecting data and reporting their outcomes.',
        image: {
          kind: 'photo',
          src: '/design/peepul-approach-1.webp',
          alt: 'A Peepul team member at a whiteboard with colleagues during a programme discussion',
          position: '50% 50%',
        },
      },
      {
        title: '2. Finding Common Ground Across Peepul’s Theory of Change',
        body: 'That context became the foundation for the shared framework we set out to develop. Across four leadership workshops, we mapped Peepul’s Theory of Change to a shared set of organisation-level indicators. This meant helping leadership make some hard calls: which indicators should be common across every programme, which should stay at programme level without rolling up, and how to settle cases where two programmes defined the same concept differently. The aim was to find the foundational thread that already ran through every programme, and give it common definitions the whole organisation could stand behind.',
        image: {
          kind: 'photo',
          src: '/design/peepul-approach-2.webp',
          alt: 'Peepul and Goalkeep team members gathered around a laptop and a dashboard on screen',
          position: '50% 50%',
        },
      },
      {
        title: '3. Giving Leadership One Integrated Picture of the Organisation',
        body: 'Before any development began, we put dashboard mockups in front of the leadership team, including a view mapping Peepul’s Theory of Change to organisation-level scorecards. For the first time, everyone was reacting to the same picture of Peepul. Definitions, indicators and dashboard views were then refined over several rounds to arrive at the final system, which gives leadership an organisation-wide view of impact.',
        image: {
          kind: 'photo',
          src: '/design/peepul-approach-3.webp',
          alt: 'A Peepul team member explaining the leadership dashboard shown on a wall screen',
          position: '50% 50%',
        },
      },
    ],
    outcomes: {
      lead: 'By the end of the engagement, Peepul had developed:',
      cards: [
        {
          tone: 'blue',
          title: 'One shared language for impact',
          items: [
            '19 organisation-level indicators agreed across all 8 programmes',
            'Common definitions set for core concepts, including student learning outcomes and classroom engagement',
            'Programme-level flexibility retained, with each programme’s measures also mapped to the shared framework',
          ],
        },
        {
          tone: 'teal',
          title: 'A single view of organisational impact for leadership',
          items: [
            'A leadership dashboard live with 7 integrated views, all mapped to Peepul’s Theory of Change',
            'Organisation-level indicators connected to existing programme data, with no new data collection burden on teams',
            'Data gaps made visible to leadership, with indicators that lack data flagged as “Data NA” for follow-up',
          ],
        },
        {
          tone: 'gold',
          title: 'Future growth anchored in a shared purpose',
          items: [
            'Foundational literacy and numeracy (FLN) confirmed as the centre of expansion into new geographies',
            'Programmes continue adapting to local contexts while contributing to one organisational outcome',
          ],
        },
      ],
    },
    reinforced: [
      'For organisations working across multiple programmes, complexity is often a sign of growth rather than a sign that systems are failing. Individual programmes naturally evolve to respond to different contexts, which makes organisation-wide alignment progressively more challenging.',
      'This project reinforced that effective impact measurement begins with creating enough organisational clarity to decide what should remain common across every programme. Once those conversations happen, designing indicators, dashboards and reporting systems becomes a much more straightforward exercise.',
    ],
    testimonial: {
      quote:
        'Actually having the data to bring you down to what are the core elements of your program that will really drive impact, I think that is what was super helpful for us.',
      name: 'Kruti Bharucha',
      role: 'CEO, Peepul',
      photo: {
        src: '/design/96f200edd011068c9f8fa31ab54f6103.webp',
        alt: 'Kruti Bharucha, CEO of Peepul, speaking in an interview',
        position: '50% 18%',
      },
      size: 26,
    },
  },
  {
    slug: 'british-asian-trust',
    org: 'British Asian Trust',
    sectorTags: ['cp'],
    audience: 'fund',
    service: 'Data adoption and capacity-building',
    card: {
      title: 'A stronger, evidence-led story for 16 KAWACH partners',
      summary:
        'Nearly 70 people from partner organisations and the KAWACH team turned local evidence into prioritised insights for the annual report.',
      stat: {
        value: '92%',
        label: 'of participants said they learnt something new',
      },
      cover: {
        kind: 'photo',
        src: '/design/bat-cover.webp',
        alt: 'KAWACH partner organisations and Goalkeep gathered in a workshop discussion',
        position: '50% 50%',
      },
    },
    readTime: 4,
    headline: {
      lead: 'How a three-day data literacy workshop helped BAT',
      em: 'build a stronger impact narrative',
    },
    intro:
      'KAWACH, a British Asian Trust programme, works through 16 partner organisations across 12 districts in four states to strengthen child protection systems in India. Its partners held rich evidence, but bringing it together into one clear, representative narrative was a recurring challenge at annual reporting time. Goalkeep designed a three-day workshop for nearly 70 participants that turned local evidence into prioritised insights for district, state and annual programme reports.',
    hero: {
      kind: 'photo',
      src: '/design/bat-cover.webp',
      alt: 'KAWACH partner organisations and Goalkeep gathered in a workshop discussion',
      position: '50% 50%',
    },
    background: {
      aside: {
        kind: 'photo',
        src: '/design/bat-background.webp',
        alt: 'A Goalkeep facilitator speaking with KAWACH workshop participants around a table',
        position: '50% 40%',
        quote:
          'The visible reporting difficulties were symptoms of deeper issues in how data was gathered, interpreted and discussed across the programme.',
      },
      paragraphs: [
        'KAWACH is a decade-long British Asian Trust programme that works through 16 partner organisations across 12 districts in four states to strengthen child protection systems and create safer environments for children.',
        'Its leadership relies on quantitative and qualitative data from these partners to understand how the work is progressing and to report on it at district, state and programme level. Each year, annual reporting brought a wider challenge into focus: KAWACH had a wealth of evidence across its partner network, but no simple way to turn it into one coherent picture of progress, learning and impact.',
      ],
      points: [
        {
          lead: 'Fragmented data and reporting processes:',
          text: 'partners generated valuable evidence in different contexts and formats, which made it difficult to identify common patterns or build a representative, programme-wide narrative.',
        },
        {
          lead: 'A compliance-led reporting mindset:',
          text: 'reporting risked becoming an exercise in submitting as much information as possible, rather than using data transparently to learn and to communicate what was and wasn’t working.',
        },
        {
          lead: 'Uneven confidence and power dynamics:',
          text: 'implementing partners were closest to the work, but did not always have the skills, confidence or space to analyse their evidence and share challenges openly with programme leadership.',
        },
      ],
    },
    steps: [
      {
        title: '1. Introducing the MAP Framework',
        body: 'Nearly 70 participants from partner organisations and KAWACH’s programme and leadership teams came together in Bengaluru. We introduced the MAP framework: craft a Message for your audience, Amplify the priorities that matter most and Prove each claim with clear evidence. Everyday exercises and a custom quiz in the style of Kaun Banega Crorepati made the ideas stick, with programme staff and partners taking part on equal terms.',
        image: {
          kind: 'photo',
          src: '/design/bat-approach-1.webp',
          alt: 'Workshop participants standing and discussing around a table with sticky notes on the wall',
          position: '50% 50%',
        },
      },
      {
        title: '2. Applying MAP to KAWACH’s Evidence',
        body: 'Participants then worked in district groups on priority programme indicators, combining individual reflection with structured discussion of achievements, challenges, lessons and next steps. A KAWACH team member facilitated each table and documented the evidence in a shared digital template, making sure every participant had space to contribute.',
        image: {
          kind: 'photo',
          src: '/design/bat-approach-2.webp',
          alt: 'Workshop participants seated in groups working through evidence on paper',
          position: '50% 50%',
        },
      },
      {
        title: '3. Refining and Streamlining the Findings',
        body: 'Groups reviewed their inputs to find the most important messages and test whether each claim was backed by quantitative or qualitative evidence. By the middle of the second day, participants were pushing one another for clearer evidence, while facilitators balanced progress with making sure every perspective was heard.',
        image: {
          kind: 'photo',
          src: '/design/bat-approach-3.webp',
          alt: 'Workshop participants gathered around a table reviewing their findings',
          position: '50% 50%',
        },
      },
    ],
    outcomes: {
      lead: 'By the end of the workshop, KAWACH had:',
      cards: [
        {
          tone: 'blue',
          title: 'A sharper, more representative narrative',
          items: [
            'Evidence from almost all districts, organised around priority indicators',
            'Inputs that went on to inform district, state and annual programme reports',
          ],
        },
        {
          tone: 'teal',
          title: 'Stronger data literacy and ownership',
          items: [
            'Partners practised choosing messages, prioritising information and backing claims with evidence',
            '92% of participants said they learnt something new, and 72% would recommend similar workshops',
          ],
        },
        {
          tone: 'gold',
          title: 'Reporting as shared learning',
          items: [
            'Reporting began to shift from a compliance exercise to collective sense-making',
            'More space for partners to share both progress and difficulties honestly',
          ],
        },
      ],
    },
    reinforced: [
      'For intermediaries, funders and NGO networks working through multiple partners, data capacity building can do more than improve a report. When partners have a clear method, practical tools and a safe space to interpret evidence together, reporting can become a source of learning, alignment and stronger collaboration.',
      'The KAWACH engagement reinforced that a strong impact narrative is not created by collecting the greatest possible volume of information. It emerges when organisations build the confidence and discipline to decide what matters, surface different perspectives and support their claims with evidence.',
    ],
  },
  {
    slug: 'vanavil',
    org: 'Vanavil Trust',
    sectorTags: ['liv', 'edu'],
    audience: 'np',
    service: 'Kickstarter Program',
    card: {
      title: 'From attendance data to assessing learning at Vanavil',
      summary:
        'Teachers agreed on common competencies and a simpler assessment process, and a dashboard now compares learning across grades and terms.',
      stat: {
        value: '2',
        label: 'data-entry sheets per teacher, instead of many scattered ones',
      },
      cover: {
        kind: 'photo',
        src: '/design/vanavil-cover.webp',
        alt: 'A Vanavil team member leading a session with teachers in the courtyard',
        position: '50% 50%',
      },
    },
    readTime: 3,
    headline: {
      lead: 'How streamlining assessments helped Vanavil Trust',
      em: 'compare learning across grades and terms',
    },
    intro:
      'Vanavil Trust had already used attendance data from an earlier Goalkeep engagement to bring children who had dropped out back to school. The next question was whether its assessment data could become just as actionable. Goalkeep worked with Vanavil’s teachers to agree on common competencies, streamline how they assess and build a dashboard that compares learning across grades, subjects and terms.',
    hero: {
      kind: 'photo',
      src: '/design/vanavil-cover.webp',
      alt: 'A Vanavil team member leading a session with teachers in the courtyard',
      position: '50% 50%',
    },
    background: {
      aside: {
        kind: 'photo',
        src: '/design/vanavil-background.webp',
        alt: 'Vanavil teachers looking at a tablet together',
        position: '50% 30%',
        quote: 'If we collect this information, what action will it help us take?',
        darker: true,
      },
      paragraphs: [
        'Vanavil Trust began in Nagapattinam, Tamil Nadu, in the aftermath of the 2004 tsunami, and today runs a residential school, children’s homes and after-school centres that support hundreds of children through education, nutrition, child protection and livelihood initiatives.',
        'An earlier Goalkeep engagement had given Vanavil a simple system to monitor attendance, and with native-language training the team grew confident using that data, which helped bring three children who had dropped out back to school. That raised a new question: if attendance data could become actionable, could assessment data too? Vanavil already had a rich assessment process, but it came with its own challenges:',
      ],
      points: [
        {
          text: 'Information sat across multiple sheets and formats, which made it difficult to compare, analyse and turn into action.',
        },
        {
          text: 'Activities changed from term to term and every teacher documented children’s progress in their own way, so learning was hard to compare across grades and terms.',
        },
        {
          text: 'Teachers’ time with children came first, and there was a genuine concern that standardising assessments would take away their flexibility to adapt activities.',
        },
      ],
    },
    steps: [
      {
        title: '1. Asking What the Data Should Answer',
        body: 'Through focus group discussions and interviews with teachers and programme leaders, we drafted the high-priority questions the data needed to answer. Every data point was held to one test that we kept returning to: if we collect this information, what action will it help us take?',
        image: {
          kind: 'photo',
          src: '/design/vanavil-approach-1.webp',
          alt: 'Vanavil teachers and staff gathered in the courtyard for a discussion',
          position: '50% 50%',
        },
      },
      {
        title: '2. Agreeing on Common Competencies',
        body: 'Teachers revised their assessment sheets together, removed repetitive activities and aligned around a common set of competencies. We then streamlined attendance and assessments into two data-entry sheets per teacher, while keeping the flexibility to change activities from one term to the next.',
        image: {
          kind: 'photo',
          src: '/design/vanavil-approach-2.webp',
          alt: 'Vanavil teachers filling in assessment sheets',
          position: '50% 50%',
        },
      },
      {
        title: '3. Making the Dashboard Feel Familiar',
        body: 'The dashboard that emerged compares learning across grades, subjects and terms, alongside nutrition indicators such as children at risk of malnutrition. During orientation and data-entry training, teachers who had first felt overwhelmed grew comfortable navigating it, because it reflected work they already understood.',
        image: {
          kind: 'photo',
          src: '/design/vanavil-approach-3.webp',
          alt: 'A Vanavil teacher pointing out results on a wall screen',
          position: '50% 50%',
        },
      },
    ],
    outcomes: {
      lead: 'By the end of the engagement, Vanavil had:',
      cards: [
        {
          tone: 'blue',
          title: 'A simpler way to assess',
          items: [
            'Two data-entry sheets per teacher, instead of many scattered ones',
            'A common set of competencies agreed by teachers, with repetitive activities removed',
          ],
        },
        {
          tone: 'teal',
          title: 'One view of every child’s learning',
          items: [
            'A dashboard comparing learning across grades, subjects and terms',
            'Nutrition indicators, such as children at risk of malnutrition, tracked alongside academic progress',
          ],
        },
        {
          tone: 'gold',
          title: 'A new habit of asking why',
          items: [
            'Assessment conversations shifted from what data to collect to what will help the team decide better',
            'Early conversations on bringing socio-emotional learning into a structured assessment framework',
          ],
        },
      ],
    },
    reinforced: [
      'Many small nonprofits assume that an impact monitoring system needs complex software, dedicated data teams or deep technical expertise. Vanavil’s journey shows otherwise: once teachers saw that the dashboard reflected work they already understood, it stopped feeling intimidating.',
      'The most important step wasn’t choosing the right software or collecting more data, but agreeing on what mattered enough to measure. In the end, this project wasn’t about helping Vanavil measure more. It was about helping them decide what was truly worth measuring.',
    ],
    testimonial: {
      quote:
        'We can now spot issues as they happen, not months later. The fact that Goalkeep made us think about this is itself valuable.',
      name: 'Revathi Radhakrishnan',
      role: 'Founder and Director, Vanavil Trust',
      photo: {
        src: '/design/8a398dc9df1bc9bde12e5bf01d5c8fcf.webp',
        alt: 'Revathi Radhakrishnan, Founder and Director of Vanavil Trust',
        position: '70% 40%',
      },
      size: 26,
    },
  },
  {
    slug: 'baithak',
    org: 'Baithak Foundation',
    sectorTags: ['arts', 'edu'],
    audience: 'np',
    service: 'Data systems and workflows',
    card: {
      title: 'Making the impact of arts education visible at Baithak',
      summary:
        'A shared view of reach and depth across 137 schools now anchors Baithak’s monthly reviews and its conversations with funders.',
      stat: {
        value: '137',
        label: 'schools and centres in one shared view',
      },
      cover: {
        kind: 'photo',
        src: '/design/8625ca604ea24fa43d1fd299a4c5afea.webp',
        alt: 'Baithak Foundation and Goalkeep at work',
        position: '50% 35%',
      },
    },
    readTime: 4,
    headline: {
      lead: 'How an MEL framework helped Baithak Foundation',
      em: 'build its case for multi-year funding',
    },
    intro:
      'Baithak Foundation brings Indian traditional music and dance to children from marginalised communities, and its work has grown to over 8,000 children across 137 public schools and community centres. As it grew, Baithak wanted to understand not just how many children it reached, but the change it was creating for them. Goalkeep worked with the team to measure both reach and depth, giving Baithak a clearer picture of its impact and a stronger case for funding.',
    hero: {
      kind: 'photo',
      src: '/design/61c8bcfa7308cd56e5a1e5f6e2e2d521.webp',
      alt: 'Baithak team members laughing during a monthly review of their dashboard',
      position: '50% 40%',
    },
    background: {
      aside: {
        kind: 'photo',
        src: '/design/6a30dd7e7a0b1d94fda6aad4535ecb0b.webp',
        alt: 'A Baithak team member speaking during a monthly review',
        position: '40% 30%',
        quote:
          'The need was not just to bring data together, but to measure what mattered to Baithak and make it useful to the people running its programmes.',
      },
      paragraphs: [
        'Baithak Foundation works to make Indian traditional music and dance accessible to children from marginalised communities, and has grown from a weekend activity in 2016 to reaching over 8,000 children across 137 public schools and community centres.',
        'For an organisation built by musicians and artists, the big question was how to communicate its impact. In a Baithak session you can see children focusing for longer and regulating themselves through the art form, but across 137 schools there was no consistent way to capture that change. There was a time when the founders, Mandar and Dakshayani, could visit every school and gauge it themselves, but as the organisation grew this was no longer sustainable. Three questions became particularly important:',
      ],
      points: [
        {
          lead: 'Are children getting the exposure they need?',
          text: 'At scale, are all students attending enough sessions, which schools need immediate attention, and which art forms have they not yet experienced?',
        },
        {
          lead: 'Are sessions enabling children to grow?',
          text: 'Participation alone could not capture the depth of children’s experiences, so Baithak also wanted to understand engagement, progression in skills and the role of teachers.',
        },
        {
          lead: 'How are these observations informing the work?',
          text: 'Without a consolidated view of the data, programme teams found it harder to identify gaps across schools and respond to them.',
        },
      ],
    },
    steps: [
      {
        title: '1. Defining What to Measure',
        body: 'The first step was to sit with Baithak’s teams and define what change in their students really looked like. The framework brought together indicators of reach, such as how many children participate, how often and the range of art forms they experience, alongside indicators of depth, including engagement, progression in skills and teacher involvement.',
        image: {
          kind: 'photo',
          src: '/design/510999bff14058ff24b16e8f9d0c13b6.webp',
          alt: 'Baithak team members working through their data with Goalkeep',
          position: '50% 40%',
        },
      },
      {
        title: '2. Bringing the Information Together',
        body: 'We built a single source of truth for Baithak’s programmes, with the schools it works with, sessions completed, feedback received and children’s growth all in one place. A Looker Studio dashboard, powered by Google Sheets, consolidates the data automatically as it is collected, so every record adds to the overall picture of the programme.',
        image: {
          kind: 'photo',
          src: '/design/197b6244f3e3cdd9831edbb22c8ff441.webp',
          alt: "Session counts for February on Baithak's dashboard during a monthly review",
          position: '50% 45%',
        },
      },
      {
        title: '3. Making Data Part of Programme Decisions',
        body: 'Today, Baithak’s monthly review starts with a team member projecting the dashboard on the wall and leading the discussion, while the founders take part as participants. The team decides what to work on in the coming month and celebrates the previous month’s wins, and anyone can point out that a school has fallen behind on sessions, whether or not it is theirs to manage. Nobody has to chase sheets or clean data, so the conversation stays on what to do next.',
        image: {
          kind: 'photo',
          src: '/design/95cbb4cc4235fd7c3acae86422b38afe.webp',
          alt: 'The Baithak and Goalkeep teams together',
          position: '50% 40%',
        },
      },
    ],
    outcomes: {
      lead: 'By the end of the engagement, Baithak had:',
      cards: [
        {
          tone: 'blue',
          title: 'A common understanding of impact',
          items: [
            'A data framework covering reach, such as participation and exposure to art forms, and depth, such as engagement, skill progression and teacher involvement',
            'A consistent way to read what registers, forms and teacher observations say about children’s experiences',
          ],
        },
        {
          tone: 'teal',
          title: 'One picture of the whole programme',
          items: [
            'A Looker Studio dashboard, powered by Google Sheets, bringing together access and engagement data across schools',
            'A clear basis for spotting gaps in access and engagement, reviewed by the team every month',
          ],
        },
        {
          tone: 'gold',
          title: 'A stronger case for arts education',
          items: [
            'Annual funding grew from ₹1 crore to ₹1.7 crore over this period, alongside three multi-year CSR grants',
            'A structured evidence base to explain the reach and depth of children’s experiences, as part of a broader organisational effort',
          ],
        },
      ],
    },
    reinforced: [
      'For organisations built around an experience like music or dance, the most meaningful change can feel the hardest to measure. This project reinforced that it starts with agreeing on what change actually looks like, and then measuring both reach and depth so that neither number has to tell the whole story on its own.',
      'Once the data sat in one place, its value showed up in the room: a monthly review led by the team rather than the founders, focused on what to do next instead of on cleaning sheets.',
    ],
    testimonial: {
      quote:
        'The process helped us clarify our focus and key questions. That itself was a big benefit. We’ve moved from focusing just on efficiency to thinking about quality and the deeper aspects of our work.',
      name: 'Dakshayani Athalye',
      role: 'Co-Founder and CEO, Baithak Foundation',
      photo: {
        src: '/design/8625ca604ea24fa43d1fd299a4c5afea.webp',
        alt: 'Dakshayani Athalye, Co-Founder and CEO of Baithak Foundation, smiling with a colleague',
        position: '35% 30%',
      },
      size: 23,
      wide: true,
    },
  },
]

const bySlug = new Map(caseStudies.map((study) => [study.slug, study]))

export const getCaseStudy = (slug: string): CaseStudy | undefined => bySlug.get(slug as CaseStudySlug)

export const caseStudyHref = (slug: CaseStudySlug) => `/case-studies/${slug}`

export type Filter<TId extends string> = { id: 'all' | TId; label: string; tone: Tone }

/** The filter chips, in the export's order. Health has no study yet, so it shows the empty state. */
export const audienceFilters: Array<Filter<Audience>> = [
  { id: 'all', label: 'All', tone: 'blue' },
  { id: 'np', label: audiences.np.chip, tone: 'gold' },
  { id: 'fund', label: audiences.fund.chip, tone: 'blue' },
  { id: 'eco', label: audiences.eco.chip, tone: 'teal' },
]
export const sectorFilters: Array<Filter<Sector>> = [
  { id: 'all', label: 'All', tone: 'blue' },
  { id: 'edu', label: sectors.edu.label, tone: 'gold' },
  { id: 'health', label: sectors.health.label, tone: 'teal' },
  { id: 'cp', label: sectors.cp.label, tone: 'coral' },
  { id: 'liv', label: sectors.liv.label, tone: 'blue' },
  { id: 'arts', label: sectors.arts.label, tone: 'teal' },
]

export const quizHref = '/resources/data-quiz'
