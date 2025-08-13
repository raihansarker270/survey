"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function AppHeader({ isAuthed }: { isAuthed: boolean }) {
  const path = usePathname();
  const [showLogin, setShowLogin] = useState(false);

  // admin রুটে ইউজার হেডার না দেখাতে চাইলে
  if (path?.startsWith("/admin")) return null;

  return (
    <>
      <header className="border-b border-gray-800">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Surveyto<span className="text-emerald-400">CASH</span>
          </Link>

          <nav className="space-x-6 text-sm">
            {isAuthed ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/earn">Earn</Link>
                <Link href="/withdraw">Withdraw</Link>
                <Link href="/admin"></Link>
                <form action="/api/auth/logout" method="POST" className="inline">
                  <button type="submit" className="text-gray-300 hover:text-white">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-300 hover:text-white"
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

