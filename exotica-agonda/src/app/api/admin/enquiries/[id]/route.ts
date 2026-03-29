import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { sendEmail } from '@/lib/email';

// PATCH /api/admin/enquiries/:id — admin replies to an inquiry
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, replyMessage } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'Inquiry ID is required' },
                { status: 400 }
            );
        }

        // Fetch the current inquiry
        const existing = await db.inquiry.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json(
                { error: 'Not Found', message: 'Inquiry not found' },
                { status: 404 }
            );
        }

        // Update inquiry
        const updated = await db.inquiry.update({
            where: { id },
            data: {
                status: status || existing.status,
                replyMessage: replyMessage !== undefined ? replyMessage : existing.replyMessage,
                respondedAt: replyMessage ? new Date() : existing.respondedAt,
            },
        });

        // If a reply was sent, email the guest
        if (replyMessage && existing.email) {
            setImmediate(async () => {
                try {
                    await sendEmail({
                        to: existing.email!,
                        subject: 'Reply from The Exotica Agonda — Your Inquiry',
                        html: `
                            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                                <div style="background:#1e293b;padding:30px;text-align:center">
                                    <h1 style="color:white;margin:0;font-size:24px">The Exotica Agonda</h1>
                                </div>
                                <div style="padding:30px;background:#f8fafc">
                                    <h2 style="color:#1e293b">Hello ${existing.name || 'Guest'},</h2>
                                    <p style="color:#4a5568">We have replied to your inquiry. Here is our response:</p>
                                    <div style="background:white;border-left:4px solid #1e81b0;padding:20px;border-radius:8px;margin:20px 0">
                                        <p style="color:#1e293b;margin:0;font-style:italic">"${replyMessage}"</p>
                                    </div>
                                    <p style="color:#4a5568">Your original message:</p>
                                    <div style="background:#f1f5f9;padding:15px;border-radius:8px;margin:10px 0">
                                        <p style="color:#64748b;margin:0;font-size:14px">${existing.message}</p>
                                    </div>
                                    <p style="color:#4a5568;margin-top:30px">Thank you for contacting us!</p>
                                    <p style="color:#1e81b0;font-weight:bold">The Exotica Agonda Team</p>
                                </div>
                                <div style="background:#2a303c;padding:15px;text-align:center">
                                    <p style="color:#9ca3af;font-size:12px;margin:0">Val 101/5 - Agonda Beach Rd, Agonda, Goa 403702</p>
                                </div>
                            </div>
                        `,
                    });
                } catch (emailErr) {
                    console.error('[Enquiry Reply] Failed to send email:', emailErr);
                }
            });
        }

        return NextResponse.json({ message: 'Inquiry updated successfully', data: updated });
    } catch (error) {
        console.error('[Admin Enquiries] PATCH error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to update inquiry' },
            { status: 500 }
        );
    }
}

// GET /api/admin/enquiries/:id — fetch a single inquiry
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const inquiry = await db.inquiry.findUnique({
            where: { id },
        });

        if (!inquiry) {
            return NextResponse.json(
                { error: 'Not Found', message: 'Inquiry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: inquiry });
    } catch (error) {
        console.error('[Admin Enquiries] GET error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch inquiry' },
            { status: 500 }
        );
    }
}
