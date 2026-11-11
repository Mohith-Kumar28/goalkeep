import type { DomainId, QuizScore } from "@/content/quiz"

/**
 * The results email a quiz-taker receives, in the order Goalkeep sent on
 * Nov 11, in the site's palette: a gold opening, a navy score band, the four
 * domains as tinted tiles. Tables and inline styles because email clients
 * ignore most CSS; the <style> block only tightens paddings on phones.
 */

const NAVY = "#2f4a92"
const NAVY_DEEP = "#1e3266"
const INK = "#14131a"
const MUTED = "#5b5a66"
const LINE = "#e5e7ee"
const PAGE = "#f4f1e8"
const GOLD = "#eac452"
const GOLD_SOFT = "#f5df9c"
const FONT = "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

/* The site's four accent tones, one per domain: tile ground, number, bar. */
const TONES: Record<DomainId, { bg: string; ink: string; bar: string }> = {
  data: { bg: "#eaeff9", ink: "#2f4d9f", bar: "#3f63c8" },
  technology: { bg: "#e7f2f0", ink: "#176059", bar: "#2f9c8f" },
  process: { bg: "#fbeee9", ink: "#9c452a", bar: "#e07a5f" },
  strategy: { bg: "#fbf3df", ink: "#7d5e0c", bar: "#cfa72f" },
}

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

function tile(id: DomainId, title: string, total: number, max: number) {
  const tone = TONES[id]
  const width = Math.max(Math.round((total / max) * 100), 4)
  return `<td class="tile" width="50%" valign="top" style="padding:6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${tone.bg};border-radius:14px;"><tr><td style="padding:18px 18px 16px;">
      <div style="font:700 13px/18px ${FONT};color:${tone.ink};">${escape(title)}</div>
      <div style="margin-top:6px;font:800 32px/36px ${FONT};color:${tone.ink};">${total}<span style="font-size:16px;font-weight:700;opacity:.65;">/${max}</span></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;background:rgba(20,19,26,0.08);border-radius:999px;"><tr>
        <td style="width:${width}%;height:6px;background:${tone.bar};border-radius:999px;font-size:0;line-height:0;">&nbsp;</td><td style="font-size:0;line-height:0;">&nbsp;</td>
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
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escape(subject)}</title>
<style>
  @media (max-width: 520px) {
    .px { padding-left: 22px !important; padding-right: 22px !important; }
    .tiles { padding-left: 16px !important; padding-right: 16px !important; }
    .hero-title { font-size: 38px !important; line-height: 42px !important; }
    .tile { padding: 4px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${PAGE};">
  <div style="display:none;max-height:0;overflow:hidden;">${escape(persona)} · ${score.total}/${score.max}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
    <tr>
      <td align="center" style="padding:28px 12px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;">

          <tr>
            <td class="px" style="background:${NAVY};padding:20px 40px;">
              <img src="${site}/email/wordmark-white.png" width="118" height="28" alt="Goalkeep" style="display:block;border:0;height:28px;width:auto;">
            </td>
          </tr>

          <tr>
            <td class="px" style="background:${GOLD};padding:32px 40px 34px;">
              <div style="font:800 12px/16px ${FONT};letter-spacing:.14em;text-transform:uppercase;color:#5c4a12;">Data culture quiz results</div>
              <div style="margin-top:18px;font:700 17px/22px ${FONT};color:${NAVY_DEEP};">You are a</div>
              <div class="hero-title" style="margin-top:2px;font:800 46px/50px ${FONT};letter-spacing:-0.02em;color:${NAVY_DEEP};">Data <em>${escape(score.persona.label)}</em></div>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:22px;"><tr>
                <td style="background:${NAVY};border-radius:999px;padding:9px 18px;font:700 14px/20px ${FONT};color:#dbe2f4;white-space:nowrap;">
                  Total score&nbsp;&nbsp;<span style="font:800 18px/20px ${FONT};color:#ffffff;">${score.total}</span><span style="color:${GOLD_SOFT};font-weight:800;">/${score.max}</span>
                </td>
              </tr></table>
              <div style="margin-top:14px;font:600 14px/20px ${FONT};color:#5c4a12;">${escape(organization)}</div>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:30px 40px 8px;">
              ${p(`Hi ${first}, thank you for taking the data culture quiz. Here is how you scored across the four domains of a data culture.`, true)}
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
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};border-radius:16px;"><tr>
                <td style="padding:24px 26px;">
                  <div style="font:700 18px/26px ${FONT};color:#ffffff;">How do you compare?</div>
                  <div style="margin-top:6px;font:400 15px/23px ${FONT};color:#dbe2f4;">Curious about how your results compare against your peers, sector or region? Explore this report for yourself.</div>
                  <a href="${REPORT_URL}" style="display:inline-block;margin-top:18px;padding:12px 22px;border-radius:6px;background:${GOLD};color:${INK};font:800 14px/20px ${FONT};text-decoration:none;">Explore the report &rarr;</a>
                </td>
              </tr></table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:34px 40px 0;">
              <div style="font:800 20px/28px ${FONT};color:${INK};margin-bottom:14px;">Build a data culture that lasts</div>
              ${p(`Would you like to learn how to cultivate a sustainable data culture in your organization? Goalkeep offers the &ldquo;Data-Culture Rubric&rdquo; to all its clients. The rubric is a comprehensive assessment that evaluates various aspects of your organization's data-culture ecosystem.`)}
              ${p(`Through a series of thought-provoking questions, our rubric delves into the depth of your organization's data culture, providing you with a clear understanding of its strengths and areas that require improvement.`)}
              ${p(`To embark on this transformative journey of becoming a data-driven trailblazer, simply reach out to us at <a href="mailto:${CONTACT}" style="color:${NAVY};font-weight:700;text-decoration:underline;">${CONTACT}</a>.`, true)}
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:26px 40px 38px;">
              <a href="mailto:${CONTACT}?subject=${encodeURIComponent(`Our data culture quiz results (${persona})`)}" style="display:inline-block;padding:14px 26px;border-radius:6px;background:${NAVY};color:#ffffff;font:800 15px/20px ${FONT};text-decoration:none;">Let&rsquo;s talk &rarr;</a>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:22px 40px 26px;border-top:1px solid ${LINE};">
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
    `To embark on this transformative journey of becoming a data-driven trailblazer, simply reach out to us at ${CONTACT}.`,
    "",
    "Let's talk!",
  ].join("\n")

  return { subject, html, text }
}
