/*
  Creates the connection to the database
*/

import { createClient } from '@libsql/client';
export const dynamic = 'force-dynamic';

export const db = createClient({
  url: process.env.DB_URL!,
  authToken: process.env.DB_TOKEN!,
});