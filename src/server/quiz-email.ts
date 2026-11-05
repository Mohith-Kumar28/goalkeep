import { formatScore } from "@/content/quiz"
import type { QuizScore } from "@/content/quiz"

/**
 * The results email a quiz-taker receives. Same table-and-inline-styles
 * construction as contact-email.ts, for the same reason: email clients.
 */

const NAVY = "#2f4a92"
const INK = "#14131a"
const MUTED = "#5b5a66"
const LINE = "#e3e7f1"
const TINT = "#f1f4fa"
const YELLOW = "#eac452"
const TEAL = "#2f9c8f"
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const SITE = "https://goalkeep.net"

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function bar(average: number) {
  const width = Math.round(((average - 1) / 4) * 100)
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};border-radius:999px;"><tr><td style="width:${Math.max(width, 2)}%;height:8px;background:${TEAL};border-radius:999px;font-size:0;line-height:0;">&nbsp;</td><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>`
}

export function quizEmail(name: string, organization: string, score: QuizScore) {
  const subject = `Your data culture results for ${organization}`
  const first = escape(name.split(/\s+/)[0] ?? name)

  const rows = score.domains
    .map(
      (d) => `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid ${LINE};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font:700 15px/22px ${FONT};color:${INK};">${escape(d.title)}</td>
                <td align="right" style="font:600 13px/22px ${FONT};color:${MUTED};">${escape(d.level.label)} · <span style="color:${INK};font-weight:700;">${formatScore(d.average)}</span> / 5</td>
              </tr></table>
              <div style="margin-top:8px;">${bar(d.average)}</div>
            </td>
          </tr>`
    )
    .join("")

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${TINT};">
  <div style="display:none;max-height:0;overflow:hidden;">Overall ${formatScore(score.average)} / 5 · ${escape(score.level.label)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${LINE};">
          <tr>
            <td style="background:${NAVY};padding:28px 32px;">
              <div style="font:700 13px/18px ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${YELLOW};">Goalkeep · Data culture quiz</div>
              <div style="margin-top:8px;font:700 24px/30px ${FONT};color:#ffffff;">${escape(organization)} scored ${formatScore(score.average)} / 5</div>
              <div style="margin-top:6px;font:400 15px/22px ${FONT};color:#c9d3ef;">${escape(score.level.label)}. ${escape(score.level.reading)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;font:400 15px/24px ${FONT};color:${INK};">Hi ${first}, thanks for taking the quiz. Here is how your answers came out across the four parts of a data culture.</td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;">
              <div style="padding:18px 20px;background:${TINT};border-radius:10px;font:400 15px/24px ${FONT};color:${INK};">Your lowest score is in <strong>${escape(score.weakest.title)}</strong>. That is usually the best place to start, and it is what our work on <a href="${SITE}${score.weakest.next.to}" style="color:${NAVY};">${escape(score.weakest.next.label.toLowerCase())}</a> is for.</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 32px;">
              <a href="${SITE}/#contact" style="display:inline-block;padding:12px 22px;border-radius:4px;background:${NAVY};color:#ffffff;font:600 15px/20px ${FONT};text-decoration:none;">Talk to us about your results</a>
              <div style="margin-top:12px;font:400 13px/19px ${FONT};color:${MUTED};">Or just reply to this email. A person at Goalkeep reads it.</div>
            </td>
          </tr>
        </table>
        <div style="max-width:600px;margin-top:16px;font:400 12px/18px ${FONT};color:${MUTED};">You received this because you took the data culture quiz on goalkeep.net.</div>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `${organization}: data culture quiz results`,
    "",
    `Overall: ${formatScore(score.average)} / 5 (${score.level.label})`,
    score.level.reading,
    "",
    ...score.domains.map((d) => `${d.title}: ${formatScore(d.average)} / 5 (${d.level.label})`),
    "",
    `Your lowest score is in ${score.weakest.title}. See ${SITE}${score.weakest.next.to}`,
    "",
    `Talk to us about your results: ${SITE}/#contact, or reply to this email.`,
  ].join("\n")

  return { subject, html, text }
}
