/**
 * The frame every website email shares: the site's blue header with the white
 * wordmark, a white body, a quiet footer. Tables and inline styles because
 * email clients ignore most CSS.
 *
 * Dark mode: the Gmail apps recolour emails themselves and no markup stops
 * them. Every colour here is a plain background and text colour, so whatever
 * Gmail does, it does to both together and the text stays readable.
 */

export const BLUE = "#2e4a92"
export const BLUE_SOFT = "#c9d3ef"
export const BLUE_TINT = "#eef2fa"
export const GOLD = "#e8c352"
export const INK = "#14131a"
export const MUTED = "#5b5a66"
export const LINE = "#e5e7ee"
export const PAGE = "#f4f6fb"
export const FONT = "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

export const SITE = "https://goalkeep.org"

export function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}


export function button(href: string, label: string, variant: "blue" | "gold" = "blue") {
  const bg = variant === "gold" ? GOLD : BLUE
  const color = variant === "gold" ? INK : "#ffffff"
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${bg};border-radius:4px;">
    <a href="${href}" style="display:inline-block;padding:13px 24px;font:800 15px/20px ${FONT};color:${color};text-decoration:none;">${label}</a>
  </td></tr></table>`
}

export const paragraph = (html: string, last = false) =>
  `<p style="margin:0 0 ${last ? 0 : 16}px;font:400 15px/25px ${FONT};color:${INK};">${html}</p>`

/** A row of the body, padded to the frame's gutter. */
export const section = (html: string, padding = "24px 40px 0") => `<tr><td class="px" style="padding:${padding};">${html}</td></tr>`

type Header = {
  eyebrow: string
  /** HTML: may carry an <em> for the gold accent. */
  title: string
  sub?: string
}

export function emailDocument({
  subject,
  preheader,
  header,
  body,
  footer,
  site = SITE,
}: {
  subject: string
  preheader: string
  header: Header
  body: string
  footer: string
  site?: string
}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${escape(subject)}</title>
<style>
  :root { color-scheme: light only; }
  @media (max-width: 520px) {
    .px { padding-left: 22px !important; padding-right: 22px !important; }
    .tiles { padding-left: 16px !important; padding-right: 16px !important; }
    .tile { padding: 4px !important; }
    .hero-title { font-size: 30px !important; line-height: 36px !important; }
  }
</style>
</head>
<body class="body" style="margin:0;padding:0;background:${PAGE};">
  <div style="display:none;max-height:0;overflow:hidden;">${escape(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
    <tr>
      <td align="center" style="padding:28px 12px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${LINE};">
          <tr>
            <td class="px" style="background:${BLUE};padding:28px 40px 34px;">
              <img src="${site}/email/wordmark-white.png" width="118" height="28" alt="Goalkeep" style="display:block;border:0;height:28px;width:auto;">
              <div style="margin-top:32px;font:700 13px/18px ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${GOLD};">${header.eyebrow}</div>
              <div class="hero-title" style="margin-top:12px;font:500 36px/42px ${FONT};letter-spacing:-0.02em;color:#ffffff;">${header.title}</div>
              ${header.sub ? `<div style="margin-top:12px;font:400 15px/23px ${FONT};color:${BLUE_SOFT};">${header.sub}</div>` : ""}
            </td>
          </tr>
          ${body}
          <tr>
            <td class="px" style="padding:20px 40px 24px;border-top:1px solid ${LINE};">
              <div style="font:400 12px/19px ${FONT};color:${MUTED};">${footer}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** The gold accent inside a header title. */
export const accent = (text: string) => `<strong style="font-weight:800;font-style:italic;color:${GOLD};">${escape(text)}</strong>`
