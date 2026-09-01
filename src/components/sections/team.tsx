import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { team, teamSection } from '@/content/team'

/**
 * The people, with their names on.
 *
 * For a consultancy whose whole pitch is "we work alongside your team, not
 * above them", faces do more than any paragraph can. These are the actual
 * Goalkeep portraits — already shot as cut-outs on brand colours, which is
 * why the grid needs no treatment of its own.
 */
export function Team() {
  return (
    <section
      className="band relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-1)' }}
      aria-labelledby="team-heading"
    >
      <div className="shell relative">
        <Reveal className="flex flex-col gap-5 pb-8 md:pb-10">
          <p className="eyebrow-band band-coral">{teamSection.eyebrow}</p>
          <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
            <h2 id="team-heading" className="h2 text-[var(--fg-1)] md:col-span-7">
              {teamSection.headline}
            </h2>
            <p className="lead text-[var(--fg-2)] md:col-span-5 md:pb-1">
              {teamSection.lead}
            </p>
          </div>
        </Reveal>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {team.map((person, i) => (
            <Reveal as="li" key={person.slug} delay={Math.min(i, 5) * 0.05}>
              <figure className="flex flex-col gap-3">
                <img
                  src={person.photo}
                  alt={person.name}
                  loading="lazy"
                  decoding="async"
                  width={300}
                  height={300}
                  className="aspect-square w-full rounded-[var(--r-md)] object-cover"
                />
                <figcaption>
                  <p className="text-[length:var(--fs-base)] font-extrabold leading-tight text-[var(--fg-1)]">
                    {person.name}
                  </p>
                  <p className="mt-1 text-[length:var(--fs-sm)] text-[var(--fg-2)]">
                    {person.role}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10">
          <GkButton to={teamSection.cta.to} variant="tertiary" withArrow>
            {teamSection.cta.label}
          </GkButton>
        </div>
      </div>
    </section>
  )
}
