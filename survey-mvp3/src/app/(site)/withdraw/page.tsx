import { prisma } from "@/src/lib/prisma";
import { getSessionFromCookie } from "@/src/lib/auth";

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
    return <div className="card">Please sign in first.</div>;
  }

  const [points, withdrawals] = await Promise.all([
    getPoints(session.userId),
    getRecentWithdrawals(session.userId),
  ]);

  const min = 500; // $5 if 100 pts = $1

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Withdraw</h1>

      <div className="card">
        <div className="text-sm text-gray-300 mb-4">
          Balance: <span className="badge">{points} pts</span> (Minimum withdrawal: {min} pts)
        </div>
        <form action="/api/withdraw/create" method="POST" className="grid gap-3 max-w-md">
          <label className="label">Method</label>
          <select name="method" className="input">
            <option value="paypal">PayPal</option>
            <option value="giftcard">Gift Card</option>
          </select>
          <label className="label">Details (e.g., PayPal Email)</label>
          <input name="details" className="input" placeholder="your-paypal@example.com" required />
          <label className="label">Amount (points)</label>
          <input name="amountPoints" className="input" type="number" min={min} max={points} defaultValue={min} required />
          <button className="btn" type="submit">Request Withdrawal</button>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Recent Withdrawals</h3>

        {withdrawals.length === 0 ? (
          <div className="text-sm text-gray-400">Requested withdrawals appear here after submission.</div>
        ) : (
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
                {withdrawals.map(w => (
                  <tr key={w.id} className="border-t border-gray-800">
                    <td className="py-2">{new Date(w.createdAt).toLocaleString()}</td>
                    <td>{w.amountPoints} pts</td>
                    <td>{w.method}</td>
                    <td className="capitalize">{w.status}</td>
                    <td className="text-gray-400 truncate">{JSON.parse(w.detailsJson).details}</td>
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
