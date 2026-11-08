"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  createCharacter,
  deleteCharacter,
  type Proficiencies,
  Stat,
} from "@/db/fetch_data/characters";

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
  let uploadedImagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    if (image.size > 5 * 1024 * 1024) {
      throw new Error("Character image must be 5 MB or smaller.");
    }

    const extensions: Record<string, string> = {
      "image/avif": ".avif",
      "image/gif": ".gif",
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };
    const extension = extensions[image.type];

    if (!extension) {
      throw new Error("Character image must be a JPEG, PNG, GIF, WebP, or AVIF file.");
    }

    const fileName = `${randomUUID()}${extension}`;
    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "characters",
    );

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(
      path.join(uploadDirectory, fileName),
      Buffer.from(await image.arrayBuffer()),
    );
    uploadedImagePath = path.join(uploadDirectory, fileName);
    imageUrl = `/uploads/characters/${fileName}`;
  }

  const proficiencies: Proficiencies = {};

  for (const stat of Object.values(Stat)) {
    const values = getList(formData, stat);
    if (values.length > 0) {
      proficiencies[stat] = values;
    }
  }

  try {
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
  } catch (error) {
    if (uploadedImagePath) {
      try {
        await unlink(uploadedImagePath);
      } catch {
        throw new Error("Character creation failed and the uploaded image could not be cleaned up.");
      }
    }
    throw error;
  }

  revalidatePath("/character");
  redirect("/character");
}

export async function deleteExistingCharacter(formData: FormData): Promise<void> {
  const username = (await cookies()).get("username")?.value;
  const characterId = getText(formData, "characterId");

  if (!username) {
    throw new Error("You must be logged in to delete a character.");
  }

  if (!characterId) {
    throw new Error("Character ID is required.");
  }

  await deleteCharacter(characterId, username);
  revalidatePath("/character");
}
