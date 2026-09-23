import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SpecsForm from "./specs-form";

export default async function SpecsTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  return <SpecsForm customer={customer} />;
}
