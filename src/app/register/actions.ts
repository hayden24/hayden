"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type RegisterState = { error?: string } | undefined;

export async function register(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const signupCode = String(formData.get("signupCode") ?? "").trim();

  // The very first account is the owner and is always an admin. After that, new
  // accounts need the SIGNUP_CODE you hand out (sign-up is closed if it isn't set).
  const isFirstUser = (await prisma.user.count()) === 0;
  if (!isFirstUser) {
    const expectedCode = process.env.SIGNUP_CODE?.trim();
    if (!expectedCode) {
      return { error: "Sign-up is closed. Ask the account owner to set a sign-up code." };
    }
    if (signupCode !== expectedCode) {
      return { error: "That sign-up code isn't right." };
    }
  }
  const isAdmin = isFirstUser || formData.get("isAdmin") === "on";

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: isAdmin ? "ADMIN" : "TECH",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please log in." };
    }
    throw error;
  }
}
