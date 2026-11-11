/**
 * The admin session. One password (the ADMIN_PASSWORD secret), no accounts.
 * A signed-in browser holds `expiry.HMAC-SHA256(expiry)` keyed by the
 * password, so nothing is stored server-side and changing the password signs
 * everyone out.
 */

const COOKIE = "gk_admin"
const LIFETIME_MS = 12 * 60 * 60 * 1000
const FAILED_LOGIN_DELAY_MS = 900

const encoder = new TextEncoder()

async function hmac(key: string, message: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message)))
}

const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")

/** Compares two digests of equal length without stopping at the first difference. */
function sameBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

/** Hashing both sides first makes the comparison length-independent too. */
async function safeEqual(secret: string, given: string) {
  const [a, b] = await Promise.all([hmac(secret, secret), hmac(secret, given)])
  return sameBytes(a, b)
}

async function sessionToken(password: string, expiry: number) {
  return `${expiry}.${hex(await hmac(password, String(expiry)))}`
}

async function validSession(password: string, token: string | undefined) {
  if (!token) return false
  const [expiry, signature] = token.split(".")
  if (!/^\d+$/.test(expiry) || Number(expiry) < Date.now()) return false
  if (!/^[0-9a-f]{64}$/.test(signature)) return false
  const given = Uint8Array.from(signature.match(/../g)!, (pair) => parseInt(pair, 16))
  return sameBytes(await hmac(password, expiry), given)
}

export type AdminSession = { enabled: boolean; signedIn: boolean }

async function context() {
  const { env } = await import("cloudflare:workers")
  const server = await import("@tanstack/react-start/server")
  return { password: env.ADMIN_PASSWORD, server }
}

/** Admin pages are private: never cached, never indexed. */
function keepPrivate(server: Awaited<ReturnType<typeof context>>["server"]) {
  server.setResponseHeader("Cache-Control", "no-store")
  server.setResponseHeader("X-Robots-Tag", "noindex, nofollow")
}

export async function readSession(): Promise<AdminSession> {
  const { password, server } = await context()
  keepPrivate(server)
  if (!password) return { enabled: false, signedIn: false }
  return { enabled: true, signedIn: await validSession(password, server.getCookie(COOKIE)) }
}

/** The boundary every admin server function crosses. */
export async function requireAdmin() {
  const session = await readSession()
  if (!session.signedIn) throw new Error("Not signed in.")
}

/** For the CSV route, which has a Request instead of server-function context. */
export async function requestIsAdmin(request: Request) {
  const { env } = await import("cloudflare:workers")
  if (!env.ADMIN_PASSWORD) return false
  const token = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((part) => part.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  return validSession(env.ADMIN_PASSWORD, token)
}

export async function signIn(attempt: string): Promise<boolean> {
  const { password, server } = await context()
  keepPrivate(server)
  if (!password) return false
  if (!(await safeEqual(password, attempt))) {
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS))
    return false
  }
  const url = server.getRequestUrl()
  const expiry = Date.now() + LIFETIME_MS
  server.setCookie(COOKIE, await sessionToken(password, expiry), {
    httpOnly: true,
    secure: !["localhost", "127.0.0.1"].includes(url.hostname),
    sameSite: "strict",
    path: "/",
    maxAge: LIFETIME_MS / 1000,
  })
  return true
}

export async function signOut() {
  const { server } = await context()
  server.deleteCookie(COOKIE, { path: "/" })
}
