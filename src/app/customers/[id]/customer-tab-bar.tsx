"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelIcon, BulbIcon, OutletIcon, NotesIcon } from "@/components/icons";

const TABS = [
  { key: "panels", label: "Panels", Icon: PanelIcon },
  { key: "lighting", label: "Lighting", Icon: BulbIcon },
  { key: "specs", label: "Devices & service", Icon: OutletIcon },
  { key: "notes", label: "Notes", Icon: NotesIcon },
] as const;

export default function CustomerTabBar({ customerId }: { customerId: string }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-4">
        {TABS.map(({ key, label, Icon }) => {
          const href = `/customers/${customerId}/${key}`;
          const active = pathname === href;
          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                active ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
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
