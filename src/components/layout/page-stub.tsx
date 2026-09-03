import type { ReactNode } from 'react'
import { GkButton } from '@/components/primitives/gk-button'
import { Scribble } from '@/components/primitives/doodles'
import { PatternField } from '@/components/primitives/shapes'

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
    <section className="ground-cream band accent-coral relative">
      <PatternField pattern="dots" color="var(--gk-ink)" opacity={0.05} scale={30} />

      <div className="shell relative flex max-w-[52ch] flex-col gap-6">
        <p className="mb-1 flex items-center gap-3">
          <span className="eyebrow">{eyebrow}</span>
          <Scribble
            name="arrow-hook"
            color="var(--gk-coral)"
            className="h-6 w-10 opacity-80"
          />
        </p>
        <h1 className="h2">{heading}</h1>
        <p className="lead">
          There&rsquo;s more to say here than we&rsquo;ve written down so far.
          In the meantime, the quickest route to an answer is to ask us
          directly — a person replies.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <GkButton to="/" variant="primary" withArrow>
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
