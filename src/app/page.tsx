import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobList from "@/components/job-list";

export default async function Home() {
  const jobs = await prisma.job.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
      laborEntries: { select: { hours: true } },
      materialEntries: { select: { quantity: true, unitCost: true } },
    },
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <h1 className="text-lg font-semibold text-slate-900">Open assignments</h1>
      <JobList
        jobs={jobs}
        emptyMessage="No open assignments. Create a new work order to get started."
      />
      {jobs.length === 0 && (
        <p className="mt-4 text-center">
          <Link href="/jobs/new" className="text-sm font-medium text-blue-600 hover:underline">
            + New work order
          </Link>
        </p>
      )}
    </main>
  );
}
