import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { submitContact } from '@/server/forms'

export type ContactFormState =
  | { status: 'closed' }
  | { status: 'open'; intent: string }
  | { status: 'sending'; intent: string }
  | { status: 'sent' }
  | { status: 'error'; intent: string; message: string }

export type ContactFields = { name: string; email: string; organization: string; website: string }

type ContactFormApi = {
  state: ContactFormState
  /** Opens the form, or retargets it when it is already open. */
  open: (intent: string) => void
  close: () => void
  submit: (fields: ContactFields) => Promise<void>
}

const ContactFormContext = createContext<ContactFormApi | null>(null)

export function useContactForm(): ContactFormApi {
  const api = useContext(ContactFormContext)
  if (!api) throw new Error('useContactForm needs a <DesignPage> above it')
  return api
}

/**
 * `service` has to be one of the homepage's four service titles: the server
 * rejects anything else. The CTA label travels in the message, since the
 * design's form has no message field.
 */
export function ContactFormProvider({ service, children }: { service: string; children: ReactNode }) {
  const [state, setState] = useState<ContactFormState>({ status: 'closed' })
  const intent = useRef('')

  const open = useCallback((next: string) => {
    setState((current) => {
      if (current.status === 'sending' || current.status === 'sent') return current
      intent.current = next
      return current.status === 'error' ? { ...current, intent: next } : { status: 'open', intent: next }
    })
  }, [])

  const close = useCallback(() => setState({ status: 'closed' }), [])

  const submit = useCallback(
    async (fields: ContactFields) => {
      const label = intent.current
      setState({ status: 'sending', intent: label })
      try {
        const result = await submitContact({
          data: {
            ...fields,
            service,
            message: `${label} (from ${window.location.pathname})`,
          },
        })
        setState(result.ok ? { status: 'sent' } : { status: 'error', intent: label, message: result.error })
      } catch {
        setState({
          status: 'error',
          intent: label,
          message: 'Something went wrong sending your message. Please try again.',
        })
      }
    },
    [service],
  )

  const api = useMemo(() => ({ state, open, close, submit }), [state, open, close, submit])
  return <ContactFormContext.Provider value={api}>{children}</ContactFormContext.Provider>
}
