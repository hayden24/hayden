import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NotesForm from "../notes-form";

export default async function NotesTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({ where: { id }, select: { notes: true } });
  if (!job) notFound();

  return (
    <section>
      <NotesForm jobId={id} notes={job.notes} />
    </section>
  );
}
