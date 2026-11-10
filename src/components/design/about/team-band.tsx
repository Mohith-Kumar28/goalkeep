import { useEffect, useRef, useState } from "react"
import { Rich } from "@/components/design/kickstarter/rich"
import type { about } from "@/content/design/about"

const TONE_ORDER = ["gold", "blue", "teal", "coral"] as const

const INLINE_QUERY = "(max-width: 1100px)"
const PHONE_QUERY = "(max-width: 760px)"

function useInlineColumns() {
  const [columns, setColumns] = useState<number | null>(null)
  useEffect(() => {
    const inline = window.matchMedia(INLINE_QUERY)
    const phone = window.matchMedia(PHONE_QUERY)
    const update = () =>
      setColumns(inline.matches ? (phone.matches ? 2 : 3) : null)
    update()
    inline.addEventListener("change", update)
    phone.addEventListener("change", update)
    return () => {
      inline.removeEventListener("change", update)
      phone.removeEventListener("change", update)
    }
  }, [])
  return columns
}

export function TeamBand({ team }: { team: typeof about.team }) {
  const [selected, setSelected] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const columns = useInlineColumns()
  const mobile = columns !== null
  const panelRef = useRef<HTMLDivElement>(null)
  const panelRow =
    openIndex === null || columns === null
      ? -1
      : Math.floor(openIndex / columns)

  useEffect(() => {
    if (openIndex !== null) {
      panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [openIndex])

  const choose = (k: number) => {
    setSelected(k)
    if (mobile) setOpenIndex((current) => (current === k ? null : k))
  }
  const person = team.people[selected]
  const noteTone = TONE_ORDER[selected % 4]

  return (
    <section
      id="team"
      className="dc-band"
      style={{ background: "#FFFFFF", paddingTop: 56, paddingBottom: 60 }}
    >
      <div className="dc-shell">
        <p className="dc-eyebrow" style={{ color: "#176059" }}>
          {team.eyebrow}
        </p>
        <h2 className="dc-h2" style={{ maxWidth: "24ch" }}>
          <Rich html={team.heading} />
        </h2>
        <div
          className="dc-about-team"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,5fr) minmax(0,7fr)",
            gap: 48,
            alignItems: "start",
            marginTop: 32,
          }}
        >
          {!mobile && (
            <div
              className="dc-spotlight-sticky"
              style={{ position: "sticky", top: 28 }}
            >
              <div key={selected} className="dc-spotlight">
                <figure
                  className="dc-polaroid"
                  style={{ margin: 0, transform: "rotate(-1.5deg)" }}
                >
                  <span
                    className="dc-tape"
                    data-tone={TONE_ORDER[(selected + 1) % 4]}
                    aria-hidden="true"
                    style={{
                      top: -15,
                      left: "50%",
                      marginLeft: -58,
                      transform: "rotate(-4deg)",
                    }}
                  />
                  <img
                    src={person.photo.src}
                    alt={person.name}
                    style={{
                      height: 360,
                      objectPosition: person.photo.position,
                    }}
                  />
                </figure>
                <div
                  className="dc-sticky"
                  data-tone={noteTone}
                  aria-live="polite"
                  style={{
                    margin: "-56px 0 0 36px",
                    transform: "rotate(1.2deg)",
                    zIndex: 5,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 24,
                      fontWeight: 800,
                      lineHeight: 1.2,
                    }}
                  >
                    {person.name}
                  </span>
                  <span
                    data-tone={person.tone}
                    style={{
                      display: "block",
                      marginTop: 2,
                      fontSize: 14,
                      fontWeight: 800,
                      color: "var(--ink)",
                    }}
                  >
                    {person.role}
                  </span>
                  <span
                    style={{
                      display: "block",
                      marginTop: 12,
                      fontSize: 16,
                      lineHeight: 1.6,
                    }}
                  >
                    {person.bio}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div
            className="dc-about-minis"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 22,
              paddingTop: 8,
            }}
          >
            {team.people.flatMap((p, k) => {
              const card = (
                <button
                  key={p.name}
                  type="button"
                  className={
                    (mobile ? openIndex === k : k === selected)
                      ? "dc-mini dc-on"
                      : "dc-mini"
                  }
                  data-tone={p.tone}
                  aria-pressed={mobile ? undefined : k === selected}
                  aria-expanded={mobile ? openIndex === k : undefined}
                  onClick={() => choose(k)}
                  onMouseEnter={mobile ? undefined : () => setSelected(k)}
                  onFocus={mobile ? undefined : () => setSelected(k)}
                >
                  <span
                    className="dc-tape"
                    data-tone={TONE_ORDER[k % 4]}
                    aria-hidden="true"
                  />
                  <span className="dc-mini-ph">
                    <img
                      src={p.photo.src}
                      alt=""
                      style={{ objectPosition: p.photo.position }}
                    />
                  </span>
                  <span className="dc-mini-n">{p.name}</span>
                  <span className="dc-mini-r">{p.role}</span>
                </button>
              )
              if (columns === null) return [card]
              const endsRow =
                k % columns === columns - 1 || k === team.people.length - 1
              if (!endsRow || Math.floor(k / columns) !== panelRow)
                return [card]
              const open = team.people[openIndex!]
              return [
                card,
                <div
                  key="panel"
                  ref={panelRef}
                  className="dc-sticky dc-mini-panel"
                  data-tone={TONE_ORDER[openIndex! % 4]}
                  data-col={openIndex! % columns}
                  data-cols={columns}
                  aria-live="polite"
                >
                  <button
                    type="button"
                    className="dc-mini-panel-x"
                    aria-label="Close bio"
                    onClick={() => setOpenIndex(null)}
                  >
                    &times;
                  </button>
                  <span className="dc-mini-panel-n">{open.name}</span>
                  <span className="dc-mini-panel-r" data-tone={open.tone}>
                    {open.role}
                  </span>
                  <span className="dc-mini-panel-b">{open.bio}</span>
                </div>,
              ]
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
