import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export async function GET() {
    try {
        const users = await db.adminUser.findMany();
        return NextResponse.json({ 
            status: 'connected', 
            count: users.length,
            users: users.map(u => ({ id: u.id, email: u.email, isActive: u.isActive }))
        });
    } catch (error: any) {
        return NextResponse.json({ 
            status: 'error', 
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
