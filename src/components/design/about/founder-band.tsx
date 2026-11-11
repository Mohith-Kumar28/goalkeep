import type { about } from "@/content/design/about"

export function FounderBand({ founder }: { founder: typeof about.founder }) {
  return (
    <section
      className="dc-band dc-about-founder-band"
      style={{ background: "#FFFFFF", paddingTop: 56, paddingBottom: 56 }}
    >
      <h1 className="sr-only">About Goalkeep</h1>
      <div className="dc-shell dc-about-founder">
        <div>
          <p className="dc-eyebrow">{founder.eyebrow}</p>
          {founder.paragraphs.map((text, i) => (
            <p
              key={text}
              style={{
                margin: i === 0 ? "14px 0 0" : "18px 0 0",
                maxWidth: "60ch",
              }}
            >
              {text}
            </p>
          ))}
          <div className="dc-founder-signoff">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <p
                  className="dc-hand"
                  style={{ margin: 0, fontSize: 24, color: "#1E3266" }}
                >
                  {founder.name}
                </p>
                <a
                  className="dc-li-link"
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${founder.name} on LinkedIn`}
                >
                  <svg
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 14,
                  color: "rgba(20,19,26,0.66)",
                }}
              >
                {founder.title}
              </p>
            </div>
            <figure className="dc-polaroid dc-founder-fig">
              <span
                className="dc-tape"
                data-tone="coral"
                aria-hidden="true"
                style={{
                  top: -12,
                  left: "50%",
                  marginLeft: -40,
                  transform: "rotate(-3deg)",
                }}
              />
              <img
                className="dc-founder-img"
                src={founder.photo.src}
                alt={founder.photo.alt}
                style={{ objectPosition: founder.photo.position }}
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
