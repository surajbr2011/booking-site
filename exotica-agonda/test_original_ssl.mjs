import { PrismaClient } from '@prisma/client';
// Using ORIGINAL host and user but adding sslmode=require
const directUrl = "postgresql://postgres.wmmcnkrsjsnpvqoatsph:Exoticadatabas@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function main() {
  try {
    console.log('Attempting connection to ORIGINAL host with SSL...');
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
