import type { Deliverables } from "@/content/design/service-page"
import type { Tone } from "../tones"
import { Reveal } from "../../primitives/reveal"
import { AudienceTag } from "./audience-tag"
import { Rich } from "./rich"

export function DeliverablesSection({
  heading,
  items,
  tone,
  audienceTag,
}: Deliverables & { tone: Tone; audienceTag?: string }) {
  return (
    <section
      className="dc-band dc-svc-band"
      style={{ background: "#FFFFFF" }}
    >
      <Reveal className="dc-shell">
        {audienceTag && (
          <p style={{ margin: "0 0 14px", textAlign: "center" }}>
            <AudienceTag tone={tone}>{audienceTag}</AudienceTag>
          </p>
        )}
        <Rich
          as="h2"
          className="dc-h2"
          html={heading}
          style={{ margin: "0 auto", textAlign: "center", maxWidth: "28ch" }}
        />
        <div
          className="dc-grid3 dc-deliv-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          }}
        >
          {items.map((item) => (
            <div key={item.label} className="dc-deliv-item">
              <div
                className="dc-tile"
                dangerouslySetInnerHTML={{ __html: item.illustration }}
              />
              <p className="dc-deliv-label">{item.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
