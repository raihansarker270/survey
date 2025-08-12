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
        {/* Hero */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Get Paid for Your Opinion —{" "}
          <span className="text-emerald-400">Join US Surveys &amp; Earn Rewards</span>
        </h1>

        <p className="text-gray-300">
          Share your thoughts, complete fun surveys, and earn real rewards.
          Quick sign-up, instant credits, and safe payouts — all in one place.
        </p>

        {/* Sign in form */}
        <form onSubmit={login} className="card space-y-3 max-w-md">
          <label className="label">Sign in with your email to start earning</label>
          <input
            className="input"
            placeholder="you@example.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn" disabled={loading}>
            {loading ? "Signing in..." : "Start Earning"}
          </button>
          {message && <div className="text-sm text-gray-300">{message}</div>}
        </form>
      </div>

      {/* Right column: Features */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Why Join Us?</h3>
        <ul className="space-y-2 text-gray-300 list-disc ml-5">
          <li>Complete surveys anytime, anywhere</li>
          <li>Instant credit to your wallet</li>
          <li>Safe &amp; secure payouts</li>
          <li>US-only for best-matched surveys</li>
          <li>Simple and easy — no passwords needed</li>
        </ul>
      </div>

      {/* Cashout Methods (SVG) */}
      <div className="md:col-span-2 mt-2">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">You can cash out via:</h3>
          <div className="flex flex-wrap gap-6 items-center">
            <IconItem src="/images/paypal.svg" label="PayPal" />
            <IconItem src="/images/amazon.svg" label="Amazon Gift Card" />
            <IconItem src="/images/apple.svg" label="Apple Gift Card" />
            <IconItem src="/images/crypto.svg" label="Crypto" />
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * Availability may vary. Additional methods can be added over time.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Small presentational component for cashout icons */
function IconItem({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-sm text-gray-300">
      <img
        src={src}
        alt={label}
        className="h-10 w-auto transition-transform duration-150 hover:scale-105"
        loading="lazy"
      />
      <span className="mt-2">{label}</span>
    </div>
  );
}
