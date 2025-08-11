import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  const session = getSessionFromCookie();
  if (!session) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const form = await req.formData();
  const method = String(form.get("method") || "");
  const details = String(form.get("details") || "");
  const amountPoints = parseInt(String(form.get("amountPoints") || "0"), 10);

  if (!method || !details || !Number.isFinite(amountPoints)) {
    return NextResponse.json({ message: "Bad input" }, { status: 400 });
  }

  // min threshold
  const min = 500;
  if (amountPoints < min) {
    return NextResponse.json({ message: `Minimum is ${min} points` }, { status: 400 });
  }

  // check balance
  const sum = await prisma.ledgerEntry.aggregate({
    where: { userId: session.userId },
    _sum: { amountPoints: true },
  });
  const balance = sum._sum.amountPoints || 0;
  if (amountPoints > balance) {
    return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
  }

  // create withdrawal & debit ledger
  const w = await prisma.withdrawal.create({
    data: {
      userId: session.userId,
      amountPoints,
      method,
      detailsJson: JSON.stringify({ details }),
      status: "pending",
    }
  });

  await prisma.ledgerEntry.create({
    data: {
      userId: session.userId,
      type: "debit",
      source: "withdrawal",
      amountPoints: -amountPoints,
      note: `Withdrawal request ${w.id}`,
    }
  });

  return NextResponse.redirect(new URL("/withdraw", process.env.SITE_URL), { status: 302 });
}
