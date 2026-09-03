"use client";

import { useTransition } from "react";
import { updateJobStatus } from "../actions";

const options = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "DONE", label: "Done" },
];

export default function StatusSelect({
  jobId,
  status,
}: {
  jobId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === status)
  );

  return (
    <div className="relative inline-grid w-full grid-cols-3 rounded-full bg-slate-100 p-1 sm:w-auto">
      <div
        className="absolute inset-y-1 left-1 rounded-full bg-blue-600 transition-transform duration-200 ease-out"
        style={{
          width: "calc((100% - 8px) / 3)",
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const isActive = opt.value === status;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => updateJobStatus(jobId, opt.value))}
            className={`relative z-10 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 sm:text-sm ${
              isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
