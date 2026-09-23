/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const monthsAgo = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
};

async function upsertUser(email, name) {
  const password = await bcrypt.hash("demo1234", 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, password },
  });
}

async function main() {
  const demo = await upsertUser("demo@homebase.local", "Demo Homeowner");
  const neighbor = await upsertUser("neighbor@homebase.local", "Pat (neighbor)");

  if ((await prisma.homeItem.count({ where: { userId: demo.id } })) === 0) {
    const items = [
      { category: "PAINT", name: "Living room walls", room: "Living room", brand: "Sherwin-Williams", color: "Agreeable Gray SW 7029", spec: "Eggshell", model: "Duration Interior", notes: "Half gallon left on the garage shelf." },
      { category: "PAINT", name: "All interior trim", room: "Whole house", brand: "Benjamin Moore", color: "Chantilly Lace OC-65", spec: "Semi-gloss" },
      { category: "PAINT", name: "Front door", room: "Exterior", brand: "Behr", color: "Black Evergreen", spec: "Satin", whereToBuy: "Home Depot" },
      { category: "FILTER", name: "Furnace filter", room: "Basement", size: "16x25x1", spec: "MERV 11", brand: "Filtrete", lastReplaced: monthsAgo(4), replaceEveryMonths: 3, whereToBuy: "Costco 6-pack" },
      { category: "FILTER", name: "Fridge water filter", room: "Kitchen", brand: "Whirlpool", model: "EDR1RXD1", lastReplaced: monthsAgo(2), replaceEveryMonths: 6 },
      { category: "LIGHT_BULB", name: "Recessed ceiling lights", room: "Kitchen", size: "BR30, E26", spec: "9W LED (65W equiv.)", color: "2700K soft white", model: "6 bulbs, dimmable" },
      { category: "LIGHT_BULB", name: "Vanity bar", room: "Bathroom", size: "G25 globe, E26", spec: "5W LED", color: "3000K" },
      { category: "APPLIANCE", name: "Dishwasher", room: "Kitchen", brand: "Bosch", model: "SHX878ZD5N", spec: "FD 9912 00123", notes: "Installed 2021. Warranty paperwork in the kitchen drawer." },
      { category: "PLUMBING", name: "Water heater", room: "Basement", brand: "Rheem", size: "50 gal", lastReplaced: monthsAgo(10), replaceEveryMonths: 12, notes: "Flush once a year. Shutoff valve is on the cold line above the tank." },
      { category: "ELECTRICAL", name: "Garage outlets", room: "Garage", spec: "Panel A, #14", size: "20A" },
    ];
    await prisma.homeItem.createMany({ data: items.map((i) => ({ ...i, userId: demo.id })) });
  }

  if ((await prisma.post.count()) === 0) {
    await prisma.post.create({
      data: {
        type: "TIP",
        title: "Write the filter size right on the furnace",
        body: "Grab a Sharpie and write the filter size and the date you changed it on the side of the furnace. Next time you're at the store you can snap a photo instead of guessing.",
        authorId: neighbor.id,
      },
    });
    await prisma.post.create({
      data: {
        type: "PROJECT",
        title: "Refinished our deck in a weekend",
        body: "Day 1: power washed and let it dry. Day 2: sanded the rough boards and put down two coats of semi-transparent stain. Total cost about $180. Biggest lesson: start early so the stain isn't in direct afternoon sun.",
        authorId: neighbor.id,
      },
    });
    await prisma.post.create({
      data: {
        type: "HELP",
        title: "Breaker trips when the microwave and toaster run together",
        body: "Kitchen breaker (20A) trips whenever both are on. House was built in 1998. Is this just too much load or should I be worried?",
        authorId: demo.id,
        replies: {
          create: [
            {
              body: "Most likely just overload — a microwave and toaster together can pull 20A+. Try moving one to a different counter circuit. If it trips with only one running, call an electrician.",
              authorId: neighbor.id,
            },
          ],
        },
      },
    });
  }

  console.log("Seeded demo data (demo@homebase.local / demo1234).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
