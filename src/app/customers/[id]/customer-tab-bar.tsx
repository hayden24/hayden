"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoltIcon, BulbIcon, BreakerIcon, InfoIcon, BriefcaseIcon } from "@/components/icons";

const TABS = [
  { key: "service", label: "Service", Icon: BoltIcon },
  { key: "lighting", label: "Lighting", Icon: BulbIcon },
  { key: "circuits", label: "Circuits", Icon: BreakerIcon },
  { key: "info", label: "Other info", Icon: InfoIcon },
  { key: "jobs", label: "Jobs", Icon: BriefcaseIcon },
] as const;

export default function CustomerTabBar({ customerId }: { customerId: string }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-5">
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
