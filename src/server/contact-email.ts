/**
 * The email Goalkeep's team gets for each contact-form enquiry. Email clients
 * ignore stylesheets and most modern CSS, so this is a table layout with
 * inline styles. Colours are the site's tokens (src/styles/tokens.css).
 */

export type Enquiry = {
  name: string
  email: string
  organization: string
  service: string
  message: string
}

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

function receivedAt(date: Date) {
  return (
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(date) + " IST"
  )
}

function row(label: string, valueHtml: string) {
  return `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid ${LINE};width:150px;vertical-align:top;font:600 12px/18px ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${MUTED};">${label}</td>
            <td style="padding:14px 0;border-bottom:1px solid ${LINE};vertical-align:top;font:400 15px/22px ${FONT};color:${INK};">${valueHtml}</td>
          </tr>`
}

export function contactEmail(enquiry: Enquiry, date = new Date()) {
  const name = escape(enquiry.name)
  const email = escape(enquiry.email)
  const organization = escape(enquiry.organization)
  const service = escape(enquiry.service)
  const message = escape(enquiry.message).replace(/\r?\n/g, "<br>")
  const when = receivedAt(date)
  const replyHref = `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent("Re: your enquiry to Goalkeep")}`

  const subject = `New enquiry from ${enquiry.name} (${enquiry.organization})`

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${TINT};">
  <div style="display:none;max-height:0;overflow:hidden;">${organization} · ${service}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${LINE};">
          <tr>
            <td style="background:${NAVY};padding:28px 32px;">
              <div style="font:700 13px/18px ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${YELLOW};">Goalkeep · New enquiry</div>
              <div style="margin-top:8px;font:700 24px/30px ${FONT};color:#ffffff;">${name} from ${organization}</div>
              <div style="margin-top:6px;font:400 14px/20px ${FONT};color:#c9d3ef;">Received ${when} via the website contact form</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row("Name", name)}${row("Email", `<a href="mailto:${email}" style="color:${NAVY};text-decoration:underline;">${email}</a>`)}${row("Organization", organization)}${row(
                "Looking for",
                `<span style="display:inline-block;padding:3px 10px;border-radius:999px;background:${TINT};color:${NAVY};font-weight:600;">${service}</span>`
              )}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;">
              <div style="font:600 12px/18px ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${MUTED};">Message</div>
              <div style="margin-top:10px;padding:18px 20px;background:${TINT};border-radius:10px;font:400 15px/24px ${FONT};color:${INK};">${message}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 32px;">
              <a href="${replyHref}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:${NAVY};color:#ffffff;font:600 15px/20px ${FONT};text-decoration:none;">Reply to ${name}</a>
              <div style="margin-top:12px;font:400 13px/19px ${FONT};color:${MUTED};">Or just hit reply: this email's reply-to is ${email}.</div>
            </td>
          </tr>
        </table>
        <div style="max-width:600px;margin-top:16px;font:400 12px/18px ${FONT};color:${MUTED};">Sent automatically by the Goalkeep website. The enquiry is also saved in the site database.</div>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `New enquiry from ${enquiry.name} (${enquiry.organization})`,
    `Received ${when}`,
    "",
    `Name:         ${enquiry.name}`,
    `Email:        ${enquiry.email}`,
    `Organization: ${enquiry.organization}`,
    `Looking for:  ${enquiry.service}`,
    "",
    "Message:",
    enquiry.message,
    "",
    "Reply to this email to answer them directly.",
  ].join("\n")

  return { subject, html, text }
}
