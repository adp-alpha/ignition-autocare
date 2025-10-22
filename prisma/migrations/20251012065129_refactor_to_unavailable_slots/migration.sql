/*
  Warnings:

  - You are about to drop the column `slotId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `defaultCapacity` on the `slot_configurations` table. All the data in the column will be lost.
  - You are about to drop the `booking_slots` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookingDate` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayTime` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new columns to bookings table (nullable first)
ALTER TABLE "bookings" 
ADD COLUMN "bookingDate" DATE,
ADD COLUMN "displayTime" TEXT,
ADD COLUMN "endTime" TEXT,
ADD COLUMN "startTime" TEXT;

-- Step 2: Migrate existing booking data from booking_slots to bookings
UPDATE "bookings" b
SET 
  "bookingDate" = bs."date",
  "displayTime" = bs."displayTime",
  "endTime" = bs."endTime",
  "startTime" = bs."startTime"
FROM "booking_slots" bs
WHERE b."slotId" = bs."id";

-- Step 3: Make columns required
ALTER TABLE "bookings" 
ALTER COLUMN "bookingDate" SET NOT NULL,
ALTER COLUMN "displayTime" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL;

-- Step 4: Drop foreign key and slotId column
ALTER TABLE "public"."bookings" DROP CONSTRAINT "bookings_slotId_fkey";

-- DropIndex
DROP INDEX "public"."bookings_slotId_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "slotId";

-- AlterTable
ALTER TABLE "slot_configurations" DROP COLUMN "defaultCapacity",
ADD COLUMN     "slotsPerTimeSlot" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "public"."booking_slots";

-- CreateTable
CREATE TABLE "unavailable_slots" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unavailable_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "unavailable_slots_date_idx" ON "unavailable_slots"("date");

-- CreateIndex
CREATE UNIQUE INDEX "unavailable_slots_date_startTime_endTime_key" ON "unavailable_slots"("date", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "bookings_bookingDate_startTime_endTime_idx" ON "bookings"("bookingDate", "startTime", "endTime");
