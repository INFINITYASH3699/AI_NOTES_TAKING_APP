import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { noteSchema, updateNoteSchema } from "@/lib/validations"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"
import { eq, and, desc, ilike } from "drizzle-orm"
import { getSession } from "@/lib/auth/session"

const notesRoutes = new Hono()

// Middleware to check authentication
notesRoutes.use("/*", async (c, next) => {
  const session = await getSession()
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  c.set("userId", session.user.id)
  await next()
})

// Get all notes
notesRoutes.get("/", async (c) => {
  try {
    const userId = c.get("userId")
    const search = c.req.query("search")

    let query = db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt))

    if (search) {
      query = db
        .select()
        .from(notes)
        .where(
          and(
            eq(notes.userId, userId),
            ilike(notes.title, `%${search}%`)
          )
        )
        .orderBy(desc(notes.updatedAt))
    }

    const allNotes = await query

    return c.json({ notes: allNotes })
  } catch (error) {
    console.error("Get notes error:", error)
    return c.json({ error: "Failed to fetch notes" }, 500)
  }
})

// Get single note
notesRoutes.get("/:id", async (c) => {
  try {
    const userId = c.get("userId")
    const noteId = c.req.param("id")

    const [note] = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .limit(1)

    if (!note) {
      return c.json({ error: "Note not found" }, 404)
    }

    return c.json({ note })
  } catch (error) {
    console.error("Get note error:", error)
    return c.json({ error: "Failed to fetch note" }, 500)
  }
})

// Create note
notesRoutes.post("/", zValidator("json", noteSchema), async (c) => {
  try {
    const userId = c.get("userId")
    const { title, content, tags } = c.req.valid("json")

    const [note] = await db
      .insert(notes)
      .values({
        title,
        content,
        tags: tags || [],
        userId,
      })
      .returning()

    return c.json({ note }, 201)
  } catch (error) {
    console.error("Create note error:", error)
    return c.json({ error: "Failed to create note" }, 500)
  }
})

// Update note
notesRoutes.put("/:id", zValidator("json", updateNoteSchema), async (c) => {
  try {
    const userId = c.get("userId")
    const noteId = c.req.param("id")
    const data = c.req.valid("json")

    const [note] = await db
      .update(notes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .returning()

    if (!note) {
      return c.json({ error: "Note not found" }, 404)
    }

    return c.json({ note })
  } catch (error) {
    console.error("Update note error:", error)
    return c.json({ error: "Failed to update note" }, 500)
  }
})

// Delete note
notesRoutes.delete("/:id", async (c) => {
  try {
    const userId = c.get("userId")
    const noteId = c.req.param("id")

    const [deletedNote] = await db
      .delete(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
      .returning()

    if (!deletedNote) {
      return c.json({ error: "Note not found" }, 404)
    }

    return c.json({ success: true })
  } catch (error) {
    console.error("Delete note error:", error)
    return c.json({ error: "Failed to delete note" }, 500)
  }
})

export default notesRoutes