const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = process.env.INITIAL_ADMIN_PASSWORD || 'admin123';

  const existing = await prisma.admin.findUnique({
    where: { username }
  });

  if (existing) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.admin.create({
    data: {
      username,
      password: hashedPassword
    }
  });

  console.log(`Admin user created successfully!`);
  console.log(`Username: ${username}`);
  console.log(`Password: ${password} (Please change this immediately in settings)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
