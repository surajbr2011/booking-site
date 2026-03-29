import { PrismaClient } from '@prisma/client';
// Attempting with "Exoticadatabase" (added 'e' at the end)
const directUrl = "postgresql://postgres.wmmcnkrsjsnpvqoatsph:Exoticadatabase@db.wmmcnkrsjsnpvqoatsph.supabase.co:5432/postgres?sslmode=require";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function main() {
  try {
    console.log('Attempting connection with corrected password sequence...');
    const rooms = await prisma.room.findMany();
    console.log('SUCCESS! Found ' + rooms.length + ' rooms.');
  } catch (e) {
    console.error('FAILED:');
    console.error(e.message || e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
