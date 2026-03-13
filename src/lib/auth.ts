import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export type Session = {
  userId: string;
  role: "USER" | "ADMIN";
  email: string;
};

const SESSION_COOKIE_NAME = "session";

function getJwtSecret() {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_JWT_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: Session) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  const userId = payload.userId;
  const role = payload.role;
  const email = payload.email;
  if (typeof userId !== "string") throw new Error("Invalid session (userId)");
  if (role !== "USER" && role !== "ADMIN") throw new Error("Invalid session (role)");
  if (typeof email !== "string") throw new Error("Invalid session (email)");
  return { userId, role, email } satisfies Session;
}

export async function setSessionCookie(session: Session) {
  const token = await createSessionToken(session);
  const isProd = process.env.NODE_ENV === "production";
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  (await cookies()).set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

