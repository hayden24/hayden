import { prisma } from "@/lib/prisma";
import PanelList from "./panel-list";

export default async function PanelsTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const panels = await prisma.panel.findMany({
    where: { customerId: id },
    orderBy: { createdAt: "asc" },
  });

  return <PanelList customerId={id} panels={panels} />;
}
