// app/api/slots/available/route.ts

import { prisma } from '@/lib/prisma';
import { AvailableDatesResponse, AvailableSlot } from '@/types/booking';
import { addDays, format, startOfDay } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const daysAhead = parseInt(searchParams.get('days') || '60');

    const today = startOfDay(new Date());

    const config = await prisma.slotConfiguration.findFirst({
      where: { isActive: true },
    });

    if (!config) {
      return NextResponse.json({ error: 'Slot configuration not found.' }, { status: 500 });
    }

    const minLeadTimeDays = config.minLeadTimeDays ?? 1;
    const startDate = addDays(today, minLeadTimeDays);
    const maxDays = Math.min(daysAhead, config.maxBookingDays ?? 60);
    const endDate = addDays(today, maxDays);

    const closedDays = await prisma.closedDay.findMany({
      where: {
        OR: [
          {
            date: { gte: startDate, lte: endDate },
            isRecurring: false,
          },
          {
            isRecurring: true,
          },
        ],
      },
    });

    const closedDatesSet = new Set(
      closedDays.filter(d => !d.isRecurring).map(d => format(d.date, 'yyyy-MM-dd'))
    );

    const closedDaysOfWeek = new Set(
      closedDays.filter(d => d.isRecurring && d.dayOfWeek !== null).map(d => d.dayOfWeek!)
    );

    const unavailableSlots = await prisma.unavailableSlot.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
    });

    const unavailableSlotsSet = new Set(
      unavailableSlots.map(slot =>
        `${format(slot.date, 'yyyy-MM-dd')}_${slot.startTime}_${slot.endTime}`
      )
    );

    // 🛠️ This is where the error previously occurred. Ensure Prisma client is regenerated.
    const existingBookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          notIn: ['CANCELLED', 'NO_SHOW'],
        },
      },
      select: {
        bookingDate: true,
        startTime: true,
        endTime: true,
      },
    });

    const bookingCounts = new Map<string, number>();
    existingBookings.forEach(booking => {
      const key = `${format(booking.bookingDate, 'yyyy-MM-dd')}_${booking.startTime}_${booking.endTime}`;
      bookingCounts.set(key, (bookingCounts.get(key) || 0) + 1);
    });

    const workingDays = config.workingDays as number[];
    const slotsPerTimeSlot = config.slotsPerTimeSlot ?? 1;

    const timeSlots = generateTimeSlots(
      config.slotStartTime,
      config.slotEndTime,
      config.slotDurationMinutes
    );

    const availableSlotsByDate = new Map<string, AvailableSlot[]>();

    for (let i = 0; i <= maxDays - minLeadTimeDays; i++) {
      const date = addDays(startDate, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayOfWeek = date.getDay();

      if (!workingDays.includes(dayOfWeek)) continue;
      if (closedDatesSet.has(dateStr)) continue;
      if (closedDaysOfWeek.has(dayOfWeek)) continue;

      const availableSlotsForDate: AvailableSlot[] = [];

      for (const timeSlot of timeSlots) {
        const slotKey = `${dateStr}_${timeSlot.start}_${timeSlot.end}`;

        if (unavailableSlotsSet.has(slotKey)) continue;

        const currentBookings = bookingCounts.get(slotKey) || 0;
        const availableCapacity = slotsPerTimeSlot - currentBookings;

        if (availableCapacity <= 0) continue;

        availableSlotsForDate.push({
          id: slotKey,
          date: dateStr,
          displayTime: timeSlot.display,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          availableCapacity,
        });
      }

      if (availableSlotsForDate.length > 0) {
        availableSlotsByDate.set(dateStr, availableSlotsForDate);
      }
    }

    const result: AvailableDatesResponse = {
      dates: Array.from(availableSlotsByDate.entries()).map(([date, slots]) => ({
        date,
        slots,
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch available slots',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number
): Array<{ start: string; end: string; display: string }> {
  const slots: Array<{ start: string; end: string; display: string }> = [];

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  let currentMinutes = startMinutes;

  while (currentMinutes + durationMinutes <= endMinutes) {
    const slotStartHour = Math.floor(currentMinutes / 60);
    const slotStartMinute = currentMinutes % 60;

    const slotEndMinutes = currentMinutes + durationMinutes;
    const slotEndHour = Math.floor(slotEndMinutes / 60);
    const slotEndMinute = slotEndMinutes % 60;

    const start = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMinute).padStart(2, '0')}`;
    const end = `${String(slotEndHour).padStart(2, '0')}:${String(slotEndMinute).padStart(2, '0')}`;

    slots.push({
      start,
      end,
      display: `${start} - ${end}`,
    });

    currentMinutes += durationMinutes;
  }

  return slots;
}
