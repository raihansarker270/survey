import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getSessionFromCookie } from "@/src/lib/auth";

function isAdmin(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}

export async function POST(req: Request) {
  const s = getSessionFromCookie();
  if (!isAdmin(s?.email)) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });

  const w = await prisma.withdrawal.findUnique({ where: { id } });
  if (!w) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

  if (w.status === "pending") {
    // 1) mark rejected
    await prisma.withdrawal.update({ where: { id }, data: { status: "rejected" } });
    // 2) refund points (reversal credit)
    await prisma.ledgerEntry.create({
      data: {
        userId: w.userId,
        type: "reversal",
        source: "withdrawal",
        amountPoints: w.amountPoints,
        note: `Withdrawal ${w.id} rejected — refund`,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
