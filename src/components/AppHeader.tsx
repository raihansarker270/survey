"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const path = usePathname();

  // /admin রুটে ইউজার হেডার একেবারে লুকিয়ে দিন
  if (path?.startsWith("/admin")) return null;

  return (
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
        </nav>
      </div>
    </header>
  );
}
