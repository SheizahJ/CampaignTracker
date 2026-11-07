"use server";

import { verifyPassword } from "@/db/fetch_data/users";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  _previousError: string,
  formData: FormData,
): Promise<string> {
  try {
    const isValid = await verifyPassword(
      String(formData.get("username")),
      String(formData.get("password")),
    );

    if (!isValid) {
      return "Invalid username or password.";
    }
  } catch (error) {
    return error instanceof Error ? error.message : "Unable to sign in.";
  }

  const cookieStore = await cookies();
  cookieStore.set("signed_in", crypto.randomUUID(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/");
}
