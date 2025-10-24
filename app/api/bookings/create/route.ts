import { generateBookingReference, validateBookingRequest } from '@/lib/booking-utils';
import { processBookingNotificationsLightweight } from '@/lib/background-jobs';
import { PerformanceMonitor } from '@/lib/performance-monitor';
import { logEmailConfigStatus } from '@/lib/email-config-checker';
import { prisma } from '@/lib/prisma';
import { BookingResponse, CreateBookingRequest } from '@/types/booking';
import { NextRequest, NextResponse } from 'next/server';

// Module-level flag to track if email config has been logged
let emailConfigLogged = false;




/**
 * POST /api/bookings/create
 * Create a new booking
 */
export async function POST(request: NextRequest) {
  const monitor = new PerformanceMonitor('Booking Creation');
  
  // Log email configuration status (only once per deployment)
  if (!(globalThis as any).emailConfigLogged) {
    logEmailConfigStatus();
    (globalThis as any).emailConfigLogged = true;
  }
  
  try {
    const body: CreateBookingRequest = await request.json();
    monitor.checkpoint('Request parsed');

    // Validate request
    const validation = validateBookingRequest(body);
    monitor.checkpoint('Request validated');
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: validation.errors.join(', '),
        } as BookingResponse,
        { status: 400 }
      );
    }

    // Parse date string as UTC to avoid timezone shifts
    // body.slot.date is in format "YYYY-MM-DD" (e.g., "2025-10-29")
    const [year, month, day] = body.slot.date.split('-').map(Number);
    const bookingDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

    console.log('📅 Date processing:', {
      received: body.slot.date,
      parsed: bookingDate.toISOString(),
      utcDate: bookingDate.toISOString().split('T')[0],
    });

    const { startTime, endTime } = body.slot;

    const dayOfWeek = bookingDate.getUTCDay();

    // Pre-transaction validation checks (reduce time in transaction)
    const [config, unavailableSlot, closedDay, existingBookingsCount] =
      await Promise.all([
        prisma.slotConfiguration.findFirst({
          where: { isActive: true },
        }),

        prisma.unavailableSlot.findUnique({
          where: {
            date_startTime_endTime: {
              date: bookingDate,
              startTime,
              endTime,
            },
          },
        }),

        prisma.closedDay.findFirst({
          where: {
            OR: [
              { date: bookingDate, isRecurring: false },
              { isRecurring: true, dayOfWeek },
            ],
          },
        }),

        prisma.booking.count({
          where: {
            bookingDate,
            startTime,
            endTime,
            status: {
              notIn: ['CANCELLED', 'NO_SHOW'],
            },
          },
        }),
      ]);

    // Validation checks before transaction
    if (!config) {
      return NextResponse.json(
        {
          success: false,
          message: 'Slot configuration not found',
          error: 'System configuration error',
        } as BookingResponse,
        { status: 500 }
      );
    }

    const slotsPerTimeSlot = config.slotsPerTimeSlot || 1;

    if (unavailableSlot) {
      return NextResponse.json(
        {
          success: false,
          message: 'This time slot is not available',
          error: 'Slot unavailable',
        } as BookingResponse,
        { status: 400 }
      );
    }

    if (closedDay) {
      return NextResponse.json(
        {
          success: false,
          message: `Garage is closed on this date: ${closedDay.reason || 'Closed'}`,
          error: 'Day closed',
        } as BookingResponse,
        { status: 400 }
      );
    }

    if (existingBookingsCount >= slotsPerTimeSlot) {
      return NextResponse.json(
        {
          success: false,
          message: 'This time slot is fully booked',
          error: 'Slot full',
        } as BookingResponse,
        { status: 400 }
      );
    }

    // Short transaction - only write operations
    monitor.checkpoint('Starting database transaction');
    const result = await prisma.$transaction(async (tx) => {
      // Find or create customer
      let customer = await tx.customer.findFirst({
        where: { email: body.customer.email },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            firstName: body.customer.firstName,
            lastName: body.customer.lastName,
            email: body.customer.email,
            contactNumber: body.customer.contactNumber,
          },
        });
      } else {
        // Update customer info if changed
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            firstName: body.customer.firstName,
            lastName: body.customer.lastName,
            contactNumber: body.customer.contactNumber,
          },
        });
      }

      // Double-check slot capacity one more time (within transaction for consistency)
      const finalBookingCount = await tx.booking.count({
        where: {
          bookingDate,
          startTime,
          endTime,
          status: {
            notIn: ['CANCELLED', 'NO_SHOW'],
          },
        },
      });

      if (finalBookingCount >= slotsPerTimeSlot) {
        throw new Error('This time slot was just booked by another user');
      }

      // Generate booking reference
      const bookingReference = await generateBookingReference(tx);

      // Create booking
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          customerId: customer.id,
          vrm: body.vehicle.vrm.toUpperCase(),
          make: body.vehicle.make,
          model: body.vehicle.model,
          engineSize: body.vehicle.engineSize,
          fuelType: body.vehicle.fuelType,
          vehicleClass: body.vehicle.vehicleClass,
          bookingDate,
          startTime,
          endTime,
          displayTime: body.slot.timeSlot,
          servicesData: body.services as any,
          totalPrice: body.services.totalPrice,
          isBlueLightCardHolder: body.isBlueLightCardHolder,
          notes: body.notes,
          status: 'CONFIRMED',
        },
        include: {
          customer: true,
        },
      });

      return { booking, customer, originalDateString: body.slot.date };
    }, {
      maxWait: 5000,
      timeout: 8000,
    });
    
    monitor.checkpoint('Database transaction completed');

    // Return success response immediately - don't wait for external services
    const response: BookingResponse = {
      success: true,
      bookingId: result.booking.id,
      bookingReference: result.booking.bookingReference,
      message: 'Booking created successfully',
    };

    // Process external services asynchronously (fire and forget)
    processBookingNotificationsLightweight(result.booking, result.customer, result.originalDateString);
    monitor.checkpoint('Background jobs queued');

    monitor.finish(true);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    monitor.finish(false);
    console.error('❌ Error creating booking:', error);

    const response: BookingResponse = {
      success: false,
      message: 'Failed to create booking',
      error: error.message || 'Unknown error',
    };

    return NextResponse.json(response, { status: 400 });
  }
}

/**
 * GET /api/bookings/create
 * Get booking by reference
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Booking reference is required' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingReference: reference },
      include: {
        customer: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
