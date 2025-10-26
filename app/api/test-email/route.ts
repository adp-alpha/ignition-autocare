import { NextRequest, NextResponse } from 'next/server';
import { sendEmailWithFallback, checkEmailHealth } from '@/lib/email-fallback';

export async function GET() {
  try {
    // Check email service health
    const health = await checkEmailHealth();
    
    return NextResponse.json({
      success: true,
      message: 'Email service health check',
      health,
      environment: {
        hasSendGrid: !!process.env.SENDGRID_API_KEY,
        hasGmail: !!(process.env.SMTP_EMAIL_USER && process.env.SMTP_EMAIL_PASS),
        fromEmail: process.env.FROM_EMAIL,
        emailDisabled: process.env.DISABLE_EMAIL === 'true',
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email address is required'
      }, { status: 400 });
    }

    // Test email configuration
    const testMailOptions = {
      from: {
        name: "Ignition Autocare Test",
        address: process.env.FROM_EMAIL || "test@ignitionautocare.com",
      },
      to: email,
      subject: "Test Email - Ignition Autocare Email Service",
      text: `
Hello!

This is a test email from Ignition Autocare to verify that the email service is working correctly.

✅ Email service is configured and working
✅ SendGrid integration is active
✅ Booking confirmations will be sent successfully

If you received this email, your email configuration is working perfectly!

Best regards,
Ignition Autocare Team

---
This is an automated test email sent at ${new Date().toISOString()}
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Email - Ignition Autocare</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #28a745; }
    .logo { font-size: 24px; font-weight: bold; color: #28a745; margin-bottom: 10px; }
    .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🚗 Ignition Autocare</div>
      <h1>Email Service Test</h1>
    </div>

    <p>Hello!</p>
    
    <p>This is a test email from Ignition Autocare to verify that the email service is working correctly.</p>

    <div class="success">
      <strong>✅ Success!</strong><br>
      ✅ Email service is configured and working<br>
      ✅ SendGrid integration is active<br>
      ✅ Booking confirmations will be sent successfully
    </div>

    <p>If you received this email, your email configuration is working perfectly!</p>

    <p>Best regards,<br>
    <strong>Ignition Autocare Team</strong></p>

    <div class="footer">
      <p>This is an automated test email sent at ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send test email
    const result = await sendEmailWithFallback(testMailOptions);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      sentTo: email,
    });

  } catch (error) {
    console.error('Test email failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}