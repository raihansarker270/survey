/* src/app/(site)/earn/EarnTabs.tsx */
"use client";
import { useState } from "react";

export default function EarnTabs({ tabs }: { tabs: { id: string; label: string; url: string }[] }) {
  const vis = tabs.filter(t => t.url);
  const [active, setActive] = useState(vis[0]?.id);
  const activeUrl = vis.find(t => t.id === active)?.url || "";
  const height = Number(process.env.NEXT_PUBLIC_CPX_IFRAME_HEIGHT || process.env.CPX_IFRAME_HEIGHT || 2000);

  return (
    <>
      <div className="flex gap-2 mb-4">
        {vis.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`px-3 py-1 rounded-md border ${active===t.id?"border-emerald-500":"border-gray-700 text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {activeUrl ? (
        <iframe
          key={activeUrl}
          src={activeUrl}
          width="100%"
          height={height}
          style={{ border: 0 }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      ) : (
        <div className="text-sm text-red-300">URL not configured.</div>
      )}
    </>
  );
}
