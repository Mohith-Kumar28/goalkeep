import type { Audience, Edition } from "@/content/design/newsletter"
import { BLUE_TINT, FONT, INK, MUTED, accent, button, emailDocument, escape, paragraph, section } from "./email-layout"

/**
 * Sent when someone subscribes from a past edition's button: the teaser they
 * were reading and a link to the full edition on Mailchimp's archive.
 */

const plain = (html: string) => html.replace(/<[^>]+>/g, "")

export function editionEmail(edition: Edition, audience: Audience, site?: string) {
  const headline = plain(edition.headline)
  const url = edition.archive.value[audience]
  const subject = `The Keep-Up, ${edition.month}: ${headline}`

  const body = [
    section(paragraph("Thanks for subscribing to The Keep-Up. Here is the edition you were reading.", true), "30px 40px 0"),
    section(
      `<div style="padding:22px 24px;background:${BLUE_TINT};border-radius:12px;">
        <div style="font:400 15px/25px ${FONT};color:${INK};">${escape(edition.lead)}</div>
        <div style="margin-top:12px;font:400 15px/25px ${FONT};color:${MUTED};">${escape(edition.excerpt)}</div>
      </div>`,
    ),
    section(
      `${button(escape(url), `Read the full ${escape(edition.month)} edition &rarr;`, "gold")}
      <div style="margin-top:14px;font:400 13px/19px ${FONT};color:${MUTED};">The next issue reaches you at the end of the month.</div>`,
      "26px 40px 34px",
    ),
  ].join("")

  const html = emailDocument({
    subject,
    preheader: `The full ${edition.month} edition you asked for.`,
    header: {
      eyebrow: `The Keep-Up · ${escape(edition.month)}`,
      title: accent(headline),
    },
    body,
    footer: `You received this because you subscribed to The Keep-Up on <a href="https://goalkeep.org" style="color:${MUTED};">goalkeep.org</a>.`,
    site,
  })

  const text = [
    `The Keep-Up, ${edition.month}: ${headline}`,
    "",
    "Thanks for subscribing to The Keep-Up. Here is the edition you were reading.",
    "",
    edition.lead,
    "",
    edition.excerpt,
    "",
    `Read the full ${edition.month} edition: ${url}`,
    "",
    "The next issue reaches you at the end of the month.",
  ].join("\n")

  return { subject, html, text }
}
