// src/app/(site)/layout.tsx
import AppHeader from "@/components/AppHeader";
import { getSessionFromCookie } from "@/lib/auth";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = getSessionFromCookie(); // Server-side
  const isAuthed = !!session;

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <AppHeader isAuthed={isAuthed} />
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <footer className="bg-card text-muted py-6 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <p>© {new Date().getFullYear()} SurveyToCash. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap">
            <a href="/terms-of-service" className="hover:text-primary">Terms of Service</a>
            <a href="/privacy-policy" className="hover:text-primary">Privacy Policy</a>
            <a href="/cookie-policy" className="hover:text-primary">Cookie Policy</a>
            <a href="/affiliate-policy" className="hover:text-primary">Affiliate Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
