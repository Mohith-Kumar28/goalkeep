import { ClipboardCheck, Mail, MessageSquareText } from "lucide-react"
import type { CollectionId } from "@/server/admin/collections"

export const collectionIcons = {
  contact: MessageSquareText,
  newsletter: Mail,
  quiz: ClipboardCheck,
} satisfies Record<CollectionId, unknown>
