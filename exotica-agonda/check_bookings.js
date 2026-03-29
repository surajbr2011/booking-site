const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.booking.findMany({
    where: {
      bookingStatus: 'confirmed'
    },
    include: {
      room: true
    }
  });

  console.log('Confirmed Bookings:');
  console.log(JSON.stringify(bookings, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
