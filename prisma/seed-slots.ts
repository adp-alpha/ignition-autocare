import { PrismaClient } from '@prisma/client';
import { addDays, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

async function seedBookingSystem() {
  console.log('🌱 Seeding booking system configuration...');
  
  try {
    // 1. Create default slot configuration
    console.log('Creating slot configuration...');
    const config = await prisma.slotConfiguration.upsert({
      where: { id: 'default-config' },
      update: {},
      create: {
        id: 'default-config',
        slotDurationMinutes: 120, // 2 hours per slot
        slotStartTime: '08:00',
        slotEndTime: '17:00',
        workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat (0=Sunday, 6=Saturday)
        slotsPerTimeSlot: 1, // How many bookings can be made per time slot
        minLeadTimeDays: 1, // Must book at least 1 day in advance
        maxBookingDays: 60, // Can book up to 60 days ahead
        isActive: true,
      },
    });
    console.log('✅ Slot configuration created');
    
    // 2. Add recurring closed days (e.g., Sundays)
    console.log('Adding recurring closed days...');
    const today = startOfDay(new Date());
    
    // Add recurring closure for Sundays
    const nextSunday = addDays(today, 7 - today.getDay() || 7);
    await prisma.closedDay.upsert({
      where: { date: nextSunday },
      update: {},
      create: {
        date: nextSunday,
        reason: 'Sundays - Garage Closed',
        isRecurring: true,
        dayOfWeek: 0, // Sunday
      },
    });
    
    console.log('✅ Recurring closed days added');
    
    // 3. Add specific closed dates (example)
    console.log('Adding specific closed dates...');
    
    // Example: Add a specific closed date (e.g., 2 weeks from now for staff training)
    const specificClosedDate = addDays(today, 14);
    try {
      await prisma.closedDay.upsert({
        where: { date: specificClosedDate },
        update: {},
        create: {
          date: specificClosedDate,
          reason: 'Staff Training Day',
          isRecurring: false,
        },
      });
      console.log('✅ Specific closed dates added');
    } catch (error) {
      console.log('⚠️ Specific closed date already exists or skipped');
    }
    
    // 4. Add example unavailable slots (optional - for demonstration)
    console.log('Adding example unavailable slots...');
    
    // Example: Make 10:00-12:00 unavailable on a specific date
    const exampleUnavailableDate = addDays(today, 7);
    try {
      await prisma.unavailableSlot.upsert({
        where: {
          date_startTime_endTime: {
            date: exampleUnavailableDate,
            startTime: '10:00',
            endTime: '12:00',
          },
        },
        update: {},
        create: {
          date: exampleUnavailableDate,
          startTime: '10:00',
          endTime: '12:00',
          reason: 'Equipment Maintenance',
        },
      });
      console.log('✅ Example unavailable slots added');
    } catch (error) {
      console.log('⚠️ Example unavailable slot already exists or skipped');
    }
    
    // 5. Display summary
    const closedDaysCount = await prisma.closedDay.count();
    const unavailableSlotsCount = await prisma.unavailableSlot.count();
    
    console.log('\n📊 Seeding Summary:');
    console.log(`  Slot Duration: ${config.slotDurationMinutes} minutes`);
    console.log(`  Working Hours: ${config.slotStartTime} - ${config.slotEndTime}`);
    console.log(`  Working Days: Mon-Sat (Sundays closed)`);
    console.log(`  Slots Per Time: ${config.slotsPerTimeSlot}`);
    console.log(`  Min Lead Time: ${config.minLeadTimeDays} day(s)`);
    console.log(`  Max Booking Window: ${config.maxBookingDays} days`);
    console.log(`  Closed Days: ${closedDaysCount}`);
    console.log(`  Unavailable Slots: ${unavailableSlotsCount}`);
    console.log('\n💡 Note: Slots are generated dynamically. Only unavailable slots are stored.');
    
    console.log('\n✅ Booking system seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding booking system:', error);
    throw error;
  }
}

// Run the seed function
seedBookingSystem()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
