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

  const purchaseOrdersByJobNumber = {
    "J-1001": [
      { poNumber: "PO-4021", vendor: "City Electric Supply", description: "200A panel + breakers", amount: 612.4 },
    ],
    "J-0998": [
      { poNumber: "PO-3987", vendor: "Springfield Electrical Wholesale", description: "GFCI breakers and wire", amount: 284.1 },
    ],
  };

  let createdCount = 0;
  for (const job of jobs) {
    const existing = await prisma.job.findFirst({ where: { jobNumber: job.jobNumber } });
    if (existing) continue;

    const created = await prisma.job.create({
      data: { ...job, createdById: demoUser.id },
    });
    createdCount += 1;

    const purchaseOrders = purchaseOrdersByJobNumber[job.jobNumber];
    if (purchaseOrders) {
      for (const po of purchaseOrders) {
        await prisma.purchaseOrder.create({
          data: { ...po, jobId: created.id, userId: demoUser.id },
        });
      }
    }
  }

  console.log(`Seeded ${createdCount} pretend jobs (skipping any that already exist).`);

  const customers = [
    {
      name: "Karen Willis",
      address: "412 Oak St, Springfield",
      phone: "(555) 201-8834",
      serviceType: "Overhead",
      utilityCompany: "Springfield Power & Light",
      deviceBrand: "Leviton",
      deviceStyle: "Decora (rocker)",
      outletColor: "White",
      switchColor: "White",
      coverPlateColor: "White",
      coverPlateType: "Screwless",
      accessNotes: "Side gate code 4821. Friendly dog.",
      panels: [
        {
          label: "Main panel",
          location: "Garage, east wall",
          brand: "Square D Homeline",
          amperage: 200,
          panelType: "Main breaker",
          voltage: "120/240V 1Ø",
          spaces: 40,
          breakerType: "HOM",
          notes: "4 spaces open. Kitchen circuits are AFCI/GFCI dual-function.",
        },
      ],
      fixtures: [],
    },
    {
      name: "Springfield Auto Body",
      address: "77 Industrial Pkwy, Springfield",
      phone: "(555) 553-7761",
      serviceType: "Underground",
      deviceBrand: "Hubbell",
      deviceStyle: "Standard (toggle/duplex)",
      outletColor: "Gray",
      switchColor: "Gray",
      coverPlateColor: "Gray",
      coverPlateType: "Unbreakable nylon",
      accessNotes: "Ask for Mike at the front desk. Shop closes at 5.",
      panels: [
        {
          label: "MDP",
          location: "Electrical room behind office",
          brand: "Eaton CH (Cutler-Hammer)",
          amperage: 400,
          panelType: "Main breaker",
          voltage: "120/208V 3Ø",
          spaces: 42,
        },
        {
          label: "Panel B (shop)",
          location: "Shop, column C4",
          brand: "Eaton CH (Cutler-Hammer)",
          amperage: 225,
          panelType: "Sub-panel",
          voltage: "120/208V 3Ø",
          spaces: 42,
          notes: "Full. Fed from MDP 225A 3-pole.",
        },
      ],
      fixtures: [
        {
          location: "Shop bays",
          fixtureType: "8' strip",
          quantity: 24,
          lampType: "F96T12",
          ballast: "2-lamp F96T12 HO, 120V magnetic",
          notes: "Customer wants a quote to retrofit to LED.",
        },
        {
          location: "Front office",
          fixtureType: "2x4 troffer",
          quantity: 8,
          lampType: "F32T8, 4100K",
          ballast: "3-lamp F32T8, 120-277V, instant start",
        },
      ],
    },
  ];

  let customerCount = 0;
  for (const { panels, fixtures, ...customer } of customers) {
    const existing = await prisma.customer.findFirst({ where: { name: customer.name } });
    if (existing) continue;

    await prisma.customer.create({
      data: {
        ...customer,
        panels: { create: panels },
        fixtures: { create: fixtures },
      },
    });
    customerCount += 1;
  }

  console.log(`Seeded ${customerCount} pretend customers (skipping any that already exist).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
