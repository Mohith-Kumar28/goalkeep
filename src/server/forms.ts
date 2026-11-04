import { createServerFn } from "@tanstack/react-start"
import { contact } from "@/content/homepage"
import { contactEmail } from "./contact-email"

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
    if (!contact.serviceOptions.includes(data.service)) {
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

/**
 * Emails a new enquiry to everyone in CONTACT_EMAIL_TO (comma-separated) via
 * Resend. Replying to the email replies to the person who wrote in.
 */
async function notifyContact(
  env: MailEnv,
  data: Omit<ContactInput, "website">
) {
  const to = (env.CONTACT_EMAIL_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean)
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL_FROM || to.length === 0) {
    console.error(
      "contact email skipped: RESEND_API_KEY, CONTACT_EMAIL_FROM or CONTACT_EMAIL_TO is not set"
    )
    return
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_EMAIL_FROM,
        to,
        reply_to: data.email,
        ...contactEmail(data),
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      console.error(
        `contact email failed: ${response.status} ${await response.text()}`
      )
    }
  } catch (error) {
    console.error("contact email failed:", error)
  }
}

/* Goalkeep's existing Mailchimp audience - the same list the sign-up form on
   goalkeep.net posts to. */
const MAILCHIMP =
  "https://goalkeep.us8.list-manage.com/subscribe/post-json?u=c21fe4d3a05df1cb8cee0f967&id=b94a34e160&f_id=00a139e3f0"

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((input: { email: string; website: string }) => ({
    email: text(input.email, 200).toLowerCase(),
    website: text(input.website, 200),
  }))
  .handler(async ({ data }): Promise<FormResult> => {
    if (data.website) return { ok: true }
    if (!EMAIL.test(data.email))
      return { ok: false, error: "Please enter a valid email address." }

    const { env } = await import("cloudflare:workers")
    // Signing up twice is not an error.
    await env.DB.prepare(
      "INSERT OR IGNORE INTO newsletter_signups (email) VALUES (?)"
    )
      .bind(data.email)
      .run()

    // Best effort: also add them to the Mailchimp list. The address is already
    // stored, so a Mailchimp failure never fails the sign-up.
    try {
      await fetch(`${MAILCHIMP}&EMAIL=${encodeURIComponent(data.email)}&c=cb`, {
        signal: AbortSignal.timeout(4000),
      })
    } catch {
      // Stored in D1 regardless.
    }

    return { ok: true }
  })
