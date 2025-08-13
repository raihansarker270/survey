"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoginModal from "./LoginModal"; // সঠিক path ঠিক রাখো

export default function AppHeader() {
  const path = usePathname();
  const [showLogin, setShowLogin] = useState(false);

  // /admin রুটে ইউজার হেডার লুকিয়ে দিন
  if (path?.startsWith("/admin")) return null;

  return (
    <>
      <header className="border-b border-gray-800">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Survey<span className="text-emerald-400">MVP</span>
          </Link>
          <nav className="space-x-6 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/earn">Earn</Link>
            <Link href="/withdraw">Withdraw</Link>
            <Link href="/admin">Admin</Link>
            <button
              onClick={() => setShowLogin(true)}
              className="text-gray-300 hover:text-white"
            >
              Login / Register
            </button>
          </nav>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
}

