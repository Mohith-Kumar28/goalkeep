export type TeamMember = {
  slug: string
  name: string
  role: string
  photo: string
}

/**
 * The actual Goalkeep team, with their real portraits from goalkeep.net.
 * Roles are taken from their own site.
 *
 * This section exists because the fastest way to make a services page feel
 * human is to show the humans. These are the people a client actually sits
 * with — not stock photography, not illustrations.
 *
 * [VERIFY] Manije Kelkar (Founder & Director), Swapneel Rane (Director) and
 * Simran Adwani (Data Analyst) are on the team but have no portrait on the
 * current site — add them once we have photos.
 */
export const team: Array<TeamMember> = [
  { slug: 'bhumika', name: 'Bhumika Manjunath', role: 'Lead, Project Delivery', photo: '/team/bhumika.jpg' },
  { slug: 'jishnu', name: 'Jishnu Sarkar', role: 'Lead, People and Organisation', photo: '/team/jishnu.jpg' },
  { slug: 'aditya', name: 'Aditya Krishnan', role: 'Lead, Business Development', photo: '/team/aditya.jpg' },
  { slug: 'aashini', name: 'Aashini Goyal', role: 'Project Manager', photo: '/team/aashini.jpg' },
  { slug: 'anand', name: 'Anand Navale', role: 'Project Manager', photo: '/team/anand.jpg' },
  { slug: 'gayatri', name: 'Gayatri Sreekumar', role: 'Project Manager', photo: '/team/gayatri.jpg' },
  { slug: 'keerthi', name: 'Keerthi L N', role: 'Data Analyst', photo: '/team/keerthi.jpg' },
  { slug: 'kirti', name: 'Kirti Sharma', role: 'Data Analyst', photo: '/team/kirti.jpg' },
  { slug: 'tanya', name: 'Tanya Singh', role: 'Data Analyst', photo: '/team/tanya.jpg' },
]

export const teamSection = {
  eyebrow: 'The team',
  headline: 'You work with these people. Not an account manager.',
  lead: 'A small team in India. Whoever scopes your project is the one who builds it.',
  cta: { label: 'Meet the whole team', to: '/about' },
}
