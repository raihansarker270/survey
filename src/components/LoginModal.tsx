"use client";
import { useEffect, useRef, useState } from "react";

export default function LoginModal({
  isOpen,
  onClose,
}: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Login failed");
      onClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Click on backdrop to close (but ignore clicks inside dialog)
  function backdropClick(e: React.MouseEvent) {
    if (e.target === dialogRef.current) onClose();
  }

  const canSubmit = email.trim().length > 3;

  return (
    <div
      ref={dialogRef}
      onMouseDown={backdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 id="login-title" className="text-lg font-semibold text-white">Login / Register</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={login} className="space-y-3">
          <input
            className="input w-full"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn w-full" disabled={loading || !canSubmit}>
            {loading ? "Signing in..." : "Start Earning"}
          </button>
          {message && (
            <div className="text-sm text-red-400" aria-live="polite">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
