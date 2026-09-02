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

export async function createJob(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const jobNumber = String(formData.get("jobNumber") ?? "").trim();
  const scopeOfWork = String(formData.get("scopeOfWork") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerContact = String(formData.get("customerContact") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!jobNumber || !scopeOfWork || !customerName || !customerContact || !location) {
    return {
      error:
        "Job number, scope of work, customer name, customer contact, and location are required.",
    };
  }

  const job = await prisma.job.create({
    data: {
      jobNumber,
      scopeOfWork,
      customerName,
      customerContact,
      location,
      notes: notes || null,
      createdById: user.id,
    },
  });

  revalidatePath("/");
  redirect(`/jobs/${job.id}`);
}

export async function updateJobDetails(
  jobId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireUser();

  const jobNumber = String(formData.get("jobNumber") ?? "").trim();
  const scopeOfWork = String(formData.get("scopeOfWork") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerContact = String(formData.get("customerContact") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!jobNumber || !scopeOfWork || !customerName || !customerContact || !location) {
    return {
      error:
        "Job number, scope of work, customer name, customer contact, and location are required.",
    };
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      jobNumber,
      scopeOfWork,
      customerName,
      customerContact,
      location,
      notes: notes || null,
    },
  });

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/");
  revalidatePath("/assignments/in-progress");
  return { success: true };
}

export async function updateJobStatus(jobId: string, status: string) {
  await requireUser();
  const validStatuses = ["OPEN", "IN_PROGRESS", "COMPLETE", "ON_HOLD"];
  if (!validStatuses.includes(status)) return;

  await prisma.job.update({
    where: { id: jobId },
    data: { status: status as "OPEN" | "IN_PROGRESS" | "COMPLETE" | "ON_HOLD" },
  });

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/");
}

export async function addLaborEntry(
  jobId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const dateStr = String(formData.get("date") ?? "");
  const hoursStr = String(formData.get("hours") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  const hours = Number(hoursStr);
  if (!dateStr || !hoursStr || Number.isNaN(hours) || hours <= 0) {
    return { error: "A valid date and number of hours are required." };
  }

  await prisma.laborEntry.create({
    data: {
      jobId,
      userId: user.id,
      date: new Date(dateStr),
      hours,
      description: description || null,
    },
  });

  revalidatePath(`/jobs/${jobId}`);
  return { success: true };
}

export async function deleteLaborEntry(jobId: string, entryId: string) {
  const user = await requireUser();
  const entry = await prisma.laborEntry.findUnique({ where: { id: entryId } });
  if (!entry) return;
  if (entry.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized to delete this entry.");
  }
  await prisma.laborEntry.delete({ where: { id: entryId } });
  revalidatePath(`/jobs/${jobId}`);
}

export async function addMaterialEntry(
  jobId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const description = String(formData.get("description") ?? "").trim();
  const quantityStr = String(formData.get("quantity") ?? "1");
  const unitCostStr = String(formData.get("unitCost") ?? "");
  const dateStr = String(formData.get("date") ?? "");

  const quantity = Number(quantityStr);
  if (!description || Number.isNaN(quantity) || quantity <= 0) {
    return { error: "A description and valid quantity are required." };
  }

  const unitCost = unitCostStr ? Number(unitCostStr) : null;
  if (unitCost !== null && Number.isNaN(unitCost)) {
    return { error: "Unit cost must be a number." };
  }

  await prisma.materialEntry.create({
    data: {
      jobId,
      userId: user.id,
      description,
      quantity,
      unitCost,
      date: dateStr ? new Date(dateStr) : new Date(),
    },
  });

  revalidatePath(`/jobs/${jobId}`);
  return { success: true };
}

export async function deleteMaterialEntry(jobId: string, entryId: string) {
  const user = await requireUser();
  const entry = await prisma.materialEntry.findUnique({ where: { id: entryId } });
  if (!entry) return;
  if (entry.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized to delete this entry.");
  }
  await prisma.materialEntry.delete({ where: { id: entryId } });
  revalidatePath(`/jobs/${jobId}`);
}

export async function deleteJob(jobId: string) {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("Only admins can delete jobs.");
  }
  await prisma.job.delete({ where: { id: jobId } });
  revalidatePath("/");
  redirect("/");
}
