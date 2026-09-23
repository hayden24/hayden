-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "utilityCompany" TEXT,
    "meterNumber" TEXT,
    "serviceType" TEXT,
    "deviceBrand" TEXT,
    "deviceStyle" TEXT,
    "outletColor" TEXT,
    "switchColor" TEXT,
    "coverPlateColor" TEXT,
    "coverPlateType" TEXT,
    "accessNotes" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Panel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "location" TEXT,
    "brand" TEXT,
    "amperage" INTEGER,
    "panelType" TEXT,
    "voltage" TEXT,
    "spaces" INTEGER,
    "breakerType" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Panel_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fixture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "fixtureType" TEXT,
    "quantity" INTEGER,
    "lampType" TEXT,
    "ballast" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Fixture_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
