import Link from "next/link";

export const metadata = { title: "Admin Console" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-gray-800">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-semibold">
            Admin<span className="text-emerald-400">Console</span>
          </Link>
          <nav className="space-x-6 text-sm">
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/withdrawals">Withdrawals</Link>
            <form action="/api/auth/logout" method="POST" className="inline">
              <button className="text-gray-300 hover:text-white" type="submit">Sign out</button>
            </form>
          </nav>
        </div>
      </header>

      <main className="container py-8">{children}</main>
    </>
  );
}
