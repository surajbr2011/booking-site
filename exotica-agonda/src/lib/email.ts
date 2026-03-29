import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
}

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@exoticaagonda.com';

    console.log(`[Email] Attempting to send: "${subject}" to ${to}`);

    if (!apiKey) {
        console.warn('------------------------------------------------------------');
        console.warn('[Email] SKIPPED: SENDGRID_API_KEY is not configured in .env');
        console.warn(`[Email] Target: ${to}`);
        console.warn(`[Email] Subject: ${subject}`);
        console.warn('------------------------------------------------------------');
        return { success: false, reason: 'MISSING_API_KEY' };
    }

    const msg = {
        to,
        from: fromEmail,
        subject,
        html,
    };

    try {
        const response = await sgMail.send(msg);
        console.log(`[Email] SUCCESS: Sent to ${to}`);
        return { success: true, response };
    } catch (error: any) {
        const errorDetails = error?.response?.body || error;
        console.error('------------------------------------------------------------');
        console.error('[Email] FAILED: SendGrid error');
        console.error(`[Email] Error:`, JSON.stringify(errorDetails, null, 2));
        console.error('------------------------------------------------------------');
        throw error;
    }
};

// ─── Email Templates ────────────────────────────────────────────────────────

export const BookingConfirmationTemplate = (
    guestName: string,
    bookingReference: string,
    roomName: string,
    checkIn: string,
    checkOut: string,
    nights: number,
    totalAmount: number,
    guestCount: number
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e293b,#1e81b0);padding:48px 40px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">The Exotica Agonda</h1>
      <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Agonda Beach, South Goa</p>
    </div>
    
    <!-- Confirmation Banner -->
    <div style="background:#ecfdf5;border-bottom:1px solid #d1fae5;padding:20px 40px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <span style="font-size:24px;">✅</span>
        <span style="color:#059669;font-weight:900;font-size:16px;">Booking Confirmed!</span>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <p style="color:#374151;font-size:16px;margin:0 0 24px;">Dear <strong>${guestName}</strong>,</p>
      <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 32px;">
        We're thrilled to confirm your reservation at The Exotica Agonda! Your booking has been received and we look forward to welcoming you to our beautiful beachside resort.
      </p>

      <!-- Booking Details Box -->
      <div style="background:#f8fafc;border-radius:16px;padding:28px;margin-bottom:32px;border:1px solid #e5e7eb;">
        <h2 style="color:#1e293b;font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 20px;">Booking Details</h2>
        
        <table style="width:100%;border-collapse:collapse;">
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#9ca3af;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Reference</td>
            <td style="padding:12px 0;color:#1e81b0;font-size:15px;font-weight:900;text-align:right;">${bookingReference}</td>
          </tr>
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#9ca3af;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Room</td>
            <td style="padding:12px 0;color:#1e293b;font-size:15px;font-weight:700;text-align:right;">${roomName}</td>
          </tr>
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#9ca3af;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Check-In</td>
            <td style="padding:12px 0;color:#1e293b;font-size:15px;font-weight:700;text-align:right;">${checkIn}</td>
          </tr>
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#9ca3af;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Check-Out</td>
            <td style="padding:12px 0;color:#1e293b;font-size:15px;font-weight:700;text-align:right;">${checkOut}</td>
          </tr>
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#9ca3af;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Duration</td>
            <td style="padding:12px 0;color:#1e293b;font-size:15px;font-weight:700;text-align:right;">${nights} Night${nights > 1 ? 's' : ''}</td>
          </tr>
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#9ca3af;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Guests</td>
            <td style="padding:12px 0;color:#1e293b;font-size:15px;font-weight:700;text-align:right;">${guestCount}</td>
          </tr>
          <tr>
            <td style="padding:16px 0 0;color:#1e293b;font-size:16px;font-weight:900;">Total Amount Paid</td>
            <td style="padding:16px 0 0;color:#1e81b0;font-size:22px;font-weight:900;text-align:right;">₹${totalAmount.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>

      <!-- What Next -->
      <div style="background:#fff7ed;border-radius:16px;padding:24px;margin-bottom:32px;border:1px solid #fed7aa;">
        <h3 style="color:#92400e;font-size:14px;font-weight:900;margin:0 0 12px;">📋 What Happens Next?</h3>
        <ul style="color:#92400e;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
          <li>Our team will reach out to confirm your special requests</li>
          <li>Check-in time: 12:00 PM noon</li>
          <li>Check-out time: 11:00 AM</li>
          <li>Please carry a valid ID for check-in</li>
        </ul>
      </div>

      <!-- Contact -->
      <div style="text-align:center;padding:20px;background:#f1f5f9;border-radius:16px;">
        <p style="color:#64748b;font-size:13px;margin:0 0 8px;">Questions? Contact us anytime</p>
        <a href="mailto:info@exoticaagonda.com" style="color:#1e81b0;font-weight:700;text-decoration:none;">info@exoticaagonda.com</a>
        <span style="color:#94a3b8;margin:0 8px;">·</span>
        <a href="tel:+919876543210" style="color:#1e81b0;font-weight:700;text-decoration:none;">+91 98765 43210</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#1e293b;padding:24px 40px;text-align:center;">
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">The Exotica Agonda · Near Agonda Beach · Canacona, Goa 403702</p>
    </div>
  </div>
</body>
</html>
`;

export const AdminBookingNotificationTemplate = (
    guestName: string,
    guestEmail: string,
    bookingReference: string,
    roomName: string,
    checkIn: string,
    checkOut: string,
    totalAmount: number
) => `
<h2 style="color:#1e293b;">🏨 New Booking Received</h2>
<table border="0" cellpadding="8" style="border-collapse:collapse;width:100%;max-width:600px;">
  <tr><td><strong>Reference:</strong></td><td style="color:#1e81b0;font-weight:700;">${bookingReference}</td></tr>
  <tr><td><strong>Guest:</strong></td><td>${guestName} (${guestEmail})</td></tr>
  <tr><td><strong>Room:</strong></td><td>${roomName}</td></tr>
  <tr><td><strong>Check-In:</strong></td><td>${checkIn}</td></tr>
  <tr><td><strong>Check-Out:</strong></td><td>${checkOut}</td></tr>
  <tr><td><strong>Total Amount:</strong></td><td style="color:#1e81b0;font-weight:900;">₹${totalAmount.toLocaleString('en-IN')}</td></tr>
</table>
<p style="color:#64748b;margin-top:16px;">Log in to the admin panel to manage this booking.</p>
`;

export const AdminNewInquiryTemplate = (name: string, email: string | null, phone: string, message: string) => `
<h2>New Contact Inquiry from ${name}</h2>
<p><strong>Email:</strong> ${email || 'N/A'}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
`;

export const GuestInquiryConfirmationTemplate = (name: string) => `
<h2>Hello ${name},</h2>
<p>Thank you for reaching out to The Exotica Agonda.</p>
<p>We have received your inquiry and our team will get back to you shortly.</p>
<br />
<p>Best regards,</p>
<p>The Exotica Agonda Team</p>
`;
