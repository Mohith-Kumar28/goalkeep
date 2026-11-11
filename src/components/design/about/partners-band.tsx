import { LogoTicker } from "@/components/primitives/logo-ticker"
import { Rich } from "@/components/design/kickstarter/rich"
import { partnerGroups } from "@/content/partners"
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
      </div>
      <div style={{ marginTop: 36 }}>
        <LogoTicker groups={partnerGroups} />
      </div>
    </section>
  )
}
