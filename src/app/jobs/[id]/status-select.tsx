"use client";

import { useTransition } from "react";
import { updateJobStatus } from "../actions";

const options = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETE", label: "Complete" },
  { value: "ON_HOLD", label: "On hold" },
];

export default function StatusSelect({
  jobId,
  status,
}: {
  jobId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateJobStatus(jobId, e.target.value))}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-medium text-slate-700 disabled:opacity-60"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
