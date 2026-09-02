import Link from "next/link";
import { auth } from "@/auth";
import NavMenu from "@/components/nav-menu";

export default async function Header() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <header
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-slate-900">
          Job Tracker
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-slate-500 sm:inline">{session.user.name}</span>
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
