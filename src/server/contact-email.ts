import { BLUE, BLUE_TINT, FONT, INK, LINE, MUTED, button, emailDocument, escape, section } from "./email-layout"

/** The email Goalkeep's team gets for each contact-form enquiry. */

export type Enquiry = {
  name: string
  email: string
  organization: string
  service: string
  message: string
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

function row(label: string, valueHtml: string, last = false) {
  return `<tr>
    <td style="padding:14px 12px 14px 0;${last ? "" : `border-bottom:1px solid ${LINE};`}width:118px;vertical-align:top;font:700 11px/20px ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">${label}</td>
    <td style="padding:14px 0;word-break:break-word;${last ? "" : `border-bottom:1px solid ${LINE};`}vertical-align:top;font:400 15px/22px ${FONT};color:${INK};">${valueHtml}</td>
  </tr>`
}

export function contactEmail(enquiry: Enquiry, site?: string, date = new Date()) {
  const name = escape(enquiry.name)
  const email = escape(enquiry.email)
  const organization = escape(enquiry.organization)
  const service = escape(enquiry.service)
  const message = escape(enquiry.message).replace(/\r?\n/g, "<br>")
  const when = receivedAt(date)
  const replyHref = `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent("Re: your enquiry to Goalkeep")}`
  const subject = `New enquiry from ${enquiry.name} (${enquiry.organization})`

  const details = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px;"><tr><td style="padding:4px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", name)}
      ${row("Email", `<a href="mailto:${email}" style="color:${BLUE};font-weight:700;">${email}</a>`)}
      ${row("Organisation", organization)}
      ${row("Looking for", `<strong style="color:${BLUE};">${service}</strong>`, true)}
    </table>
  </td></tr></table>`

  const body = [
    section(details, "28px 40px 0"),
    section(
      `<div style="font:700 12px/18px ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Message</div>
      <div style="margin-top:10px;padding:18px 20px;background:${BLUE_TINT};border-radius:12px;font:400 15px/25px ${FONT};color:${INK};">${message}</div>`,
    ),
    section(
      `${button(replyHref, `Reply to ${name} &rarr;`)}
      <div style="margin-top:12px;font:400 13px/19px ${FONT};color:${MUTED};">Or just hit reply: this email's reply-to is ${email}.</div>`,
      "26px 40px 34px",
    ),
  ].join("")

  const html = emailDocument({
    subject,
    preheader: `${enquiry.organization} · ${enquiry.service}`,
    header: {
      eyebrow: "New website enquiry",
      title: `${name}<br><span style="color:#c9d3ef;font-size:22px;line-height:30px;">${organization}</span>`,
      sub: `Received ${escape(when)} via the contact form`,
    },
    body,
    footer: "Sent automatically by the Goalkeep website. The enquiry is also saved in the site database.",
    site,
  })

  const text = [
    `New enquiry from ${enquiry.name} (${enquiry.organization})`,
    `Received ${when}`,
    "",
    `Name:         ${enquiry.name}`,
    `Email:        ${enquiry.email}`,
    `Organisation: ${enquiry.organization}`,
    `Looking for:  ${enquiry.service}`,
    "",
    "Message:",
    enquiry.message,
    "",
    "Reply to this email to answer them directly.",
  ].join("\n")

  return { subject, html, text }
}
