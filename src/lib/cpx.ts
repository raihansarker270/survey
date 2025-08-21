import crypto from "crypto";

function md5(s: string) {
  return crypto.createHash("md5").update(s, "utf8").digest("hex");
}

export function buildCpxUrl(opts: { uid: string; name?: string; email?: string }) {
  const appId = process.env.CPX_APP_ID;
  const secret = process.env.CPX_APP_SECRET;
  if (!appId || !secret) return "";

  const secure_hash = md5(`${opts.uid}-${secret}`);
  const now = Date.now().toString(); // cache-buster

  const qs = new URLSearchParams({
    app_id: appId,
    ext_user_id: opts.uid,
    secure_hash,
    subid_1: opts.uid,
    subid_2: now,
  });
  if (opts.name) qs.set("username", opts.name);
  if (opts.email) qs.set("email", opts.email);

  return `https://offers.cpx-research.com/index.php?${qs.toString()}`;
}
