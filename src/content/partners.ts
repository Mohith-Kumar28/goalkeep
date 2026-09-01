import type { PartnerLogo } from './types'

/**
 * The 27 organizations currently shown on goalkeep.net, recovered from the
 * live site and named by hand — the existing site ships them with no real
 * alt text, which we are not reproducing.
 *
 * [VERIFY] Permission to display each mark, and whether this is the full
 * current list. The footnote on the ticker says "Logos shown with permission",
 * so that has to be true before launch.
 */
export const partners: Array<PartnerLogo> = [
  { file: 'org-01.png', name: 'Dost Education', kind: 'org' },
  { file: 'org-02.png', name: 'Aangan Trust', kind: 'org' },
  { file: 'org-03.png', name: 'Acumen Academy', kind: 'funder' },
  { file: 'org-04.png', name: 'SVP India', kind: 'funder' },
  { file: 'org-05.png', name: 'Alohomora Education Foundation', kind: 'org' },
  { file: 'org-06.png', name: 'Catalysts for Social Action', kind: 'org' },
  { file: 'org-07.png', name: 'Dovetail Impact Foundation', kind: 'funder' },
  { file: 'org-08.png', name: 'Foster and Forge Foundation', kind: 'org' },
  { file: 'org-09.png', name: 'Jai Vakeel Foundation', kind: 'org' },
  { file: 'org-10.png', name: 'Medha', kind: 'org' },
  { file: 'org-11.png', name: 'Point of View', kind: 'org' },
  { file: 'org-12.png', name: 'Kshamata', kind: 'org' },
  { file: 'org-13.png', name: 'Udayan Care', kind: 'org' },
  { file: 'org-14.png', name: 'Toybank', kind: 'org' },
  { file: 'org-15.png', name: 'Welthungerhilfe', kind: 'funder' },
  { file: 'org-16.png', name: 'ATE Chandra Foundation', kind: 'funder' },
  { file: 'org-17.png', name: 'Baithak', kind: 'org' },
  { file: 'org-18.png', name: 'Vanavil', kind: 'org' },
  { file: 'org-19.png', name: 'Antarang Foundation', kind: 'org' },
  { file: 'org-20.png', name: "Children's Investment Fund Foundation", kind: 'funder' },
  { file: 'org-21.png', name: 'Educate Girls', kind: 'org' },
  { file: 'org-22.png', name: 'Ghaswala Vision Foundation', kind: 'org' },
  { file: 'org-23.png', name: 'SNEHA', kind: 'org' },
  { file: 'org-24.png', name: 'Migrants Resilience Collaborative', kind: 'org' },
  { file: 'org-25.png', name: 'Madhi Foundation', kind: 'org' },
  { file: 'org-26.png', name: 'Key Education Foundation', kind: 'org' },
  { file: 'org-27.png', name: 'Quest Alliance', kind: 'org' },
]

/** Top row scrolls right to left; bottom row left to right. */
export const tickerRowOne = partners.filter((_, i) => i % 2 === 0)
export const tickerRowTwo = partners.filter((_, i) => i % 2 === 1)
