"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoginModal from "./LoginModal";

type Props = {
  isAuthed: boolean;
};

export default function AppHeader({ isAuthed }: Props) {
  const path = usePathname();
  const [showLogin, setShowLogin] = useState(false);

  // admin route-এ header না দেখানোর জন্য
  if (path?.startsWith("/admin")) return null;

  return (
    <>
      <header className="container header flex justify-between items-center py-6">
        {/* Logo */}
        <Link href="/" className="logo">
          <svg
            width="250"
            height="45"
            viewBox="0 0 250 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="45" height="45" rx="15" fill="#164ed0" />
            <path
              d="M15 30c8-10 16-10 24 0"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text
              x="55"
              y="32"
              fontFamily="Montserrat, sans-serif"
              fontSize="22"
              fontWeight="700"
              fill="#164ed0"
            >
              SurveyToCash
            </text>
          </svg>
        </Link>

        {/* Navigation Links */}
        <nav className="nav flex gap-4 items-center">
          <Link
            href="/how-it-works"
            className="nav-link text-gray-700 hover:text-black"
          >
            How it works
          </Link>

          {isAuthed ? (
            <>
              <Link
                href="/dashboard"
                className="nav-link text-gray-700 hover:text-black"
              >
                Dashboard
              </Link>
              <Link
                href="/earn"
                className="nav-link text-gray-700 hover:text-black"
              >
                Earn
              </Link>
              <Link
                href="/withdraw"
                className="nav-link text-gray-700 hover:text-black"
              >
                Withdraw
              </Link>
              <form action="/api/auth/logout" method="POST" className="inline">
                <button
                  type="submit"
                  className="btn btn-outline text-gray-700 hover:text-black"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Access button opens LoginModal */}
              <button
                onClick={() => setShowLogin(true)}
                className="btn btn-gradient"
              >
                Access
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
}
