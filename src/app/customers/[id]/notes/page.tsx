import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NotesForm from "./notes-form";

export default async function CustomerNotesTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { accessNotes: true, notes: true },
  });
  if (!customer) notFound();

  return (
    <section>
      <NotesForm customerId={id} accessNotes={customer.accessNotes} notes={customer.notes} />
    </section>
  );
}
