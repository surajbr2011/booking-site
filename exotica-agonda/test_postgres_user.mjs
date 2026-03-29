import { PrismaClient } from '@prisma/client';
// Using "postgres" as user instead of "postgres.wmmcnkrsjsnpvqoatsph"
const directUrl = "postgresql://postgres:Exoticadatabas@db.wmmcnkrsjsnpvqoatsph.supabase.co:5432/postgres?sslmode=require";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function main() {
  try {
    console.log('Attempting connection with "postgres" user on direct host...');
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
