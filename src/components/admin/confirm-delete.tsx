import { AlertDialog } from "radix-ui"
import type { ReactNode } from "react"

export function ConfirmDelete({
  open,
  onOpenChange,
  noun,
  name,
  busy,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  noun: string
  name: ReactNode
  busy: boolean
  onConfirm: () => void
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="ad-overlay" />
        <AlertDialog.Content className="ad ad-dialog">
          <AlertDialog.Title>Delete this {noun}?</AlertDialog.Title>
          <AlertDialog.Description>
            <strong>{name}</strong> will be removed for good. This cannot be undone.
          </AlertDialog.Description>
          <div className="ad-dialog-actions">
            <AlertDialog.Cancel className="dc-btn ad-btn-quiet">Keep it</AlertDialog.Cancel>
            <button type="button" className="dc-btn ad-btn-danger-solid" onClick={onConfirm} disabled={busy}>
              {busy ? "Deleting…" : `Delete ${noun}`}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
