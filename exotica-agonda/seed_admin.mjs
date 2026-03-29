import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@exotica.com';
  const password = 'admin123';
  
  const existingUser = await prisma.adminUser.findUnique({ where: { email } });
  
  if (existingUser) {
    console.log(`Admin user ${email} already exists. Updating password...`);
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash, isActive: true },
    });
    console.log('Password updated successfully.');
  } else {
    console.log(`Creating admin user ${email}...`);
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        fullName: 'System Admin',
        role: 'admin',
        isActive: true,
      },
    });
    console.log('Admin user created successfully.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
