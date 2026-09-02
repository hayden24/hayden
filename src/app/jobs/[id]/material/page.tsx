import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deleteMaterialEntry } from "../../actions";
import DeleteButton from "@/components/delete-button";
import AddMaterialForm from "../add-material-form";

export default async function MaterialTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const materialEntries = await prisma.materialEntry.findMany({
    where: { jobId: id },
    include: { user: { select: { name: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <section className="space-y-4">
      <AddMaterialForm jobId={id} />
      {materialEntries.length === 0 ? (
        <p className="text-sm text-slate-500">No materials logged yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {materialEntries.map((entry) => (
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
                action={deleteMaterialEntry.bind(null, id, entry.id)}
                confirmText="Delete this material entry?"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
