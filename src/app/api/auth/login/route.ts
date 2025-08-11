import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const COOKIE = "session_token";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const rawEmail = body?.email;
    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    // ইউজার না থাকলে তৈরি করি
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    // JWT সাইন
    const secret = process.env.JWT_SECRET || "dev-secret-change";
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: "30d" }
    );

    // কুকি সেট
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (e) {
    console.error("login error:", e);
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 }
    );
  }
}
