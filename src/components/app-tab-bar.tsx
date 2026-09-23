"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ShareIcon, HelpIcon } from "@/components/icons";

const TABS = [
  { href: "/", label: "My home", Icon: HomeIcon, match: ["/", "/items"] },
  { href: "/share", label: "Share", Icon: ShareIcon, match: ["/share"] },
  { href: "/help", label: "Help", Icon: HelpIcon, match: ["/help"] },
] as const;

export default function AppTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-3">
        {TABS.map(({ href, label, Icon, match }) => {
          const active = match.some((m) =>
            m === "/" ? pathname === "/" : pathname === m || pathname.startsWith(`${m}/`)
          );
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                active ? "text-emerald-700" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="px-1 text-center leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
