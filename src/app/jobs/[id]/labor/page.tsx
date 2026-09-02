import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deleteLaborEntry } from "../../actions";
import DeleteButton from "@/components/delete-button";
import AddLaborForm from "../add-labor-form";

export default async function LaborTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const laborEntries = await prisma.laborEntry.findMany({
    where: { jobId: id },
    include: { user: { select: { name: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <section className="space-y-4">
      <AddLaborForm jobId={id} />
      {laborEntries.length === 0 ? (
        <p className="text-sm text-slate-500">No hours logged yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {laborEntries.map((entry) => (
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
                action={deleteLaborEntry.bind(null, id, entry.id)}
                confirmText="Delete this labor entry?"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
