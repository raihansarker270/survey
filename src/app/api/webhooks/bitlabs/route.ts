import crypto from "crypto";

function verifySignature(uid: string, amount: number, txId: string, signature?: string) {
  const secret = process.env.BITLABS_SECRET || "";
  if (!secret) return true; // secret না দিলে স্কিপ (MVP)
  if (!signature) return false;

  const payload = `${uid}:${amount}:${txId}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hmac, "hex"),
    Buffer.from(signature, "hex")
  );
}
