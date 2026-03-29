import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { sendEmail, AdminNewInquiryTemplate, GuestInquiryConfirmationTemplate } from '@/lib/email';
import { sanitizeName, sanitizeEmail, sanitizePhone, sanitizeString } from '@/lib/sanitize';
import { contactRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        // Rate limit: 5 contact submissions per IP per hour
        const ip = getClientIP(request);
        const rl = contactRateLimit(ip);
        if (!rl.success) {
            return NextResponse.json(
                { error: 'Too Many Requests', message: 'Too many submissions. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();

        // Sanitize all inputs before processing
        const name = sanitizeName(body.name);
        const email = sanitizeEmail(body.email);
        const phone = sanitizePhone(body.phone);
        const message = sanitizeString(body.message);

        // Basic validation
        if (!name || !phone || !message) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'Name, phone, and message are required' },
                { status: 400 }
            );
        }

        // Save inquiry to database
        const inquiry = await db.inquiry.create({
            data: {
                name,
                email,
                phone,
                message,
                status: 'new',
                createdAt: new Date(),
            },
        });

        // Send emails (non-blocking, don't throw if email fails but log it)
        try {
            // 1. Notify Admin
            const adminEmail = process.env.ADMIN_EMAIL;
            if (adminEmail) {
                await sendEmail({
                    to: adminEmail,
                    subject: 'New Inquiry - The Exotica Agonda',
                    html: AdminNewInquiryTemplate(name, email, phone, message),
                });
            }

            // 2. Send confirmation to Guest (if email provided)
            if (email) {
                await sendEmail({
                    to: email,
                    subject: 'We received your inquiry - The Exotica Agonda',
                    html: GuestInquiryConfirmationTemplate(name),
                });
            }
        } catch (emailError) {
            console.error('Failed to send notification emails:', emailError);
        }

        return NextResponse.json(
            { message: 'Inquiry submitted successfully', data: inquiry },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error handling contact form submission:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to submit inquiry' },
            { status: 500 }
        );
    }
}
