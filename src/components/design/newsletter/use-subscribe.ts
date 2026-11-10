import { useCallback, useState } from 'react'
import { subscribeNewsletter } from '@/server/forms'

export type FormId = 'card' | 'closing'

export type Signup = { email: string; name: string; organization: string; website: string }

export type SubscribeState =
  | { status: 'idle' }
  | { status: 'sending'; form: FormId }
  | { status: 'done' }
  | { status: 'error'; form: FormId; message: string }

/** Both forms on the page share this: signing up in one thanks you in both. */
export function useSubscribe() {
  const [state, setState] = useState<SubscribeState>({ status: 'idle' })

  const subscribe = useCallback(async (form: FormId, signup: Signup) => {
    setState({ status: 'sending', form })
    try {
      const result = await subscribeNewsletter({ data: signup })
      setState(result.ok ? { status: 'done' } : { status: 'error', form, message: result.error })
    } catch {
      setState({ status: 'error', form, message: 'Something went wrong signing you up. Please try again.' })
    }
  }, [])

  const reset = useCallback(() => setState({ status: 'idle' }), [])
  return { state, subscribe, reset }
}
