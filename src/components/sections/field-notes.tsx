import { Link } from '@tanstack/react-router'
import { CardRail } from '@/components/primitives/card-rail'
import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { fieldNoteSection, fieldNotes } from '@/content/homepage'
import type { FieldNote } from '@/content/types'
import { cn } from '@/lib/utils'

/**
 * Band 7 — no accent.
 *
 * Text-forward cards with no images, deliberately: a scroller of stock blog
 * imagery is the fastest route to slop, and mono meta plus a strong title is
 * both more editorial and far cheaper to maintain.
 */
export function FieldNotes() {
  return (
    <section
      className="band"
      style={{
        backgroundColor: 'var(--gk-teal-tint)',
        '--band-accent': 'var(--gk-teal-deep)',
        '--link-color': 'var(--gk-teal-ink)',
        '--link-color-hover': 'var(--gk-charcoal)',
      } as React.CSSProperties}
      aria-labelledby="field-notes-heading"
    >
      <div className="shell">
        <Reveal className="flex flex-col gap-5 pb-8 md:flex-row md:items-end md:gap-12 md:pb-6">
          <div className="flex max-w-[52ch] flex-col gap-4">
            <p className="eyebrow">
              {fieldNoteSection.eyebrow}
            </p>
            <h2 id="field-notes-heading" className="h2 text-[var(--fg-1)]">
              {fieldNoteSection.headline}
            </h2>
            <p className="lead text-[var(--fg-2)]">{fieldNoteSection.lead}</p>
          </div>
          <div className="shrink-0 md:ml-auto md:pb-1">
            <GkButton to={fieldNoteSection.cta.to} variant="tertiary" withArrow>
              {fieldNoteSection.cta.label}
            </GkButton>
          </div>
        </Reveal>
      </div>

      <div className="shell !pr-0">
        <CardRail label="Field notes" controlsClassName="pr-4 md:pr-12 xl:pr-16">
          {fieldNotes.map((note, i) => (
            <FieldNoteCard key={note.slug} note={note} index={i} />
          ))}
          <div className="w-4 shrink-0 md:w-8" aria-hidden="true" />
        </CardRail>
      </div>
    </section>
  )
}

const TAG_HUES = [
  'var(--gk-coral-tint)',
  'var(--gk-blue-tint)',
  'var(--gk-yellow-tint)',
  'var(--gk-teal-tint)',
]

function FieldNoteCard({ note, index }: { note: FieldNote; index: number }) {
  const inverse = note.inverse === true
  const tagFill = TAG_HUES[index % TAG_HUES.length]

  return (
    <Link
      to="/resources/blog"
      className={cn(
        'group flex w-[85vw] flex-col gap-4 rounded-[var(--r-md)] p-6 sm:w-[384px] md:p-8',
        'transition-[box-shadow,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)]',
        'shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]',
        inverse
          ? 'bg-[var(--gk-charcoal)]'
          : 'border border-[var(--hairline)] bg-[var(--bg-1)] hover:border-[var(--n-400)]',
      )}
    >
      <div className="flex items-center gap-3">
        <p
          className={cn(
            'text-[length:var(--fs-sm)]',
            inverse ? 'text-[var(--n-400)]' : 'text-[var(--fg-2)]',
          )}
          data-mono
        >
          {note.date} · {note.readingTime}
        </p>
        {note.badge && (
          <span
            className="text-[length:var(--fs-xs)] font-extrabold uppercase tracking-[var(--tracking-eyebrow)] text-white"
            data-mono
          >
            {note.badge}
          </span>
        )}
      </div>

      <h3 className={cn('h3', inverse ? 'text-white' : 'text-[var(--fg-1)]')}>
        {note.title}
      </h3>

      <p
        className={cn(
          'text-[length:var(--fs-base)]',
          inverse ? 'text-[var(--n-200)]' : 'text-[var(--fg-2)]',
        )}
      >
        {note.dek}
      </p>

      <span
        className={cn(
          'mt-auto w-fit rounded-[var(--r-pill)] px-3 py-1 text-[length:var(--fs-sm)] font-bold',
          inverse
            ? 'border border-white/40 text-white'
            : 'text-[var(--gk-charcoal)]',
        )}
        style={inverse ? undefined : { backgroundColor: tagFill }}
      >
        {note.tag}
      </span>
    </Link>
  )
}
