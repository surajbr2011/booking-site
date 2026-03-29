const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@exoticaagonda.com';

console.log('--- SendGrid Diagnostic Tool ---');
console.log(`API Key set: ${apiKey ? 'YES (starts with ' + apiKey.substring(0, 4) + '...)' : 'NO'}`);
console.log(`From Email: ${fromEmail}`);
console.log('-------------------------------\n');

if (!apiKey) {
    console.error('ERROR: SENDGRID_API_KEY is missing in .env');
    console.log('\nTo fix this:');
    console.log('1. Go to https://sendgrid.com and create an API key.');
    console.log('2. Add SENDGRID_API_KEY="your_key_here" to your .env file.');
    process.exit(1);
}

sgMail.setApiKey(apiKey);

const testEmail = {
    to: 'test@example.com', // Change this to your email to test real delivery
    from: fromEmail,
    subject: 'Test Email - Exotica Agonda',
    text: 'This is a test email from your Exotica Hotel Booking system.',
    html: '<strong>This is a test email from your Exotica Hotel Booking system.</strong>',
};

async function runTest() {
    try {
        console.log(`Attempting to send test email to: ${testEmail.to}...`);
        await sgMail.send(testEmail);
        console.log('\n✅ SUCCESS! Email sent successfully.');
        console.log('Check your inbox (and spam folder) for the test email.');
    } catch (error) {
        console.error('\n❌ FAILED: Error sending email.');
        if (error.response) {
            console.error('SendGrid Error Body:', JSON.stringify(error.response.body, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

runTest();
