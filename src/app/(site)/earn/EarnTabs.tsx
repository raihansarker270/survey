"use client";

import { useMemo, useState } from "react";

export default function EarnTabs({ tabs }: { tabs: { id: string; label: string; url: string }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const [nonce, setNonce] = useState<number>(0);

  const activeTab = useMemo(() => tabs.find((t) => t.id === active), [tabs, active]);

  const height = Number(process.env.NEXT_PUBLIC_CPX_IFRAME_HEIGHT || 2000);

  const activeUrl = useMemo(() => {
    if (!activeTab?.url) return "";
    const u = new URL(activeTab.url);
    if (nonce) u.searchParams.set("_", String(nonce));
    return u.toString();
  }, [activeTab?.url, nonce]);

  return (
    <>
      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`px-3 py-1 rounded-md border ${active === t.id ? "border-emerald-500" : "border-gray-700 text-gray-300"}`}>
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
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
          />

          <div className="mt-2 flex gap-2">
            <a href={activeUrl} target="_blank" rel="noopener noreferrer" className="btn text-sm">Open in new tab</a>
            <button className="btn text-sm" onClick={() => setNonce(Date.now())} title="Try fresh session">Try fresh session</button>
          </div>
        </>
      ) : (
        <div className="text-sm text-red-300">URL not configured.</div>
      )}
    </>
  );
}
