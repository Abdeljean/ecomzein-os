import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const isTeam = process.argv.includes('--team');
  console.log(`🌱 Starting E-comZein Database Seeder (${isTeam ? 'Full Team' : 'Single Owner'})...`);

  const ownerPasswordHash = await bcrypt.hash('462920@.', 10);
  const teamPasswordHash = await bcrypt.hash('password123', 10);

  // Single Owner Account (roya.creative@gmail.com)
  const owner = await prisma.user.findUnique({ where: { email: 'roya.creative@gmail.com' } });
  if (!owner) {
    await prisma.user.create({
      data: {
        email: 'roya.creative@gmail.com',
        name: 'Youssef El Amrani',
        role: 'owner',
        passwordHash: ownerPasswordHash
      }
    });
    console.log('✓ Seeded Owner Account: roya.creative@gmail.com');
  }

  // Seed Team Accounts only when requested via --team
  if (isTeam) {
    const team = [
      { email: 'sara@ecomzein.ma', name: 'Sara Loudiyi', role: 'commercial' },
      { email: 'amine@ecomzein.ma', name: 'Amine Kabbaj', role: 'confirmation' },
      { email: 'mehdi@ecomzein.ma', name: 'Mehdi Tazi', role: 'technician' },
      { email: 'hassan@ecomzein.ma', name: 'Hassan Benjelloun', role: 'finance' }
    ];

    for (const u of team) {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email: u.email,
            name: u.name,
            role: u.role,
            passwordHash: teamPasswordHash
          }
        });
        console.log(`✓ Seeded Team Account: ${u.name} (${u.role})`);
      }
    }
  }

  console.log('✅ E-comZein Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
