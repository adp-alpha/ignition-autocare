import nodemailer, { SentMessageInfo } from "nodemailer";
import { formatServicesForDisplay } from "./booking-utils";
import { sendEmailWithFallback } from "./email-fallback";

interface BookingEmailData {
  booking: any;
  customer: any;
}

/**
 * Create email transporter with SendGrid priority
 */
function createTransporter() {
  // Priority 1: SendGrid (most reliable)
  if (process.env.SENDGRID_API_KEY) {
    console.log("📧 Using SendGrid for email delivery");
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "apikey", // This is literally the string "apikey"
        pass: process.env.SENDGRID_API_KEY, // Your SendGrid API key
      },
      // Anti-spam configurations
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
    });
  }

  // Priority 2: Gmail SMTP (fallback)
  if (process.env.SMTP_EMAIL_USER && process.env.SMTP_EMAIL_PASS) {
    console.log("📧 Using Gmail SMTP for email delivery");
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
      // Anti-spam configurations
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
    });
  }

  console.warn(
    "⚠️ No email credentials configured - emails will be skipped"
  );
  return null;
}

/**
 * Generate booking confirmation email HTML
 */
function generateBookingConfirmationHTML(data: BookingEmailData): string {
  const { booking, customer } = data;
  const servicesDescription = formatServicesForDisplay(booking.servicesData);

  // Format the booking date nicely
  const bookingDate = new Date(
    `${booking.bookingDateString}T${booking.startTime}:00`
  );
  const formattedDate = bookingDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Ignition Autocare</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #007bff; }
    .logo { font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 10px; }
    .title { font-size: 20px; color: #333; margin: 0; }
    .section { margin: 25px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff; }
    .section h3 { margin-top: 0; color: #007bff; font-size: 16px; }
    .detail-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; }
    .detail-label { font-weight: bold; color: #555; }
    .detail-value { color: #333; }
    .services-list { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
    .price-total { font-size: 18px; font-weight: bold; color: #28a745; text-align: center; padding: 15px; background: #e8f5e8; border-radius: 5px; margin: 20px 0; }
    .reference { background: #007bff; color: white; padding: 15px; text-align: center; border-radius: 5px; font-weight: bold; font-size: 16px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
    .contact-info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    @media (max-width: 600px) {
      .container { padding: 20px; }
      .detail-row { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🚗 Ignition Autocare</div>
      <h1 class="title">Booking Confirmation</h1>
    </div>

    <p>Dear ${customer.firstName} ${customer.lastName},</p>
    <p>Thank you for booking with Ignition Autocare! Your appointment has been confirmed.</p>

    <div class="reference">
      Booking Reference: ${booking.bookingReference}
    </div>

    <div class="section">
      <h3>📅 Appointment Details</h3>
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${formattedDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time:</span>
        <span class="detail-value">${booking.startTime} - ${
    booking.endTime
  }</span>
      </div>
    </div>

    <div class="section">
      <h3>🚙 Vehicle Information</h3>
      <div class="detail-row">
        <span class="detail-label">Registration:</span>
        <span class="detail-value">${booking.vrm}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Make & Model:</span>
        <span class="detail-value">${booking.make} ${booking.model}</span>
      </div>
      ${
        booking.engineSize
          ? `
      <div class="detail-row">
        <span class="detail-label">Engine Size:</span>
        <span class="detail-value">${booking.engineSize}</span>
      </div>`
          : ""
      }
      ${
        booking.fuelType
          ? `
      <div class="detail-row">
        <span class="detail-label">Fuel Type:</span>
        <span class="detail-value">${booking.fuelType}</span>
      </div>`
          : ""
      }
    </div>

    <div class="section">
      <h3>🔧 Services Booked</h3>
      <div class="services-list">
        ${servicesDescription
          .split("\n")
          .map((service) =>
            service.trim() ? `<div>• ${service.trim()}</div>` : ""
          )
          .join("")}
      </div>
      ${
        booking.isBlueLightCardHolder
          ? '<div style="color: #28a745; font-weight: bold;">✅ Blue Light Card Discount Applied</div>'
          : ""
      }
    </div>

    <div class="price-total">
      Total Price: £${parseFloat(booking.totalPrice).toFixed(2)}
    </div>

    ${
      booking.notes
        ? `
    <div class="section">
      <h3>📝 Special Notes</h3>
      <p>${booking.notes}</p>
    </div>`
        : ""
    }

    <div class="contact-info">
      <h3>📍 Location & Contact</h3>
      <p><strong>Ignition Autocare</strong><br>
      Colorado Way, Castleford, West Yorkshire, WF104TA<br>
      Phone: 01977 807050<br>
      Email: kevin@ignitionautocare.co.uk</p>
      
      <p><strong>Important:</strong> Please arrive 10 minutes before your appointment time.</p>
    </div>

    <div class="section">
      <h3>❓ Need to Make Changes?</h3>
      <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible. We require at least 24 hours notice for cancellations.</p>
    </div>

    <div class="footer">
      <p>This is an automated confirmation email. Please save this for your records.</p>
      <p>Thank you for choosing Ignition Autocare!</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generate plain text version of booking confirmation
 */
function generateBookingConfirmationText(data: BookingEmailData): string {
  const { booking, customer } = data;
  const servicesDescription = formatServicesForDisplay(booking.servicesData);

  const bookingDate = new Date(
    `${booking.bookingDateString}T${booking.startTime}:00`
  );
  const formattedDate = bookingDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
BOOKING CONFIRMATION - IGNITION AUTOCARE

Dear ${customer.firstName} ${customer.lastName},

Thank you for booking with Ignition Autocare! Your appointment has been confirmed.

BOOKING REFERENCE: ${booking.bookingReference}

APPOINTMENT DETAILS:
Date: ${formattedDate}
Time: ${booking.startTime} - ${booking.endTime}

VEHICLE INFORMATION:
Registration: ${booking.vrm}
Make & Model: ${booking.make} ${booking.model}
${booking.engineSize ? `Engine Size: ${booking.engineSize}` : ""}
${booking.fuelType ? `Fuel Type: ${booking.fuelType}` : ""}

SERVICES BOOKED:
${servicesDescription}
${booking.isBlueLightCardHolder ? "\n✅ Blue Light Card Discount Applied" : ""}

TOTAL PRICE: £${parseFloat(booking.totalPrice).toFixed(2)}

${booking.notes ? `SPECIAL NOTES:\n${booking.notes}\n` : ""}

LOCATION & CONTACT:
Ignition Autocare
[Your garage address here]
Phone: [Your phone number]
Email: [Your email address]

IMPORTANT: Please arrive 10 minutes before your appointment time.

Need to make changes? Contact us at least 24 hours in advance.

This is an automated confirmation email. Please save this for your records.

Thank you for choosing Ignition Autocare!
  `.trim();
}

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmationEmail(
  data: BookingEmailData
): Promise<void> {
  const { booking, customer } = data;

  // Check if we're in a problematic environment (like DigitalOcean)
  const isProblematicEnvironment =
    process.env.DISABLE_EMAIL === "true" ||
    process.env.NODE_ENV === "production";

  if (isProblematicEnvironment) {
    console.log(
      `📧 Email disabled for production environment - booking ${booking.bookingReference} confirmed without email`
    );
    console.log(
      `📋 Customer details: ${customer.firstName} ${customer.lastName} (${customer.email})`
    );
    console.log(
      `🚗 Vehicle: ${booking.vrm} - ${booking.make} ${booking.model}`
    );
    console.log(
      `📅 Appointment: ${booking.bookingDateString} at ${booking.startTime}`
    );
    console.log(`💰 Total: £${booking.totalPrice}`);
    return;
  }

  try {
    const transporter = createTransporter();

    // Skip email if transporter is not configured
    if (!transporter) {
      console.log(
        "📧 Email service not configured - skipping email for booking:",
        booking.bookingReference
      );
      return;
    }

    const mailOptions = {
      from: {
        name: "Ignition Autocare",
        address: process.env.FROM_EMAIL || "bookings@ignitionautocare.com",
      },
      to: {
        name: `${customer.firstName} ${customer.lastName}`,
        address: customer.email,
      },
      subject: `Booking Confirmed: ${booking.bookingReference} - ${booking.vrm}`,
      text: generateBookingConfirmationText(data),
      html: generateBookingConfirmationHTML(data),
      // Add booking reference to headers for tracking
      headers: {
        "X-Booking-Reference": booking.bookingReference,
        "X-Customer-Email": customer.email,
      },
    };

    // Quick timeout for email - don't let it block the system
    const result = await Promise.race([
      sendEmailWithFallback(mailOptions),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Email timeout - continuing without email")),
          10000
        )
      ),
    ]);

    console.log("✅ Booking confirmation email sent successfully:", {
      messageId: result.messageId,
      bookingReference: booking.bookingReference,
      customerEmail: customer.email,
    });
  } catch (error) {
    // Don't throw error - just log and continue
    console.warn("⚠️ Email failed but booking is still confirmed:", {
      bookingReference: booking.bookingReference,
      customerEmail: customer.email,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    console.log("📋 Booking confirmed without email notification");
  }
}

/**
 * Send booking reminder email (can be called by a cron job)
 */
export async function sendBookingReminderEmail(
  data: BookingEmailData
): Promise<void> {
  try {
    const transporter = createTransporter();

    // Skip email if transporter is not configured
    if (!transporter) {
      console.log(
        "📧 Email service not configured - skipping reminder for booking:",
        data.booking.bookingReference
      );
      return;
    }
    const { booking, customer } = data;

    const bookingDate = new Date(
      `${booking.bookingDateString}T${booking.startTime}:00`
    );
    const formattedDate = bookingDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const mailOptions = {
      from: {
        name: "Ignition Autocare",
        address: process.env.FROM_EMAIL || "bookings@ignitionautocare.com",
      },
      to: {
        name: `${customer.firstName} ${customer.lastName}`,
        address: customer.email,
      },
      subject: `Reminder: Your appointment tomorrow - ${booking.bookingReference}`,
      text: `
Dear ${customer.firstName},

This is a friendly reminder about your appointment with Ignition Autocare tomorrow:

Date: ${formattedDate}
Time: ${booking.startTime}
Vehicle: ${booking.vrm}
Booking Reference: ${booking.bookingReference}

Please arrive 10 minutes before your appointment time.

If you need to make any changes, please contact us as soon as possible.

Thank you,
Ignition Autocare Team
      `.trim(),
      headers: {
        "X-Booking-Reference": booking.bookingReference,
        "X-Email-Type": "reminder",
      },
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Booking reminder email sent:", booking.bookingReference);
  } catch (error) {
    console.error("❌ Failed to send booking reminder email:", error);
    throw error;
  }
}
