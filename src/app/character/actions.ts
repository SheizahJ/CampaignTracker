"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createCharacter, type Proficiencies, Stat } from "@/db/fetch_data/characters";

function getText(formData: FormData, field: string): string {
  return String(formData.get(field) ?? "").trim();
}

function getNumber(formData: FormData, field: string): number {
  return Number(formData.get(field) ?? 0);
}

function getList(formData: FormData, field: string): string[] {
  return formData
    .getAll(field)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function createNewCharacter(formData: FormData): Promise<void> {
  const username = (await cookies()).get("username")?.value;

  if (!username) {
    throw new Error("You must be logged in to create a character.");
  }

  const dateOfBirth = getText(formData, "dob");
  const dob = dateOfBirth.replaceAll("-", "/");
  const image = formData.get("image");
  let imageUrl: string | null = null;

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      throw new Error("Character image must be an image file.");
    }

    if (image.size > 5 * 1024 * 1024) {
      throw new Error("Character image must be 5 MB or smaller.");
    }

    const bytes = Buffer.from(await image.arrayBuffer()).toString("base64");
    imageUrl = `data:${image.type};base64,${bytes}`;
  }

  const proficiencies: Proficiencies = {};

  for (const stat of Object.values(Stat)) {
    const values = getList(formData, stat);
    if (values.length > 0) {
      proficiencies[stat] = values;
    }
  }

  await createCharacter({
    username,
    name: getText(formData, "name"),
    surname: getText(formData, "surname"),
    dob,
    imageUrl,
    stats: {
      str: getNumber(formData, "str"),
      dex: getNumber(formData, "dex"),
      con: getNumber(formData, "con"),
      int: getNumber(formData, "int"),
      wis: getNumber(formData, "wis"),
      cha: getNumber(formData, "cha"),
    },
    bank: {
      gold: getNumber(formData, "gold"),
      silver: getNumber(formData, "silver"),
      copper: getNumber(formData, "copper"),
    },
    proficiencies,
  });

  revalidatePath("/character");
  redirect("/character");
}
