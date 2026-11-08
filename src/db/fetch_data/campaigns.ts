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
