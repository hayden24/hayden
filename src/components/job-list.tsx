import Link from "next/link";
import type { Job } from "@prisma/client";

const statusStyles: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETE: "bg-green-100 text-green-700",
  ON_HOLD: "bg-slate-200 text-slate-700",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  COMPLETE: "Complete",
  ON_HOLD: "On hold",
};

type JobWithTotals = Job & {
  laborEntries: { hours: number }[];
  materialEntries: { quantity: number; unitCost: number | null }[];
};

export default function JobList({
  jobs,
  emptyMessage,
}: {
  jobs: JobWithTotals[];
  emptyMessage: string;
}) {
  if (jobs.length === 0) {
    return <p className="mt-10 text-center text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <ul className="mt-4 space-y-3">
      {jobs.map((job) => {
        const totalHours = job.laborEntries.reduce((sum, e) => sum + e.hours, 0);
        const totalMaterialCost = job.materialEntries.reduce(
          (sum, e) => sum + e.quantity * (e.unitCost ?? 0),
          0
        );
        return (
          <li key={job.id}>
            <Link
              href={`/jobs/${job.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">
                    {job.title}
                    {job.jobNumber ? (
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        #{job.jobNumber}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-slate-500">{job.customerName}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${statusStyles[job.status]}`}
                >
                  {statusLabels[job.status]}
                </span>
              </div>
              <div className="mt-3 flex gap-4 text-xs text-slate-500">
                <span>{totalHours.toFixed(1)} labor hrs</span>
                <span>
                  {totalMaterialCost > 0
                    ? `$${totalMaterialCost.toFixed(2)} materials`
                    : `${job.materialEntries.length} material item(s)`}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
