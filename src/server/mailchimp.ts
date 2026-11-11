import { createHash } from "node:crypto"

/**
 * The contact form and the quiz add their submitter to Goalkeep's Mailchimp
 * audience (Nov 10 review: "everyone who submits they should get added to the
 * Mailchimp database"). Newsletter sign-ups stopped on Nov 11 and stay in D1.
 *
 * With MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID set, this uses the Marketing
 * API, which can tag the member. Without them it falls back to the audience's
 * public sign-up endpoint, the one goalkeep.net's own form posts to, which
 * takes the email and name but no tags.
 *
 * New members are always `pending`: Mailchimp emails them to confirm before
 * they get anything (double opt-in). Existing members keep their status.
 */

export type MailchimpEnv = {
  MAILCHIMP_API_KEY?: string
  MAILCHIMP_LIST_ID?: string
}

export type FormSource = "contact" | "partner" | "newsletter" | "quiz"

const SOURCE_TAG: Record<FormSource, string> = {
  contact: "Website: contact form",
  partner: "Website: partner with us",
  newsletter: "Website: newsletter",
  quiz: "Website: data culture quiz",
}

export type MailchimpMember = {
  email: string
  name?: string | null
  source: FormSource
  /** Added beside the source tag, e.g. the newsletter audience or quiz band. */
  tags?: Array<string>
}

const PUBLIC_SIGNUP =
  "https://goalkeep.us8.list-manage.com/subscribe/post-json?u=c21fe4d3a05df1cb8cee0f967&id=b94a34e160&f_id=00a139e3f0"

const TIMEOUT_MS = 5000

/** Best effort: the submission is already stored, so this logs and never throws. */
export async function addToMailchimp(env: MailchimpEnv, member: MailchimpMember): Promise<void> {
  const tags = [SOURCE_TAG[member.source], ...(member.tags ?? [])]
  if (import.meta.env.DEV) {
    console.log(`mailchimp skipped in dev: would add ${member.email} tagged ${tags.join(", ")}`)
    return
  }
  try {
    if (env.MAILCHIMP_API_KEY && env.MAILCHIMP_LIST_ID) {
      await viaApi(env.MAILCHIMP_API_KEY, env.MAILCHIMP_LIST_ID, member, tags)
    } else {
      await viaPublicSignup(member)
    }
  } catch (error) {
    console.error(`mailchimp (${member.source}) failed:`, error)
  }
}

async function viaApi(key: string, listId: string, member: MailchimpMember, tags: Array<string>) {
  const server = key.split("-")[1]
  if (!server) {
    console.error("mailchimp skipped: MAILCHIMP_API_KEY has no server suffix (expected key-usN)")
    return
  }
  const hash = createHash("md5").update(member.email.toLowerCase()).digest("hex")
  const url = `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}`
  const headers = {
    Authorization: `Basic ${btoa(`goalkeep:${key}`)}`,
    "Content-Type": "application/json",
  }

  const upsert = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      email_address: member.email,
      status_if_new: "pending",
      ...(member.name ? { merge_fields: { FNAME: member.name } } : {}),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!upsert.ok) {
    console.error(`mailchimp (${member.source}) upsert failed: ${upsert.status} ${await upsert.text()}`)
    return
  }

  const tagged = await fetch(`${url}/tags`, {
    method: "POST",
    headers,
    body: JSON.stringify({ tags: tags.map((name) => ({ name, status: "active" })) }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!tagged.ok) {
    console.error(`mailchimp (${member.source}) tagging failed: ${tagged.status} ${await tagged.text()}`)
  }
}

async function viaPublicSignup(member: MailchimpMember) {
  const fname = member.name ? `&FNAME=${encodeURIComponent(member.name)}` : ""
  const response = await fetch(`${PUBLIC_SIGNUP}&EMAIL=${encodeURIComponent(member.email)}${fname}&c=cb`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const body = await response.text()
  // An address already on the list comes back as an error; that is fine.
  if (!response.ok || (body.includes('"result":"error"') && !body.includes("already subscribed"))) {
    console.error(`mailchimp (${member.source}) public sign-up failed: ${response.status} ${body.slice(0, 300)}`)
  }
}
