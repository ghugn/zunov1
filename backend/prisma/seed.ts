import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed fund templates
  await prisma.fundTemplate.upsert({
    where: { id: 'template-rent' },
    update: {},
    create: {
      id: 'template-rent',
      name: 'Sinh viên ở trọ',
      residenceType: 'rent',
      livingPct: 40,
      foodPct: 20,
      growthPct: 15,
      experiencePct: 10,
      futurePct: 15,
      isDefault: true,
    },
  });

  await prisma.fundTemplate.upsert({
    where: { id: 'template-dorm' },
    update: {},
    create: {
      id: 'template-dorm',
      name: 'Sinh viên ký túc xá',
      residenceType: 'dorm',
      livingPct: 7.5,
      foodPct: 65,
      growthPct: 10,
      experiencePct: 7.5,
      futurePct: 10,
      isDefault: true,
    },
  });

  console.log('✅ Seed data created: 2 fund templates');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
