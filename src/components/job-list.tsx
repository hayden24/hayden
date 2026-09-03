import Link from "next/link";
import type { Job } from "@prisma/client";

const statusStyles: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  DONE: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  DONE: "Done",
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
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Job #{job.jobNumber}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${statusStyles[job.status]}`}
                >
                  {statusLabels[job.status]}
                </span>
              </div>
              <p className="mt-1 font-medium text-slate-900">{job.scopeOfWork}</p>
              <dl className="mt-2 space-y-0.5 text-sm text-slate-500">
                <div>
                  <dt className="inline font-medium text-slate-600">Location: </dt>
                  <dd className="inline">{job.location}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-slate-600">Customer contact: </dt>
                  <dd className="inline">{job.customerContact}</dd>
                </div>
              </dl>
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
