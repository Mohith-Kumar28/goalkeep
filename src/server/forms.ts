import { createServerFn } from "@tanstack/react-start"
import { contact } from "@/content/homepage"
import { newsletter, readers } from "@/content/design/newsletter"
import { detailOptions, likert, scoreQuiz, statementCount } from "@/content/quiz"
import type { Answer, QuizDetails } from "@/content/quiz"
import { contactEmail } from "./contact-email"
import { addToMailchimp } from "./mailchimp"
import type { MailchimpEnv } from "./mailchimp"
import { editionEmail } from "./newsletter-email"
import { quizEmail } from "./quiz-email"

/**
 * Every form on the site. Each writes to the `goalkeep-site` D1 database
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
    const fromPartnerPage = (getRequestHeader("referer") ?? "").includes("/partner-with-us")

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

    // Best effort: the enquiry is already stored, so neither call can fail
    // the submission.
    await Promise.all([
      notifyContact(env, data, siteOrigin(getRequestHeader)),
      addToMailchimp(env, {
        email: data.email,
        name: data.name,
        source: fromPartnerPage ? "partner" : "contact",
      }),
    ])

    return { ok: true }
  })

/** The site's own origin, so emails link and load images from wherever it is served. */
function siteOrigin(header: (name: "host") => string | undefined) {
  const host = header("host")
  if (!host) return "https://goalkeep.org"
  return `${host.startsWith("localhost") ? "http" : "https"}://${host}`
}

type MailEnv = MailchimpEnv & {
  RESEND_API_KEY?: string
  CONTACT_EMAIL_FROM?: string
  CONTACT_EMAIL_TO?: string
  QUIZ_EMAIL_FROM?: string
  QUIZ_REPLY_TO?: string
}

/** Everyone in CONTACT_EMAIL_TO (comma-separated). */
function teamAddresses(env: MailEnv) {
  return (env.CONTACT_EMAIL_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean)
}

type Mail = {
  /** Overrides CONTACT_EMAIL_FROM for this one email. */
  from?: string
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
  const from = mail.from ?? env.CONTACT_EMAIL_FROM
  if (!env.RESEND_API_KEY || !from || mail.to.length === 0) {
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
      body: JSON.stringify({ ...mail, from }),
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
async function notifyContact(env: MailEnv, data: Omit<ContactInput, "website">, site: string) {
  await sendMail(env, "contact", {
    to: teamAddresses(env),
    reply_to: data.email,
    ...contactEmail(data, site),
  })
}

export type NewsletterInput = {
  email: string
  name?: string
  organization?: string
  audience?: string
  /** The edition whose "Subscribe to the next issue" button was used. */
  edition?: string
  website: string
}

const readerNamed = (id: string) => readers.find((r) => r.id === id) ?? null

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((input: NewsletterInput) => {
    const editionId = text(input.edition, 20)
    return {
      email: text(input.email, 200).toLowerCase(),
      name: text(input.name, 120) || null,
      organization: text(input.organization, 200) || null,
      audience: readerNamed(text(input.audience, 20)),
      edition: newsletter.editions.find((e) => e.id === editionId) ?? null,
      website: text(input.website, 200),
    }
  })
  .handler(async ({ data }): Promise<FormResult> => {
    if (data.website) return { ok: true }
    if (!EMAIL.test(data.email))
      return { ok: false, error: "Please enter a valid email address." }

    const { env } = await import("cloudflare:workers")
    // Signing up twice is not an error; a second sign-up fills in whatever
    // the first one left out.
    await env.DB.prepare(
      `INSERT INTO newsletter_signups (email, name, organization, audience, edition) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (email) DO UPDATE SET
         name = COALESCE(excluded.name, name),
         organization = COALESCE(excluded.organization, organization),
         audience = COALESCE(excluded.audience, audience),
         edition = COALESCE(excluded.edition, edition)`
    )
      .bind(data.email, data.name, data.organization, data.audience?.id ?? null, data.edition?.id ?? null)
      .run()

    // Sign-ups live only in D1 for now (Nov 11: "forget mailchimp
    // integration"); export them from /api/export/newsletter.csv. Best
    // effort: the address is already stored, so the email cannot fail the
    // sign-up. Most of each edition is shared, so a reader who didn't pick
    // an audience gets the nonprofit version.
    if (data.edition) {
      const { getRequestHeader } = await import("@tanstack/react-start/server")
      await sendMail(env, "newsletter edition", {
        to: [data.email],
        reply_to: teamAddresses(env)[0],
        ...editionEmail(data.edition, data.audience?.version ?? "nonprofit", siteOrigin(getRequestHeader)),
      })
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
    sector: text(input.sector, 80),
    sectorOther: text(input.sectorOther, 120),
    role: text(input.role, 80),
    roleOther: text(input.roleOther, 120),
    size: text(input.size, 40),
    budget: text(input.budget, 40),
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
    if (data.sector && !detailOptions.sector.includes(data.sector))
      return { ok: false, error: "Please choose your primary sector." }
    if (data.sector === "Other" && !data.sectorOther)
      return { ok: false, error: "Please tell us your primary sector." }
    if (!detailOptions.role.includes(data.role))
      return { ok: false, error: "Please choose your role." }
    if (data.role === "Other" && !data.roleOther)
      return { ok: false, error: "Please tell us your role." }
    if (data.size && !detailOptions.size.includes(data.size))
      return { ok: false, error: "Please choose your organisation’s size." }
    if (data.budget && !detailOptions.budget.includes(data.budget))
      return { ok: false, error: "Please choose your organisation’s budget." }
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
      "INSERT INTO quiz_responses (name, email, organization, region, sector, role, size, budget, answers, score_data, score_technology, score_process, score_strategy, score_overall, band, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        data.name,
        data.email,
        data.organization,
        null,
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
        score.persona.id,
        userAgent
      )
      .run()

    const [emailed] = await Promise.all([
      sendMail(env, "quiz", {
        from: env.QUIZ_EMAIL_FROM,
        to: [data.email],
        reply_to: env.QUIZ_REPLY_TO ?? teamAddresses(env)[0],
        ...quizEmail(data.name, data.organization, score, siteOrigin(getRequestHeader)),
      }),
      addToMailchimp(env, {
        email: data.email,
        name: data.name,
        source: "quiz",
        tags: [`Quiz: Data ${score.persona.label}`],
      }),
    ])

    return { ok: true, emailed }
  })
