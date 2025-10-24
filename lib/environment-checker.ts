/**
 * Environment checker for booking system
 * Helps identify and fix common deployment issues
 */

export interface EnvironmentStatus {
  email: {
    enabled: boolean;
    configured: boolean;
    provider: string | null;
    issues: string[];
    recommendations: string[];
  };
  calendar: {
    configured: boolean;
    issues: string[];
  };
  database: {
    configured: boolean;
    issues: string[];
  };
  overall: {
    status: 'healthy' | 'warning' | 'error';
    criticalIssues: string[];
  };
}

/**
 * Check environment configuration
 */
export function checkEnvironment(): EnvironmentStatus {
  const status: EnvironmentStatus = {
    email: {
      enabled: process.env.DISABLE_EMAIL !== 'true',
      configured: false,
      provider: null,
      issues: [],
      recommendations: [],
    },
    calendar: {
      configured: false,
      issues: [],
    },
    database: {
      configured: false,
      issues: [],
    },
    overall: {
      status: 'healthy',
      criticalIssues: [],
    },
  };

  // Check email configuration
  if (status.email.enabled) {
    if (process.env.SENDGRID_API_KEY) {
      status.email.configured = true;
      status.email.provider = 'SendGrid';
    } else if (process.env.SMTP_EMAIL_USER && process.env.SMTP_EMAIL_PASS) {
      status.email.configured = true;
      status.email.provider = 'Gmail SMTP';
    } else if (process.env.EMAIL_SERVICE === 'gmail' && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      status.email.configured = true;
      status.email.provider = 'Gmail Service';
    } else {
      status.email.issues.push('No email credentials configured');
      status.email.recommendations.push('Set SMTP_EMAIL_USER and SMTP_EMAIL_PASS for Gmail');
      status.email.recommendations.push('Or use SendGrid: EMAIL_SERVICE=sendgrid, SENDGRID_API_KEY=your_key');
      status.email.recommendations.push('Or disable email: DISABLE_EMAIL=true');
    }
  } else {
    status.email.provider = 'Disabled';
    status.email.configured = true; // Disabled is a valid configuration
  }

  // Check Google Calendar
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON) {
    status.calendar.configured = true;
  } else {
    status.calendar.issues.push('Google Calendar not configured');
    status.overall.criticalIssues.push('Google Calendar integration missing');
  }

  // Check database
  if (process.env.DATABASE_URL) {
    status.database.configured = true;
  } else {
    status.database.issues.push('Database URL not configured');
    status.overall.criticalIssues.push('Database connection missing');
  }

  // Determine overall status
  if (status.overall.criticalIssues.length > 0) {
    status.overall.status = 'error';
  } else if (status.email.issues.length > 0 || status.calendar.issues.length > 0) {
    status.overall.status = 'warning';
  }

  return status;
}

/**
 * Log environment status
 */
export function logEnvironmentStatus(): void {
  const status = checkEnvironment();
  
  console.log('🔍 Environment Status Check');
  console.log('===========================');
  
  // Email status
  if (status.email.enabled) {
    if (status.email.configured) {
      console.log(`✅ Email: Configured (${status.email.provider})`);
    } else {
      console.log('❌ Email: Not configured');
      status.email.issues.forEach(issue => console.log(`   - ${issue}`));
      console.log('   Recommendations:');
      status.email.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
  } else {
    console.log('⚠️  Email: Disabled (DISABLE_EMAIL=true)');
    console.log('   - Customers will receive Google Calendar invites only');
  }
  
  // Calendar status
  if (status.calendar.configured) {
    console.log('✅ Google Calendar: Configured');
  } else {
    console.log('❌ Google Calendar: Not configured');
    status.calendar.issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  // Database status
  if (status.database.configured) {
    console.log('✅ Database: Configured');
  } else {
    console.log('❌ Database: Not configured');
    status.database.issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  // Overall status
  console.log(`📊 Overall Status: ${status.overall.status.toUpperCase()}`);
  if (status.overall.criticalIssues.length > 0) {
    console.log('🚨 Critical Issues:');
    status.overall.criticalIssues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  console.log('===========================');
}

/**
 * Get quick fix instructions
 */
export function getQuickFixInstructions(): string {
  const status = checkEnvironment();
  
  let instructions = '🚀 Quick Fix Instructions:\n\n';
  
  if (!status.email.configured && status.email.enabled) {
    instructions += '📧 Email Setup:\n';
    instructions += '1. For DigitalOcean/Production: Add DISABLE_EMAIL=true to .env\n';
    instructions += '2. For SendGrid: Add EMAIL_SERVICE=sendgrid and SENDGRID_API_KEY=your_key\n';
    instructions += '3. For Gmail: Add SMTP_EMAIL_USER and SMTP_EMAIL_PASS to .env\n\n';
  }
  
  if (!status.calendar.configured) {
    instructions += '📅 Google Calendar Setup:\n';
    instructions += '1. Create Google Service Account\n';
    instructions += '2. Add GOOGLE_SERVICE_ACCOUNT_KEY_JSON to .env\n';
    instructions += '3. Add GOOGLE_CALENDAR_ID to .env\n\n';
  }
  
  if (!status.database.configured) {
    instructions += '🗄️  Database Setup:\n';
    instructions += '1. Add DATABASE_URL to .env\n';
    instructions += '2. Run: npx prisma migrate deploy\n\n';
  }
  
  instructions += '🔧 Test your setup:\n';
  instructions += '- Visit: /api/test-email\n';
  instructions += '- Create a test booking\n';
  instructions += '- Check application logs\n';
  
  return instructions;
}