import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import crypto from "crypto";

function md5(s: string) {
  return crypto.createHash("md5").update(s, "utf8").digest("hex");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const uid = searchParams.get("user_id");
  const amountUsd = Number(searchParams.get("amount_usd"));
  const amountLocal = Number(searchParams.get("amount_local")); // ✅ NEW
  const txId = searchParams.get("trans_id");
  const hash = searchParams.get("hash");
  const status = searchParams.get("status");

  if (!uid || !txId || !Number.isFinite(amountUsd)) {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  // ✅ Verify hash
  const secret = process.env.CPX_APP_SECRET!;
  const expected = md5(`${txId}-${secret}`);
  if (!hash || hash !== expected) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 403 });
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (status === "1") {
      await tx.ledgerEntry.upsert({
        where: { externalTxId: txId },
        update: {},
        create: {
          userId: uid,
          type: "credit",
          source: "offerwall",
          amountPoints: Math.round(amountUsd * 100), // $1 = 100 points
          externalTxId: txId,
          note: `cpx postback (usd=${amountUsd}, local=${amountLocal})`, // ✅ Save both
        },
      });
    } else if (status === "2") {
      await tx.ledgerEntry.updateMany({
        where: { externalTxId: txId },
        data: { amountPoints: 0, note: "cpx canceled/fraud" },
      });
    }
  });

  return new NextResponse("OK");
}
