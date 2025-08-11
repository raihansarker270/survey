import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/src/lib/auth";

export async function GET() {
  const s = getSessionFromCookie();
  return NextResponse.json(s ?? { userId: null, email: null });
}
