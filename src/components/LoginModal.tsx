"use client";

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || (res.ok ? "Logged in!" : "Login failed"));
      if (res.ok) window.location.href = "/dashboard";
    } catch (err) {
      setMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    // Overlay with click-to-close
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // click overlay closes modal
    >
      <div
        className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()} // prevent modal click closing
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black font-bold text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Sign in with your email
        </h2>

        <form onSubmit={login} className="space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="gradient"
            fullWidth
            large
            disabled={loading}
          >
            {loading ? "Signing in..." : "Start Earning"}
          </Button>
        </form>

        {message && (
          <p className="mt-2 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
