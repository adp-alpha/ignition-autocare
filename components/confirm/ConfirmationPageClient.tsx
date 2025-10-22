"use client";

import IgnitionImage from "@/assets/Ignition-auto-care.png";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BookingServiceMapper } from "@/lib/booking-service-mapper";
import { useBooking } from "@/lib/context/BookingContext";
import { AvailableSlot, CreateBookingRequest } from "@/types/booking";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import BookingSummary from "./BookingSummary";
const ConfirmationPageClient = () => {
  const {
    vehicleData,
    selectedServices,
    displayPrices,
    totalPrice,
    isBlueLightCardHolder,
    toggleBlueLightCard,
  } = useBooking();

  // --- START: Date and Time Availability Logic ---

  const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
  // State for available dates from API
  const [availableDates, setAvailableDates] = useState<Map<string, AvailableSlot[]>>(new Map());
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotError, setSlotError] = useState<string | null>(null);

  // Fetch available slots from API
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        setLoadingSlots(true);
        setSlotError(null);

        const response = await fetch('/api/slots/available?days=60');
        if (!response.ok) {
          throw new Error('Failed to fetch available slots');
        }

        const data = await response.json();

        // Convert to Map for efficient lookup
        const datesMap = new Map<string, AvailableSlot[]>();
        data.dates.forEach((dateData: { date: string; slots: AvailableSlot[] }) => {
          datesMap.set(dateData.date, dateData.slots);
        });

        setAvailableDates(datesMap);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setSlotError('Unable to load available slots. Please try again.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, []);

  // Find the earliest available date from the data
  const earliestAvailableDate = useMemo(() => {
    if (availableDates.size > 0) {
      const dates = Array.from(availableDates.keys()).sort();
      return new Date(dates[0]);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }, [availableDates]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | undefined>();

  // Set initial date once slots are loaded
  useEffect(() => {
    if (!selectedDate && availableDates.size > 0) {
      setSelectedDate(earliestAvailableDate);
    }
  }, [availableDates, earliestAvailableDate, selectedDate]);

  // Find available time slots for the selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split("T")[0];
    return availableDates.get(dateString) || [];
  }, [selectedDate, availableDates]);

  // Reset time slot if the selected date changes
  useEffect(() => {
    if (selectedSlot && selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const slots = availableDates.get(dateString) || [];
      const isSlotStillAvailable = slots.some(
        (slot) => slot.id === selectedSlot.id
      );
      if (!isSlotStillAvailable) {
        setSelectedSlot(undefined);
      }
    }
  }, [selectedDate, selectedSlot, availableDates]);

  // --- END: Date and Time Availability Logic ---

  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });
  const [notes, setNotes] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name in customerDetails) {
      setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    } else if (name === "notes") {
      setNotes(value);
    }
  };

  const isFormValid = () => {
    return (
      selectedDate &&
      selectedSlot &&
      customerDetails.firstName &&
      customerDetails.lastName &&
      customerDetails.email &&
      customerDetails.contactNumber &&
      agreeToTerms
    );
  };

  const handleConfirmBooking = async () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields and agree to the terms.");
      return;
    }

    if (!vehicleData || !displayPrices || !selectedSlot) {
      alert("Missing required booking information.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map services to structured data
      const servicesData = BookingServiceMapper.mapContextToServicesData(
        selectedServices,
        displayPrices,
        isBlueLightCardHolder,
        totalPrice
      );

      // Create booking request
      const bookingRequest: CreateBookingRequest = {
        customer: customerDetails,
        vehicle: {
          vrm: vehicleData.Results.VehicleDetails.VehicleIdentification.Vrm,
          make: vehicleData.Results.VehicleDetails.VehicleIdentification.DvlaMake,
          model: vehicleData.Results.VehicleDetails.VehicleIdentification.DvlaModel,
          engineSize: vehicleData.Results.VehicleDetails.DvlaTechnicalDetails?.EngineCapacityCc
            ? `${vehicleData.Results.VehicleDetails.DvlaTechnicalDetails.EngineCapacityCc}cc`
            : vehicleData.Results.ModelDetails?.Powertrain?.IceDetails?.EngineCapacityCc
            ? `${vehicleData.Results.ModelDetails.Powertrain.IceDetails.EngineCapacityCc}cc`
            : undefined,
          fuelType: vehicleData.Results.ModelDetails?.Powertrain?.FuelType || undefined,
          vehicleClass: vehicleData.Results.ModelDetails?.ModelClassification?.VehicleClass || undefined,
        },
        slot: {
          date:  formatDateToString(selectedDate!),
          timeSlot: selectedSlot.displayTime,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
        services: servicesData,
        notes: notes || undefined,
        isBlueLightCardHolder,
      };

      console.log("--- BOOKING REQUEST ---");
      console.log(JSON.stringify(bookingRequest, null, 2));

      // Send to API
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create booking');
      }

      console.log("--- BOOKING CONFIRMED ---");
      console.log(result);

      // Show success message
      alert(
        `Booking Confirmed!\n\nBooking Reference: ${result.bookingReference}\n\nYou will receive a confirmation email shortly.`
      );

      // Optionally redirect to a success page or clear the form
      // window.location.href = `/booking-success?ref=${result.bookingReference}`;

    } catch (error) {
      console.error('Error creating booking:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      alert(`Booking Failed: ${error instanceof Error ? error.message : 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vehicleData) {
    return (
      <div className="container mx-auto py-8 px-4 lg:px-52">
        <div className="text-center">
          <p className="text-lg">Loading booking details...</p>
          <p className="text-sm text-gray-500 mt-2">
            If you have landed here directly, please start a booking from the services page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 lg:px-52">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left and Center Columns for form content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Vehicle Header */}
          <div className="flex items-center gap-2">
            <Image alt="Ignition Autocare" src={IgnitionImage} width={120} />
            <div>
              <p className="text-gray-500">YOUR BOOKING WITH</p>
              <h1 className="text-3xl font-bold">Ignition Autocare</h1>
              <div className="flex items-center space-x-2 mt-2">
                <span className="bg-yellow-400 text-black font-bold py-1 px-2 rounded">
                  {vehicleData.Results.VehicleDetails.VehicleIdentification.Vrm}
                </span>
                <span className="text-lg">
                  {
                    vehicleData.Results.VehicleDetails.VehicleIdentification
                      .DvlaMake
                  }{" "}
                  {
                    vehicleData.Results.VehicleDetails.VehicleIdentification
                      .DvlaModel
                  }
                </span>
              </div>
            </div>
          </div>

          {/* 1. Choose date */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. Choose date & time</h2>

            {loadingSlots && (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Loading available slots...</p>
              </div>
            )}

            {slotError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                <p>{slotError}</p>
              </div>
            )}

            {!loadingSlots && !slotError && availableDates.size > 0 && (
              <>
                <p className="text-md text-brand-dark-blue font-semibold">
                  The earliest available date is{" "}
                  {earliestAvailableDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  .
                </p>
                <div className="grid grid-cols-1 gap-8">
                  <div className="w-full flex gap-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date: Date) => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        if (date < yesterday) return true;

                        const dateString = date.toISOString().split("T")[0];
                        return !availableDates.has(dateString);
                      }}
                      className="rounded-md border w-[60%]"
                    />
                    {selectedDate && availableTimeSlots.length > 0 && (
                      <div>
                        <Label>Choose an available time slot</Label>
                        <ToggleGroup
                          type="single"
                          className="mt-2 w-full grid grid-cols-2 gap-2"
                          value={selectedSlot?.id}
                          onValueChange={(value: string) => {
                            const slot = availableTimeSlots.find(s => s.id === value);
                            setSelectedSlot(slot);
                          }}
                        >
                          {availableTimeSlots.map((slot) => (
                            <ToggleGroupItem
                              key={slot.id}
                              value={slot.id}
                              aria-label={`Toggle ${slot.displayTime}`}
                              disabled={slot.availableCapacity === 0}
                              className="w-full"
                            >
                              {slot.displayTime}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                        <p className="text-sm text-gray-500 mt-2">
                          Garages will confirm the exact time within your chosen
                          slot.
                        </p>
                      </div>
                    )}
                    {selectedDate && availableTimeSlots.length === 0 && (
                      <div className="text-gray-500">
                        <p>No available slots for this date.</p>
                        <p className="text-sm">Please select another date.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!loadingSlots && !slotError && availableDates.size === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                <p>No available slots found. Please contact the garage directly.</p>
              </div>
            )}
          </div>

          {/* 2. Your details */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Your details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={customerDetails.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={customerDetails.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={customerDetails.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* 3. Notes for garage */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              4. Notes for garage (Optional)
            </h2>
            <Textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={handleInputChange}
              placeholder="Let the garage know about any specific issues..."
            />
          </div>

          {/* 4. Payment and Confirmation */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
              <h3 className="font-bold">No pre-payment required</h3>
              <p>Pay nothing until the date of your booking!</p>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                <p className="font-semibold">Error creating booking:</p>
                <p>{submitError}</p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) =>
                  setAgreeToTerms(checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <a href="#" className="underline">
                  terms and conditions
                </a>{" "}
                of this booking
              </label>
            </div>
            <Button
              onClick={handleConfirmBooking}
              disabled={!isFormValid() || isSubmitting || loadingSlots}
              className="w-full lg:w-auto"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </div>

        {/* Right Column for Booking Summary */}
        <div className="lg:col-span-1">
          <BookingSummary />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPageClient;
