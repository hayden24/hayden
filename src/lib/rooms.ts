import { prisma } from "@/lib/prisma";

const COMMON_ROOMS = [
  "Kitchen",
  "Living room",
  "Primary bedroom",
  "Bathroom",
  "Basement",
  "Garage",
  "Exterior",
  "Whole house",
];

// Rooms the user has already used, followed by common suggestions.
export async function roomSuggestions(userId: string) {
  const used = await prisma.homeItem.findMany({
    where: { userId, room: { not: null } },
    distinct: ["room"],
    select: { room: true },
    orderBy: { room: "asc" },
  });
  const names = used.map((r) => r.room as string);
  return [...names, ...COMMON_ROOMS.filter((r) => !names.includes(r))];
}
