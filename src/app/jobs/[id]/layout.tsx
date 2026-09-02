import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { deleteJob } from "../actions";
import DeleteButton from "@/components/delete-button";
import StatusSelect from "./status-select";
import JobDetails from "./job-details";
import JobTabBar from "./job-tab-bar";

const backLinkByStatus: Record<string, { href: string; label: string }> = {
  OPEN: { href: "/", label: "Open assignments" },
  IN_PROGRESS: { href: "/assignments/in-progress", label: "Projects in progress" },
};

export default async function JobLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [job, session, laborAgg, materialEntries, poAgg] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: { createdBy: { select: { name: true } } },
    }),
    auth(),
    prisma.laborEntry.aggregate({ where: { jobId: id }, _sum: { hours: true } }),
    prisma.materialEntry.findMany({
      where: { jobId: id },
      select: { quantity: true, unitCost: true },
    }),
    prisma.purchaseOrder.aggregate({ where: { jobId: id }, _sum: { amount: true } }),
  ]);

  if (!job) notFound();

  const totalHours = laborAgg._sum.hours ?? 0;
  const totalMaterialCost = materialEntries.reduce(
    (sum, e) => sum + e.quantity * (e.unitCost ?? 0),
    0
  );
  const totalPOAmount = poAgg._sum.amount ?? 0;
  const isAdmin = session?.user?.role === "ADMIN";
  const backLink = backLinkByStatus[job.status] ?? backLinkByStatus.OPEN;

  return (
    <>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-28">
        <Link href={backLink.href} className="text-sm text-blue-600 hover:underline">
          &larr; {backLink.label}
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <JobDetails
              job={{
                id: job.id,
                jobNumber: job.jobNumber,
                scopeOfWork: job.scopeOfWork,
                location: job.location,
                customerName: job.customerName,
                customerContact: job.customerContact,
              }}
            />
          </div>
          <StatusSelect jobId={job.id} status={job.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
          <span>
            <strong className="text-slate-900">{totalHours.toFixed(1)}</strong> labor hrs
          </span>
          <span>
            <strong className="text-slate-900">${totalMaterialCost.toFixed(2)}</strong> materials
          </span>
          <span>
            <strong className="text-slate-900">${totalPOAmount.toFixed(2)}</strong> purchase orders
          </span>
          <span>Created by {job.createdBy.name}</span>
        </div>

        <div className="mt-6">{children}</div>

        {isAdmin && (
          <div className="mt-8 border-t border-slate-200 pt-4">
            <DeleteButton
              action={deleteJob.bind(null, job.id)}
              confirmText="Delete this entire job, including all labor, material, and purchase order entries?"
            />
          </div>
        )}
      </main>
      <JobTabBar jobId={job.id} />
    </>
  );
}
