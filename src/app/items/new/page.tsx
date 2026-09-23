import Link from "next/link";
import { requireUser } from "@/lib/session";
import { roomSuggestions } from "@/lib/rooms";
import { isCategory } from "@/lib/categories";
import { createItem } from "../actions";
import ItemForm from "../item-form";

export default async function NewItemPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, user] = await Promise.all([searchParams, requireUser()]);
  const rooms = await roomSuggestions(user.id);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <Link href="/" className="text-sm text-emerald-700 hover:underline">
        &larr; My home
      </Link>
      <h1 className="mt-2 text-lg font-semibold text-slate-900">Add to my home</h1>
      <p className="mt-1 text-sm text-slate-500">
        Save a detail you&apos;ll want to look up later.
      </p>
      <div className="mt-6">
        <ItemForm
          action={createItem}
          rooms={rooms}
          initialCategory={category && isCategory(category) ? category : undefined}
          submitLabel="Save item"
        />
      </div>
    </main>
  );
}
