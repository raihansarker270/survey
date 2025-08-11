import { prisma } from "../../../lib/prisma"; // ঠিক পাথ
import PendingTable from "./PendingTable";

export const dynamic = "force-dynamic";

async function getPending() {
  return prisma.withdrawal.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    include: { user: true },
  });
}

export default async function AdminWithdrawalsPage() {
  const rows = await getPending();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin · Pending Withdrawals</h1>
      <div className="card overflow-x-auto">
        <PendingTable rows={rows as any[]} />
      </div>
      <div className="text-xs text-gray-400">
        Approve = শুধু status পরিবর্তন। Reject = status পরিবর্তন + ইউজারের ওয়ালেটে সমান পয়েন্ট রিফান্ড (reversal)।
      </div>
    </div>
  );
}
