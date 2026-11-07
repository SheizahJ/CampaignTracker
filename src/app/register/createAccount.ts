"use server";

import { createUser } from "@/db/fetch_data/users";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(
  _previousError: string,
  formData: FormData,
): Promise<string> {
  try {
    const username = String(formData.get("username"));

    await createUser(
      username,
      String(formData.get("password")),
    );

    const cookieStore = await cookies();
    cookieStore.set("username", username, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error) {
    return error instanceof Error ? error.message : "Unable to register.";
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
