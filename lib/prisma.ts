import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import type { PoolConfig } from '@neondatabase/serverless';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), pass the config directly to the adapter
  const poolConfig: PoolConfig = { connectionString: process.env.DATABASE_URL };
  const adapter = new PrismaNeon(poolConfig);
  prisma = new PrismaClient({ adapter });
} else {
  // Em desenvolvimento, usa uma conexão TCP padrão e armazena em cache global
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
export { prisma };