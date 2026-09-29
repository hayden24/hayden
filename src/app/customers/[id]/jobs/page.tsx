import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobList from "@/components/job-list";

export default async function CustomerJobsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const jobs = await prisma.job.findMany({
    where: { customerId: id },
    orderBy: { createdAt: "desc" },
    include: {
      laborEntries: { select: { hours: true } },
      materialEntries: { select: { quantity: true, unitCost: true } },
    },
  });

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">Jobs</h2>
        <Link
          href={`/jobs/new?customerId=${id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          + New work order
        </Link>
      </div>
      <JobList jobs={jobs} emptyMessage="No jobs for this customer yet." />
    </section>
  );
}
