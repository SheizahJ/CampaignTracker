/*
  Handles database queries for the CAMPAIGN table
*/

import { randomUUID } from 'node:crypto';
import { db } from '@/db/client';
import { getUserByUsername } from '@/db/fetch_data/users';

export const dynamic = 'force-dynamic';

export enum CampaignStatus {
  Active = 'active',
  Paused = 'paused',
  Completed = 'completed',
}

export interface Campaign {
  id: string;
  creator: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  status: CampaignStatus;
  bannerImageUrl: string | null;
  createdAt: string;
  lastUpdated: string;
}

export interface CreateCampaignInput {
  creator: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  status?: CampaignStatus;
  bannerImageUrl?: string | null;
}

export interface UpdateCampaignInput {
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  status?: CampaignStatus;
  bannerImageUrl?: string | null;
}

export class CampaignError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CampaignError';
  }
}

function rowToCampaign(row: Record<string, unknown>): Campaign {
  return {
    id: String(row.id),
    creator: String(row.creator),
    title: String(row.title),
    subtitle: row.subtitle == null ? null : String(row.subtitle),
    description: row.description == null ? null : String(row.description),
    status: String(row.status) as CampaignStatus,
    bannerImageUrl:
      row.banner_image_url == null ? null : String(row.banner_image_url),
    createdAt: String(row.created_at),
    lastUpdated: String(row.last_updated),
  };
}

function validateStatus(status: string): status is CampaignStatus {
  return Object.values(CampaignStatus).includes(status as CampaignStatus);
}

// Adds a new CAMPAIGN into the database
export async function createCampaign(
  input: CreateCampaignInput,
): Promise<string> {
  const creator = input.creator.trim();
  const title = input.title.trim();
  const status = input.status ?? CampaignStatus.Active;

  if (!creator) {
    throw new CampaignError('Campaign creator is required.');
  }

  if (!(await getUserByUsername(creator))) {
    throw new CampaignError('The specified campaign creator does not exist.');
  }

  if (!title) {
    throw new CampaignError('Campaign title is required.');
  }

  if (!validateStatus(status)) {
    throw new CampaignError('Campaign status is invalid.');
  }

  const id = randomUUID();
  const now = new Date().toISOString();

  await db.execute({
    sql: `
      INSERT INTO campaign (
        id,
        creator,
        title,
        subtitle,
        description,
        status,
        banner_image_url,
        created_at,
        last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      creator,
      title,
      input.subtitle?.trim() || null,
      input.description?.trim() || null,
      status,
      input.bannerImageUrl?.trim() || null,
      now,
      now,
    ],
  });

  return id;
}

// Updates a CAMPAIGN when requested by its creator
export async function updateCampaign(
  id: string,
  creator: string,
  updates: UpdateCampaignInput,
): Promise<void> {
  const normalizedId = id.trim();
  const normalizedCreator = creator.trim();

  if (!normalizedId) {
    throw new CampaignError('Campaign ID is required.');
  }

  if (!normalizedCreator) {
    throw new CampaignError('Campaign creator is required.');
  }

  if (updates.title !== undefined && !updates.title.trim()) {
    throw new CampaignError('Campaign title is required.');
  }

  if (updates.status !== undefined && !validateStatus(updates.status)) {
    throw new CampaignError('Campaign status is invalid.');
  }

  const currentCampaign = await getCampaignById(normalizedId);
  if (!currentCampaign || currentCampaign.creator !== normalizedCreator) {
    throw new CampaignError(
      'Campaign was not found or you do not have permission to update it.',
    );
  }

  const result = await db.execute({
    sql: `
      UPDATE campaign
      SET title = ?,
          subtitle = ?,
          description = ?,
          status = ?,
          banner_image_url = ?,
          last_updated = ?
      WHERE id = ? AND creator = ?
    `,
    args: [
      updates.title?.trim() ?? currentCampaign.title,
      updates.subtitle === undefined
        ? currentCampaign.subtitle
        : updates.subtitle?.trim() || null,
      updates.description === undefined
        ? currentCampaign.description
        : updates.description?.trim() || null,
      updates.status ?? currentCampaign.status,
      updates.bannerImageUrl === undefined
        ? currentCampaign.bannerImageUrl
        : updates.bannerImageUrl?.trim() || null,
      new Date().toISOString(),
      normalizedId,
      normalizedCreator,
    ],
  });

  if (result.rowsAffected === 0) {
    throw new CampaignError(
      'Campaign was not found or you do not have permission to update it.',
    );
  }
}

// Deletes a CAMPAIGN when requested by its creator
export async function deleteCampaign(
  id: string,
  creator: string,
): Promise<void> {
  const normalizedId = id.trim();
  const normalizedCreator = creator.trim();

  if (!normalizedId) {
    throw new CampaignError('Campaign ID is required.');
  }

  if (!normalizedCreator) {
    throw new CampaignError('Campaign creator is required.');
  }

  const result = await db.execute({
    sql: 'DELETE FROM campaign WHERE id = ? AND creator = ?',
    args: [normalizedId, normalizedCreator],
  });

  if (result.rowsAffected === 0) {
    throw new CampaignError(
      'Campaign was not found or you do not have permission to delete it.',
    );
  }
}

// Gets one (1) CAMPAIGN from the database
export async function getCampaignById(id: string): Promise<Campaign | null> {
  if (!id.trim()) {
    throw new CampaignError('Campaign ID is required.');
  }

  const result = await db.execute({
    sql: 'SELECT * FROM campaign WHERE id = ?',
    args: [id],
  });

  if (result.rows.length === 0) return null;
  return rowToCampaign(result.rows[0]);
}

// Gets all CAMPAIGNS created by a USER
export async function getCampaignsByCreator(
  creator: string,
): Promise<Campaign[]> {
  const normalizedCreator = creator.trim();
  if (!normalizedCreator) {
    throw new CampaignError('Campaign creator is required.');
  }

  const result = await db.execute({
    sql: `
      SELECT * FROM campaign
      WHERE creator = ?
      ORDER BY created_at DESC
    `,
    args: [normalizedCreator],
  });

  return result.rows.map(rowToCampaign);
}

// Gets all CAMPAIGNS with the requested status
export async function getCampaignsByStatus(
  status: CampaignStatus,
): Promise<Campaign[]> {
  if (!validateStatus(status)) {
    throw new CampaignError('Campaign status is invalid.');
  }

  const result = await db.execute({
    sql: `
      SELECT * FROM campaign
      WHERE status = ?
      ORDER BY created_at DESC
    `,
    args: [status],
  });

  return result.rows.map(rowToCampaign);
}
