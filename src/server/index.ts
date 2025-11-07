import { Hono } from "hono"
import { handle } from "hono/vercel"
import authRoutes from "./routes/auth"
import notesRoutes from "./routes/notes"
import aiRoutes from "./routes/ai"

export const runtime = "edge"

const app = new Hono().basePath("/api")

app.route("/auth", authRoutes)
app.route("/notes", notesRoutes)
app.route("/ai", aiRoutes)

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)