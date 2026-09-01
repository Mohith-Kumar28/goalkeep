import type { ReactNode } from 'react'
import { GkButton } from '@/components/primitives/gk-button'

/**
 * Route stub for pages beyond this build's scope.
 *
 * These exist so every nav link resolves with correct metadata rather than
 * 404ing, and so each page's identity is already set when it gets built out.
 * Deliberately honest about being unfinished — no fake content.
 */
export function PageStub({
  eyebrow,
  heading,
}: {
  eyebrow: string
  heading: ReactNode
}) {
  return (
    <section className="band" style={{ backgroundColor: 'var(--bg-2)' }}>
      <div className="shell flex max-w-[52ch] flex-col gap-6">
        <p className="eyebrow">
          {eyebrow}
        </p>
        <h1 className="h2 text-[var(--fg-1)]">{heading}</h1>
        <p className="lead text-[var(--fg-2)]">
          There&rsquo;s more to say here than we&rsquo;ve written down so far.
          In the meantime, the quickest route to an answer is to ask us
          directly — a person replies.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <GkButton to="/" variant="secondary">
            Back to the homepage
          </GkButton>
          <GkButton to="/contact" variant="tertiary" withArrow>
            Write to us
          </GkButton>
        </div>
      </div>
    </section>
  )
}
