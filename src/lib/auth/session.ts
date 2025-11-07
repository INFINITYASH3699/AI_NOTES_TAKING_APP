import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { User } from "@/types";

const secretKey = process.env.JWT_SECRET || "fallback-secret-key-for-build-only";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expiresAt });

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return session;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  cookies().delete("session");
}

export async function updateSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;

  const parsed = await decrypt(session);
  if (!parsed) return null;

  parsed.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const updated = await encrypt(parsed);

  cookies().set("session", updated, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: parsed.expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return parsed;
}