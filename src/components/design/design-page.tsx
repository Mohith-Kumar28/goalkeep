import type { ReactNode } from 'react'
import { ContactFormProvider } from './contact-form'

/**
 * Wraps a services or programs page: the `.dc` base styles, plus the form
 * state that the hero buttons and the contact band share.
 */
export function DesignPage({ service, children }: { service: string; children: ReactNode }) {
  return (
    <ContactFormProvider service={service}>
      <div className="dc">{children}</div>
    </ContactFormProvider>
  )
}
