import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  return session.user;
}

export type FormState = { error?: string; success?: boolean } | undefined;

export function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
