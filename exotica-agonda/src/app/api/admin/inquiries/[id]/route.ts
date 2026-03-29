import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';

// GET /api/admin/inquiries/:id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const inquiry = await db.inquiry.findUnique({ where: { id } });
        if (!inquiry) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }
        return NextResponse.json({ data: inquiry });
    } catch (error) {
        console.error('[Admin Inquiries] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 });
    }
}

// PATCH /api/admin/inquiries/:id — update status / send reply
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, replyMessage } = body;

        const existing = await db.inquiry.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        const updated = await db.inquiry.update({
            where: { id },
            data: {
                status: status ?? existing.status,
                replyMessage: replyMessage !== undefined ? replyMessage : existing.replyMessage,
                respondedAt: replyMessage ? new Date() : existing.respondedAt,
            },
        });

        // Email the guest (non-blocking)
        if (replyMessage && existing.email) {
            setImmediate(async () => {
                try {
                    await sendEmail({
                        to: existing.email!,
                        subject: 'Reply from The Exotica Agonda',
                        html: `
                        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                            <div style="background:#1e293b;padding:28px;text-align:center">
                                <h1 style="color:white;margin:0;font-size:22px">The Exotica Agonda</h1>
                            </div>
                            <div style="padding:28px;background:#f8fafc">
                                <h2 style="color:#1e293b;margin-top:0">Hello ${existing.name},</h2>
                                <p style="color:#4a5568">We have replied to your inquiry:</p>
                                <div style="background:white;border-left:4px solid #1e81b0;padding:18px;border-radius:8px;margin:18px 0">
                                    <p style="color:#1e293b;margin:0">"${replyMessage}"</p>
                                </div>
                                <p style="color:#4a5568;font-size:13px">Your original message: <em>${existing.message}</em></p>
                                <p style="color:#1e81b0;font-weight:bold;margin-top:20px">The Exotica Agonda Team</p>
                            </div>
                            <div style="background:#2a303c;padding:12px;text-align:center">
                                <p style="color:#9ca3af;font-size:11px;margin:0">Val 101/5 - Agonda Beach Rd, Agonda, Goa 403702</p>
                            </div>
                        </div>`,
                    });
                } catch (e) {
                    console.error('[Inquiry Reply Email] Failed:', e);
                }
            });
        }

        return NextResponse.json({ message: 'Inquiry updated successfully', data: updated });
    } catch (error) {
        console.error('[Admin Inquiries] PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}

// DELETE /api/admin/inquiries/:id
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.inquiry.delete({ where: { id } });
        return NextResponse.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error('[Admin Inquiries] DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
    }
}
