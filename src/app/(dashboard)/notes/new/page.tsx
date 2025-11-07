import { NoteEditor } from "@/components/NoteEditor"

export default function NewNotePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <NoteEditor mode="create" />
    </div>
  )
}