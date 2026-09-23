"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  return session.user;
}

export type FormState = { error?: string; success?: boolean } | undefined;

// Trimmed text, or null when the field was left blank.
function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

// Whole number, null when blank, NaN when not a valid non-negative integer.
function wholeNumber(formData: FormData, key: string) {
  const value = text(formData, key);
  if (value === null) return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : NaN;
}

function revalidateCustomer(customerId: string) {
  revalidatePath(`/customers/${customerId}`, "layout");
  revalidatePath("/customers");
}

export async function createCustomer(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const name = text(formData, "name");
  const address = text(formData, "address");
  if (!name || !address) {
    return { error: "Customer name and address are required." };
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      address,
      phone: text(formData, "phone"),
      email: text(formData, "email"),
    },
  });

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}/panels`);
}

export async function updateCustomerContact(
  customerId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const name = text(formData, "name");
  const address = text(formData, "address");
  if (!name || !address) {
    return { error: "Customer name and address are required." };
  }

  await prisma.customer.update({
    where: { id: customerId },
    data: {
      name,
      address,
      phone: text(formData, "phone"),
      email: text(formData, "email"),
    },
  });

  revalidateCustomer(customerId);
  return { success: true };
}

export async function updateCustomerSpecs(
  customerId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  await prisma.customer.update({
    where: { id: customerId },
    data: {
      utilityCompany: text(formData, "utilityCompany"),
      meterNumber: text(formData, "meterNumber"),
      serviceType: text(formData, "serviceType"),
      deviceBrand: text(formData, "deviceBrand"),
      deviceStyle: text(formData, "deviceStyle"),
      outletColor: text(formData, "outletColor"),
      switchColor: text(formData, "switchColor"),
      coverPlateColor: text(formData, "coverPlateColor"),
      coverPlateType: text(formData, "coverPlateType"),
    },
  });

  revalidateCustomer(customerId);
  return { success: true };
}

export async function updateCustomerNotes(
  customerId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  await prisma.customer.update({
    where: { id: customerId },
    data: {
      accessNotes: text(formData, "accessNotes"),
      notes: text(formData, "notes"),
    },
  });

  revalidateCustomer(customerId);
  return { success: true };
}

export async function deleteCustomer(customerId: string) {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("Only admins can delete customers.");
  }
  await prisma.customer.delete({ where: { id: customerId } });
  revalidatePath("/customers");
  redirect("/customers");
}

// Creates a panel when panelId is null, otherwise updates that panel.
export async function savePanel(
  customerId: string,
  panelId: string | null,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const label = text(formData, "label");
  if (!label) {
    return { error: "Give the panel a name, e.g. \"Main panel\" or \"Garage sub\"." };
  }

  const amperage = wholeNumber(formData, "amperage");
  const spaces = wholeNumber(formData, "spaces");
  if (Number.isNaN(amperage) || Number.isNaN(spaces)) {
    return { error: "Amperage and spaces must be whole numbers." };
  }

  const data = {
    label,
    location: text(formData, "location"),
    brand: text(formData, "brand"),
    amperage,
    panelType: text(formData, "panelType"),
    voltage: text(formData, "voltage"),
    spaces,
    breakerType: text(formData, "breakerType"),
    notes: text(formData, "notes"),
  };

  if (panelId) {
    await prisma.panel.update({ where: { id: panelId, customerId }, data });
  } else {
    await prisma.panel.create({ data: { ...data, customerId } });
  }

  revalidateCustomer(customerId);
  return { success: true };
}

export async function deletePanel(customerId: string, panelId: string) {
  await requireUser();
  await prisma.panel.deleteMany({ where: { id: panelId, customerId } });
  revalidateCustomer(customerId);
}

// Creates a fixture when fixtureId is null, otherwise updates that fixture.
export async function saveFixture(
  customerId: string,
  fixtureId: string | null,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const location = text(formData, "location");
  if (!location) {
    return { error: "A location is required, e.g. \"Warehouse\" or \"Kitchen\"." };
  }

  const quantity = wholeNumber(formData, "quantity");
  if (Number.isNaN(quantity)) {
    return { error: "Quantity must be a whole number." };
  }

  const data = {
    location,
    fixtureType: text(formData, "fixtureType"),
    quantity,
    lampType: text(formData, "lampType"),
    ballast: text(formData, "ballast"),
    notes: text(formData, "notes"),
  };

  if (fixtureId) {
    await prisma.fixture.update({ where: { id: fixtureId, customerId }, data });
  } else {
    await prisma.fixture.create({ data: { ...data, customerId } });
  }

  revalidateCustomer(customerId);
  return { success: true };
}

export async function deleteFixture(customerId: string, fixtureId: string) {
  await requireUser();
  await prisma.fixture.deleteMany({ where: { id: fixtureId, customerId } });
  revalidateCustomer(customerId);
}
