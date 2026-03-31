import path from 'node:path';
import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

// @ts-expect-error - Prisma 7 config properties not yet fully typed
export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    async resolve() {
      return { url: process.env.DATABASE_URL! };
    },
  },
  studio: {
    async resolve() {
      return { url: process.env.DATABASE_URL! };
    },
  },
});
