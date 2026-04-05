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

  const district = await prisma.district.upsert({
    where: { name: 'Accra District' },
    update: {},
    create: { name: 'Accra District' },
  });

  const circuitNames = ['Circuit 1', 'Circuit 2', 'Circuit 3'];
  const circuits = await Promise.all(
    circuitNames.map((name) =>
      prisma.circuit.upsert({
        where: {
          name_districtId: {
            name,
            districtId: district.id,
          },
        },
        update: {},
        create: {
          name,
          districtId: district.id,
        },
      }),
    ),
  );

  const assemblies = await Promise.all([
    prisma.assembly.upsert({
      where: {
        name_circuitId: {
          name: 'Calabash Assembly',
          circuitId: circuits[0].id,
        },
      },
      update: {},
      create: {
        name: 'Calabash Assembly',
        circuitId: circuits[0].id,
      },
    }),
    prisma.assembly.upsert({
      where: {
        name_circuitId: {
          name: 'Grace Assembly',
          circuitId: circuits[1].id,
        },
      },
      update: {},
      create: {
        name: 'Grace Assembly',
        circuitId: circuits[1].id,
      },
    }),
    prisma.assembly.upsert({
      where: {
        name_circuitId: {
          name: 'Bethany Assembly',
          circuitId: circuits[2].id,
        },
      },
      update: {},
      create: {
        name: 'Bethany Assembly',
        circuitId: circuits[2].id,
      },
    }),
  ]);

  await prisma.district.update({
    where: { id: district.id },
    data: { headquarterAssemblyId: assemblies[0].id },
  });

  await Promise.all(
    circuits.map((circuit, index) =>
      prisma.circuit.update({
        where: { id: circuit.id },
        data: { headquarterAssemblyId: assemblies[index].id },
      }),
    ),
  );

  const ministryNames = [
    'Choir/Music',
    "Women's Fellowship",
    "Men's Fellowship",
    'Youth Fellowship',
    'Other',
  ];

  await Promise.all(
    ministryNames.map((name) =>
      prisma.ministry.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const positions = [
    'Elder',
    'Deacon',
    'Deaconess',
    'Sunday School Teacher',
    'Presiding Elder',
    'Head Deacon',
    'Head Deaconess',
  ];

  await Promise.all(
    positions.map((name) =>
      prisma.position.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

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
