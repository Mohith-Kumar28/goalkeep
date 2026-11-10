import { about } from "@/content/design/about"
import "@/styles/design-about.css"
import { FounderBand } from "./founder-band"
import { MissionBand } from "./mission-band"
import { PartnersBand } from "./partners-band"
import { TeamBand } from "./team-band"
import { WaysBand } from "./ways-band"

export function AboutPage() {
  return (
    <div className="dc">
      <FounderBand founder={about.founder} />
      <MissionBand mission={about.mission} />
      <TeamBand team={about.team} />
      <PartnersBand partners={about.partners} />
      <WaysBand ways={about.ways} />
    </div>
  )
}
