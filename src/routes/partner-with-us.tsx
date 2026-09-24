import { createFileRoute } from "@tanstack/react-router"
import { GkButton } from "@/components/primitives/gk-button"
import { Reveal } from "@/components/primitives/reveal"
import { partnerPage } from "@/content/partner"

export const Route = createFileRoute("/partner-with-us")({
  head: () => ({
    meta: [
      { title: "Partner with us — Goalkeep" },
      {
        name: "description",
        content:
          "For funders and ecosystem partners: data systems your grantees and partner organisations can actually run.",
      },
    ],
  }),
  component: PartnerWithUs,
})

/**
 * Partner with us.
 *
 * Was a one-line stub: a heading and a paragraph floating in a screen of white
 * ("too much empty white space"), under a header whose white wordmark
 * vanished into it. Now it is the destination both of the homepage's
 * non-NGO audience tabs point at, one section each, so a funder and a
 * capacity-building partner each land on copy written for them - the journey
 * fix the 23 Sep doc asked for ("intermediaries don't necessarily have
 * grantees").
 *
 * All copy is placeholder until Goalkeep's content pass; see content/partner.ts.
 */
function PartnerWithUs() {
  const { intro, segments } = partnerPage

  return (
    <>
      <section className="ground-cream relative pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow mb-5">{intro.eyebrow}</p>
            <h1 className="display max-w-[20ch] text-[var(--gk-ink)]">
              {intro.headlineLead} <em>{intro.headlineEm}</em>
            </h1>
            <p className="lead mt-6 max-w-[48ch]">{intro.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {segments.map((segment) => (
                <GkButton
                  key={segment.id}
                  href={`#${segment.id}`}
                  variant={segment.id === "funders" ? "primary" : "secondary"}
                >
                  {segment.jump}
                </GkButton>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <img
              src={intro.image}
              alt={intro.imageAlt}
              className="aspect-[4/3] w-full rounded-[var(--r-lg)] object-cover shadow-[var(--shadow-md)]"
            />
          </Reveal>
        </div>
      </section>

      {segments.map((segment, index) => (
        <section
          key={segment.id}
          id={segment.id}
          className="band relative scroll-mt-24"
          style={{
            background: index % 2 === 0 ? "var(--gk-beige)" : "var(--gk-cream)",
          }}
        >
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-4">{segment.eyebrow}</p>
              <h2 className="h2 max-w-[22ch]">
                {segment.headlineLead} <em>{segment.headlineEm}</em>
              </h2>
              <p className="lead mt-5 max-w-[46ch]">{segment.lead}</p>
              <div className="mt-8">
                <GkButton to="/contact" variant="primary" withArrow>
                  {segment.cta}
                </GkButton>
              </div>
            </div>

            <ol className="grid gap-4 lg:col-span-7">
              {segment.offers.map((offer, i) => (
                <li
                  key={offer.title}
                  className="rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--gk-white)] p-6 shadow-[var(--shadow-xs)] md:p-7"
                >
                  <p className="flex items-baseline gap-4">
                    <span className="text-[length:var(--fs-sm)] font-bold text-[var(--gk-navy)] tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[length:var(--fs-xl)] font-extrabold">
                      {offer.title}
                    </span>
                  </p>
                  <p className="mt-2 pl-9 text-[length:var(--fs-base)] leading-relaxed">
                    {offer.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </>
  )
}
