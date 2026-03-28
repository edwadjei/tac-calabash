import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taccalabash.com' },
    update: {},
    create: {
      email: 'admin@taccalabash.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`Seeded admin user: ${admin.email} (role: ${admin.role})`);
  console.log('Login credentials:');
  console.log('  Email:    admin@taccalabash.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
