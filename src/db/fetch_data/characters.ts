

import { db } from '@/db/client';
import { randomUUID } from 'node:crypto';
import { getUserByUsername } from '@/db/fetch_data/users';

export enum Stat {
  Strength = 'STR',
  Dexterity = 'DEX',
  Constitution = 'CON',
  Intelligence = 'INT',
  Wisdom = 'WIS',
  Charisma = 'CHA',
}

export type Proficiencies = Partial<Record<Stat, string[]>>;

export interface Character {
  id: string;
  username: string;
  name: string;
  surname: string;
  dob: string;
  imageUrl: string | null;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  bank: { gold: number; silver: number; copper: number };
  proficiencies: Proficiencies;
}

export class CharacterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CharacterError';
  }
}

export async function createCharacter(
  character: Omit<Character, 'id'>,
): Promise<string> {
  if (!character.username.trim()) {
    throw new CharacterError('Username is required.');
  }

  if (!(await getUserByUsername(character.username.trim()))) {
    throw new CharacterError('The specified username does not exist.');
  }

  if (!character.name.trim()) {
    throw new CharacterError('Character name is required.');
  }

  if (character.name.trim().length > 40) {
    throw new CharacterError('Character name must be 40 characters or fewer.');
  }

  if (!character.surname.trim()) {
    throw new CharacterError('Character surname is required.');
  }

  if (character.surname.trim().length > 40) {
    throw new CharacterError('Character surname must be 40 characters or fewer.');
  }

  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(character.dob)) {
    throw new CharacterError('Character date of birth must use yyyy/mm/dd format.');
  }

  const statValues = Object.values(character.stats);
  if (statValues.some((value) => !Number.isFinite(value))) {
    throw new CharacterError('Character stats must be finite numbers.');
  }

  const bankValues = Object.values(character.bank);
  if (bankValues.some((value) => !Number.isFinite(value))) {
    throw new CharacterError('Character bank values must be finite numbers.');
  }

  for (const [stat, proficiencies] of Object.entries(character.proficiencies)) {
    if (!Object.values(Stat).includes(stat as Stat)) {
      throw new CharacterError(`Invalid proficiency stat: ${stat}.`);
    }

    if (
      !Array.isArray(proficiencies) ||
      proficiencies.some(
        (proficiency) =>
          typeof proficiency !== 'string' || !proficiency.trim(),
      )
    ) {
      throw new CharacterError(
        'Each proficiency must be a non-empty string attached to a stat.',
      );
    }
  }

  const id = randomUUID();

  await db.execute({
    sql: `
      INSERT INTO character (
        id,
        username,
        name,
        surname,
        dob,
        image_url,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        bank_json,
        proficiencies_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      character.username.trim(),
      character.name.trim(),
      character.surname.trim(),
      character.dob.trim(),
      character.imageUrl?.trim() || null,
      character.stats.str,
      character.stats.dex,
      character.stats.con,
      character.stats.int,
      character.stats.wis,
      character.stats.cha,
      JSON.stringify(character.bank),
      JSON.stringify(character.proficiencies),
    ],
  });

  return id;
}

export async function getCharacterById(id: string): Promise<Character | null> {
  const result = await db.execute({
    sql: `SELECT * FROM character WHERE id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) return null;
  const row = result.rows[0];

  return {
    id: String(row.id),
    username: String(row.username),
    name: String(row.name),
    surname: String(row.surname),
    dob: String(row.dob),
    imageUrl: row.image_url == null ? null : String(row.image_url),
    stats: {
      str: Number(row.strength),
      dex: Number(row.dexterity),
      con: Number(row.constitution),
      int: Number(row.intelligence),
      wis: Number(row.wisdom),
      cha: Number(row.charisma),
    },
    bank: JSON.parse(String(row.bank_json)),
    proficiencies: JSON.parse(String(row.proficiencies_json)),
  };
}

export async function getCharactersByUsername(
  username: string,
): Promise<Character[]> {
  const result = await db.execute({
    sql: `SELECT * FROM character WHERE username = ? ORDER BY name ASC, surname ASC`,
    args: [username],
  });

  return result.rows.map((row) => ({
    id: String(row.id),
    username: String(row.username),
    name: String(row.name),
    surname: String(row.surname),
    dob: String(row.dob),
    imageUrl: row.image_url == null ? null : String(row.image_url),
    stats: {
      str: Number(row.strength),
      dex: Number(row.dexterity),
      con: Number(row.constitution),
      int: Number(row.intelligence),
      wis: Number(row.wisdom),
      cha: Number(row.charisma),
    },
    bank: JSON.parse(String(row.bank_json)),
    proficiencies: JSON.parse(String(row.proficiencies_json)),
  }));
}