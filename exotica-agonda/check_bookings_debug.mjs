import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { room: true }
  });
  console.log(JSON.stringify(bookings, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
