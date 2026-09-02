import { prisma } from "@/lib/prisma";
import JobList from "@/components/job-list";

export default async function InProgressPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "IN_PROGRESS" },
    orderBy: { createdAt: "desc" },
    include: {
      laborEntries: { select: { hours: true } },
      materialEntries: { select: { quantity: true, unitCost: true } },
    },
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <h1 className="text-lg font-semibold text-slate-900">Projects in progress</h1>
      <JobList jobs={jobs} emptyMessage="No projects in progress right now." />
    </main>
  );
}
