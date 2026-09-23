import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { deleteCustomer } from "../actions";
import { SuggestionLists } from "../field";
import DeleteButton from "@/components/delete-button";
import CustomerDetails from "./customer-details";
import CustomerTabBar from "./customer-tab-bar";

export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [customer, session] = await Promise.all([
    prisma.customer.findUnique({ where: { id } }),
    auth(),
  ]);

  if (!customer) notFound();

  const isAdmin = session?.user?.role === "ADMIN";

  // Quick-glance finishes so the right devices go on the truck.
  const atAGlance = [
    ["Outlets", customer.outletColor],
    ["Switches", customer.switchColor],
    ["Cover plates", [customer.coverPlateColor, customer.coverPlateType].filter(Boolean).join(" ")],
    ["Style", customer.deviceStyle],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-28">
        <Link href="/customers" className="text-sm text-blue-600 hover:underline">
          &larr; Customers
        </Link>

        <div className="mt-2">
          <CustomerDetails
            customer={{
              id: customer.id,
              name: customer.name,
              address: customer.address,
              phone: customer.phone,
              email: customer.email,
            }}
          />
        </div>

        {atAGlance.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
            {atAGlance.map(([label, value]) => (
              <span key={label}>
                {label}: <strong className="text-slate-900">{value}</strong>
              </span>
            ))}
          </div>
        )}

        {customer.accessNotes && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <strong>Access:</strong> {customer.accessNotes}
          </p>
        )}

        <div className="mt-6">{children}</div>

        {isAdmin && (
          <div className="mt-8 border-t border-slate-200 pt-4">
            <DeleteButton
              action={deleteCustomer.bind(null, customer.id)}
              confirmText="Delete this customer, including all panel and lighting records?"
            />
          </div>
        )}
      </main>
      <SuggestionLists />
      <CustomerTabBar customerId={customer.id} />
    </>
  );
}
