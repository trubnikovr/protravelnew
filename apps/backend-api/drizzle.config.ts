import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { resolve } from 'node:path';

config({ path: resolve(__dirname, '.env') });

const host = process.env.DATABASE_HOST ?? '127.0.0.1';
const port = process.env.DATABASE_PORT ?? '5432';
const database = process.env.DATABASE_NAME ?? 'protravel';
const user = process.env.DATABASE_USER ?? 'protravel';
const password = process.env.DATABASE_PASSWORD ?? 'protravel';

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    './apps/backend-api/src/modules/**/*.schema.ts',
    './apps/backend-api/src/core/submodules/**/*.schema.ts',
  ],
  out: './apps/backend-api/drizzle',
  dbCredentials: {
    url: `postgresql://${user}:${password}@${host}:${port}/${database}`,
  },
  strict: true,
  verbose: true,
});
