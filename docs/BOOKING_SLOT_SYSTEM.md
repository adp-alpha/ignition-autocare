# Booking & Slot Management System

## Overview

This document explains the comprehensive booking and slot management system implemented for the garage booking application.

## Architecture

### Database Schema

The system uses four main tables:

1. **Customer** - Stores customer information
2. **Booking** - Stores booking details with services data
3. **BookingSlot** - Manages available time slots with capacity
4. **ClosedDay** - Manages garage closed days (specific and recurring)
5. **SlotConfiguration** - Controls slot timings and availability rules

### Key Features

- ✅ **Dynamic Slot Management** - Slots are generated and managed in the database
- ✅ **Capacity Control** - Each slot can handle multiple bookings (configurable)
- ✅ **Closed Days** - Support for both specific dates and recurring closures
- ✅ **Lead Time** - Minimum advance booking time
- ✅ **Flexible Configuration** - Control slot duration, working hours, and capacity
- ✅ **Google Calendar Integration** - Automatic event creation
- ✅ **Transaction Safety** - Atomic booking creation with slot updates
- ✅ **Structured Service Data** - Properly typed service information

## Database Models

### Customer
```typescript
{
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  bookings: Booking[]
}
```

### Booking
```typescript
{
  id: string
  bookingReference: string // "IGN-YYYYMMDD-XXX"
  customerId: string
  vrm: string
  make: string
  model: string
  engineSize?: string
  fuelType?: string
  vehicleClass?: string
  slotId: string
  servicesData: JSON // Structured BookingServicesData
  totalPrice: Decimal
  isBlueLightCardHolder: boolean
  notes?: string
  status: BookingStatus
  googleCalendarEventId?: string
}
```

### BookingSlot
```typescript
{
  id: string
  date: Date
  startTime: string // "09:00"
  endTime: string // "11:00"
  displayTime: string // "09:00 - 11:00"
  maxCapacity: number // How many bookings this slot can take
  currentBookings: number // Current count
  isAvailable: boolean // Auto-updated based on capacity
}
```

### ClosedDay
```typescript
{
  id: string
  date: Date
  reason?: string
  isRecurring: boolean // For weekly closures
  dayOfWeek?: number // 0=Sunday, 6=Saturday
}
```

### SlotConfiguration
```typescript
{
  id: string
  slotDurationMinutes: number // e.g., 120 for 2 hours
  slotStartTime: string // "08:00"
  slotEndTime: string // "17:00"
  workingDays: number[] // [1,2,3,4,5] = Mon-Fri
  defaultCapacity: number // Default slots per time period
  minLeadTimeDays: number // Minimum advance booking
  maxBookingDays: number // Maximum days ahead to book
  isActive: boolean
}
```

## API Endpoints

### GET /api/slots/available

Fetches available booking slots.

**Query Parameters:**
- `days` (optional) - Number of days ahead to fetch (default: 60)

**Response:**
```typescript
{
  dates: [
    {
      date: "2025-10-15",
      slots: [
        {
          id: "clxxx",
          date: "2025-10-15",
          displayTime: "09:00 - 11:00",
          startTime: "09:00",
          endTime: "11:00",
          availableCapacity: 1
        }
      ]
    }
  ]
}
```

**Features:**
- Respects lead time configuration
- Filters out closed days
- Excludes fully booked slots
- Handles recurring closures (e.g., Sundays)

### POST /api/bookings/create

Creates a new booking.

**Request Body:**
```typescript
{
  customer: {
    firstName: string
    lastName: string
    email: string
    contactNumber: string
  },
  vehicle: {
    vrm: string
    make: string
    model: string
    engineSize?: string
    fuelType?: string
    vehicleClass?: string
  },
  slot: {
    date: Date
    timeSlot: string
    startTime: string
    endTime: string
  },
  services: BookingServicesData,
  notes?: string,
  isBlueLightCardHolder: boolean
}
```

**Response:**
```typescript
{
  success: boolean
  bookingId?: string
  bookingReference?: string
  googleCalendarEventId?: string
  message: string
  error?: string
}
```

**Process:**
1. Validates request data
2. Checks slot availability (transaction)
3. Creates/updates customer record
4. Generates unique booking reference (IGN-YYYYMMDD-XXX)
5. Creates booking with structured services data
6. Updates slot capacity
7. Adds event to Google Calendar
8. Returns booking confirmation

### GET /api/bookings/create?reference=IGN-20251012-001

Retrieves a booking by reference number.

## Service Data Structure

The `servicesData` field in bookings stores a comprehensive, structured representation of selected services:

```typescript
interface BookingServicesData {
  mot?: {
    type: 'MOT_CLASS_4' | 'MOT_CLASS_7'
    price: number
    originalPrice?: number
    discount?: number
    leadTime?: number
  }
  service?: {
    type: 'INTERIM' | 'FULL' | 'MAJOR' | 'OIL_CHANGE'
    engineSize: string
    price: number
    oilQuantity?: number
    parts?: {...}
    labourCost?: number
    partsCost?: number
  }
  delivery?: {...}
  customProducts?: [...]
  singlePriceProducts?: [...]
  repairs?: [...]
  vehicleSafetyCheck?: {...}
  subtotal: number
  discounts: {
    blueLightCard?: number
    bundleDiscounts?: number
  }
  totalPrice: number
}
```

## Google Calendar Integration

Each booking automatically creates a Google Calendar event with:

- **Summary:** Booking reference + vehicle details
- **Description:** Full booking details including customer, vehicle, and services
- **Time:** Based on selected slot
- **Attendees:** Customer email
- **Reminders:** 1 day before (email) + 1 hour before (popup)
- **Color:** Yellow (#5)

## Scripts

### Initial Setup

```bash
# Run migration
npx prisma migrate dev

# Seed slots for next 60 days
npm run db:seed-slots
```

### Seed Slots Script

The `prisma/seed-slots.ts` script:

1. Creates default slot configuration
2. Generates slots for next 60 days
3. Respects working days (Mon-Sat by default)
4. Creates 4 time slots per day:
   - 08:00 - 10:00
   - 10:00 - 12:00
   - 13:00 - 15:00
   - 15:00 - 17:00
5. Adds example closed days

**Configuration:**
```typescript
{
  slotDurationMinutes: 120, // 2 hours
  slotStartTime: '08:00',
  slotEndTime: '17:00',
  workingDays: [1,2,3,4,5,6], // Mon-Sat
  defaultCapacity: 1,
  minLeadTimeDays: 1,
  maxBookingDays: 60,
}
```

## Booking Status Workflow

```
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
                  ↓
              CANCELLED
                  ↓
              NO_SHOW
```

## Capacity Management

- Each slot has a `maxCapacity` (default: 1)
- `currentBookings` tracks actual bookings
- `isAvailable` auto-updates when capacity is reached
- Slots become unavailable when `currentBookings >= maxCapacity`

## Future Enhancements

### Admin Controls (Planned)

1. **Slot Configuration UI:**
   - Adjust working hours
   - Change slot duration (2hr/4hr slots)
   - Set capacity per slot
   - Configure lead time

2. **Closed Days Management:**
   - Add specific closure dates
   - Set recurring closures
   - Holiday calendar integration

3. **Booking Management:**
   - View all bookings
   - Cancel/reschedule
   - Update status
   - Send notifications

4. **Calendar Sync:**
   - Two-way sync with Google Calendar
   - Handle external changes
   - Conflict resolution

## Environment Variables

```bash
# Required for Google Calendar integration
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./electric-rhino-473503-g0-4ee3284c26d4.json
GOOGLE_CALENDAR_ID=primary

# Database
DATABASE_URL=postgresql://...
```

## Usage Example

### Creating a Booking

```typescript
const response = await fetch('/api/bookings/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      contactNumber: '07123456789'
    },
    vehicle: {
      vrm: 'ABC123',
      make: 'Ford',
      model: 'Focus',
      engineSize: '1501cc-2000cc',
      fuelType: 'Petrol'
    },
    slot: {
      date: new Date('2025-10-15'),
      timeSlot: '09:00 - 11:00',
      startTime: '09:00',
      endTime: '11:00'
    },
    services: servicesData,
    isBlueLightCardHolder: false
  })
});

const result = await response.json();
console.log(result.bookingReference); // IGN-20251015-001
```

### Fetching Available Slots

```typescript
const response = await fetch('/api/slots/available?days=30');
const { dates } = await response.json();

dates.forEach(({ date, slots }) => {
  console.log(`${date}: ${slots.length} slots available`);
});
```

## Error Handling

- **Slot Not Available:** Returns 400 if slot doesn't exist or is closed
- **Slot Fully Booked:** Returns 400 if capacity exceeded
- **Validation Errors:** Returns 400 with detailed error messages
- **Calendar Sync Failure:** Booking still succeeds, error logged
- **Transaction Failures:** Automatic rollback ensures data consistency

## Performance Considerations

- Indexes on frequently queried fields (date, status, email)
- Efficient slot availability calculation
- Transaction isolation for booking creation
- Pagination for large booking lists (future)

## Testing

Test scenarios to verify:

1. ✅ Slot availability respects lead time
2. ✅ Closed days are excluded
3. ✅ Capacity limits enforced
4. ✅ Booking reference uniqueness
5. ✅ Transaction atomicity
6. ✅ Google Calendar event creation
7. ✅ Service data structure preservation
8. ✅ Customer deduplication by email

## Support

For issues or questions:
- Check Prisma Studio: `npx prisma studio`
- View database logs
- Check Google Calendar sync status
- Verify environment variables
