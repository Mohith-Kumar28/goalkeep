import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { Scribble } from '@/components/primitives/doodles'
import { team, teamSection } from '@/content/team'

/**
 * The people, with their names on.
 *
 * For a consultancy whose pitch is "we work alongside your team, not above
 * them", faces do more than any paragraph can. The portraits are already shot
 * as cut-outs on brand colours, so each one sits on a disc in a rotating hue
 * and tips a degree or two on hover — the treatment is on the frame, never on
 * the photograph.
 */
const DISC_HUES = [
  'var(--gk-blue-tint)',
  'var(--gk-teal-tint)',
  'var(--gk-coral-tint)',
  'var(--gk-yellow-tint)',
]

export function Team() {
  return (
    <section className="ground-cream band accent-coral relative" aria-labelledby="team-heading">
      <div className="shell relative">
        <Reveal>
          <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">{teamSection.eyebrow}</p>
              <h2 id="team-heading" className="h2 max-w-[20ch]">
                {teamSection.headline}
              </h2>
            </div>
            <p className="hand max-w-[24ch] -rotate-2 text-[var(--gk-teal-ink)] md:mb-2">
              {teamSection.lead}
            </p>
          </div>
        </Reveal>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {team.map((member, index) => (
            <Reveal as="li" key={member.slug} delay={Math.min(index, 5) * 0.05}>
              <figure className="group text-center">
                <div
                  className="relative mx-auto aspect-square w-full overflow-hidden rounded-full border-2 border-[var(--gk-ink)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-pop)] group-hover:-rotate-3 group-hover:scale-[1.04]"
                  style={{ background: DISC_HUES[index % 4] }}
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-4">
                  <span className="block font-display text-[length:var(--fs-base)] font-extrabold leading-tight">
                    {member.name}
                  </span>
                  <span className="hand block text-[length:var(--fs-hand-sm)] text-[var(--gk-coral-ink)]">
                    {member.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.15}>
          <div className="mt-12 flex items-center gap-3">
            <GkButton to={teamSection.cta.to} variant="secondary" withArrow>
              {teamSection.cta.label}
            </GkButton>
            <Scribble
              name="arrow-hook"
              color="var(--gk-coral)"
              className="hidden h-8 w-14 -scale-x-100 md:block"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
