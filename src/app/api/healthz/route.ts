
// src/app/api/healthz/route.ts
import { NextResponse } from "next/server";

// Lightweight health check (no DB calls)
export async function GET() {
  return NextResponse.json({ ok: true, uptime: process.uptime() }, { status: 200 });
}
