export interface TimeSlot {
  time: string; // e.g., "09:00 - 11:00"
  isAvailable: boolean;
}

export interface DateAvailability {
  date: string; // "YYYY-MM-DD"
  timeSlots: TimeSlot[];
}

// Note: Months are 0-indexed in JavaScript's Date object (0 for January, 11 for December).
// To ensure consistency and avoid off-by-one errors, we'll define dates using YYYY-MM-DD strings
// and parse them when needed. This makes the data more readable and less error-prone.

const generateRandomSlots = (): TimeSlot[] => {
  const slots = ["08:00 - 10:00", "10:00 - 12:00", "13:00 - 15:00", "15:00 - 17:00"];
  let availableCount = 0;
  const maxAvailable = 3; // Ensure not all slots are always available

  return slots.map(time => {
    const isAvailable = Math.random() > 0.4 && availableCount < maxAvailable; // 60% chance of being available
    if (isAvailable) {
      availableCount++;
    }
    return { time, isAvailable };
  });
};


const generateFutureDate = (dayOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    // Format to YYYY-MM-DD
    return date.toISOString().split('T')[0];
};

export const sampleAvailability: DateAvailability[] = [];

// Generate availability data for the next 60 days
for (let i = 1; i < 60; i++) {
    // Make weekends less available
    const dayOfWeek = new Date(generateFutureDate(i)).getDay();
    if (dayOfWeek === 0) { // Sunday
        continue; // Skip Sundays
    }

    const timeSlots = generateRandomSlots();

    // Ensure there's at least one available slot to make the day available
    if (timeSlots.some(slot => slot.isAvailable)) {
        sampleAvailability.push({
            date: generateFutureDate(i),
            timeSlots,
        });
    }
}

// Ensure there's a specific earliest date for consistent testing
const earliestDate = new Date('2025-10-09');
const earliestDateStr = earliestDate.toISOString().split('T')[0];

// Check if the earliest date is already in the list
const earliestDateExists = sampleAvailability.some(d => d.date === earliestDateStr);

if (!earliestDateExists) {
    // Find a place to insert it while keeping the array sorted by date
    const insertIndex = sampleAvailability.findIndex(d => new Date(d.date) > earliestDate);
    
    sampleAvailability.splice(insertIndex !== -1 ? insertIndex : 0, 0, {
        date: earliestDateStr,
        timeSlots: [
            { time: "08:00 - 10:00", isAvailable: false },
            { time: "10:00 - 12:00", isAvailable: true },
            { time: "13:00 - 15:00", isAvailable: true },
            { time: "15:00 - 17:00", isAvailable: false },
        ],
    });
}
