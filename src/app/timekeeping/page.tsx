import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function TimekeepingPage() {
  const session = await auth();
  if (!session?.user) return null;

  const entries = await prisma.laborEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    include: { job: { select: { id: true, title: true, jobNumber: true } } },
  });

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <h1 className="text-lg font-semibold text-slate-900">Timekeeping</h1>
      <p className="mt-1 text-sm text-slate-500">
        <strong className="text-slate-900">{totalHours.toFixed(1)}</strong> total hours logged
      </p>

      {entries.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          You haven&apos;t logged any hours yet. Open a job&apos;s Labor tab to add hours.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {entry.hours.toFixed(2)} hrs &middot; {formatDate(entry.date)}
                </p>
                <p className="text-xs text-slate-500">
                  <Link href={`/jobs/${entry.job.id}?tab=labor`} className="text-blue-600 hover:underline">
                    {entry.job.title}
                    {entry.job.jobNumber ? ` #${entry.job.jobNumber}` : ""}
                  </Link>
                  {entry.description ? ` — ${entry.description}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
