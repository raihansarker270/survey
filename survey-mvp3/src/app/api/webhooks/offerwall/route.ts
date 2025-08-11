import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import crypto from "crypto";

/**
 * Generic Offerwall/Webhook endpoint.
 * Configure this URL in your provider's dashboard, e.g.:
 *   https://YOUR_DOMAIN.com/api/webhooks/offerwall
 *
 * Expected query params (adjust to your provider):
 * - uid: your user ID (we track this)
 * - amount: points to credit (integer)
 * - tx_id: unique transaction id from provider
 * - sig: optional HMAC signature (depends on provider)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");
  const amount = url.searchParams.get("amount");
  const txId = url.searchParams.get("tx_id") || url.searchParams.get("txid") || url.searchParams.get("transaction_id");
  const sig = url.searchParams.get("sig") || url.searchParams.get("signature");

  if (!uid || !amount || !txId) {
    return NextResponse.json({ ok: false, error: "missing params" }, { status: 400 });
  }

  // Optional HMAC verification
  const secret = process.env.OFFERWALL_HMAC_SECRET || "";
  if (secret && sig) {
    const baseString = `${uid}|${amount}|${txId}`; // adjust to your provider's signing scheme
    const calc = crypto.createHmac("sha256", secret).update(baseString).digest("hex");
    if (calc !== sig) {
      return NextResponse.json({ ok: false, error: "bad signature" }, { status: 403 });
    }
  }

  const points = parseInt(amount, 10);
  if (!Number.isFinite(points)) {
    return NextResponse.json({ ok: false, error: "bad amount" }, { status: 400 });
  }

  try {
    // Ensure user exists
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      return NextResponse.json({ ok: false, error: "user not found" }, { status: 404 });
    }

    // Idempotent insert using externalTxId unique constraint
    await prisma.ledgerEntry.create({
      data: {
        userId: uid,
        type: "credit",
        source: "offerwall",
        amountPoints: points,
        externalTxId: txId,
        note: "Offerwall credit",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e.code === "P2002") {
      // Unique constraint failed (duplicate tx)
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error(e);
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
  }
}
