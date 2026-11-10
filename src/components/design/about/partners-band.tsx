import { Reveal } from "@/components/primitives/reveal"
import { Rich } from "@/components/design/kickstarter/rich"
import type { about } from "@/content/design/about"

export function PartnersBand({
  partners,
}: {
  partners: typeof about.partners
}) {
  return (
    <section
      className="dc-band dc-paper dc-about-partners-band"
      style={{ paddingTop: 56, paddingBottom: 60 }}
    >
      <div className="dc-shell">
        <p className="dc-eyebrow">{partners.eyebrow}</p>
        <h2 className="dc-h2" style={{ maxWidth: "26ch" }}>
          <Rich html={partners.heading} />
        </h2>
        <Reveal>
        <div
          className="dc-about-logos"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "14px 28px",
            marginTop: 32,
          }}
        >
          {partners.logos.map((logo) => (
            <div key={logo.name} className="dc-logo-tile" title={logo.name}>
              <img src={logo.src} alt={logo.name} />
            </div>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  )
}
