import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { inputClass } from "./field";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  const customers = await prisma.customer.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query } },
            { address: { contains: query } },
            { phone: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
    include: {
      panels: { select: { label: true, brand: true, amperage: true }, orderBy: { createdAt: "asc" } },
    },
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

      <form className="mt-4" role="search">
        <label htmlFor="q" className="sr-only">
          Search customers
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by name, address, or phone"
          className={inputClass}
        />
      </form>

      {customers.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          {query
            ? `No customers match "${query}".`
            : "No customers yet. Add one to start keeping panel and device info on file."}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {customers.map((customer) => (
            <li key={customer.id}>
              <Link
                href={`/customers/${customer.id}/panels`}
                className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm"
              >
                <p className="font-medium text-slate-900">{customer.name}</p>
                <p className="text-sm text-slate-500">{customer.address}</p>
                {customer.phone && <p className="text-sm text-slate-500">{customer.phone}</p>}
                {customer.panels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {customer.panels.map((panel, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                      >
                        {[panel.label, panel.amperage && `${panel.amperage}A`, panel.brand]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
