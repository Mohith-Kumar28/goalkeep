import { fieldNotes, fieldNoteSection } from '@/content/homepage'
import type { FieldNote } from '@/content/types'
import { GkButton } from '@/components/primitives/gk-button'
import { Reveal } from '@/components/primitives/reveal'
import { ShapeField } from '@/components/primitives/logo-shapes'
import { cn } from '@/lib/utils'

/**
 * Three notes, not five, and each now carries a photograph.
 *
 * These were text-only by design in v0 — the argument being that a scroller of
 * stock blog imagery is the fastest route to slop. That argument held while the
 * only images available were stock. They aren't any more.
 */
const TAG_HUES = ['var(--gk-blue-tint)', 'var(--gk-teal-tint)', 'var(--gk-coral-tint)']

export function FieldNotes() {
  return (
    <section
      className="ground-cream band accent-teal"
      aria-labelledby="field-notes-heading"
    >
      <ShapeField variant="notes" />

      <div className="shell relative">
        <Reveal>
          <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">{fieldNoteSection.eyebrow}</p>
              <h2 id="field-notes-heading" className="h2 max-w-[18ch]">
                {fieldNoteSection.headline}
              </h2>
              <p className="lead mt-4 max-w-[42ch]">{fieldNoteSection.lead}</p>
            </div>
            <GkButton to={fieldNoteSection.cta.to} variant="secondary" withArrow>
              {fieldNoteSection.cta.label}
            </GkButton>
          </div>
        </Reveal>

        <ul className="grid gap-6 md:grid-cols-3">
          {fieldNotes.map((note, index) => (
            <Reveal as="li" key={note.slug} delay={index * 0.07} className="h-full">
              <NoteCard note={note} hue={TAG_HUES[index % 3]} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function NoteCard({ note, hue }: { note: FieldNote; hue: string }) {
  return (
    <article
      data-ground={note.inverse ? 'navy' : undefined}
      className={cn(
        'card-lift flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] border',
        note.inverse
          ? 'border-transparent bg-[var(--gk-navy)] text-white'
          : 'border-[var(--hairline)] bg-[var(--gk-white)] text-[var(--gk-ink)]',
      )}
    >
      <div className="relative">
        <img
          src={note.image}
          alt={note.imageAlt}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover"
        />
        {note.badge && (
          <span className="chip absolute right-4 top-4 bg-[var(--gk-yellow)] text-[var(--gk-ink)] shadow-[var(--shadow-sm)]">
            {note.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <p
          className={cn(
            'text-[length:var(--fs-sm)] font-bold',
            note.inverse ? 'text-white/75' : 'text-[var(--fg-2)]',
          )}
        >
          {note.date} · {note.readingTime}
        </p>
        <h3 className="h3 text-[length:var(--fs-lg)]">{note.title}</h3>
        <p
          className={cn(
            'text-[length:var(--fs-sm)]',
            note.inverse ? 'text-white/80' : 'text-[var(--fg-2)]',
          )}
        >
          {note.dek}
        </p>
        <span
          className={cn(
            'chip mt-auto self-start text-[length:var(--fs-xs)]',
            note.inverse ? 'text-white' : 'text-[var(--gk-navy)]',
          )}
          style={{ background: note.inverse ? 'rgb(255 255 255 / 0.12)' : hue }}
        >
          {note.tag}
        </span>
      </div>
    </article>
  )
}
