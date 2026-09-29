import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isRecordKind, type RecordKind } from "@/lib/customer-records";
import RecordSection, { type CustomerRecord } from "../record-section";

function loadRecords(kind: RecordKind, customerId: string): Promise<CustomerRecord[]> {
  const args = { where: { customerId }, orderBy: { createdAt: "asc" as const } };
  switch (kind) {
    case "service":
      return prisma.electricalService.findMany(args);
    case "lighting":
      return prisma.lightingFixture.findMany(args);
    case "circuits":
      return prisma.circuit.findMany(args);
    case "info":
      return prisma.customerInfoItem.findMany(args);
  }
}

export default async function CustomerSectionPage({
  params,
}: {
  params: Promise<{ id: string; section: string }>;
}) {
  const { id, section } = await params;
  if (!isRecordKind(section)) notFound();

  const records = await loadRecords(section, id);

  return <RecordSection customerId={id} kind={section} records={records} />;
}
