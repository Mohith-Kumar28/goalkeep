import type { Tone } from "@/components/design/tones"

export type Person = {
  name: string
  role: string
  bio: string
  photo: { src: string; position: string }
  tone: Tone
}

export type Audience = {
  id: "nonprofit" | "funder" | "ecosystem"
  title: string
  pill: string
  body: string
  tone: Tone
}

export const about = {
  founder: {
    eyebrow: "a note from our founder",
    photo: {
      src: "/design/6d381336750276a362aa07133f2c7f9c.webp",
      alt: "Manije Kelkar, founder of Goalkeep",
      position: "50% 30%",
    },
    paragraphs: [
      "I began working in the social sector as a volunteer with Akanksha Foundation while I was in college. In the twenty years since, I have spent over a decade helping organisations strengthen their measurement, their data systems and their ability to make evidence-informed decisions.",
      "I founded Goalkeep in 2020 after repeatedly seeing organisations collect significant amounts of data without the systems, capabilities or confidence needed to turn it into better decisions.",
      "Data, when used well, can do far more than help us make decisions. It can offer new ways of understanding problems, exploring solutions and fuelling our quest for meaning. That is the philosophy with which we approach our work at Goalkeep: not to always offer definitive answers, but to equip individuals and organisations to undertake these data-driven journeys themselves.",
    ],
    name: "Manije Kelkar",
    title: "Founder & Director, Goalkeep",
    linkedin: "https://www.linkedin.com/in/manije-kelkar/",
  },
  mission: {
    eyebrow: "our mission",
    heading:
      "Goalkeep enables social sector organisations to <em>measure, communicate and deepen their impact with confidence.</em>",
    body: "Social-sector organisations collect a great deal of data, but too little of it goes back into making better programmatic decisions. We build people-friendly systems and capabilities that turn scattered information into useful insight, so teams can make better decisions, communicate impact clearly and deepen the change they create.",
    link: "Meet the team",
    photo: {
      src: "/design/a1d2b27d6b420f186674a6dcba4f86b7.webp",
      alt: "The Goalkeep team sitting together on the steps of a garden at the team offsite, with a dog in front",
      position: "50% 48%",
    },
    stats: [
      { value: "910+", label: "people trained", tone: "gold" },
      { value: "100+", label: "organisations partnered with", tone: "blue" },
      {
        value: "50%",
        label: "reduction in average time spent on reporting",
        tone: "teal",
      },
      { value: "64%", label: "net promoter score", tone: "coral" },
    ] satisfies Array<{ value: string; label: string; tone: Tone }>,
  },
  team: {
    eyebrow: "our team",
    heading: "Say hello to <em>the people behind the work.</em>",
    people: [
      {
        name: "Manije Kelkar",
        role: "Founder & Director",
        bio: "What drives me is when individuals fundamentally change their relationship with data, and use it to explore, understand and do better. I love it when our work gives people a way to measure the impact of their work, but also deepen it. Outside work, I like coffee, cooking and connecting with my friends.",
        photo: {
          src: "/design/16cb390c7b561f2cfb456b0f57fd9d5e.webp",
          position: "50% 55%",
        },
        tone: "gold",
      },
      {
        name: "Swapneel Rane",
        role: "Director",
        bio: "What drives me most is tackling complex, ambiguous challenges where the client's desired outcome is clear, but the path to get there is entirely unknown. I want to design solutions that genuinely excite people to engage with their own data. Outside work, I follow cycling, sailing and sumo wrestling, and firmly believe neutrinos should be everyone's favourite fundamental particle!",
        photo: {
          src: "/design/2d0b98587fa7f0f410612a7a39a9b29a.webp",
          position: "50% 30%",
        },
        tone: "blue",
      },
      {
        name: "Jishnu Sarkar",
        role: "Lead, People and Organization Development",
        bio: "I curate and facilitate learning experiences that simplify how people can use data, and own projects that help Goalkeep grow, from recruitment to systems and processes. Outside work, I'm at the gym, playing football, or cooking for others at my artisanal grilled cheese sandwich pop-up!",
        photo: {
          src: "/design/eba8c02af065bfe653db1dcce38c4c03.webp",
          position: "50% 30%",
        },
        tone: "teal",
      },
      {
        name: "Praveena G",
        role: "Lead, Project Delivery and Excellence",
        bio: "I leverage AI and tech to solve the pain points of social purpose organisations, and train and empower NGO staff to comfortably navigate their data systems. I love watching movies and reflecting on them, and choreographing dances to the 90s Tamil music I grew up hearing.",
        photo: {
          src: "/design/ff46a709e6e2e44bf1f309d2dbcf640d.webp",
          position: "50% 30%",
        },
        tone: "coral",
      },
      {
        name: "Aditya Krishnan",
        role: "Lead, Business Development",
        bio: "I'm driven by solving problems that people care about. Outside work, you'll mostly find me watching football, doing a little theatre & improv, and spending time with the students I used to teach.",
        photo: {
          src: "/design/28fdf2cfa414583546e6fd3358de0dbe.webp",
          position: "50% 30%",
        },
        tone: "gold",
      },
      {
        name: "Bhumika Manjunath",
        role: "Senior Project Manager",
        bio: "I'm most motivated by work that requires me to think deeply, solve complex problems, and work collaboratively with clients to understand what they really need. Outside work: I enjoy playing with my dog, hosting costume parties or reading!",
        photo: {
          src: "/design/a7c1d30a675680b83b8392e57c451f89.webp",
          position: "50% 30%",
        },
        tone: "blue",
      },
      {
        name: "Gurnaaz",
        role: "BD and Fundraising Manager",
        bio: "What excites me is getting to meet nonprofits where they are, understand the realities of their work, and find what better data systems could actually make possible for them. I love reading stories about immigrant communities, and making travel plans to take my dog Buddy across the country!",
        photo: {
          src: "/design/0124f949242b6f6d234d9f3baa62a606.webp",
          position: "50% 30%",
        },
        tone: "teal",
      },
      {
        name: "Aashini Goyal",
        role: "Project Manager",
        bio: "I'm motivated by the care the Goalkeep team puts into understanding and responding to clients' needs, and I love the variety of projects I get to work on here. I enjoy watching films, reading books and discussing them with my dad, and exploring new food places.",
        photo: {
          src: "/design/e72728531f5ce51b3520d92238094a21.webp",
          position: "50% 30%",
        },
        tone: "coral",
      },
      {
        name: "Anand Navale",
        role: "Project Manager",
        bio: "Solving real problems for clients keeps me going: building processes and systems that make data easier to record and use, while saving teams time and effort. Outside work, I'm a football purist. I live and breathe it.",
        photo: {
          src: "/design/e9b8b9613ab97ea657bbf82a3dad3d5a.webp",
          position: "50% 30%",
        },
        tone: "gold",
      },
      {
        name: "Gayatri Sreekumar",
        role: "Project Manager",
        bio: "I enjoy making sense of different perspectives on data, and turning what we learn into creating something useful that benefits communities: whether that's a clearer report, or a better tool to help them make more informed decisions. Outside work, I'm exploring new food spots, planning travels, or spending time with my cat.",
        photo: {
          src: "/design/3e31694ac6816dff0619e9d226ceefbb.webp",
          position: "50% 30%",
        },
        tone: "blue",
      },
      {
        name: "Simran Adwani",
        role: "Data Analyst",
        bio: "Organisations working for social change deserve decisions grounded in clear, reliable information, and I find real purpose in building the systems that make this possible. Outside work, I'm often binge-watching a good series, working on canvas paintings or embroidery, or whipping up something in the kitchen!",
        photo: {
          src: "/design/aaa350bdf0f7d38fb8cc870fab0cf438.webp",
          position: "50% 30%",
        },
        tone: "teal",
      },
      {
        name: "Tanya Singh",
        role: "Data Analyst",
        bio: "I'm driven by work where data leads to real decisions for social good. Seeing a team use a dashboard or pipeline I built to understand their own work is the most motivating part for me. Outside work, I'm travelling to new places, playing badminton or cricket, or binging a good thriller.",
        photo: {
          src: "/design/aa66d0d6d5a19a0964aafc4b6083b3c4.webp",
          position: "50% 30%",
        },
        tone: "coral",
      },
      {
        name: "Vidhansingh Rajput",
        role: "Data Analyst",
        bio: "I enjoy untangling messy information, finding patterns that might otherwise go unnoticed, and building systems that make data more reliable and easier to use. Outside work, I'm working out, learning something new, or exploring how technology can solve everyday problems.",
        photo: {
          src: "/design/e1da57ba771dcf31642de3a7aa22e5cc.webp",
          position: "50% 30%",
        },
        tone: "gold",
      },
      {
        name: "Kirti Sharma",
        role: "Data Analyst",
        bio: "I love being involved in the entire journey of turning raw, scattered data into clear visuals and insights that people can use to make better decisions. Outside work, I'm exploring food places with friends and family, and am also pursuing my MBA!",
        photo: {
          src: "/design/3040b1ee6ee4a378432a36650b3c76db.webp",
          position: "50% 30%",
        },
        tone: "blue",
      },
    ] satisfies Array<Person>,
  },
  partners: {
    eyebrow: "partners who trust us",
    heading:
      "Nonprofits, funders and intermediaries <em>we’ve worked with.</em>",
    logos: [
      {
        name: "Dost Education",
        src: "/design/2b2f3dec17193c04a794fa58490c147b.webp",
      },
      {
        name: "Acumen Academy",
        src: "/design/b9638e720b901847322efaf637268875.webp",
      },
      {
        name: "Alohomora Education Foundation",
        src: "/design/ed5abc13748ead5d0df0d2b6f3de02d2.webp",
      },
      {
        name: "Dovetail Impact Foundation",
        src: "/design/f6be2f30d688e62c3cc6332f0ba16ee8.webp",
      },
      {
        name: "Jai Vakeel Foundation",
        src: "/design/ab0432ae337d3a98549504a153f4f1e7.webp",
      },
      {
        name: "Point of View",
        src: "/design/c8c2e5a0cd3b24cd9a0d61336aed434b.webp",
      },
      {
        name: "Udayan Care",
        src: "/design/cfdf406825b1da2a40638ac02baac63a.webp",
      },
      {
        name: "Welthungerhilfe",
        src: "/design/5c070b051c7c1a97e1056ba0a9eed48c.webp",
      },
      { name: "Baithak", src: "/design/c1050ab18fcce0e6619937c5e761873f.webp" },
      {
        name: "Antarang Foundation",
        src: "/design/22f214d82648ef47c83802bcce7f36e9.webp",
      },
      {
        name: "Educate Girls",
        src: "/design/6deb31d5bf8ce273f5ac36d6a96f8c91.webp",
      },
      { name: "SNEHA", src: "/design/3846743fa694c15ad20133cc9b206eb0.webp" },
      {
        name: "Madhi Foundation",
        src: "/design/c4a56c9b302663d2f8c86baadd515544.webp",
      },
      {
        name: "Quest Alliance",
        src: "/design/d65cde43a4f53edddb16e8649c332f16.webp",
      },
      {
        name: "Aangan Trust",
        src: "/design/136a61d09ea597ee2fcfda1693346e4c.webp",
      },
      {
        name: "SVP India",
        src: "/design/2aff8edb695039df74da71a3e4bc7aff.webp",
      },
      {
        name: "Catalysts for Social Action",
        src: "/design/e07e9c5f8fbf74cac5e8698460284290.webp",
      },
      {
        name: "Foster and Forge Foundation",
        src: "/design/d8fe4dae5d807671cfc69052d5574fd9.webp",
      },
      { name: "Medha", src: "/design/99a33e617b6c0a61b16425633a037dd4.webp" },
      {
        name: "Kshamata",
        src: "/design/f1973d1b8c770202c757abfa01ce4b94.webp",
      },
      { name: "Toybank", src: "/design/0ce4104b5bf60cb379172bc79d3b4874.webp" },
      {
        name: "ATE Chandra Foundation",
        src: "/design/84b3bccf479a82eff48ab86b5617aefe.webp",
      },
      { name: "Vanavil", src: "/design/7438a0255ce1ba4dcf659ec6b3c0ee12.webp" },
      {
        name: "Children's Investment Fund Foundation",
        src: "/design/2ca3757a57874d388a81712fee998f4e.webp",
      },
      {
        name: "Ghaswala Vision Foundation",
        src: "/design/a36a7863e499eb05e83c161049442faa.webp",
      },
      {
        name: "Migrants Resilience Collaborative",
        src: "/design/6a177295ba600b93a0caedaa1e25fa78.webp",
      },
      {
        name: "Key Education Foundation",
        src: "/design/0f25b563aed7491d5e01513dea4c2a79.webp",
      },
    ],
  },
  ways: {
    eyebrow: "ways to partner",
    heading: "Ready to put <em>your data to work?</em>",
    lead: "Pick the note that sounds most like you.",
    audiences: [
      {
        id: "nonprofit",
        title: "I’m a nonprofit",
        pill: "Nonprofit",
        body: "looking to strengthen how my team measures, uses and communicates data, through a custom project or one of your programs.",
        tone: "gold",
      },
      {
        id: "funder",
        title: "I’m a funder",
        pill: "Funder",
        body: "looking to understand impact across my portfolio or help my grantees build stronger, more consistent measurement practices.",
        tone: "blue",
      },
      {
        id: "ecosystem",
        title: "I’m an ecosystem partner",
        pill: "Ecosystem partner",
        body: "looking for an MEL capacity building partner for my nonprofit cohort, network, or incubator.",
        tone: "teal",
      },
    ] satisfies Array<Audience>,
    photo: {
      src: "/design/2d652b73fb1ae851bb991c1b5ecb1bc1.webp",
      alt: "A nonprofit cohort together after a capacity-building workshop",
      position: "50% 50%",
    },
  },
}
