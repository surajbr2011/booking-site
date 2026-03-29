require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Current Admin Users ---');
        const users = await prisma.adminUser.findMany();
        if (users.length === 0) {
            console.log('NO ADMIN USERS FOUND IN DATABASE.');
        } else {
            users.forEach(u => {
                console.log(`ID: ${u.id} | Email: ${u.email} | Active: ${u.isActive} | Role: ${u.role}`);
            });
        }
    } catch (e) {
        console.error('DATABASE ERROR:', e);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
