"use client";

import { useRouter } from "next/navigation";

type Row = {
  id: string;
  createdAt: string;
  amountPoints: number;
  method: string;
  detailsJson: string;
  user: { email: string };
};

export default function PendingTable({ rows }: { rows: Row[] }) {
  const router = useRouter();

  async function callApi(path: string, id: string) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      alert(`Failed: ${res.status} ${t}`);
    }
    router.refresh(); // টেবিল রিফ্রেশ
  }

  if (!rows.length) {
    return <div className="text-sm text-gray-300 p-4">No pending withdrawals.</div>;
  }

  return (
    <table className="w-full text-sm">
      <thead className="text-left text-gray-400">
        <tr>
          <th className="py-2">Date</th>
          <th>User</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Details</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((w) => {
          let details = "";
          try { details = JSON.parse(w.detailsJson)?.details ?? ""; } catch { details = w.detailsJson; }
          return (
            <tr key={w.id} className="border-t border-gray-800">
              <td className="py-2">{new Date(w.createdAt).toLocaleString()}</td>
              <td className="text-gray-300">{w.user.email}</td>
              <td>{w.amountPoints} pts</td>
              <td>{w.method}</td>
              <td className="text-gray-400 truncate max-w-[240px]">{details}</td>
              <td className="space-x-2">
                <button className="btn" onClick={() => callApi("/api/admin/withdrawals/approve", w.id)}>
                  Approve
                </button>
                <button
                  className="btn"
                  style={{ background: "#ef4444", color: "white" }}
                  onClick={() => callApi("/api/admin/withdrawals/reject", w.id)}
                >
                  Reject & Refund
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
