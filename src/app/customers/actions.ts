"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { RECORD_CONFIGS, isRecordKind, type RecordKind } from "@/lib/customer-records";

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  return session.user;
}

export type FormState = { error?: string; success?: boolean } | undefined;

function readCustomerFields(formData: FormData) {
  const optional = (key: string) => String(formData.get(key) ?? "").trim() || null;
  return {
    name: String(formData.get("name") ?? "").trim(),
    contact: optional("contact"),
    email: optional("email"),
    address: optional("address"),
    notes: optional("notes"),
  };
}

export async function createCustomer(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const data = readCustomerFields(formData);
  if (!data.name) {
    return { error: "Customer name is required." };
  }

  const customer = await prisma.customer.create({ data });

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomer(
  customerId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const data = readCustomerFields(formData);
  if (!data.name) {
    return { error: "Customer name is required." };
  }

  await prisma.customer.update({ where: { id: customerId }, data });

  revalidatePath(`/customers/${customerId}`, "layout");
  revalidatePath("/customers");
  return { success: true };
}

export async function deleteCustomer(customerId: string) {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("Only admins can delete customers.");
  }
  // Jobs are kept (their customer link is cleared); electrical info is deleted with the customer.
  await prisma.customer.delete({ where: { id: customerId } });
  revalidatePath("/customers");
  redirect("/customers");
}

function readRecordFields(kind: RecordKind, formData: FormData) {
  const data: Record<string, string | null> = {};
  for (const field of RECORD_CONFIGS[kind].fields) {
    data[field.name] = String(formData.get(field.name) ?? "").trim() || null;
  }
  return data;
}

const recordModels = {
  service: {
    create: (data: Record<string, string | null>, customerId: string) =>
      prisma.electricalService.create({ data: { ...data, customerId } }),
    update: (id: string, customerId: string, data: Record<string, string | null>) =>
      prisma.electricalService.updateMany({ where: { id, customerId }, data }),
    delete: (id: string, customerId: string) =>
      prisma.electricalService.deleteMany({ where: { id, customerId } }),
  },
  lighting: {
    create: (data: Record<string, string | null>, customerId: string) =>
      prisma.lightingFixture.create({ data: { ...data, customerId } }),
    update: (id: string, customerId: string, data: Record<string, string | null>) =>
      prisma.lightingFixture.updateMany({ where: { id, customerId }, data }),
    delete: (id: string, customerId: string) =>
      prisma.lightingFixture.deleteMany({ where: { id, customerId } }),
  },
  circuits: {
    create: (data: Record<string, string | null>, customerId: string) =>
      prisma.circuit.create({ data: { ...data, customerId } }),
    update: (id: string, customerId: string, data: Record<string, string | null>) =>
      prisma.circuit.updateMany({ where: { id, customerId }, data }),
    delete: (id: string, customerId: string) =>
      prisma.circuit.deleteMany({ where: { id, customerId } }),
  },
  info: {
    create: (data: Record<string, string | null>, customerId: string) =>
      prisma.customerInfoItem.create({ data: { ...data, customerId } }),
    update: (id: string, customerId: string, data: Record<string, string | null>) =>
      prisma.customerInfoItem.updateMany({ where: { id, customerId }, data }),
    delete: (id: string, customerId: string) =>
      prisma.customerInfoItem.deleteMany({ where: { id, customerId } }),
  },
} satisfies Record<RecordKind, unknown>;

export async function saveCustomerRecord(
  customerId: string,
  kind: string,
  recordId: string | null,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();
  if (!isRecordKind(kind)) return { error: "Unknown record type." };

  const data = readRecordFields(kind, formData);
  if (Object.values(data).every((v) => v === null)) {
    return { error: "Fill in at least one field." };
  }

  if (recordId) {
    await recordModels[kind].update(recordId, customerId, data);
  } else {
    await recordModels[kind].create(data, customerId);
  }

  revalidatePath(`/customers/${customerId}`, "layout");
  return { success: true };
}

export async function deleteCustomerRecord(customerId: string, kind: string, recordId: string) {
  await requireUser();
  if (!isRecordKind(kind)) return;
  await recordModels[kind].delete(recordId, customerId);
  revalidatePath(`/customers/${customerId}`, "layout");
}
