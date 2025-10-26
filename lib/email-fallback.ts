/**
 * Fallback email service for DigitalOcean and other hosting providers
 * Tries multiple email methods in order of preference
 */

import nodemailer, { SentMessageInfo } from "nodemailer";

interface EmailConfig {
  name: string;
  config: any;
}

/**
 * Get email configurations in order of preference
 */
function getEmailConfigurations(): EmailConfig[] {
  const configs: EmailConfig[] = [];

  // SendGrid (most reliable for production) - PRIORITY
  if (process.env.SENDGRID_API_KEY) {
    configs.push({
      name: 'SendGrid SMTP',
      config: {
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth: {
          user: "apikey", // This is literally the string "apikey"
          pass: process.env.SENDGRID_API_KEY,
        },
        tls: {
          rejectUnauthorized: false
        }
      }
    });
  }

  // Gmail with explicit SMTP (better for DigitalOcean)
  if (process.env.SMTP_EMAIL_USER && process.env.SMTP_EMAIL_PASS) {
    configs.push({
      name: 'Gmail SMTP (587)',
      config: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL_USER,
          pass: process.env.SMTP_EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      }
    });

    configs.push({
      name: 'Gmail SMTP (465)',
      config: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_EMAIL_USER,
          pass: process.env.SMTP_EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      }
    });

    configs.push({
      name: 'Gmail Service',
      config: {
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL_USER,
          pass: process.env.SMTP_EMAIL_PASS,
        },
      }
    });
  }

  return configs;
}

/**
 * Try to send email with fallback configurations
 */
export async function sendEmailWithFallback(mailOptions: any): Promise<SentMessageInfo> {
  const configs = getEmailConfigurations();
  
  if (configs.length === 0) {
    throw new Error('No email configurations available');
  }

  let lastError: Error | null = null;

  for (const { name, config } of configs) {
    try {
      console.log(`📧 Attempting to send email via ${name}...`);
      
      const transporter = nodemailer.createTransport({
        ...config,
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        logger: false,
        debug: false,
      });

      // Test connection first
      await transporter.verify();
      console.log(`✅ ${name} connection verified`);

      // Send email with timeout
      const result = await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`${name} timeout after 30 seconds`)), 30000)
        )
      ]);

      console.log(`✅ Email sent successfully via ${name}`);
      return result;

    } catch (error) {
      console.warn(`⚠️ ${name} failed:`, error instanceof Error ? error.message : error);
      lastError = error instanceof Error ? error : new Error(`${name} failed`);
      continue;
    }
  }

  // All methods failed
  throw new Error(`All email methods failed. Last error: ${lastError?.message}`);
}

/**
 * Quick email service health check
 */
export async function checkEmailHealth(): Promise<{
  available: string[];
  unavailable: string[];
}> {
  const configs = getEmailConfigurations();
  const available: string[] = [];
  const unavailable: string[] = [];

  for (const { name, config } of configs) {
    try {
      const transporter = nodemailer.createTransport({
        ...config,
        connectionTimeout: 5000,
        greetingTimeout: 3000,
        socketTimeout: 5000,
      });

      await Promise.race([
        transporter.verify(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);

      available.push(name);
    } catch (error) {
      unavailable.push(name);
    }
  }

  return { available, unavailable };
}