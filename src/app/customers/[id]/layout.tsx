import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { deleteCustomer } from "../actions";
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
              contact: customer.contact,
              email: customer.email,
              address: customer.address,
              notes: customer.notes,
            }}
          />
        </div>

        <div className="mt-6">{children}</div>

        {isAdmin && (
          <div className="mt-8 border-t border-slate-200 pt-4">
            <DeleteButton
              action={deleteCustomer.bind(null, customer.id)}
              confirmText="Delete this customer and all of their service, lighting, circuit, and other info? Their jobs will be kept."
            />
          </div>
        )}
      </main>
      <CustomerTabBar customerId={customer.id} />
    </>
  );
}
