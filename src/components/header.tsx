import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Header() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-slate-900">
          Job Tracker
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500">{session.user.name}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
