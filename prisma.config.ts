import path from 'node:path';
import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
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
