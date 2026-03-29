import { PrismaClient } from '@prisma/client';
// Attempt 1: Direct host + sslmode=require
const directUrl = "postgresql://postgres.wmmcnkrsjsnpvqoatsph:Exoticadatabas@db.wmmcnkrsjsnpvqoatsph.supabase.co:5432/postgres?sslmode=require";
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
    console.error('FAILED (Direct Host + SSL):');
    console.error(e.message || e);
    
    // Attempt 2: Direct Host NO SSL (just in case)
    console.log('\nRetrying without explicit sslmode...');
    const url2 = "postgresql://postgres.wmmcnkrsjsnpvqoatsph:Exoticadatabas@db.wmmcnkrsjsnpvqoatsph.supabase.co:5432/postgres";
    const prisma2 = new PrismaClient({ datasources: { db: { url: url2 } } });
    try {
      const rooms2 = await prisma2.room.findMany();
      console.log('Success on retry! Found ' + rooms2.length + ' rooms.');
    } catch (e2) {
      console.error('FAILED AGAIN:');
      console.error(e2.message || e2);
    } finally {
      await prisma2.$disconnect();
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
