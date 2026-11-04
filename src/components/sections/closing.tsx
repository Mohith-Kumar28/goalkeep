import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { closing } from '@/content/homepage'
import { GkButton } from '@/components/primitives/gk-button'
import { MarkAssembly } from '@/components/primitives/logo-shapes'
import { Reveal } from '@/components/primitives/reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { subscribeNewsletter } from '@/server/forms'

/**
 * The bookend.
 *
 * "I think right now what's happening is that it's just seeming like a clunky
 * random thing going on with the circle" — so the 260px spinning four-segment
 * ring is gone.
 *
 * Two things replace it, and both are the same instruction: "these things
 * appearing over here, one by one — you come to the last section and first
 * this appears, then this, then this," and "pieces from the logo, instead of
 * using the whole logo, getting assembled and forming a shape on scroll."
 *
 *   · Every element of the copy is its own Reveal on an increasing delay, so
 *     the close writes itself as you arrive at it.
 *   · The mark itself is scattered into its four arcs and pulled back together
 *     by the scroll — the fragments arrive one at a time and land as the
 *     wordmark's ring. It is the page's last frame, and the only place the
 *     whole mark is ever drawn from its parts.
 *
 * 23 Sep: leaner. Less vertical space, a smaller mark, no highlighter, no
 * margin note, and the primary button in yellow. 23 Oct: the headline is set
 * like the rest - light, with "clarity and certainty" in bold italic.
 *
 * 21 Oct: "Talk to us" scrolls to the contact form below, and the data
 * culture quiz button is now a newsletter sign-up that flips into an email
 * box when clicked.
 */
export function Closing() {
  return (
    <section
      data-ground="navy"
      className="ground-navy accent-yellow relative overflow-hidden py-14 md:py-16"
      aria-labelledby="closing-heading"
      style={{ backgroundColor: 'var(--gk-navy)' }}
    >
      <div className="shell relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* The eyebrow and the second headline line ("Sub: remove") both
              went in the copy replacement. One sentence, then the buttons. */}
          <Reveal delay={0.12}>
            <h2 id="closing-heading" className="display max-w-[22ch]">
              {closing.headlineLead} <em>{closing.headlineEm}</em>
            </h2>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <GkButton href={closing.primaryCta.to} variant="accent" onDark withArrow>
                {closing.primaryCta.label}
              </GkButton>
              <Newsletter />
            </div>
          </Reveal>

          {/* The mark assembles on phones too, under the buttons — it is the
              page's last frame and worth having on every screen. */}
          <div className="mt-10 flex justify-center lg:hidden">
            <MarkAssembly size={120} />
          </div>
        </div>

        <div className="hidden lg:col-span-4 lg:flex lg:items-center lg:justify-center">
          <MarkAssembly size={150} />
        </div>
      </div>
    </section>
  )
}

type Status = 'idle' | 'sending' | 'done' | 'error'

/**
 * "Subscribe to our newsletter. Click it. Flips into a box. Submit. Simple."
 */
function Newsletter() {
  const reduced = useReducedMotion()
  const { newsletter } = closing
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const flip = reduced
    ? {}
    : {
        initial: { rotateX: -90, opacity: 0 },
        animate: { rotateX: 0, opacity: 1 },
        exit: { rotateX: 90, opacity: 0 },
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
      }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setStatus('sending')
    setError('')
    try {
      const result = await subscribeNewsletter({
        data: {
          email: String(form.get('email') ?? ''),
          website: String(form.get('website') ?? ''),
        },
      })
      if (result.ok) {
        setStatus('done')
      } else {
        setStatus('error')
        setError(result.error)
      }
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className={open && status !== 'done' ? 'w-full [perspective:800px] sm:w-auto' : '[perspective:800px]'}>
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.div key="button" {...flip}>
            <GkButton variant="secondary" onDark onClick={() => setOpen(true)} aria-expanded={false}>
              {newsletter.label}
            </GkButton>
          </motion.div>
        ) : status === 'done' ? (
          <motion.p
            key="done"
            {...flip}
            role="status"
            className="flex min-h-[3.25rem] items-center rounded-[var(--r-btn)] border border-white/40 px-5 font-bold text-white"
          >
            {newsletter.done}
          </motion.p>
        ) : (
          <motion.form key="form" {...flip} onSubmit={submit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder={newsletter.placeholder}
                disabled={status === 'sending'}
                aria-invalid={status === 'error' || undefined}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className="min-h-[3.25rem] min-w-0 flex-1 rounded-[var(--r-btn)] sm:w-[17rem] sm:flex-none border border-white/40 bg-white px-4 text-[length:var(--fs-base)] text-[var(--gk-ink)] placeholder:text-[var(--gk-ink)]/55 focus:border-[var(--gk-yellow)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--gk-yellow)]"
              />
              {/* The honeypot. Off screen, out of the tab order, ignored by
                  autofill - people never see it, bots fill it in. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />
              <GkButton type="submit" variant="secondary" onDark disabled={status === 'sending'} className="shrink-0">
                {status === 'sending' ? 'Subscribing…' : newsletter.submit}
              </GkButton>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="text-[length:var(--fs-sm)] font-semibold text-[var(--gk-yellow)]">
                {error}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
