import type { Audience, Edition } from "@/content/design/newsletter"

/**
 * Sent when someone subscribes from a past edition's "Subscribe to keep
 * reading" button: the teaser they were reading and a link to the full
 * edition on Mailchimp's archive. Same table-and-inline-styles construction
 * as contact-email.ts, for the same reason: email clients.
 */

const NAVY = "#2f4a92"
const INK = "#14131a"
const MUTED = "#5b5a66"
const LINE = "#e3e7f1"
const TINT = "#f1f4fa"
const YELLOW = "#eac452"
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

const plain = (html: string) => html.replace(/<[^>]+>/g, "")

export function editionEmail(edition: Edition, audience: Audience) {
  const headline = plain(edition.headline)
  const url = edition.archive.value[audience]
  const subject = `The Keep-Up, ${edition.month}: ${headline}`

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${TINT};">
  <div style="display:none;max-height:0;overflow:hidden;">The full ${escape(edition.month)} edition you asked for.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${LINE};">
          <tr>
            <td style="background:${NAVY};padding:28px 32px;">
              <div style="font:700 13px/18px ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${YELLOW};">The Keep-Up · ${escape(edition.month)}</div>
              <div style="margin-top:8px;font:700 24px/30px ${FONT};color:#ffffff;">${escape(headline)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;font:400 15px/24px ${FONT};color:${INK};">Thanks for subscribing to The Keep-Up. Here is the edition you were reading.</td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0;font:400 15px/24px ${FONT};color:${INK};">${escape(edition.lead)}</td>
          </tr>
          <tr>
            <td style="padding:12px 32px 0;font:400 15px/24px ${FONT};color:${MUTED};">${escape(edition.excerpt)}</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 32px;">
              <a href="${escape(url)}" style="display:inline-block;padding:12px 22px;border-radius:4px;background:${NAVY};color:#ffffff;font:600 15px/20px ${FONT};text-decoration:none;">Read the full ${escape(edition.month)} edition</a>
              <div style="margin-top:12px;font:400 13px/19px ${FONT};color:${MUTED};">If you haven't yet, please confirm your email from Mailchimp's message, so the next issue reaches you at the end of the month.</div>
            </td>
          </tr>
        </table>
        <div style="max-width:600px;margin-top:16px;font:400 12px/18px ${FONT};color:${MUTED};">You received this because you subscribed to The Keep-Up on goalkeep.net.</div>
      </td>
    </tr>
  </table>
</body>
</html>`

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
    "If you haven't yet, please confirm your email from Mailchimp's message, so the next issue reaches you at the end of the month.",
  ].join("\n")

  return { subject, html, text }
}
