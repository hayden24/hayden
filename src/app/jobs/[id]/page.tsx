import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { deleteLaborEntry, deleteMaterialEntry, deleteJob } from "../actions";
import DeleteButton from "@/components/delete-button";
import StatusSelect from "./status-select";
import AddLaborForm from "./add-labor-form";
import AddMaterialForm from "./add-material-form";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function JobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab === "material" ? "material" : "labor";

  const [job, session] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true } },
        laborEntries: { include: { user: { select: { name: true } } }, orderBy: { date: "desc" } },
        materialEntries: {
          include: { user: { select: { name: true } } },
          orderBy: { date: "desc" },
        },
      },
    }),
    auth(),
  ]);

  if (!job) notFound();

  const totalHours = job.laborEntries.reduce((sum, e) => sum + e.hours, 0);
  const totalMaterialCost = job.materialEntries.reduce(
    (sum, e) => sum + e.quantity * (e.unitCost ?? 0),
    0
  );
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        &larr; All jobs
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {job.title}
            {job.jobNumber ? (
              <span className="ml-2 text-sm font-normal text-slate-400">#{job.jobNumber}</span>
            ) : null}
          </h1>
          <p className="text-sm text-slate-500">{job.customerName}</p>
          {job.address && <p className="text-sm text-slate-500">{job.address}</p>}
        </div>
        <StatusSelect jobId={job.id} status={job.status} />
      </div>

      {job.notes && (
        <p className="mt-3 whitespace-pre-wrap rounded-md bg-white p-3 text-sm text-slate-600 border border-slate-200">
          {job.notes}
        </p>
      )}

      <div className="mt-4 flex gap-6 text-sm text-slate-500">
        <span>
          <strong className="text-slate-900">{totalHours.toFixed(1)}</strong> labor hrs
        </span>
        <span>
          <strong className="text-slate-900">${totalMaterialCost.toFixed(2)}</strong> materials
        </span>
        <span>Created by {job.createdBy.name}</span>
      </div>

      <div className="mt-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          <Link
            href={`/jobs/${job.id}?tab=labor`}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              activeTab === "labor"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Labor
          </Link>
          <Link
            href={`/jobs/${job.id}?tab=material`}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              activeTab === "material"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Material
          </Link>
        </nav>
      </div>

      {activeTab === "labor" ? (
        <section className="mt-4 space-y-4">
          <AddLaborForm jobId={job.id} />
          {job.laborEntries.length === 0 ? (
            <p className="text-sm text-slate-500">No hours logged yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {job.laborEntries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {entry.hours.toFixed(2)} hrs &middot; {formatDate(entry.date)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {entry.user.name}
                      {entry.description ? ` — ${entry.description}` : ""}
                    </p>
                  </div>
                  <DeleteButton
                    action={deleteLaborEntry.bind(null, job.id, entry.id)}
                    confirmText="Delete this labor entry?"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="mt-4 space-y-4">
          <AddMaterialForm jobId={job.id} />
          {job.materialEntries.length === 0 ? (
            <p className="text-sm text-slate-500">No materials logged yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {job.materialEntries.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {entry.description} &middot; qty {entry.quantity}
                      {entry.unitCost != null && (
                        <> &middot; ${(entry.quantity * entry.unitCost).toFixed(2)}</>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {entry.user.name} — {formatDate(entry.date)}
                    </p>
                  </div>
                  <DeleteButton
                    action={deleteMaterialEntry.bind(null, job.id, entry.id)}
                    confirmText="Delete this material entry?"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {isAdmin && (
        <div className="mt-8 border-t border-slate-200 pt-4">
          <DeleteButton
            action={deleteJob.bind(null, job.id)}
            confirmText="Delete this entire job, including all labor and material entries?"
          />
        </div>
      )}
    </main>
  );
}
