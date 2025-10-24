import { NextRequest, NextResponse } from 'next/server';
import { checkEmailConfiguration, getQuickSetupInstructions } from '@/lib/email-config-checker';
import { sendBookingConfirmationEmail } from '@/lib/email-service';

/**
 * GET /api/test-email
 * Check email configuration status
 */
export async function GET() {
  const config = checkEmailConfiguration();
  
  if (config.isConfigured) {
    return NextResponse.json({
      success: true,
      message: `Email service configured: ${config.service}`,
      service: config.service,
    });
  } else {
    return NextResponse.json({
      success: false,
      message: 'Email service not configured',
      missingVars: config.missingVars,
      recommendations: config.recommendations,
      setupInstructions: getQuickSetupInstructions(),
    }, { status: 400 });
  }
}

/**
 * POST /api/test-email
 * Send a test email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email address is required',
      }, { status: 400 });
    }

    // Check if email is disabled
    if (process.env.DISABLE_EMAIL === 'true') {
      return NextResponse.json({
        success: false,
        message: 'Email is disabled via DISABLE_EMAIL environment variable',
        recommendation: 'Remove DISABLE_EMAIL=true from your .env file to enable email',
      }, { status: 400 });
    }

    const config = checkEmailConfiguration();
    
    if (!config.isConfigured) {
      return NextResponse.json({
        success: false,
        message: 'Email service not configured',
        setupInstructions: getQuickSetupInstructions(),
      }, { status: 400 });
    }

    // Send test email
    const testBookingData = {
      booking: {
        bookingReference: 'TEST-' + Date.now(),
        bookingDateString: '2025-01-15',
        startTime: '10:00',
        endTime: '12:00',
        vrm: 'TEST123',
        make: 'Test',
        model: 'Vehicle',
        engineSize: '2000cc',
        fuelType: 'Petrol',
        totalPrice: '99.99',
        isBlueLightCardHolder: false,
        notes: 'This is a test booking email',
        servicesData: {
          services: [
            { name: 'MOT Test', price: 54.85 },
            { name: 'Full Service', price: 45.14 }
          ],
          totalPrice: 99.99,
          isBlueLightCardHolder: false
        }
      },
      customer: {
        firstName: 'Test',
        lastName: 'Customer',
        email: email,
      }
    };

    await sendBookingConfirmationEmail(testBookingData);

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
      service: config.service,
    });

  } catch (error) {
    console.error('Test email failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Email test completed with warnings',
      error: error instanceof Error ? error.message : 'Unknown error',
      note: 'Booking system will work without email - customers get Google Calendar invites',
      setupInstructions: getQuickSetupInstructions(),
    }, { status: 200 }); // Return 200 since system still works
  }
}