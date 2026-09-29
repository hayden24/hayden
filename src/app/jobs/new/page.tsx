import { prisma } from "@/lib/prisma";
import NewJobForm from "./new-job-form";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, contact: true, address: true },
  });
  const customer = customers.find((c) => c.id === customerId);

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
      <h1 className="text-lg font-semibold text-slate-900">New work order</h1>
      <NewJobForm customers={customers} customer={customer} />
    </main>
  );
}
