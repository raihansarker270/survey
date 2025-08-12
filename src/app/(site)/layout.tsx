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
            Surveyto<span className="text-emerald-400">Cash</span>
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

      <footer className="bg-darkGray text-gray-400 py-4">
  <div className="container mx-auto flex justify-between items-center">
    <p>© {new Date().getFullYear()} SurveyToCash. All rights reserved.</p>
    <div className="space-x-6">
      <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
      <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
      <Link href="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
      <Link href="/affiliate-policy" className="hover:text-white">Affiliate Policy</Link>
    </div>
  </div>
</footer>
    </>
  );
}


