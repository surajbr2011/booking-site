const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function update() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        await prisma.adminUser.update({
            where: { email: 'admin@exoticaagonda.com' },
            data: { passwordHash: hash }
        });
        console.log('Password updated to admin123');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
update();
