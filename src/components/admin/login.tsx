import { useRouter } from "@tanstack/react-router"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { FormEvent } from "react"
import { adminSignIn } from "@/server/admin/api"

export function LoginScreen() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError("")
    try {
      const { ok } = await adminSignIn({ data: { password } })
      if (ok) {
        await router.invalidate()
        return
      }
      setError("That password is not right. Try again.")
      setPassword("")
    } catch {
      setError("Could not reach the server. Try again in a moment.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad ad-login">
      <div className="ad-login-inner">
        <div className="ad-login-brand">
          <img src="/wordmark-white.webp" alt="Goalkeep" width={673} height={160} />
          <span>admin</span>
        </div>
        <form className="ad-card ad-login-card" onSubmit={submit} noValidate>
          <div>
            <h1>Sign in</h1>
            <p>Enquiries, newsletter sign-ups and quiz responses, in one place.</p>
          </div>
          <div className="ad-field">
            <label className="ad-label" htmlFor="admin-password">
              Password
            </label>
            <div className="ad-password">
              <input
                id="admin-password"
                className="ad-input"
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "admin-password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
              </button>
            </div>
            {error && (
              <p id="admin-password-error" className="ad-error" role="alert">
                <AlertCircle aria-hidden />
                {error}
              </p>
            )}
          </div>
          <button type="submit" className="dc-btn dc-btn-primary" disabled={busy || !password}>
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
