import { ArrowIcon } from "@/components/design/icons"
import { ClampText } from "@/components/primitives/clamp-text"
import { Reveal } from "@/components/primitives/reveal"
import { Rich } from "@/components/design/kickstarter/rich"
import type { about } from "@/content/design/about"

export function MissionBand({ mission }: { mission: typeof about.mission }) {
  return (
    <section
      className="dc-band dc-paper dc-about-mission-band"
      style={{ paddingTop: 56, paddingBottom: 60 }}
    >
      <div className="dc-shell">
        <div
          className="dc-about-mission"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,6fr) minmax(0,6fr)",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <p className="dc-eyebrow">{mission.eyebrow}</p>
            <h2 className="dc-h2" style={{ maxWidth: "22ch" }}>
              <Rich html={mission.heading} />
            </h2>
            <ClampText className="dc-about-mission-body">{mission.body}</ClampText>
            <a className="dc-tlink" href="#team" style={{ marginTop: 26 }}>
              {mission.link} <ArrowIcon />
            </a>
          </div>
          <Reveal>
          <figure
            className="dc-polaroid"
            style={{
              margin: 0,
              padding: "14px 14px 16px",
              transform: "rotate(1.4deg)",
            }}
          >
            <img
              src={mission.photo.src}
              alt={mission.photo.alt}
              style={{ height: 360, objectPosition: mission.photo.position }}
            />
          </figure>
          </Reveal>
        </div>
        <div
          className="dc-about-nums"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 28,
            marginTop: 44,
          }}
        >
          {mission.stats.map((stat, i) => (
            <Reveal key={stat.value} delay={i * 0.07}>
            <div
              className="dc-sticky dc-num-note"
              data-tone={stat.tone}
              style={{ minHeight: 140 }}
            >
              <span
                className="dc-num-v"
                style={{
                  display: "block",
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                }}
              >
                {stat.value}
              </span>
              <span
                className="dc-hand dc-num-l"
                style={{
                  display: "block",
                  marginTop: 12,
                  fontSize: 17,
                  lineHeight: 1.4,
                  color: "rgba(20,19,26,0.82)",
                }}
              >
                {stat.label}
              </span>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
