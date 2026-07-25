import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ensure Prisma Client binaries exist on runtime
try {
  const clientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
  if (!fs.existsSync(clientPath)) {
    execSync('npx prisma generate', { stdio: 'ignore' });
  }
} catch (err) {
  // Silent fallback
}

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error']
});
