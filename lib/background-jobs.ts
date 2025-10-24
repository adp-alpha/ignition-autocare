/**
 * Simple background job processing for booking notifications
 * This ensures notifications are sent even if the initial request fails
 */

import { addEventToGoogleCalendar } from "./google-calendar";
import { sendBookingConfirmationEmail } from "./email-service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Process booking notifications with retry logic
 */
export async function processBookingNotifications(
  booking: any,
  customer: any,
  originalDateString: string,
  retryCount = 0
): Promise<void> {
  const maxRetries = 3;
  const bookingData = {
    booking: {
      ...booking,
      bookingDateString: originalDateString,
    },
    customer,
  };

  try {
    console.log(
      `🔄 Processing notifications for ${booking.bookingReference} (attempt ${
        retryCount + 1
      })`
    );

    // Run both operations in parallel with timeout
    const results = await Promise.allSettled([
      // Google Calendar with timeout
      Promise.race([
        addEventToGoogleCalendar(bookingData),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Google Calendar timeout")), 10000)
        ),
      ]),

      // Email with timeout
      Promise.race([
        sendBookingConfirmationEmail(bookingData),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Email timeout")), 8000)
        ),
      ]),
    ]);

    const [calendarResult, emailResult] = results;

    // Handle Google Calendar result
    if (calendarResult.status === "fulfilled") {
      try {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { googleCalendarEventId: calendarResult.value as string },
        });
        console.log("✅ Google Calendar synced:", calendarResult.value);
      } catch (dbError) {
        console.error("⚠️ Failed to update booking with calendar ID:", dbError);
      }
    } else {
      console.error("❌ Google Calendar failed:", calendarResult.reason);
    }

    // Handle Email result
    if (emailResult.status === "fulfilled") {
      console.log("✅ Email confirmation sent successfully");
    } else {
      console.error("❌ Email confirmation failed:", emailResult.reason);
    }

    // Check if we need to retry
    const hasFailures = results.some((result) => result.status === "rejected");

    if (hasFailures && retryCount < maxRetries) {
      console.log(
        `⏰ Scheduling retry ${retryCount + 1}/${maxRetries} for ${
          booking.bookingReference
        }`
      );

      // Exponential backoff: 2s, 4s, 8s
      const delay = Math.pow(2, retryCount + 1) * 1000;

      setTimeout(() => {
        processBookingNotifications(
          booking,
          customer,
          originalDateString,
          retryCount + 1
        ).catch((error) => {
          console.error(
            `❌ Retry ${retryCount + 1} failed for ${
              booking.bookingReference
            }:`,
            error
          );
        });
      }, delay);
    } else {
      console.log(
        `✅ Notification processing completed for ${booking.bookingReference}`
      );
    }
  } catch (error) {
    console.error(
      `❌ Critical error processing notifications for ${booking.bookingReference}:`,
      error
    );

    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount + 1) * 1000;
      setTimeout(() => {
        processBookingNotifications(
          booking,
          customer,
          originalDateString,
          retryCount + 1
        ).catch((retryError) => {
          console.error(
            `❌ Final retry failed for ${booking.bookingReference}:`,
            retryError
          );
        });
      }, delay);
    }
  }
}

/**
 * Lightweight notification processing (fire and forget)
 */
export async function processBookingNotificationsLightweight(
  booking: any,
  customer: any,
  originalDateString: string
): Promise<void> {
  const bookingData = {
    booking: {
      ...booking,
      bookingDateString: originalDateString,
    },
    customer,
  };

  // Fire and forget - don't wait for completion
  Promise.allSettled([
    addEventToGoogleCalendar(bookingData).then(async (googleEventId) => {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { googleCalendarEventId: googleEventId },
      });
      console.log("✅ Calendar synced:", googleEventId);
    }),

    sendBookingConfirmationEmail(bookingData).then(() => {
      console.log("✅ Email sent");
    }),
  ])
    .then((results) => {
      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length > 0) {
        console.log(
          `⚠️ ${failures.length} notification(s) failed for ${booking.bookingReference}`
        );
      } else {
        console.log(
          `✅ All notifications sent for ${booking.bookingReference}`
        );
      }
    })
    .catch((error) => {
      console.error(
        `❌ Notification error for ${booking.bookingReference}:`,
        error
      );
    });
}
