"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createCampaign,
  deleteCampaign,
  type UpdateCampaignInput,
  updateCampaign,
} from "@/db/fetch_data/campaigns";

export async function createNewCampaign(formData: FormData): Promise<void> {
  const username = (await cookies()).get("username")?.value;

  if (!username) {
    throw new Error("You must be logged in to create a campaign.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const banner = formData.get("banner");

  if (!title) {
    throw new Error("Campaign title is required.");
  }

  let bannerImageUrl: string | null = null;
  if (banner instanceof File && banner.size > 0) {
    if (!banner.type.startsWith("image/")) {
      throw new Error("Campaign banner must be an image file.");
    }

    if (banner.size > 5 * 1024 * 1024) {
      throw new Error("Campaign banner must be 5 MB or smaller.");
    }

    const bytes = Buffer.from(await banner.arrayBuffer()).toString("base64");
    bannerImageUrl = `data:${banner.type};base64,${bytes}`;
  }

  await createCampaign({
    creator: username,
    title,
    subtitle: subtitle || null,
    description: description || null,
    bannerImageUrl,
  });

  revalidatePath("/campaigns");
}

export async function deleteExistingCampaign(formData: FormData): Promise<void> {
  const username = (await cookies()).get("username")?.value;
  const campaignId = String(formData.get("campaignId") ?? "").trim();

  if (!username) {
    throw new Error("You must be logged in to delete a campaign.");
  }

  await deleteCampaign(campaignId, username);
  revalidatePath("/campaigns");
}

export async function updateExistingCampaign(
  campaignId: string,
  updates: UpdateCampaignInput,
): Promise<void> {
  const username = (await cookies()).get("username")?.value;

  if (!username) {
    throw new Error("You must be logged in to update a campaign.");
  }

  await updateCampaign(campaignId, username, updates);
  revalidatePath("/campaigns");
}
