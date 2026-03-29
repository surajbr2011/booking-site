const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up rooms...');
  
  // First, delete related records if any (e.g. bookings, although in a real app you'd want to handle this carefully)
  // For this project, we can just delete rooms since we want to sync with seed.
  
  // Use a transaction or simply delete.
  const deletedBookings = await prisma.booking.deleteMany({});
  console.log(`Deleted ${deletedBookings.count} bookings.`);
  
  const deletedRooms = await prisma.room.deleteMany({});
  console.log(`Deleted ${deletedRooms.count} rooms.`);
  
  console.log('Database cleaned. Now run the seed script.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
