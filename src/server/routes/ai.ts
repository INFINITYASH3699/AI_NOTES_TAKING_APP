import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { aiRequestSchema } from "@/lib/validations"
import { summarizeNote, improveNote, generateTags } from "@/lib/ai/openai"
import { getSession } from "@/lib/auth/session"

type Variables = {
  userId: string
}

const aiRoutes = new Hono<{ Variables: Variables }>()

// Middleware to check authentication
aiRoutes.use("/*", async (c, next) => {
  const session = await getSession()
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  await next()
})

aiRoutes.post("/", zValidator("json", aiRequestSchema), async (c) => {
  try {
    const { content, action } = c.req.valid("json")

    let result: string | string[]

    switch (action) {
      case "summarize":
        result = await summarizeNote(content)
        break
      case "improve":
        result = await improveNote(content)
        break
      case "tags":
        result = await generateTags(content)
        break
      default:
        return c.json({ error: "Invalid action" }, 400)
    }

    return c.json({
      success: true,
      result: Array.isArray(result) ? result.join(", ") : result,
    })
  } catch (error) {
    console.error("AI request error:", error)
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI request failed",
      },
      500
    )
  }
})

export default aiRoutes