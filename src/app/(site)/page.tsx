"use client";

import { useState } from "react";

export default function Home() {
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
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold leading-tight">
          Launch your <span className="text-emerald-400">US Paid Survey</span> site fast.
        </h1>
        <p className="text-gray-300">
          Users complete surveys, you earn margin, they earn rewards. Simple wallet, webhook-based credits,
          manual withdrawals. This MVP is intentionally minimal — secure it further before public launch.
        </p>
        <form onSubmit={login} className="card space-y-3 max-w-md">
          <label className="label">Sign in with email (no password, MVP)</label>
          <input
            className="input"
            placeholder="you@example.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>
          {message && <div className="text-sm text-gray-300">{message}</div>}
        </form>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Features</h3>
        <ul className="space-y-2 text-gray-300 list-disc ml-5">
          <li>Offerwall embed with user tracking</li>
          <li>Webhook to credit points (with optional HMAC)</li>
          <li>Wallet ledger and withdrawal requests</li>
          <li>US-only checks (extend as needed)</li>
        </ul>
      </div>
    </div>
  );
}
