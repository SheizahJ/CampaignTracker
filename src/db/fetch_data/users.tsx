/*
    Handles database queries for the USER table
*/

import { db } from '@/db/client';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export interface User {
    username: string;
    password: string; // MUST BE HASHED
}

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

// Adds a new USER into the database
export async function createUser(username: string, password: string): Promise<string> {
  if (!username.trim()) {
    throw new UserError('Username is required.');
  }

  if (!password) {
    throw new UserError('Password is required.');
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw new UserError('That username is already taken.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await db.execute({
    sql: `INSERT INTO user (username, password_hash) VALUES (?, ?)`,
    args: [username, passwordHash],
  });

  return username;
}

// Gets usernames of all USERS 
export async function getUsernames(): Promise<string[]> {
  const result = await db.execute('SELECT username FROM user ORDER BY username ASC');
  return result.rows.map((row) => row.username as string);
}

// Gets one (1) USER from the database
export async function getUserByUsername(username: string): Promise<User | null> {
  if (!username.trim()) {
    throw new UserError('Username is required.');
  }

  const result = await db.execute({
    sql: `SELECT * FROM user WHERE username = ?`,
    args: [username],
  });

  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as User;
}

// Checks to 
export async function verifyPassword(username: string, password: string): Promise<boolean> {
  const result = await db.execute({
    sql: `SELECT password_hash FROM user WHERE username = ?`,
    args: [username],
  })

  if (result.rows.length === 0) return false;
  const storedHash = result.rows[0].password_hash as string;

  const isValid = await bcrypt.compare(password, storedHash);
  return isValid;
}
