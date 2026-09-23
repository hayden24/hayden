import Link from "next/link";
import type { HomeItem, ItemCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  DETAIL_FIELDS,
  isCategory,
  isOverdue,
  visibleFields,
} from "@/lib/categories";

const SEARCH_FIELDS = [
  "name",
  "room",
  ...DETAIL_FIELDS,
  "whereToBuy",
  "notes",
] as const satisfies readonly (keyof HomeItem)[];

function buildWhere(userId: string, q: string, category?: ItemCategory) {
  const where: Prisma.HomeItemWhereInput = { userId };
  if (category) where.category = category;
  if (q) {
    // "filter", "bulbs", "paint" etc. should also match the category itself.
    const lower = q.toLowerCase();
    const matchingCategories = CATEGORY_KEYS.filter((key) => {
      const label = CATEGORIES[key].label.toLowerCase();
      return label.includes(lower) || lower.includes(label.replace(/s$/, ""));
    });
    where.OR = [
      ...SEARCH_FIELDS.map((field) => ({ [field]: { contains: q } })),
      ...(matchingCategories.length ? [{ category: { in: matchingCategories } }] : []),
    ];
  }
  return where;
}

function summary(item: HomeItem) {
  return visibleFields(item.category)
    .filter((f) => item[f])
    .slice(0, 3)
    .map((f) => item[f])
    .join(" · ");
}

export default async function MyHomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const [params, user] = await Promise.all([searchParams, requireUser()]);
  const q = params.q?.trim() ?? "";
  const category = params.category && isCategory(params.category) ? params.category : undefined;

  const [items, totalCount] = await Promise.all([
    prisma.homeItem.findMany({
      where: buildWhere(user.id, q, category),
      orderBy: [{ room: "asc" }, { name: "asc" }],
    }),
    prisma.homeItem.count({ where: { userId: user.id } }),
  ]);

  const dueItems = items.filter(isOverdue);
  const byRoom = new Map<string, HomeItem[]>();
  for (const item of items) {
    const room = item.room || "Unassigned";
    byRoom.set(room, [...(byRoom.get(room) ?? []), item]);
  }

  const chipHref = (key?: ItemCategory) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (key) sp.set("category", key);
    const s = sp.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-slate-900">My home</h1>
        <Link
          href={category ? `/items/new?category=${category}` : "/items/new"}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Add item
        </Link>
      </div>

      <form action="/" className="mt-4">
        {category && <input type="hidden" name="category" value={category} />}
        <label htmlFor="q" className="sr-only">
          Search your home
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search: furnace filter, kitchen bulbs, bedroom paint..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </form>

      <nav aria-label="Categories" className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link
          href={chipHref()}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
            !category
              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
              : "border-slate-300 bg-white text-slate-600"
          }`}
        >
          All
        </Link>
        {CATEGORY_KEYS.map((key) => (
          <Link
            key={key}
            href={chipHref(key)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
              category === key
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-slate-300 bg-white text-slate-600"
            }`}
          >
            <span aria-hidden>{CATEGORIES[key].emoji}</span> {CATEGORIES[key].label}
          </Link>
        ))}
      </nav>

      {dueItems.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Due for replacement:</strong>{" "}
          {dueItems.map((item, i) => (
            <span key={item.id}>
              {i > 0 && ", "}
              <Link href={`/items/${item.id}`} className="underline">
                {item.name}
              </Link>
            </span>
          ))}
        </div>
      )}

      {totalCount === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-base font-medium text-slate-900">Start your home&apos;s record</p>
          <p className="mt-1 text-sm text-slate-500">
            Paint colors, filter sizes, light bulbs, appliance model numbers — save them once
            and never dig through the garage again.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(["PAINT", "FILTER", "LIGHT_BULB", "APPLIANCE"] as const).map((key) => (
              <Link
                key={key}
                href={`/items/new?category=${key}`}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-emerald-500"
              >
                <span aria-hidden>{CATEGORIES[key].emoji}</span> Add {CATEGORIES[key].label.toLowerCase()}
              </Link>
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          Nothing matches{q && <> &ldquo;{q}&rdquo;</>}.{" "}
          <Link href="/" className="text-emerald-700 hover:underline">
            Clear search
          </Link>
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {[...byRoom.entries()].map(([room, roomItems]) => (
            <section key={room}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {room}
              </h2>
              <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
                {roomItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/items/${item.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <span className="text-xl" aria-hidden>
                        {CATEGORIES[item.category].emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-slate-900">{item.name}</span>
                        <span className="block truncate text-sm text-slate-500">
                          {summary(item) || CATEGORIES[item.category].label}
                        </span>
                      </span>
                      {isOverdue(item) && (
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Due
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
