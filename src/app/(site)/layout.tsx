import Link from "next/link";
import { getSessionFromCookie } from "@/src/lib/auth";
import SiteHeader from "@/src/components/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = getSessionFromCookie(); // { userId, email } | null (server-side)
  const isAuthed = !!session;

  return (
    <>
      {/* Header is static; modal handled inside client header */}
      <SiteHeader isAuthed={isAuthed} />

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
