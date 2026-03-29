import { PrismaClient } from '@prisma/client';
const directUrl = "postgresql://postgres.wmmcnkrsjsnpvqoatsph:Exoticadatabas@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Attempting connection to ' + directUrl);
    const rooms = await prisma.room.findMany();
    console.log('Success! Found ' + rooms.length + ' rooms.');
  } catch (e) {
    console.error('FAILED:');
    console.dir(e, { depth: null });
  } finally {
    await prisma.$disconnect();
  }
}

main();
