import { PrismaClient } from '@prisma/client';
const directUrl = "postgresql://postgres.wmmcnkrsjsnpvqoatsph:Exoticadatabas@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function main() {
  try {
    const rooms = await prisma.room.findMany();
    console.log('Success! Found ' + rooms.length + ' rooms.');
  } catch (e) {
    console.error('Direct connection failed:');
    console.error(e.message || e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
