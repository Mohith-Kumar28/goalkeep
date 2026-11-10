import type { ReactNode } from "react"
import { useContactForm } from "../contact-form"
import { kickstarter } from "@/content/design/kickstarter"

export function ApplyLink({
  className,
  label,
  children,
}: {
  className: string
  label: string
  children: ReactNode
}) {
  const form = useContactForm()
  const { applyUrl } = kickstarter
  if (applyUrl.startsWith("#")) {
    return (
      <a href={applyUrl} className={className} onClick={() => form.open(label)}>
        {children}
      </a>
    )
  }
  return (
    <a
      href={applyUrl}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}
