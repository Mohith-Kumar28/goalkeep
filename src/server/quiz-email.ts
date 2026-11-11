import { marks } from "@/content/design/quiz"
import { personas } from "@/content/quiz"
import type { QuizScore } from "@/content/quiz"

/**
 * The results email a quiz-taker receives, in the order Goalkeep sent on
 * Nov 11, dressed in the site's palette. Tables and inline styles because
 * email clients ignore most CSS; the one <style> block only reflows the tier
 * ladder and paddings on narrow screens, and clients that drop it still get
 * a readable single column.
 */

const NAVY = "#2f4a92"
const NAVY_DEEP = "#1e3266"
const INK = "#14131a"
const MUTED = "#5b5a66"
const LINE = "#e5e7ee"
const GROUND = "#f1f4fa"
const YELLOW = "#eac452"
const YELLOW_TINT = "#fbf3df"
const YELLOW_INK = "#7d5e0c"
const FONT = "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

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

const range = (i: number) => {
  const next = personas[i + 1] as (typeof personas)[number] | undefined
  return next ? `${personas[i].min}–${next.min - 1}` : `${personas[i].min}–60`
}

function ladder(current: string) {
  const cells = personas
    .map((p, i) => {
      const on = p.id === current
      return `<td class="tier" width="25%" valign="top" style="padding:4px;">
        <div style="padding:10px 8px;border-radius:10px;text-align:center;${on ? `background:${YELLOW};` : "border:1px solid rgba(255,255,255,0.28);"}">
          <div style="font:800 13px/18px ${FONT};color:${on ? INK : "#ffffff"};">${escape(p.label)}</div>
          <div style="font:600 11px/16px ${FONT};color:${on ? YELLOW_INK : "#c9d3ef"};">${range(i)}</div>
        </div>
      </td>`
    })
    .join("")
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table>`
}

function domainRow(id: keyof typeof marks, title: string, total: number, max: number) {
  const mark = marks[id]
  const width = Math.max(Math.round((total / max) * 100), 3)
  return `<tr><td style="padding:14px 0;border-bottom:1px solid ${LINE};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font:700 15px/22px ${FONT};color:${INK};">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${mark.mark};margin-right:8px;vertical-align:1px;"></span>${escape(title)}
      </td>
      <td align="right" style="font:800 16px/22px ${FONT};color:${mark.ink};white-space:nowrap;">${total}<span style="font-weight:600;color:${MUTED};">/${max}</span></td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;background:${mark.tint};border-radius:999px;"><tr>
      <td style="width:${width}%;height:10px;background:${mark.mark};border-radius:999px;font-size:0;line-height:0;">&nbsp;</td><td style="font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
  </td></tr>`
}

const p = (html: string, style = "") =>
  `<p style="margin:0 0 14px;font:400 15px/25px ${FONT};color:${INK};${style}">${html}</p>`

export function quizEmail(name: string, organization: string, score: QuizScore, site = "https://goalkeep.net") {
  const persona = `Data ${score.persona.label}`
  const subject = `You are a ${persona}: your data culture quiz results`
  const first = escape(name.split(/\s+/)[0] ?? name)

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escape(subject)}</title>
<style>
  @media (max-width: 520px) {
    .px { padding-left: 22px !important; padding-right: 22px !important; }
    .hero-title { font-size: 28px !important; line-height: 34px !important; }
    .tier { display: inline-block !important; width: 50% !important; box-sizing: border-box; }
    .score { font-size: 44px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${GROUND};">
  <div style="display:none;max-height:0;overflow:hidden;">${escape(persona)} · ${score.total}/${score.max} · ${escape(organization)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GROUND};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;">

          <tr>
            <td class="px" style="background:${NAVY};padding:28px 36px 30px;">
              <img src="${site}/email/wordmark-white.png" width="122" height="29" alt="Goalkeep" style="display:block;border:0;height:29px;width:auto;">
              <div style="margin-top:28px;font:800 12px/16px ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${YELLOW};">Data culture quiz results</div>
              <div class="hero-title" style="margin-top:10px;font:500 34px/40px ${FONT};color:#ffffff;">You are a Data <em style="font-weight:800;color:${YELLOW};">${escape(score.persona.label)}</em></div>
              <div style="margin-top:8px;font:400 15px/22px ${FONT};color:#c9d3ef;">${escape(organization)}</div>
              <div style="margin-top:22px;">${ladder(score.persona.id)}</div>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:28px 36px 4px;">
              ${p(`Hi ${first}, thank you for taking the data culture quiz. Here is how ${escape(organization)} scored.`)}
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:4px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GROUND};border-radius:14px;"><tr>
                <td style="padding:20px 22px;">
                  <div style="font:800 12px/16px ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${NAVY};">Your total score</div>
                  <div class="score" style="margin-top:6px;font:800 52px/56px ${FONT};color:${NAVY_DEEP};">${score.total}<span style="font-size:24px;font-weight:700;color:${MUTED};">/${score.max}</span></div>
                </td>
              </tr></table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:10px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${score.domains.map((d) => domainRow(d.id, d.title, d.total, d.max)).join("")}
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:26px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${YELLOW_TINT};border-radius:14px;"><tr>
                <td style="padding:20px 22px;">
                  <div style="font:700 16px/24px ${FONT};color:${INK};">Curious about how your results compare against your peers, sector or region?</div>
                  <div style="margin-top:4px;font:400 15px/22px ${FONT};color:${INK};">Click on this report and explore for yourself!</div>
                  <a href="${REPORT_URL}" style="display:inline-block;margin-top:14px;padding:11px 20px;border-radius:4px;background:${NAVY};color:#ffffff;font:700 14px/20px ${FONT};text-decoration:none;">Explore the report &rarr;</a>
                </td>
              </tr></table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:30px 36px 0;">
              <div style="font:800 12px/16px ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${NAVY};margin-bottom:12px;">The Data-Culture Rubric</div>
              ${p(`Would you like to learn how to cultivate a sustainable data culture in your organization? Goalkeep offers the &ldquo;Data-Culture Rubric&rdquo; to all its clients. The rubric is a comprehensive assessment that evaluates various aspects of your organization's data-culture ecosystem.`)}
              ${p(`Through a series of thought-provoking questions, our rubric delves into the depth of your organization's data culture, providing you with a clear understanding of its strengths and areas that require improvement.`)}
              ${p(`To embark on this transformative journey of becoming a data-driven trailblazer, simply reach out to us at <a href="mailto:${CONTACT}" style="color:${NAVY};font-weight:700;">${CONTACT}</a>.`, "margin-bottom:0;")}
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:24px 36px 34px;">
              <a href="mailto:${CONTACT}?subject=${encodeURIComponent(`Our data culture quiz results (${persona})`)}" style="display:inline-block;padding:13px 24px;border-radius:4px;background:${YELLOW};color:${INK};font:800 15px/20px ${FONT};text-decoration:none;">Let&rsquo;s talk! &rarr;</a>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:20px 36px;border-top:1px solid ${LINE};background:#fcfcfd;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td valign="middle" style="padding-right:12px;"><img src="${site}/email/goalkeep-mark.png" width="32" height="32" alt="" style="display:block;border:0;"></td>
                <td valign="middle" style="font:400 12px/18px ${FONT};color:${MUTED};">Goalkeep enables social sector organisations to use data to scale impact.<br>You received this because you took the data culture quiz on <a href="${site}" style="color:${MUTED};">goalkeep.net</a>.</td>
              </tr></table>
            </td>
          </tr>

        </table>
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
