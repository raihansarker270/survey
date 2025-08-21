import { prisma } from "@/src/lib/prisma";
import { getSessionFromCookie } from "@/src/lib/auth";
import Link from "next/link";

async function getPoints(userId: string) {
  const sum = await prisma.ledgerEntry.aggregate({
    where: { userId },
    _sum: { amountPoints: true },
  });
  return sum._sum.amountPoints || 0;
}

async function getRecentWithdrawals(userId: string) {
  return prisma.withdrawal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export default async function WithdrawPage() {
  const session = getSessionFromCookie();
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600">
            Please{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              sign in
            </Link>{" "}
            first.
          </p>
        </div>
      </div>
    );
  }

  const [points, withdrawals] = await Promise.all([
    getPoints(session.userId),
    getRecentWithdrawals(session.userId),
  ]);

  const min = 500; // $5 if 100 pts = $1

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Withdraw <span className="text-blue-600">Funds</span>
      </h1>

      {/* Balance + Withdraw Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-sm text-gray-600 mb-6">
          <span className="font-medium">Balance:</span>{" "}
          <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-semibold">
            {points} pts
          </span>{" "}
          <span className="ml-2 text-gray-500">
            (Minimum withdrawal: {min} pts)
          </span>
        </div>

        <form
          action="/api/withdraw/create"
          method="POST"
          className="grid gap-4 max-w-md"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Method
            </label>
            <select
              name="method"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="paypal">PayPal</option>
              <option value="giftcard">Gift Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details (e.g., PayPal Email)
            </label>
            <input
              name="details"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="your-paypal@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (points)
            </label>
            <input
              name="amountPoints"
              type="number"
              min={min}
              max={points}
              defaultValue={min}
              required
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
            type="submit"
          >
            Request Withdrawal
          </button>
        </form>
      </div>

      {/* Recent Withdrawals */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Withdrawals</h3>

        {withdrawals.length === 0 ? (
          <div className="text-sm text-gray-500">
            Requested withdrawals will appear here after submission.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="px-3 text-left">Amount</th>
                  <th className="px-3 text-left">Method</th>
                  <th className="px-3 text-left">Status</th>
                  <th className="px-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr
                    key={w.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3">{w.amountPoints} pts</td>
                    <td className="px-3">{w.method}</td>
                    <td
                      className={`px-3 capitalize font-medium ${
                        w.status === "approved"
                          ? "text-green-600"
                          : w.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {w.status}
                    </td>
                    <td className="px-3 text-gray-500 truncate max-w-[200px]">
                      {JSON.parse(w.detailsJson).details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
