import { marks } from "@/content/design/quiz"
import type { DomainId, QuizScore } from "@/content/quiz"

/**
 * The results email a quiz-taker receives, in the order Goalkeep sent on
 * Nov 11, in the site's own scheme: the hero blue, white grounds, and the
 * gold used only as the accent it is on the site (the persona, the buttons).
 * Tables and inline styles because email clients ignore most CSS; the
 * <style> block only tightens paddings on phones.
 */

const BLUE = "#2e4a92"
const BLUE_SOFT = "#c9d3ef"
const BLUE_TINT = "#eef2fa"
const GOLD = "#e8c352"
const INK = "#14131a"
const MUTED = "#5b5a66"
const LINE = "#e5e7ee"
const PAGE = "#f4f6fb"
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

/** Each domain in the colours the quiz page gives it: the logo segment for the bar, its ink for the score. */
function tile(id: DomainId, title: string, total: number, max: number) {
  const mark = marks[id]
  const width = Math.max(Math.round((total / max) * 100), 4)
  return `<td class="tile" width="50%" valign="top" style="padding:6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid ${LINE};border-radius:12px;"><tr><td style="padding:16px 18px;">
      <div style="font:700 14px/20px ${FONT};color:${MUTED};"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${mark.mark};margin-right:7px;vertical-align:1px;"></span>${escape(title)}</div>
      <div style="margin-top:4px;font:800 30px/34px ${FONT};color:${mark.ink};">${total}<span style="font-size:16px;font-weight:700;color:${MUTED};">/${max}</span></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;background:${mark.tint};border-radius:999px;"><tr>
        <td style="width:${width}%;height:7px;background:${mark.mark};border-radius:999px;font-size:0;line-height:0;">&nbsp;</td><td style="font-size:0;line-height:0;">&nbsp;</td>
      </tr></table>
    </td></tr></table>
  </td>`
}

const p = (html: string, last = false) =>
  `<p style="margin:0 0 ${last ? 0 : 16}px;font:400 15px/25px ${FONT};color:${INK};">${html}</p>`

export function quizEmail(name: string, organization: string, score: QuizScore, site = "https://goalkeep.net") {
  const persona = `Data ${score.persona.label}`
  const subject = `You are a ${persona}: your data culture quiz results`
  const first = escape(name.split(/\s+/)[0] ?? name)
  const [a, b, c, d] = score.domains

  const html = `<!doctype html>
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
    .hero-title { font-size: 34px !important; line-height: 40px !important; }
    .tile { padding: 4px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${PAGE};">
  <div style="display:none;max-height:0;overflow:hidden;">${escape(persona)} · ${score.total}/${score.max}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
    <tr>
      <td align="center" style="padding:28px 12px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${LINE};">

          <tr>
            <td class="px" style="background:${BLUE};padding:28px 40px 36px;">
              <img src="${site}/email/wordmark-white.png" width="118" height="28" alt="Goalkeep" style="display:block;border:0;height:28px;width:auto;">
              <div style="margin-top:34px;font:700 13px/18px ${FONT};letter-spacing:.12em;text-transform:uppercase;color:${GOLD};">Data culture quiz results</div>
              <div class="hero-title" style="margin-top:12px;font:500 40px/46px ${FONT};letter-spacing:-0.02em;color:#ffffff;">You are a Data <strong style="font-weight:800;font-style:italic;color:${GOLD};">${escape(score.persona.label)}</strong></div>
              <div style="margin-top:10px;font:italic 400 17px/25px ${FONT};color:#ffffff;">${escape(score.persona.byline)}</div>
              <div style="margin-top:22px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.22);font:400 15px/22px ${FONT};color:${BLUE_SOFT};"><strong style="color:#ffffff;font-weight:700;">${escape(organization)}</strong>&nbsp;&nbsp;·&nbsp;&nbsp;Total score <strong style="color:#ffffff;font-weight:800;">${score.total}/${score.max}</strong></div>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:32px 40px 8px;">
              ${p(`Hi ${first}, thank you for taking the data culture quiz. Here is how you scored in each of the four domains.`, true)}
            </td>
          </tr>

          <tr>
            <td class="tiles" style="padding:12px 34px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>${tile(a.id, a.title, a.total, a.max)}${tile(b.id, b.title, b.total, b.max)}</tr>
                <tr>${tile(c.id, c.title, c.total, c.max)}${tile(d.id, d.title, d.total, d.max)}</tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BLUE_TINT};border-radius:12px;"><tr>
                <td style="padding:22px 24px;">
                  <div style="font:800 17px/24px ${FONT};color:${INK};">How do you compare?</div>
                  <div style="margin-top:6px;font:400 15px/23px ${FONT};color:${INK};">Curious about how your results compare against your peers, sector or region? Explore this report for yourself.</div>
                  <a href="${REPORT_URL}" style="display:inline-block;margin-top:16px;padding:12px 22px;border-radius:4px;background:${BLUE};color:#ffffff;font:700 14px/20px ${FONT};text-decoration:none;">Explore the report &rarr;</a>
                </td>
              </tr></table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:34px 40px 0;">
              <div style="font:800 19px/26px ${FONT};color:${INK};margin-bottom:14px;">Build a data culture that lasts</div>
              ${p(`Would you like to learn how to cultivate a sustainable data culture in your organization? Goalkeep offers the &ldquo;Data-Culture Rubric&rdquo; to all its clients. The rubric is a comprehensive assessment that evaluates various aspects of your organization's data-culture ecosystem.`)}
              ${p(`Through a series of thought-provoking questions, our rubric delves into the depth of your organization's data culture, providing you with a clear understanding of its strengths and areas that require improvement.`)}
              ${p(`To embark on this transformative journey of becoming a data-driven trailblazer, or to speak about taking a more in-depth data culture quiz for your entire team, simply reach out to us at <a href="mailto:${CONTACT}" style="color:${BLUE};font-weight:700;">${CONTACT}</a>.`, true)}
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:26px 40px 38px;">
              <a href="mailto:${CONTACT}?subject=${encodeURIComponent(`Our data culture quiz results (${persona})`)}" style="display:inline-block;padding:13px 24px;border-radius:4px;background:${GOLD};color:${INK};font:800 15px/20px ${FONT};text-decoration:none;">Let&rsquo;s talk &rarr;</a>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:20px 40px 24px;border-top:1px solid ${LINE};">
              <div style="font:400 12px/19px ${FONT};color:${MUTED};">Goalkeep enables social sector organisations to use data to scale impact.<br>You received this because you took the data culture quiz on <a href="${site}" style="color:${MUTED};">goalkeep.net</a>.</div>
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
    score.persona.byline,
    organization,
    "",
    `Hi ${name.split(/\s+/)[0] ?? name}, thank you for taking the data culture quiz.`,
    "",
    `Your total score: ${score.total}/${score.max}`,
    "",
    ...score.domains.map((dm) => `${dm.total}/${dm.max} in the domain of ${dm.title}`),
    "",
    `Curious about how your results compare against your peers, sector or region? Explore this report: ${REPORT_URL}`,
    "",
    `Would you like to learn how to cultivate a sustainable data culture in your organization? Goalkeep offers the "Data-Culture Rubric" to all its clients. The rubric is a comprehensive assessment that evaluates various aspects of your organization's data-culture ecosystem.`,
    "",
    "Through a series of thought-provoking questions, our rubric delves into the depth of your organization's data culture, providing you with a clear understanding of its strengths and areas that require improvement.",
    "",
    `To embark on this transformative journey of becoming a data-driven trailblazer, or to speak about taking a more in-depth data culture quiz for your entire team, simply reach out to us at ${CONTACT}.`,
    "",
    "Let's talk!",
  ].join("\n")

  return { subject, html, text }
}
