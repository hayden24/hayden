/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const demoPassword = await bcrypt.hash("demo1234", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@jobtracker.local" },
    update: {},
    create: {
      name: "Demo Office",
      email: "demo@jobtracker.local",
      password: demoPassword,
      role: "ADMIN",
    },
  });

  const jobs = [
    {
      jobNumber: "J-1001",
      scopeOfWork: "Replace 200A panel and add two new circuits for kitchen remodel",
      location: "412 Oak St, Springfield",
      customerName: "Karen Willis",
      customerContact: "Karen Willis - (555) 201-8834",
      status: "OPEN",
    },
    {
      jobNumber: "J-1002",
      scopeOfWork: "Diagnose and repair no-power condition in master bedroom",
      location: "88 Birch Ave, Springfield",
      customerName: "Tom Reyes",
      customerContact: "Tom Reyes - (555) 340-1122",
      status: "OPEN",
    },
    {
      jobNumber: "J-1003",
      scopeOfWork: "Install EV charger outlet in garage, 50A circuit",
      location: "215 Maple Dr, Shelbyville",
      customerName: "Priya Nandakumar",
      customerContact: "Priya Nandakumar - (555) 762-0099",
      status: "OPEN",
    },
    {
      jobNumber: "J-0998",
      scopeOfWork: "Rewire two bathrooms and add GFCI protection to code",
      location: "1450 5th Ave, Capital City",
      customerName: "Riverstone Property Mgmt",
      customerContact: "Dana Choi (site manager) - (555) 918-4420",
      status: "IN_PROGRESS",
    },
    {
      jobNumber: "J-0999",
      scopeOfWork: "Replace outdoor lighting and install new photocell control",
      location: "77 Industrial Pkwy, Springfield",
      customerName: "Springfield Auto Body",
      customerContact: "Mike Hansen - (555) 553-7761",
      status: "IN_PROGRESS",
    },
  ];

  for (const job of jobs) {
    const existing = await prisma.job.findFirst({ where: { jobNumber: job.jobNumber } });
    if (existing) continue;
    await prisma.job.create({
      data: { ...job, createdById: demoUser.id },
    });
  }

  console.log(`Seeded ${jobs.length} pretend jobs (skipping any that already exist).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
