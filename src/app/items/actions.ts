"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser, formText, type FormState } from "@/lib/session";
import { isCategory } from "@/lib/categories";

type ItemData = Omit<Prisma.HomeItemUncheckedCreateInput, "userId">;

function parseItem(formData: FormData): { data?: ItemData; error?: string } {
  const name = formText(formData, "name");
  const category = formText(formData, "category");
  const lastReplacedStr = formText(formData, "lastReplaced");
  const intervalStr = formText(formData, "replaceEveryMonths");

  if (!name) return { error: "Give this item a name." };
  if (!isCategory(category)) return { error: "Pick a category." };

  const replaceEveryMonths = intervalStr ? Number(intervalStr) : null;
  if (
    replaceEveryMonths !== null &&
    (!Number.isInteger(replaceEveryMonths) || replaceEveryMonths <= 0)
  ) {
    return { error: "Replacement interval must be a whole number of months." };
  }

  const optional = (key: string) => formText(formData, key) || null;

  return {
    data: {
      name,
      category,
      room: optional("room"),
      brand: optional("brand"),
      model: optional("model"),
      size: optional("size"),
      color: optional("color"),
      spec: optional("spec"),
      whereToBuy: optional("whereToBuy"),
      notes: optional("notes"),
      lastReplaced: lastReplacedStr ? new Date(lastReplacedStr) : null,
      replaceEveryMonths,
    },
  };
}

async function requireOwnItem(itemId: string) {
  const user = await requireUser();
  const item = await prisma.homeItem.findFirst({
    where: { id: itemId, userId: user.id },
    select: { id: true },
  });
  if (!item) throw new Error("Item not found.");
  return user;
}

export async function createItem(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();
  const { data, error } = parseItem(formData);
  if (!data) return { error };

  const item = await prisma.homeItem.create({ data: { ...data, userId: user.id } });

  revalidatePath("/");
  redirect(`/items/${item.id}`);
}

export async function updateItem(
  itemId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireOwnItem(itemId);
  const { data, error } = parseItem(formData);
  if (!data) return { error };

  await prisma.homeItem.update({ where: { id: itemId }, data });

  revalidatePath("/");
  revalidatePath(`/items/${itemId}`);
  return { success: true };
}

export async function markReplacedToday(itemId: string) {
  await requireOwnItem(itemId);
  await prisma.homeItem.update({
    where: { id: itemId },
    data: { lastReplaced: new Date() },
  });
  revalidatePath("/");
  revalidatePath(`/items/${itemId}`);
}

export async function deleteItem(itemId: string) {
  await requireOwnItem(itemId);
  await prisma.homeItem.delete({ where: { id: itemId } });
  revalidatePath("/");
  redirect("/");
}
