import { google } from 'googleapis';
import { formatServicesForDisplay } from './booking-utils';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

interface CalendarEventData {
  booking: any;
  customer: any;
}

/**
 * Get authenticated Google Calendar client
 */
export async function getGoogleCalendarAuth() {
  const jsonKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;

  if (!jsonKey) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_KEY_JSON');
  }

  const credentials = JSON.parse(jsonKey);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return auth;
}

/**
 * Add a booking event to Google Calendar
 */
export async function addEventToGoogleCalendar(
  data: CalendarEventData
): Promise<string> {
  try {
    const auth = await getGoogleCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });

    const { booking, customer } = data;
    const servicesData = booking.servicesData as any;

    // Format services for description
    const servicesDescription = formatServicesForDisplay(servicesData);

    // Use the original date string if available, otherwise extract from bookingDate
    let bookingDateStr: string;
    if (booking.bookingDateString) {
      bookingDateStr = booking.bookingDateString;
    } else if (booking.bookingDate instanceof Date) {
      // Extract date in UTC to avoid timezone shifts
      const date = booking.bookingDate;
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      bookingDateStr = `${year}-${month}-${day}`;
    } else {
      bookingDateStr = booking.bookingDate.toString().split('T')[0];
    }

    // Create ISO 8601 datetime strings in Europe/London timezone
    const startDateTime = `${bookingDateStr}T${booking.startTime}:00`;
    const endDateTime = `${bookingDateStr}T${booking.endTime}:00`;

    console.log('📅 Creating calendar event:', {
      originalDate: booking.bookingDateString,
      extractedDate: bookingDateStr,
      startTime: booking.startTime,
      endTime: booking.endTime,
      startDateTime,
      endDateTime,
    });

    // Create event description
    const description = `
Booking Reference: ${booking.bookingReference}

CUSTOMER DETAILS:
Name: ${customer.firstName} ${customer.lastName}
Email: ${customer.email}
Phone: ${customer.contactNumber}

VEHICLE DETAILS:
Registration: ${booking.vrm}
Make/Model: ${booking.make} ${booking.model}
${booking.engineSize ? `Engine Size: ${booking.engineSize}` : ''}
${booking.fuelType ? `Fuel Type: ${booking.fuelType}` : ''}
${booking.vehicleClass ? `Vehicle Class: ${booking.vehicleClass}` : ''}

SERVICES:
${servicesDescription}

TOTAL PRICE: £${parseFloat(booking.totalPrice).toFixed(2)}
${booking.isBlueLightCardHolder ? '\n✓ Blue Light Card Holder' : ''}

${booking.notes ? `NOTES:\n${booking.notes}` : ''}
    `.trim();

    // Create event
    const event = {
      summary: `${servicesDescription} - ${booking.vrm}`,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/London',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
      colorId: '5', // Yellow color for bookings
    };

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'all',
    });

    console.log('✅ Google Calendar event created:', response.data.id);
    console.log('   Event link:', response.data.htmlLink);

    return response.data.id!;
  } catch (error) {
    console.error('❌ Failed to create Google Calendar event:', error);
    throw new Error(`Failed to create calendar event: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update an existing calendar event
 */
export async function updateCalendarEvent(
  eventId: string,
  data: Partial<CalendarEventData>
): Promise<void> {
  try {
    const auth = await getGoogleCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Get existing event
    const existingEvent = await calendar.events.get({
      calendarId,
      eventId,
    });

    // Update with new data
    await calendar.events.update({
      calendarId,
      eventId,
      requestBody: {
        ...existingEvent.data,
        // Add updated fields here
      },
      sendUpdates: 'all',
    });

    console.log('✅ Google Calendar event updated:', eventId);
  } catch (error) {
    console.error('❌ Failed to update Google Calendar event:', error);
    throw error;
  }
}

/**
 * Cancel/delete a calendar event
 */
export async function cancelCalendarEvent(eventId: string): Promise<void> {
  try {
    const auth = await getGoogleCalendarAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all',
    });

    console.log('✅ Google Calendar event cancelled:', eventId);
  } catch (error) {
    console.error('❌ Failed to cancel Google Calendar event:', error);
    throw error;
  }
}
