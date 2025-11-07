import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { loginSchema, registerSchema } from "@/lib/validations"
import { createUser, getUserByEmail, verifyPassword } from "@/lib/auth"
import { createSession, deleteSession } from "@/lib/auth/session"

const auth = new Hono()

// Register
auth.post("/register", zValidator("json", registerSchema), async (c) => {
  try {
    const { name, email, password } = c.req.valid("json")

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return c.json({ error: "User already exists" }, 400)
    }

    const user = await createUser(name, email, password)
    await createSession(user)

    return c.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return c.json({ error: "Registration failed" }, 500)
  }
})

// Login
auth.post("/login", zValidator("json", loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid("json")

    const user = await getUserByEmail(email)
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401)
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return c.json({ error: "Invalid credentials" }, 401)
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })

    return c.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return c.json({ error: "Login failed" }, 500)
  }
})

// Logout
auth.post("/logout", async (c) => {
  try {
    await deleteSession()
    return c.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return c.json({ error: "Logout failed" }, 500)
  }
})

export default auth