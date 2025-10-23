import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import type { PoolConfig } from '@neondatabase/serverless';

const poolConfig: PoolConfig = { connectionString: process.env.DATABASE_URL };
const adapter = new PrismaNeon(poolConfig);

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;