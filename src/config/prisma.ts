const { PrismaClient } = await import('@prisma/client');

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});
