import { useState } from "react"
import type { FormEvent } from "react"
import { ArrowIcon, CloseIcon } from "@/components/design/icons"
import { Rich } from "@/components/design/kickstarter/rich"
import type { Audience, about } from "@/content/design/about"
import { contact } from "@/content/homepage"
import { submitContact } from "@/server/forms"

type Status = "idle" | "sending" | "sent" | { error: string }

export function WaysBand({ ways }: { ways: typeof about.ways }) {
  const [audience, setAudience] = useState<Audience | null>(null)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>("idle")

  const pick = (next: Audience) => {
    setAudience(next)
    setOpen(true)
    setStatus((current) => (current === "sent" ? "idle" : current))
  }
  const close = () => {
    setOpen(false)
    setAudience(null)
    setStatus("idle")
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const field = (name: string) => String(data.get(name) ?? "")
    const writingAs = audience ? `${audience.pill}: ` : ""
    setStatus("sending")
    try {
      const result = await submitContact({
        data: {
          name: field("name"),
          email: field("email"),
          organization: field("organization"),
          website: field("website"),
          service: contact.generalEnquiry,
          message: `${writingAs}${field("message")} (from ${window.location.pathname})`,
        },
      })
      setStatus(result.ok ? "sent" : { error: result.error })
    } catch {
      setStatus({
        error: "Something went wrong sending your message. Please try again.",
      })
    }
  }

  return (
    <section
      id="contact"
      className="dc-band"
      style={{ background: "#FFFFFF", paddingTop: 56, paddingBottom: 64 }}
    >
      <div
        className="dc-shell dc-about-ways"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,7fr) minmax(0,5fr)",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <p className="dc-eyebrow">{ways.eyebrow}</p>
          <h2 className="dc-h2" style={{ maxWidth: "20ch" }}>
            <Rich html={ways.heading} />
          </h2>
          <p
            style={{
              margin: "18px 0 0",
              fontSize: 18,
              color: "rgba(20,19,26,0.8)",
            }}
          >
            {ways.lead}
          </p>
          <div
            className="dc-about-ways-notes"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 24,
              marginTop: 28,
            }}
          >
            {ways.audiences.map((item) => (
              <button
                key={item.id}
                type="button"
                className="dc-way-note"
                data-tone={item.tone}
                aria-pressed={audience?.id === item.id}
                onClick={() => pick(item)}
              >
                <span
                  style={{
                    fontSize: 21,
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: "var(--ink)",
                  }}
                >
                  {item.title}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "rgba(20,19,26,0.82)",
                  }}
                >
                  {item.body}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          {open ? (
            <div
              className="dc-slide-in"
              onKeyDown={(event) => event.key === "Escape" && close()}
              style={{
                padding: 36,
                color: "#14131A",
                background: "#FFFFFF",
                border: "1px solid #E5E7EE",
                borderRadius: 12,
                boxShadow: "0 24px 56px rgba(20,19,26,0.14)",
                position: "relative",
              }}
            >
              <button
                type="button"
                className="dc-form-close"
                aria-label="Close form"
                onClick={close}
              >
                <CloseIcon />
              </button>
              {status === "sent" ? (
                <div role="status" style={{ padding: "24px 0" }}>
                  <svg
                    aria-hidden="true"
                    width="44"
                    height="44"
                    viewBox="0 0 28 28"
                  >
                    <path
                      d="M 5 15 Q 9 18 11.5 22 Q 16 11 24 5"
                      fill="none"
                      stroke="#EAC452"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p
                    style={{
                      margin: "12px 0 0",
                      fontSize: 22,
                      fontWeight: 700,
                    }}
                  >
                    Thank you.
                  </p>
                  <p
                    style={{ margin: "8px 0 0", color: "rgba(20,19,26,0.72)" }}
                  >
                    We&rsquo;ll be in touch shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    margin: 0,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 22,
                      fontWeight: 700,
                      lineHeight: 1.28,
                    }}
                  >
                    Tell us a little about you.
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700 }}>
                      I am writing as a
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {ways.audiences.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="dc-pill"
                          data-tone={item.tone}
                          aria-pressed={audience?.id === item.id}
                          onClick={() => pick(item)}
                        >
                          {item.pill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="dc-form-label">
                    Name
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      className="dc-field"
                    />
                  </label>
                  <label className="dc-form-label">
                    Email
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      className="dc-field"
                    />
                  </label>
                  <label className="dc-form-label">
                    Organisation name
                    <input
                      type="text"
                      name="organization"
                      autoComplete="organization"
                      required
                      className="dc-field"
                    />
                  </label>
                  <label className="dc-form-label">
                    How can we help?
                    <textarea
                      name="message"
                      rows={3}
                      required
                      className="dc-field"
                      style={{ resize: "vertical" }}
                    />
                  </label>
                  <div className="dc-hp" aria-hidden="true">
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </div>
                  {typeof status === "object" && (
                    <p
                      role="alert"
                      style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#9C452A",
                      }}
                    >
                      {status.error}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="dc-btn dc-btn-primary"
                    disabled={status === "sending"}
                    style={{ alignSelf: "flex-start", marginTop: 6 }}
                  >
                    {status === "sending" ? "Sending…" : "Submit"}
                    <ArrowIcon />
                  </button>
                </form>
              )}
            </div>
          ) : (
            <figure
              className="dc-polaroid"
              style={{
                margin: "8px 0 0",
                padding: "14px 14px 16px",
                transform: "rotate(-0.8deg)",
              }}
            >
              <img
                src={ways.photo.src}
                alt={ways.photo.alt}
                style={{ height: 330, objectPosition: ways.photo.position }}
              />
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}
