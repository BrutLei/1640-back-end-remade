const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Seed your database here

  // Example:
  await prisma.faculties.create({
    data: {
      name: 'Information Technology',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add more fields as necessary
    },
  });
  await prisma.groups.createMany({
    data: [
      {
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Marketing Manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Marketing Coordinator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'guest',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  // Add more seeding logic for other models as needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
