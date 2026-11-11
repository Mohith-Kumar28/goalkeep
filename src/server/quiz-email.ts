import { marks } from "@/content/design/quiz"
import type { DomainId, QuizScore } from "@/content/quiz"
import { BLUE, BLUE_TINT, FONT, INK, LINE, MUTED, accent, button, emailDocument, escape, paragraph, section } from "./email-layout"

/**
 * The results email a quiz-taker receives, in the order Goalkeep sent on
 * Nov 11, in the site's own scheme: the hero blue, white grounds, and the
 * gold used only as the accent it is on the site (the persona, the buttons).
 * Tables and inline styles because email clients ignore most CSS; the
 * <style> block only tightens paddings on phones.
 */

const REPORT_URL = "https://lookerstudio.google.com/reporting/345e34c9-1bd0-4d44-9e9b-486b3ac6b9b1"
const CONTACT = "aditya@goalkeep.org"

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


export function quizEmail(name: string, organization: string, score: QuizScore, site?: string) {
  const persona = `Data ${score.persona.label}`
  const subject = `You are a ${persona}: your data culture quiz results`
  const first = escape(name.split(/\s+/)[0] ?? name)
  const [a, b, c, d] = score.domains

  const body = [
    section(paragraph(`Hi ${first}, thank you for taking the data culture quiz. Here is how you scored in each of the four domains.`, true), "30px 40px 4px"),
    `<tr><td class="tiles" style="padding:12px 34px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>${tile(a.id, a.title, a.total, a.max)}${tile(b.id, b.title, b.total, b.max)}</tr>
        <tr>${tile(c.id, c.title, c.total, c.max)}${tile(d.id, d.title, d.total, d.max)}</tr>
      </table>
    </td></tr>`,
    section(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BLUE_TINT};border-radius:12px;"><tr><td style="padding:22px 24px;">
        <div style="font:800 17px/24px ${FONT};color:${INK};">How do you compare?</div>
        <div style="margin:6px 0 16px;font:400 15px/23px ${FONT};color:${INK};">Curious about how your results compare against your peers, sector or region? Explore this report for yourself.</div>
        ${button(REPORT_URL, "Explore the report &rarr;")}
      </td></tr></table>`,
      "28px 40px 0",
    ),
    section(
      `<div style="font:800 19px/26px ${FONT};color:${INK};margin-bottom:14px;">Build a data culture that lasts</div>
      ${paragraph(`Would you like to learn how to cultivate a sustainable data culture in your organization? Goalkeep offers the &ldquo;Data-Culture Rubric&rdquo; to all its clients. The rubric is a comprehensive assessment that evaluates various aspects of your organization's data-culture ecosystem.`)}
      ${paragraph(`Through a series of thought-provoking questions, our rubric delves into the depth of your organization's data culture, providing you with a clear understanding of its strengths and areas that require improvement.`)}
      ${paragraph(`To embark on this transformative journey of becoming a data-driven trailblazer, or to speak about taking a more in-depth data culture quiz for your entire team, simply reach out to us at <a href="mailto:${CONTACT}" style="color:${BLUE};font-weight:700;">${CONTACT}</a>.`, true)}`,
      "34px 40px 0",
    ),
    section(button(`mailto:${CONTACT}?subject=${encodeURIComponent(`Our data culture quiz results (${persona})`)}`, "Let&rsquo;s talk &rarr;", "gold"), "26px 40px 36px"),
  ].join("")

  const html = emailDocument({
    subject,
    preheader: `${persona} · ${score.total}/${score.max}`,
    header: {
      eyebrow: "Data culture quiz results",
      title: `You are a Data ${accent(score.persona.label)}`,
      sub: `<em style="color:#ffffff;font-size:17px;">${escape(score.persona.byline)}</em><br><span style="display:inline-block;margin-top:14px;"><strong style="color:#ffffff;">${escape(organization)}</strong>&nbsp;&nbsp;·&nbsp;&nbsp;Total score <strong style="color:#ffffff;">${score.total}/${score.max}</strong></span>`,
    },
    body,
    footer: `Goalkeep enables social sector organisations to use data to scale impact.<br>You received this because you took the data culture quiz on <a href="https://goalkeep.org" style="color:${MUTED};">goalkeep.org</a>.`,
    site,
  })

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
