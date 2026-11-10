import { createServerFn } from "@tanstack/react-start"
import { contact } from "@/content/homepage"
import { detailOptions, likert, scoreQuiz, statementCount } from "@/content/quiz"
import type { Answer, QuizDetails } from "@/content/quiz"
import { contactEmail } from "./contact-email"
import { quizEmail } from "./quiz-email"

/**
 * The homepage's two forms. Both write to the `goalkeep-site` D1 database
 * (binding `DB`, schema in migrations/) - "for now we'll simply store it in a
 * database". Read submissions with:
 *
 *   wrangler d1 execute goalkeep-site --remote \
 *     --command "select * from contact_submissions order by id desc"
 *
 * Every field is validated again here; the browser's checks are a courtesy.
 */

export type FormResult = { ok: true } | { ok: false; error: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export type ContactInput = {
  name: string
  email: string
  organization: string
  service: string
  message: string
  /** The honeypot. Hidden from people; bots fill it in. */
  website: string
}

export const submitContact = createServerFn({ method: "POST" })
  .validator((input: ContactInput) => ({
    name: text(input.name, 120),
    email: text(input.email, 200).toLowerCase(),
    organization: text(input.organization, 200),
    service: text(input.service, 120),
    message: text(input.message, 4000),
    website: text(input.website, 200),
  }))
  .handler(async ({ data }): Promise<FormResult> => {
    // A filled honeypot gets a quiet "success" and nothing is stored.
    if (data.website) return { ok: true }
    if (!data.name) return { ok: false, error: "Please tell us your name." }
    if (!EMAIL.test(data.email))
      return { ok: false, error: "Please enter a valid email address." }
    if (!data.organization)
      return { ok: false, error: "Please tell us your organization’s name." }
    if (data.service !== contact.generalEnquiry && !contact.serviceOptions.includes(data.service)) {
      return { ok: false, error: "Please choose how we can help." }
    }
    if (!data.message)
      return { ok: false, error: "Please add a message for us." }

    const { env } = await import("cloudflare:workers")
    const { getRequestHeader } = await import("@tanstack/react-start/server")
    const userAgent = text(getRequestHeader("user-agent"), 300) || null

    await env.DB.prepare(
      "INSERT INTO contact_submissions (name, email, organization, service, message, user_agent) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(
        data.name,
        data.email,
        data.organization,
        data.service,
        data.message,
        userAgent
      )
      .run()

    // Best effort: the enquiry is already stored, so a mail failure never
    // fails the submission.
    await notifyContact(env, data)

    return { ok: true }
  })

type MailEnv = {
  RESEND_API_KEY?: string
  CONTACT_EMAIL_FROM?: string
  CONTACT_EMAIL_TO?: string
}

/** Everyone in CONTACT_EMAIL_TO (comma-separated). */
function teamAddresses(env: MailEnv) {
  return (env.CONTACT_EMAIL_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean)
}

type Mail = {
  to: Array<string>
  reply_to?: string
  subject: string
  html: string
  text: string
}

/**
 * Sends one email through Resend. Best effort: whatever prompted it is
 * already stored, so a mail failure is logged and never fails the form.
 */
async function sendMail(env: MailEnv, label: string, mail: Mail): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL_FROM || mail.to.length === 0) {
    console.error(
      `${label} email skipped: RESEND_API_KEY, CONTACT_EMAIL_FROM or a recipient is not set`
    )
    return false
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: env.CONTACT_EMAIL_FROM, ...mail }),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      console.error(
        `${label} email failed: ${response.status} ${await response.text()}`
      )
    }
    return response.ok
  } catch (error) {
    console.error(`${label} email failed:`, error)
    return false
  }
}

/** Replying to the email replies to the person who wrote in. */
async function notifyContact(env: MailEnv, data: Omit<ContactInput, "website">) {
  await sendMail(env, "contact", {
    to: teamAddresses(env),
    reply_to: data.email,
    ...contactEmail(data),
  })
}

/* Goalkeep's existing Mailchimp audience - the same list the sign-up form on
   goalkeep.net posts to. */
const MAILCHIMP =
  "https://goalkeep.us8.list-manage.com/subscribe/post-json?u=c21fe4d3a05df1cb8cee0f967&id=b94a34e160&f_id=00a139e3f0"

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((input: { email: string; name?: string; organization?: string; website: string }) => ({
    email: text(input.email, 200).toLowerCase(),
    name: text(input.name, 120) || null,
    organization: text(input.organization, 200) || null,
    website: text(input.website, 200),
  }))
  .handler(async ({ data }): Promise<FormResult> => {
    if (data.website) return { ok: true }
    if (!EMAIL.test(data.email))
      return { ok: false, error: "Please enter a valid email address." }

    const { env } = await import("cloudflare:workers")
    // Signing up twice is not an error; a second sign-up fills in a name or
    // organization the first one left out.
    await env.DB.prepare(
      `INSERT INTO newsletter_signups (email, name, organization) VALUES (?, ?, ?)
       ON CONFLICT (email) DO UPDATE SET
         name = COALESCE(excluded.name, name),
         organization = COALESCE(excluded.organization, organization)`
    )
      .bind(data.email, data.name, data.organization)
      .run()

    // Best effort: also add them to the Mailchimp list. The address is already
    // stored, so a Mailchimp failure never fails the sign-up.
    try {
      const fname = data.name ? `&FNAME=${encodeURIComponent(data.name)}` : ""
      await fetch(`${MAILCHIMP}&EMAIL=${encodeURIComponent(data.email)}${fname}&c=cb`, {
        signal: AbortSignal.timeout(4000),
      })
    } catch {
      // Stored in D1 regardless.
    }

    return { ok: true }
  })

/** The row is stored either way; `emailed` says whether the copy went out. */
export type QuizResult = { ok: true; emailed: boolean } | { ok: false; error: string }

export type QuizInput = QuizDetails & {
  answers: Array<number>
  website: string
}

const LIKERT_VALUES: ReadonlyArray<number> = likert.map((option) => option.value)

const isAnswer = (value: unknown): value is Answer =>
  typeof value === "number" && LIKERT_VALUES.includes(value)

/**
 * A completed data culture quiz. The score is recomputed here from the raw
 * answers, so what is stored and emailed never depends on the browser's
 * arithmetic.
 */
export const submitQuiz = createServerFn({ method: "POST" })
  .validator((input: QuizInput) => ({
    name: text(input.name, 120),
    email: text(input.email, 200).toLowerCase(),
    organization: text(input.organization, 200),
    region: text(input.region, 80),
    sector: text(input.sector, 80),
    sectorOther: text(input.sectorOther, 120),
    role: text(input.role, 80),
    roleOther: text(input.roleOther, 120),
    size: text(input.size, 40),
    budget: text(input.budget, 120),
    answers: Array.isArray(input.answers) ? input.answers.slice(0, statementCount) : [],
    website: text(input.website, 200),
  }))
  .handler(async ({ data }): Promise<QuizResult> => {
    if (data.website) return { ok: true, emailed: true }
    if (!data.name) return { ok: false, error: "Please tell us your name." }
    if (!EMAIL.test(data.email))
      return { ok: false, error: "Please enter a valid email address." }
    if (!data.organization)
      return { ok: false, error: "Please tell us your organisation’s name." }
    if (data.region && !detailOptions.region.includes(data.region))
      return { ok: false, error: "Please choose your region." }
    if (data.sector && !detailOptions.sector.includes(data.sector))
      return { ok: false, error: "Please choose your sector." }
    if (data.sector === "Other" && !data.sectorOther)
      return { ok: false, error: "Please tell us your sector." }
    if (!detailOptions.role.includes(data.role))
      return { ok: false, error: "Please choose your role." }
    if (data.role === "Other" && !data.roleOther)
      return { ok: false, error: "Please tell us your role." }
    if (data.size && !detailOptions.size.includes(data.size))
      return { ok: false, error: "Please choose your organisation’s size." }
    const answers = data.answers.filter(isAnswer)
    if (answers.length !== statementCount)
      return { ok: false, error: "Please answer every statement." }

    const score = scoreQuiz(answers)
    const byDomain = Object.fromEntries(
      score.domains.map((d) => [d.id, d.average])
    )
    const sector = data.sector === "Other" ? `Other: ${data.sectorOther}` : data.sector
    const role = data.role === "Other" ? `Other: ${data.roleOther}` : data.role

    const { env } = await import("cloudflare:workers")
    const { getRequestHeader } = await import("@tanstack/react-start/server")
    const userAgent = text(getRequestHeader("user-agent"), 300) || null

    await env.DB.prepare(
      "INSERT INTO quiz_responses (name, email, organization, region, sector, role, size, budget, answers, score_data, score_technology, score_process, score_strategy, score_overall, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        data.name,
        data.email,
        data.organization,
        data.region,
        sector,
        role,
        data.size,
        data.budget || null,
        JSON.stringify(answers),
        byDomain.data,
        byDomain.technology,
        byDomain.process,
        byDomain.strategy,
        score.average,
        userAgent
      )
      .run()

    const emailed = await sendMail(env, "quiz", {
      to: [data.email],
      reply_to: teamAddresses(env)[0],
      ...quizEmail(data.name, data.organization, score),
    })

    return { ok: true, emailed }
  })
