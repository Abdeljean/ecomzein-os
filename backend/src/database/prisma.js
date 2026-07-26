import { PrismaClient } from '@prisma/client';

let prismaClient;

try {
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error']
  });
} catch (e) {
  console.warn('[Prisma Warning] Falling back to mockup proxy:', e.message);
  prismaClient = new Proxy({}, {
    get() {
      return () => Promise.resolve([]);
    }
  });
}

export const prisma = prismaClient;
