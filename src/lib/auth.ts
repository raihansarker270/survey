import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "session_token";

export type Session = {
  userId: string;
  email: string;
};

export function signSession(payload: Session): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  return jwt.sign(payload, secret, { expiresIn: "30d" });
}

export function verifySession(token: string): Session | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
    return jwt.verify(token, secret) as Session;
  } catch {
    return null;
  }
}

export function getSessionFromCookie(): Session | null {
  const store = cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function setSessionCookie(token: string) {
  const store = cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie() {
  const store = cookies();
  store.delete(COOKIE_NAME);
}
