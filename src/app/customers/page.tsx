import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = ((await searchParams).q ?? "").trim();

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { contact: { contains: q } },
            { address: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
    include: { _count: { select: { jobs: true } } },
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-slate-900">Customers</h1>
        <Link
          href="/customers/new"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + New customer
        </Link>
      </div>

      <form className="mt-4">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name, phone, address..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </form>

      {customers.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          {q ? `No customers match "${q}".` : "No customers yet. Add your first customer to get started."}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {customers.map((customer) => (
            <li key={customer.id}>
              <Link
                href={`/customers/${customer.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-900">{customer.name}</p>
                  <span className="shrink-0 text-xs text-slate-500">
                    {customer._count.jobs} job{customer._count.jobs === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-sm text-slate-500">
                  {customer.address && <p>{customer.address}</p>}
                  {customer.contact && <p>{customer.contact}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
