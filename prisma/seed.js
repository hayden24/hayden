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

  const electricalInfoByCustomer = {
    "Karen Willis": {
      services: [
        { location: "Main - garage wall", amperage: "100A", voltage: "120/240V", phase: "Single phase", panelBrand: "Federal Pacific", panelModel: "Stab-Lok", notes: "Replacing with 200A Square D on J-1001" },
      ],
      circuits: [
        { description: "Kitchen counter receptacles", fedFrom: "Main panel", circuitNumber: "7", breakerSize: "20A", wireSize: "12/2 NM" },
        { description: "Dishwasher", fedFrom: "Main panel", circuitNumber: "9", breakerSize: "15A", wireSize: "14/2 NM" },
      ],
    },
    "Springfield Auto Body": {
      services: [
        { location: "Main switchgear - rear of shop", amperage: "400A", voltage: "120/208V", phase: "Three phase", panelBrand: "Siemens", panelModel: "P1" },
      ],
      fixtures: [
        { area: "Shop bays 1-3", fixtureType: "8ft 2-lamp strip", lampType: "F96T12/HO", ballastBrand: "Advance", ballastModel: "VEL-2S110-SC", quantity: "12" },
        { area: "Office", fixtureType: "2x4 troffer", lampType: "F32T8", ballastBrand: "Philips Advance", ballastModel: "ICN-3P32-SC", quantity: "4" },
      ],
      circuits: [
        { description: "Parking lot poles", fedFrom: "Panel LP-1", circuitNumber: "2/4", breakerSize: "20A 2-pole", wireSize: "#10 THHN", notes: "Photocell on north wall" },
      ],
      infoItems: [{ label: "Access", value: "Ask for Mike at front desk; panel room key on hook behind counter" }],
    },
  };

  let createdCount = 0;
  for (const job of jobs) {
    const existing = await prisma.job.findFirst({ where: { jobNumber: job.jobNumber } });
    if (existing) continue;

    let customer = await prisma.customer.findFirst({ where: { name: job.customerName } });
    if (!customer) {
      const info = electricalInfoByCustomer[job.customerName] ?? {};
      customer = await prisma.customer.create({
        data: {
          name: job.customerName,
          contact: job.customerContact,
          address: job.location,
          services: { create: info.services ?? [] },
          fixtures: { create: info.fixtures ?? [] },
          circuits: { create: info.circuits ?? [] },
          infoItems: { create: info.infoItems ?? [] },
        },
      });
    }

    const created = await prisma.job.create({
      data: { ...job, customerId: customer.id, createdById: demoUser.id },
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

  console.log(`Seeded ${createdCount} pretend jobs and their customers (skipping any that already exist).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
