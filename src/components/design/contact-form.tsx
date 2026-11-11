import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { contact } from '@/content/homepage'
import { submitContact } from '@/server/forms'

export type ContactFormState =
  | { status: 'closed' }
  | { status: 'open'; intent: string }
  | { status: 'sending'; intent: string }
  | { status: 'sent' }
  | { status: 'error'; intent: string; message: string }

export type ContactFields = { name: string; email: string; organization: string; website: string }

/** Every choice in the "How can we assist you?" dropdown. */
export const serviceChoices = [...contact.serviceOptions, contact.generalEnquiry]

const SPONSOR_KICKSTARTER = 'Sponsor a Kickstarter program'
const FUND_LITERACY = 'Fund a Data Literacy cohort'

/** The dropdown choice a CTA should open the form on: a funding CTA on a
 *  program page picks that program's sponsorship, anything else the page's
 *  own service. */
function serviceFor(intent: string, fallback: string) {
  if (/fund|sponsor|support a cohort/i.test(intent)) {
    const path = typeof window === 'undefined' ? '' : window.location.pathname
    if (/literacy/i.test(intent) || path.includes('data-literacy')) return FUND_LITERACY
    if (/kickstarter/i.test(intent) || path.includes('kickstarter')) return SPONSOR_KICKSTARTER
  }
  return fallback
}

type ContactFormApi = {
  state: ContactFormState
  /** The dropdown's current choice, prefilled from the CTA that opened the form. */
  service: string
  setService: (service: string) => void
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
 * `service` is the page's default dropdown choice; it has to be one of
 * `serviceChoices`, which the server also accepts. The CTA label travels in
 * the message, since the design's form has no message field.
 */
export function ContactFormProvider({ service: pageService, children }: { service: string; children: ReactNode }) {
  const [state, setState] = useState<ContactFormState>({ status: 'closed' })
  const [service, setService] = useState(pageService)
  const intent = useRef('')

  const open = useCallback(
    (next: string) => {
      setState((current) => {
        if (current.status === 'sending' || current.status === 'sent') return current
        intent.current = next
        return current.status === 'error' ? { ...current, intent: next } : { status: 'open', intent: next }
      })
      setService(serviceFor(next, pageService))
    },
    [pageService],
  )

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

  const api = useMemo(
    () => ({ state, service, setService, open, close, submit }),
    [state, service, open, close, submit],
  )
  return <ContactFormContext.Provider value={api}>{children}</ContactFormContext.Provider>
}
