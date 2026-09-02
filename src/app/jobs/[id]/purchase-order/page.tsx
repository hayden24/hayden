import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deletePurchaseOrder } from "../../actions";
import DeleteButton from "@/components/delete-button";
import AddPurchaseOrderForm from "../add-purchase-order-form";

export default async function PurchaseOrderTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where: { jobId: id },
    include: { user: { select: { name: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <section className="space-y-4">
      <AddPurchaseOrderForm jobId={id} />
      {purchaseOrders.length === 0 ? (
        <p className="text-sm text-slate-500">No purchase orders yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {purchaseOrders.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  PO #{entry.poNumber} &middot; {entry.vendor}
                  {entry.amount != null && <> &middot; ${entry.amount.toFixed(2)}</>}
                </p>
                <p className="text-xs text-slate-500">
                  {entry.user.name} — {formatDate(entry.date)}
                  {entry.description ? ` — ${entry.description}` : ""}
                </p>
              </div>
              <DeleteButton
                action={deletePurchaseOrder.bind(null, id, entry.id)}
                confirmText="Delete this purchase order?"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
