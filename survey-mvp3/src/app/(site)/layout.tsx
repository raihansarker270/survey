import Link from "next/link";
import { getSessionFromCookie } from "@/src/lib/auth";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = getSessionFromCookie(); // { userId, email } | null
  const isAuthed = !!session;

  return (
    <>
      <header className="border-b border-gray-800">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Survey<span className="text-emerald-400">MVP</span>
          </Link>

          <nav className="space-x-6 text-sm">
            {isAuthed ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/earn">Earn</Link>
                <Link href="/withdraw">Withdraw</Link>
                <form action="/api/auth/logout" method="POST" className="inline">
                  <button type="submit" className="text-gray-300 hover:text-white">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* হোমপেজেই Login/Register ফর্ম আছে */}
                <Link href="/">Login / Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container py-8">{children}</main>

      <footer className="container py-12 text-sm text-gray-400">
        © {new Date().getFullYear()} SurveyMVP. All rights reserved.
      </footer>
    </>
  );
}
