/**
 * The slice of the Workers runtime the site uses. @cloudflare/workers-types
 * isn't installed and its globals clash with the DOM lib, so this declares
 * only the D1 binding from wrangler.jsonc and the email and Mailchimp variables.
 */
declare module "cloudflare:workers" {
  interface D1Result {
    success: boolean
    meta: { changes: number }
  }

  interface D1PreparedStatement {
    bind: (...values: Array<string | number | null>) => D1PreparedStatement
    run: () => Promise<D1Result>
  }

  interface D1Database {
    prepare: (query: string) => D1PreparedStatement
  }

  export const env: {
    DB: D1Database
    /** Secret: `wrangler secret put RESEND_API_KEY`. */
    RESEND_API_KEY?: string
    /** Sender on a Resend-verified domain, e.g. "Goalkeep <website@goalkeep.net>". */
    CONTACT_EMAIL_FROM?: string
    /** Comma-separated addresses that receive each contact enquiry. */
    CONTACT_EMAIL_TO?: string
    /** Secret: a Mailchimp Marketing API key, ending in its server, e.g. "…-us8". */
    MAILCHIMP_API_KEY?: string
    /** Secret: the audience (list) id the forms add members to. */
    MAILCHIMP_LIST_ID?: string
  }
}
