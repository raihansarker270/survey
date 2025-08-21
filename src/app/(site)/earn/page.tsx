import EarnTabs from "./EarnTabs";
import { getSessionFromCookie } from "@/lib/auth";
import { buildCpxUrl } from "@/lib/cpx";
import Link from "next/link";

export default async function EarnPage() {
  const session = getSessionFromCookie();
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600">
            Please{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              sign in
            </Link>{" "}
            to access surveys.
          </p>
        </div>
      </div>
    );
  }

  const uid = session.userId;
  const email = session.email ?? undefined;
  const name = email ? email.split("@")[0] : undefined;

  const cpxUrl = uid ? buildCpxUrl({ uid, name, email }) : "";

  const tabs = [
    { id: "cpx", label: "CPX Research", url: cpxUrl },
  ].filter((t) => !!t.url);

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Earn <span className="text-blue-600">Surveys</span>
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        {tabs.length > 0 ? (
          <EarnTabs tabs={tabs} />
        ) : (
          <div className="text-gray-500 text-center py-4">
            No provider URL configured
          </div>
        )}
      </div>
    </div>
  );
}
