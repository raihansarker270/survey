import crypto from "crypto";
import EarnTabs from "./EarnTabs";
import { getSessionFromCookie } from "../../../lib/auth";

function md5(s: string) {
  return crypto.createHash("md5").update(s, "utf8").digest("hex");
}

function buildCpxUrl(opts: { uid: string; name?: string; email?: string }) {
  const appId = process.env.CPX_APP_ID;
  const secret = process.env.CPX_APP_SECRET;
  if (!appId || !secret) return ""; // env নাই => URL খালি

  const secure_hash = md5(`${opts.uid}-${secret}`);

  // ✅ cache-busting + trace
  const now = Date.now().toString();

  const qs = new URLSearchParams({
    app_id: appId,
    ext_user_id: opts.uid,
    secure_hash,
    subid_1: opts.uid, // trace: কোন ইউজার
    subid_2: now,      // cache-busting nonce (প্রতি ভিউ/ক্লিকে নতুন হবে)
  });
  if (opts.name) qs.set("username", opts.name);
  if (opts.email) qs.set("email", opts.email);

  return `https://offers.cpx-research.com/index.php?${qs.toString()}`;
}

function withUid(url: string | undefined, uid: string) {
  return url ? url.replace("{UID}", encodeURIComponent(uid)) : "";
}

// (ঐচ্ছিক) সবসময় fresh SSR চাইলে uncomment করুন
// export const dynamic = "force-dynamic";

export default async function EarnPage() {
  const session = getSessionFromCookie();
  if (!session) {
    return <div className="card text-sm">Please sign in to access surveys.</div>;
  }

  const uid = session.userId; // uid অবশ্যই লাগবে
  const email = session.email ?? undefined;
  const name = email ? email.split("@")[0] : undefined;

  // CPX (server-side secure hash)
  const cpx = uid ? buildCpxUrl({ uid, name, email }) : "";

  // PureSpectrum (আগে দেয়া .env: PURESPECTRUM_URL="https://.../?uid={UID}")
  const ps = uid ? withUid(process.env.PURESPECTRUM_URL, uid) : "";

  const tabs = [
    { id: "cpx", label: "CPX Research", url: cpx },
    { id: "purespectrum", label: "PureSpectrum", url: ps },
  ].filter((t) => !!t.url); // যে URL নেই, ট্যাব দেখাবো না

  const missing: string[] = [];
  if (!uid) missing.push("userId (uid)");
  if (!process.env.CPX_APP_ID) missing.push("CPX_APP_ID");
  if (!process.env.CPX_APP_SECRET) missing.push("CPX_APP_SECRET");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Earn Surveys</h1>

      <div className="card">
        {tabs.length > 0 ? (
          <EarnTabs tabs={tabs} />
        ) : (
          <div className="text-sm text-red-300">No provider URL is configured.</div>
        )}
      </div>

      {/* Helpful debug when CPX iFrame খালি */}
      {missing.length > 0 && (
        <div className="text-xs text-amber-300">
          Missing config: {missing.join(", ")}. Check your <code>.env</code> and restart dev server.
        </div>
      )}
      <div className="text-xs text-gray-400">
        
      </div>
    </div>
  );
}
