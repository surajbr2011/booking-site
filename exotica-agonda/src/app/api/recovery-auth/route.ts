import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const email = 'admin@exoticaagonda.com';
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        
        const updated = await db.adminUser.update({
            where: { email },
            data: {
                isActive: true,
                passwordHash: hashedPassword,
                fullName: 'System Administrator'
            }
        });

        return NextResponse.json({ 
            status: 'success', 
            message: `Account ${email} activated and password reset to Admin123!`,
            user: { id: updated.id, email: updated.email, isActive: updated.isActive }
        });
    } catch (error: any) {
        return NextResponse.json({ 
            status: 'error', 
            message: error.message
        }, { status: 500 });
    }
}
