-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "admin_data" (
    "id" TEXT NOT NULL,
    "defaultLeadTime" INTEGER NOT NULL DEFAULT 0,
    "motClass4" JSONB NOT NULL,
    "motClass7" JSONB NOT NULL,
    "deliveryOptions" JSONB NOT NULL,
    "customProducts" JSONB NOT NULL,
    "singlePriceProducts" JSONB NOT NULL,
    "products" JSONB NOT NULL,
    "vehicleSafetyCheck" JSONB NOT NULL,
    "servicePricing" JSONB NOT NULL,
    "servicingRates" JSONB NOT NULL,
    "offers" JSONB NOT NULL,
    "commonRepairs" JSONB NOT NULL,
    "offersAndExtras" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "vrm" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "engineSize" TEXT,
    "fuelType" TEXT,
    "vehicleClass" TEXT,
    "slotId" TEXT NOT NULL,
    "servicesData" JSONB NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "isBlueLightCardHolder" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "googleCalendarEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_slots" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "displayTime" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL DEFAULT 1,
    "currentBookings" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closed_days" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "dayOfWeek" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "closed_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_configurations" (
    "id" TEXT NOT NULL,
    "slotDurationMinutes" INTEGER NOT NULL DEFAULT 120,
    "slotStartTime" TEXT NOT NULL DEFAULT '08:00',
    "slotEndTime" TEXT NOT NULL DEFAULT '17:00',
    "workingDays" JSONB NOT NULL DEFAULT '[1,2,3,4,5]',
    "defaultCapacity" INTEGER NOT NULL DEFAULT 1,
    "minLeadTimeDays" INTEGER NOT NULL DEFAULT 1,
    "maxBookingDays" INTEGER NOT NULL DEFAULT 60,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slot_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingReference_key" ON "bookings"("bookingReference");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_googleCalendarEventId_key" ON "bookings"("googleCalendarEventId");

-- CreateIndex
CREATE INDEX "bookings_customerId_idx" ON "bookings"("customerId");

-- CreateIndex
CREATE INDEX "bookings_slotId_idx" ON "bookings"("slotId");

-- CreateIndex
CREATE INDEX "bookings_bookingReference_idx" ON "bookings"("bookingReference");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "booking_slots_date_isAvailable_idx" ON "booking_slots"("date", "isAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "booking_slots_date_startTime_endTime_key" ON "booking_slots"("date", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "closed_days_date_idx" ON "closed_days"("date");

-- CreateIndex
CREATE UNIQUE INDEX "closed_days_date_key" ON "closed_days"("date");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "booking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
