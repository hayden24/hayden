import { prisma } from "@/lib/prisma";
import FixtureList from "./fixture-list";

export default async function LightingTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fixtures = await prisma.fixture.findMany({
    where: { customerId: id },
    orderBy: { createdAt: "asc" },
  });

  return <FixtureList customerId={id} fixtures={fixtures} />;
}
