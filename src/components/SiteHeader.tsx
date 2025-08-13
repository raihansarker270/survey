"use client";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

const LoginModal = dynamic(() => import("@/src/components/LoginModal"), {
  ssr: false,
});

export default function SiteHeader({ isAuthed }: { isAuthed: boolean }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="border-b border-gray-800">
        <div className="container flex items-center justify-between py-4">
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
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-300 transition hover:text-white"
              >
                Login / Register
              </button>
            )}
          </nav>
        </div>
      </header>

      {showLogin && (
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
}
