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
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600">
            Please{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              sign in
            </Link>{" "}
            to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Welcome */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Welcome, <span className="text-blue-600">{user.email}</span>
      </h1>

      {/* Balance Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <Balance points={points} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Activity</h3>
          <Link
            className="text-blue-600 hover:underline text-sm font-medium"
            href="/earn"
          >
            Go to Earn →
          </Link>
        </div>

        <div className="overflow-x-auto">
          {history.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
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
                  <tr key={h.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-gray-600">
                      {new Date(h.createdAt).toLocaleString()}
                    </td>
                    <td className="text-gray-700">{h.type}</td>
                    <td className="text-gray-700">{h.source}</td>
                    <td
                      className={`font-medium ${
                        h.amountPoints >= 0
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {h.amountPoints >= 0 ? "+" : ""}
                      {h.amountPoints} pts
                    </td>
                    <td className="text-gray-500">{h.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500 text-center py-4">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
