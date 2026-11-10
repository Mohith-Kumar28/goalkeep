import { describe, expect, it } from "vitest"
import { pageHead } from "./seo"

const metaContent = (head: ReturnType<typeof pageHead>, key: string) =>
  head.meta.find((m) => ("name" in m && m.name === key) || ("property" in m && m.property === key))
    ?.content

describe("pageHead", () => {
  it("keeps a long description within 155 characters, cut at a word", () => {
    const head = pageHead({ title: "T", description: "word ".repeat(80), path: "/x" })
    const description = metaContent(head, "description")!
    expect(description.length).toBeLessThanOrEqual(155)
    expect(description.endsWith("…")).toBe(true)
  })

  it("leaves a short description alone", () => {
    const head = pageHead({ title: "T", description: "Short.", path: "/x" })
    expect(metaContent(head, "description")).toBe("Short.")
  })

  it("points the canonical and og:url at the production page", () => {
    const head = pageHead({ title: "T", description: "d", path: "/about" })
    expect(head.links[0].href).toBe("https://goalkeep.net/about")
    expect(metaContent(head, "og:url")).toBe("https://goalkeep.net/about")
  })

  it("canonicalises the homepage without a trailing slash path", () => {
    const head = pageHead({ title: "T", description: "d", path: "/" })
    expect(head.links[0].href).toBe("https://goalkeep.net")
  })
})
