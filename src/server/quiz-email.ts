import type { QuizScore } from "@/content/quiz"

/**
 * The results email a quiz-taker receives, in the structure Goalkeep sent on
 * Nov 11. Same table-and-inline-styles construction as contact-email.ts, for
 * the same reason: email clients.
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

const REPORT_URL = "https://lookerstudio.google.com/reporting/345e34c9-1bd0-4d44-9e9b-486b3ac6b9b1"
const CONTACT = "aditya@goalkeep.org"

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function bar(total: number, max: number) {
  const width = Math.round((total / max) * 100)
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};border-radius:999px;"><tr><td style="width:${Math.max(width, 2)}%;height:8px;background:${TEAL};border-radius:999px;font-size:0;line-height:0;">&nbsp;</td><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>`
}

const paragraph = (html: string, top = 16) =>
  `<tr><td style="padding:${top}px 32px 0;font:400 15px/24px ${FONT};color:${INK};">${html}</td></tr>`

export function quizEmail(name: string, organization: string, score: QuizScore) {
  const persona = `Data ${score.persona.label}`
  const subject = `You are a ${persona}: your data culture quiz results`
  const first = escape(name.split(/\s+/)[0] ?? name)

  const rows = score.domains
    .map(
      (d) => `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid ${LINE};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font:700 15px/22px ${FONT};color:${INK};">${escape(d.title)}</td>
                <td align="right" style="font:700 15px/22px ${FONT};color:${INK};">${d.total}<span style="color:${MUTED};font-weight:600;">/${d.max}</span></td>
              </tr></table>
              <div style="margin-top:8px;">${bar(d.total, d.max)}</div>
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
  <div style="display:none;max-height:0;overflow:hidden;">${escape(persona)} · ${score.total}/${score.max}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${LINE};">
          <tr>
            <td style="background:${NAVY};padding:28px 32px;">
              <div style="font:700 13px/18px ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${YELLOW};">Goalkeep · Data culture quiz</div>
              <div style="margin-top:10px;font:700 28px/34px ${FONT};color:#ffffff;">You are a ${escape(persona)}</div>
              <div style="margin-top:8px;font:400 15px/22px ${FONT};color:#c9d3ef;">${escape(organization)}</div>
            </td>
          </tr>
          ${paragraph(`Hi ${first}, thank you for taking the data culture quiz.`, 24)}
          <tr>
            <td style="padding:20px 32px 0;">
              <div style="padding:16px 20px;background:${TINT};border-radius:10px;font:700 20px/28px ${FONT};color:${INK};">Your total score: ${score.total}<span style="color:${MUTED};">/${score.max}</span></div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
              </table>
            </td>
          </tr>
          ${paragraph(`Curious about how your results compare against your peers, sector or region? Click on <a href="${REPORT_URL}" style="color:${NAVY};font-weight:700;">this report</a> and explore for yourself!`, 24)}
          <tr><td style="padding:24px 32px 0;"><div style="border-top:1px solid ${LINE};font-size:0;line-height:0;">&nbsp;</div></td></tr>
          ${paragraph(`Would you like to learn how to cultivate a sustainable data culture in your organization? Goalkeep offers the &ldquo;Data-Culture Rubric&rdquo; to all its clients. The rubric is a comprehensive assessment that evaluates various aspects of your organization's data-culture ecosystem.`, 8)}
          ${paragraph(`Through a series of thought-provoking questions, our rubric delves into the depth of your organization's data culture, providing you with a clear understanding of its strengths and areas that require improvement.`)}
          ${paragraph(`To embark on this transformative journey of becoming a data-driven trailblazer, simply reach out to us at <a href="mailto:${CONTACT}" style="color:${NAVY};font-weight:700;">${CONTACT}</a>.`)}
          <tr>
            <td style="padding:24px 32px 32px;">
              <a href="mailto:${CONTACT}" style="display:inline-block;padding:12px 22px;border-radius:4px;background:${NAVY};color:#ffffff;font:600 15px/20px ${FONT};text-decoration:none;">Let&rsquo;s talk!</a>
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
    `You are a ${persona}`,
    "",
    `Hi ${name.split(/\s+/)[0] ?? name}, thank you for taking the data culture quiz.`,
    "",
    `Your total score: ${score.total}/${score.max}`,
    "",
    ...score.domains.map((d) => `${d.total}/${d.max} in the domain of ${d.title}`),
    "",
    `Curious about how your results compare against your peers, sector or region? Explore this report: ${REPORT_URL}`,
    "",
    `Would you like to learn how to cultivate a sustainable data culture in your organization? Goalkeep offers the "Data-Culture Rubric" to all its clients. The rubric is a comprehensive assessment that evaluates various aspects of your organization's data-culture ecosystem.`,
    "",
    "Through a series of thought-provoking questions, our rubric delves into the depth of your organization's data culture, providing you with a clear understanding of its strengths and areas that require improvement.",
    "",
    `To embark on this transformative journey of becoming a data-driven trailblazer, simply reach out to us at ${CONTACT}.`,
    "",
    "Let's talk!",
  ].join("\n")

  return { subject, html, text }
}
