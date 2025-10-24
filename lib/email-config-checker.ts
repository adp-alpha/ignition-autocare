/**
 * Email configuration checker and setup helper
 */

export interface EmailConfig {
  isConfigured: boolean;
  service: string | null;
  missingVars: string[];
  recommendations: string[];
}

/**
 * Check email configuration and provide setup recommendations
 */
export function checkEmailConfiguration(): EmailConfig {
  const config: EmailConfig = {
    isConfigured: false,
    service: null,
    missingVars: [],
    recommendations: [],
  };

  // Check for basic email credentials
  if (process.env.SMTP_EMAIL_USER && process.env.SMTP_EMAIL_PASS) {
    config.isConfigured = true;
    config.service = 'Gmail (via SMTP_EMAIL_*)';
    return config;
  }

  // Check for Gmail configuration
  if (process.env.EMAIL_SERVICE === 'gmail') {
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      config.isConfigured = true;
      config.service = 'Gmail';
      return config;
    } else {
      config.missingVars.push('GMAIL_USER', 'GMAIL_APP_PASSWORD');
      config.recommendations.push(
        'Set up Gmail App Password: https://support.google.com/accounts/answer/185833'
      );
    }
  }

  // Check for SendGrid configuration
  if (process.env.EMAIL_SERVICE === 'sendgrid') {
    if (process.env.SENDGRID_API_KEY) {
      config.isConfigured = true;
      config.service = 'SendGrid';
      return config;
    } else {
      config.missingVars.push('SENDGRID_API_KEY');
      config.recommendations.push(
        'Get SendGrid API key: https://sendgrid.com/docs/ui/account-and-settings/api-keys/'
      );
    }
  }

  // No service configured
  if (!process.env.EMAIL_SERVICE) {
    config.missingVars.push('EMAIL_SERVICE');
    config.recommendations.push(
      'Set EMAIL_SERVICE to "gmail" or "sendgrid"',
      'For Gmail: Set SMTP_EMAIL_USER and SMTP_EMAIL_PASS',
      'For SendGrid: Set SENDGRID_API_KEY'
    );
  }

  return config;
}

/**
 * Log email configuration status
 */
export function logEmailConfigStatus(): void {
  const config = checkEmailConfiguration();
  
  if (config.isConfigured) {
    console.log(`✅ Email service configured: ${config.service}`);
  } else {
    console.warn('⚠️ Email service not configured');
    console.warn('Missing environment variables:', config.missingVars.join(', '));
    console.warn('Recommendations:');
    config.recommendations.forEach(rec => console.warn(`  - ${rec}`));
    console.warn('Booking confirmations will be sent via Google Calendar only');
  }
}

/**
 * Quick setup helper for development
 */
export function getQuickSetupInstructions(): string {
  return `
🚀 Quick Email Setup for Development:

1. Gmail Setup (Recommended):
   - Add to your .env file:
     SMTP_EMAIL_USER=your-gmail@gmail.com
     SMTP_EMAIL_PASS=your-app-password
   
   - Get App Password:
     1. Enable 2FA on Gmail
     2. Go to Google Account → Security → 2-Step Verification → App passwords
     3. Generate password for "Mail"

2. Alternative - SendGrid (Production):
   - Add to your .env file:
     EMAIL_SERVICE=sendgrid
     SENDGRID_API_KEY=your-api-key
   
   - Get API Key from SendGrid dashboard

3. Test your setup by creating a booking!
`;
}