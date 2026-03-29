import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.room.findMany().then(() => console.log('success')).catch(e => console.error(e.message || e));
