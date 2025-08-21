import EarnTabs from "./EarnTabs";
import { getSessionFromCookie } from "@/lib/auth";
import { buildCpxUrl } from "@/lib/cpx";

export default async function EarnPage() {
  const session = getSessionFromCookie();
  if (!session) return <div>Please sign in to access surveys.</div>;

  const uid = session.userId;
  const email = session.email ?? undefined;
  const name = email ? email.split("@")[0] : undefined;

  const cpxUrl = uid ? buildCpxUrl({ uid, name, email }) : "";

  const tabs = [
    { id: "cpx", label: "CPX Research", url: cpxUrl },
  ].filter((t) => !!t.url);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Earn Surveys</h1>
      <div className="card">
        {tabs.length > 0 ? <EarnTabs tabs={tabs} /> : <div>No provider URL configured</div>}
      </div>
    </div>
  );
}
