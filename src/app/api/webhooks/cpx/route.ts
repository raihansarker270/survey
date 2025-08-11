import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const { uid, amount, txId } = await req.json();

  const amt = Number(amount);
  if (!uid || !txId || !Number.isFinite(amt) || !Number.isInteger(amt)) {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  // এক শটে সেফলি লিখতে ট্রানজ্যাকশন (টাইপ অ্যানোটেশনসহ)
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // ডুপ্লিকেট ওয়েবহুক এলে upsert ডুপ্লিকেট ব্লক করবে (externalTxId @unique)
    await tx.ledgerEntry.upsert({
      where: { externalTxId: String(txId) },
      update: {}, // ডুপ্লিকেট হলে কিছুই করবে না
      create: {
        userId: String(uid),
        type: "credit",          // schema enum অনুযায়ী
        source: "offerwall",     // "cpx" নয়; note-এ রাখতে পারো
        amountPoints: amt,       // ক্রেডিট হলে পজিটিভ
        externalTxId: String(txId),
        note: "cpx",             // উৎস মনে রাখার জন্য
      },
    });
  });

  return NextResponse.json({ ok: true });
}
