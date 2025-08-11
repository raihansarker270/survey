import { prisma } from "@/src/lib/prisma";
import { getSessionFromCookie } from "@/src/lib/auth";
import Link from "next/link";

function isAdminEmail(email?: string | null) {
  const admin = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  return !!email && admin && email.toLowerCase().trim() === admin;
}

async function findUsers(q: string) {
  const query = q.trim();
  if (!query) return [];

  // যদি সরাসরি ID দেওয়া হয়, আগে সেটাই ট্রাই করি
  const byId = await prisma.user.findUnique({ where: { id: query } });
  if (byId) return [byId];

  // না হলে ইমেইল দিয়ে fuzzy সার্চ
  return prisma.user.findMany({
    where: { email: { contains: query, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

async function getLedger(userId: string) {
  return prisma.ledgerEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

async function getWithdrawals(userId: string) {
  return prisma.withdrawal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

async function getBalance(userId: string) {
  const s = await prisma.ledgerEntry.aggregate({
    where: { userId },
    _sum: { amountPoints: true },
  });
  return s._sum.amountPoints || 0;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const session = getSessionFromCookie();
  if (!isAdminEmail(session?.email)) {
    return (
      <div className="card">
        <div className="text-sm text-gray-300">403 — Admin only.</div>
        <div className="mt-3"><Link className="link" href="/">Go home</Link></div>
      </div>
    );
  }

  const q = (searchParams?.q || "").trim();
  const results = q ? await findUsers(q) : [];

  // একটিমাত্র ইউজার হলে তার হিস্ট্রি লোড করি
  let selected = results.length === 1 ? results[0] : null;
  let ledger: Awaited<ReturnType<typeof getLedger>> = [];
  let withdrawals: Awaited<ReturnType<typeof getWithdrawals>> = [];
  let balance = 0;

  if (selected) {
    [ledger, withdrawals, balance] = await Promise.all([
      getLedger(selected.id),
      getWithdrawals(selected.id),
      getBalance(selected.id),
    ]);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin · User Search</h1>

      {/* Search box */}
      <form className="card max-w-xl" method="GET">
        <label className="label">Search by User ID or Email</label>
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            className="input"
            placeholder="e.g.  ckx... (User ID)  or  user@example.com"
          />
          <button className="btn" type="submit">Search</button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Tip: Exact User ID দিলে সরাসরি ঐ ইউজারের হিস্ট্রি দেখাবে।
        </div>
      </form>

      {/* Search results list (when multiple) */}
      {q && !selected && results.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3">
            Results for: <span className="text-emerald-400">{q}</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-400">
                <tr>
                  <th className="py-2">User</th>
                  <th>User ID</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map(u => (
                  <tr key={u.id} className="border-t border-gray-800">
                    <td className="py-2">{u.email}</td>
                    <td className="text-gray-400">{u.id}</td>
                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                    <td>
                      <Link className="link" href={`/admin/users?q=${encodeURIComponent(u.id)}`}>
                        View history →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No results */}
      {q && results.length === 0 && (
        <div className="card text-sm text-gray-300">
          No user found for <span className="text-emerald-400">{q}</span>
        </div>
      )}

      {/* Single user full view */}
      {selected && (
        <>
          <div className="card flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300">User</div>
              <div className="text-lg font-semibold">{selected.email}</div>
              <div className="text-xs text-gray-400">{selected.id}</div>
            </div>
            <div className="badge">{balance} pts</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-3">Ledger (last 100)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-400">
                    <tr>
                      <th className="py-2">Date</th>
                      <th>Type</th>
                      <th>Source</th>
                      <th>Amount</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map(l => (
                      <tr key={l.id} className="border-t border-gray-800">
                        <td className="py-2">{new Date(l.createdAt).toLocaleString()}</td>
                        <td>{l.type}</td>
                        <td>{l.source}</td>
                        <td className={l.amountPoints >= 0 ? "text-emerald-400" : "text-red-400"}>
                          {l.amountPoints >= 0 ? "+" : ""}{l.amountPoints} pts
                        </td>
                        <td className="text-gray-400">{l.note || "-"}</td>
                      </tr>
                    ))}
                    {ledger.length === 0 && (
                      <tr><td className="py-2 text-gray-400" colSpan={5}>No entries.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">Withdrawals (last 50)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-400">
                    <tr>
                      <th className="py-2">Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map(w => {
                      let details = "";
                      try { details = JSON.parse(w.detailsJson)?.details ?? ""; } catch { details = w.detailsJson; }
                      return (
                        <tr key={w.id} className="border-t border-gray-800">
                          <td className="py-2">{new Date(w.createdAt).toLocaleString()}</td>
                          <td>{w.amountPoints} pts</td>
                          <td>{w.method}</td>
                          <td className="capitalize">{w.status}</td>
                          <td className="text-gray-400 truncate max-w-[240px]">{details}</td>
                        </tr>
                      );
                    })}
                    {withdrawals.length === 0 && (
                      <tr><td className="py-2 text-gray-400" colSpan={5}>No withdrawals.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
