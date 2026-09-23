import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { roomSuggestions } from "@/lib/rooms";
import { CATEGORIES, isOverdue, nextDueDate, visibleFields } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import DeleteButton from "@/components/delete-button";
import { deleteItem, markReplacedToday, updateItem } from "../actions";
import ItemForm from "../item-form";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);

  const item = await prisma.homeItem.findFirst({ where: { id, userId: user.id } });
  if (!item) notFound();

  const rooms = await roomSuggestions(user.id);
  const config = CATEGORIES[item.category];
  const due = nextDueDate(item);
  const overdue = isOverdue(item);

  const details = [
    ...visibleFields(item.category).flatMap((field) => {
      const value = item[field];
      return value ? [{ label: config.fields[field]!.label, value }] : [];
    }),
    ...(item.whereToBuy ? [{ label: "Where to buy", value: item.whereToBuy }] : []),
  ];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/" className="text-sm text-emerald-700 hover:underline">
        &larr; My home
      </Link>

      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          <span aria-hidden>{config.emoji}</span> {config.label}
          {item.room && <> · {item.room}</>}
        </p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">{item.name}</h1>

        {details.length > 0 && (
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {details.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="text-base font-medium text-slate-900 select-all">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {item.notes && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{item.notes}</p>
        )}

        {(item.lastReplaced || due) && (
          <div
            className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
              overdue ? "bg-amber-50 text-amber-800" : "bg-slate-50 text-slate-600"
            }`}
          >
            <span>
              {item.lastReplaced && <>Last done {formatDate(item.lastReplaced)}. </>}
              {due && (
                <strong>
                  {overdue ? "Due now" : "Next due"} {formatDate(due)}
                </strong>
              )}
            </span>
            {item.replaceEveryMonths && (
              <form action={markReplacedToday.bind(null, item.id)}>
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Replaced it today
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <details className="group mt-6 rounded-xl border border-slate-200 bg-white">
        <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-slate-700">
          <span className="group-open:hidden">Edit details</span>
          <span className="hidden group-open:inline">Close editor</span>
        </summary>
        <div className="border-t border-slate-200 p-5">
          <ItemForm action={updateItem.bind(null, item.id)} rooms={rooms} item={item} submitLabel="Save changes" />
        </div>
      </details>

      <div className="mt-8 border-t border-slate-200 pt-4">
        <DeleteButton action={deleteItem.bind(null, item.id)} confirmText={`Delete "${item.name}"?`} />
      </div>
    </main>
  );
}
