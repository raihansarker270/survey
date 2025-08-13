"use client";
import { useState } from "react";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message || (res.ok ? "Logged in!" : "Login failed"));
    if (res.ok) {
      onClose();
      window.location.href = "/dashboard";
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Login / Register</h2>
        <form onSubmit={login} className="space-y-3">
          <input
            className="input w-full"
            placeholder="you@example.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn w-full" disabled={loading}>
            {loading ? "Signing in..." : "Start Earning"}
          </button>
          {message && <div className="text-sm text-gray-300">{message}</div>}
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
