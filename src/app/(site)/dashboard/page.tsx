// src/app/(site)/dashboard/page.tsx
import { prisma } from "../../../lib/prisma";
import { getSessionFromCookie } from "../../../lib/auth";
import Link from "next/link";
import { Balance } from "../../../components/Balance";


async function getData() {
  const session = getSessionFromCookie();
  if (!session) return { user: null, points: 0, history: [] as any[] };

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  const ledger = await prisma.ledgerEntry.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const agg = await prisma.ledgerEntry.aggregate({
    where: { userId: session.userId },
    _sum: { amountPoints: true },
  });
  const points = agg._sum.amountPoints || 0;

  return { user, points, history: ledger };
}

export default async function Dashboard() {
  const { user, points, history } = await getData();
  if (!user) {
    return (
      <div className="card">
        <div className="text-gray-300">
          Please <Link href="/" className="link">sign in</Link> to view your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
      <Balance points={points} />
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recent Activity</h3>
          <Link className="link" href="/earn">Go to Earn →</Link>
        </div>
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
  {history.map((h: any) => (
    <tr key={h.id} className="border-t border-gray-800">
      <td className="py-2">{new Date(h.createdAt).toLocaleString()}</td>
      <td>{h.type}</td>
      <td>{h.source}</td>
      <td className={h.amountPoints >= 0 ? "text-emerald-400" : "text-red-400"}>
        {h.amountPoints >= 0 ? "+" : ""}{h.amountPoints} pts
      </td>
      <td className="text-gray-400">{h.note || "-"}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
