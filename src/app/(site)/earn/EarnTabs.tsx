/* src/app/(site)/earn/EarnTabs.tsx */
"use client";

import { useMemo, useState } from "react";

export default function EarnTabs({
  tabs,
}: {
  tabs: { id: string; label: string; url: string }[];
}) {
  const vis = tabs.filter((t) => t.url);
  const [active, setActive] = useState(vis[0]?.id);
  const [nonce, setNonce] = useState<number>(0);

  const activeTab = useMemo(
    () => vis.find((t) => t.id === active),
    [vis, active]
  );

  const height =
    Number(
      process.env.NEXT_PUBLIC_CPX_IFRAME_HEIGHT ||
        process.env.CPX_IFRAME_HEIGHT ||
        2000
    ) || 2000;

  // Effective URL: nonce যোগ করে fresh session ট্রাই করা যাবে
  const activeUrl = useMemo(() => {
    const url = activeTab?.url || "";
    if (!url) return "";
    try {
      const u = new URL(url);
      if (nonce) u.searchParams.set("_", String(nonce)); // cache-buster
      return u.toString();
    } catch {
      // absolute না হলে as-is
      return url;
    }
  }, [activeTab?.url, nonce]);

  return (
    <>
      <div className="flex gap-2 mb-4">
        {vis.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-1 rounded-md border ${
              active === t.id
                ? "border-emerald-500"
                : "border-gray-700 text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeUrl ? (
        <>
          <iframe
            key={activeUrl}
            src={activeUrl}
            width="100%"
            height={height}
            style={{ border: 0 }}
            // ✅ popup/new tab + top navigation (on user click) allow
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
          />

          {/* Fallback actions */}
          <div className="mt-2 flex items-center gap-2">
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-sm"
            >
              Open in new tab
            </a>
            <button
              className="btn text-sm"
              onClick={() => setNonce(Date.now())}
              title="Try fresh session"
            >
              Try fresh session
            </button>
          </div>

          <div className="text-[11px] text-gray-500 mt-1 break-all">
            If a survey doesn’t open: allow pop‑ups for{" "}
            <code>offers.cpx-research.com</code> or use the button above.
            <div className="mt-1">{activeUrl}</div>
          </div>
        </>
      ) : (
        <div className="text-sm text-red-300">URL not configured.</div>
      )}
    </>
  );
}
