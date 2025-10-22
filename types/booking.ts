// Service Selection Types
export interface SelectedMotService {
  type: 'MOT_CLASS_4' | 'MOT_CLASS_7';
  price: number;
  originalPrice?: number;
  discount?: number;
  leadTime?: number;
}

export interface SelectedServiceType {
  type: 'INTERIM' | 'FULL' | 'MAJOR' | 'OIL_CHANGE';
  engineSize: string; // e.g., "1501cc-2000cc"
  price: number;
  oilQuantity?: number;
  parts?: {
    oilFilter?: { included: boolean; cost: number };
    airFilter?: { included: boolean; cost: number };
    pollenFilter?: { included: boolean; cost: number };
  };
  labourCost?: number;
  partsCost?: number;
}

export interface SelectedDeliveryOption {
  name: string;
  price: number;
  maxDistance: number | 'N/A';
  leadTime?: number;
}

export interface SelectedCustomProduct {
  name: string;
  engineCategory: 'below2000cc' | 'above2000cc';
  price: number;
  description?: string;
}

export interface SelectedSinglePriceProduct {
  name: string;
  price: number;
  hadServiceDiscount?: boolean;
}

export interface SelectedRepairItem {
  product: string;
  partsType: 'OEM' | 'STANDARD';
  price: number;
  examplePrice?: number;
  leadTime?: number;
}

export interface SelectedVehicleSafetyCheck {
  name: 'Vehicle Safety Check';
  price: number;
  originalPrice?: number;
  wasFree?: boolean; // Blue Light Card discount
}

// Main Services Data Structure
export interface BookingServicesData {
  mot?: SelectedMotService;
  service?: SelectedServiceType;
  delivery?: SelectedDeliveryOption;
  customProducts?: SelectedCustomProduct[];
  singlePriceProducts?: SelectedSinglePriceProduct[];
  repairs?: SelectedRepairItem[];
  vehicleSafetyCheck?: SelectedVehicleSafetyCheck;

  // Summary
  subtotal: number;
  discounts: {
    blueLightCard?: number;
    bundleDiscounts?: number;
  };
  totalPrice: number;
}

// Customer Details
export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
}

// Booking Slot Details
export interface BookingSlotDetails {
  date: string;
  timeSlot: string; // e.g., "09:00 - 11:00"
  startTime: string;
  endTime: string;
}

// Complete Booking Request
export interface CreateBookingRequest {
  customer: CustomerDetails;
  vehicle: {
    vrm: string;
    make: string;
    model: string;
    engineSize?: string;
    fuelType?: string;
    vehicleClass?: string;
  };
  slot: BookingSlotDetails;
  services: BookingServicesData;
  notes?: string;
  isBlueLightCardHolder: boolean;
}

// Booking Response
export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  bookingReference?: string;
  googleCalendarEventId?: string;
  message: string;
  error?: string;
}

// Available Slots Response
export interface AvailableSlot {
  id: string;
  date: string; // YYYY-MM-DD
  displayTime: string;
  startTime: string;
  endTime: string;
  availableCapacity: number;
}

export interface AvailableDatesResponse {
  dates: {
    date: string;
    slots: AvailableSlot[];
  }[];
}

// Slot Configuration
export interface SlotConfig {
  slotDurationMinutes: number;
  slotStartTime: string;
  slotEndTime: string;
  workingDays: number[];
  defaultCapacity: number;
  minLeadTimeDays: number;
  maxBookingDays: number;
}
