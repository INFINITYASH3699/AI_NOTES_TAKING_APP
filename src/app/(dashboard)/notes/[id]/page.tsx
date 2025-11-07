import { NoteEditor } from "@/components/NoteEditor"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"

export default async function EditNotePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()
  
  if (!session) {
    notFound()
  }

  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, params.id), eq(notes.userId, session.user.id)))
    .limit(1)

  if (!note) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <NoteEditor 
        mode="edit" 
        note={{
          id: note.id,
          title: note.title,
          content: note.content,
          tags: note.tags as string[],
          userId: note.userId,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        }} 
      />
    </div>
  )
}