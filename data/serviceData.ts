export const vehicleDetails = {
  name: "Volkswagen PASSAT A-TRACK TDI BMT 4MOT SA 1968cc",
  vrm: "GM16FFZ",
  fuelType: "DIESEL",
  transmission: "Semi Auto",
  motDueDate: "18/06/26",
  registrationDate: "19/06/16",
};

export const garageDetails = {
  name: "Ignition Auto Care",
  reviews: 73,
  rating: 4.8,
  nextAvailable: "Tomorrow",
  about:
    "We are a brand-new state of the art workshop using the latest dealership specification equipment to service and repair your vehicle.\n\nOur aim is to give you a prestige dealership experience at a fraction of the cost. We are also Wheel Alignment Specilists using the latest Hunter Hawkeye Elite TD.",
  banners: ["BookMyGarage Top Rated Garage 2023", "Payment Assist"],
  address: {
    line1: "Unit 3, Brookside Business Park",
    line2: "Brookside Avenue, Rustington",
    town: "Littlehampton",
    county: "West Sussex",
    postcode: "BN16 3LF",
  },
  openingHours: {
    monday: "8:00 AM - 5:30 PM",
    tuesday: "8:00 AM - 5:30 PM",
    wednesday: "8:00 AM - 5:30 PM",
    thursday: "8:00 AM - 5:30 PM",
    friday: "8:00 AM - 5:30 PM",
    saturday: "8:00 AM - 1:00 PM",
    sunday: "Closed",
  },
};

export const reviews = {
  summary:
    "Customers consistently praise Ignition Auto Care for their exceptional communication, professionalism, and high-quality work. Many highlight the friendly and helpful staff who provide clear explanations and updates. The garage is noted for its efficiency, fair pricing, and clean, modern facilities, making it a highly recommended choice for vehicle servicing and repairs.",
  // Add individual reviews if needed for the slider
};

export const servicePricing = {
  mot: {
    price: 19.99,
    originalPrice: 54.85,
    discount: 63.6,
    description: "Book your MOT the same time as a service",
  },
  interim: {
    price: 150.6,
    description: "25 item - Oil Service",
  },
  full: {
    price: 179.4,
    description: "40 item - Yearly Service",
  },
  major: {
    price: 246.5,
    description: "60 item - Bi-Yearly Service",
  },
  oilAndFilter: {
    price: 133.32,
    description: "Specialist Oil", 
  },
  additionalWork: {
    vehicleSafetyCheck: { price: 19.99, description: "Free for Blue Light Card Holders (Select on Checkout page)" },
    dpfCleaning: { price: 170.0 },
    adBlue: { price: 20.0 },
    brakeFluidReplacement: { price: 59.0 },
    coolantChange: { price: 60.0 },
    diagnosticCheck: { price: 50.0 },
    frontWheelAlignment: { price: 59.0 },
    summerCheck: { price: 20.0, description: "Drive with confidence this summer" },
    airConditioningReGas: { price: 99.0, description: "R1234YF" },
  },
  repairs: {
    frontBrakesDiscsAndPads: { price: 346.31 },
    frontBrakesPads: { price: 144.76 },
    rearBrakesDiscsAndPads: { price: "Reveal Price" },
    rearBrakesPads: { price: "Reveal Price" },
    generalRepair: { price: "Get an estimate" },
  },
  addons: {
    customerDropOff: { price: "FREE", description: "Within a 5 mile radius." },
  },
};

// NEW: Added service descriptions and metadata for the UI
export interface ServiceUIDetails {
  description?: string;
  subtitle?: string; // Added for subtitles like "25 item - Oil Service"
  hasInfo?: boolean;
  hasIcon?: boolean;
}

export const serviceUIText: { [key: string]: ServiceUIDetails } = {
  mot: {
    description: "Book your MOT the same time as a service",
  },
  interimService: {
    subtitle: "25 item - Oil Service",
    hasInfo: true,
  },
  fullService: {
    subtitle: "40 item - Yearly Service",
    hasInfo: true,
  },
  majorService: {
    subtitle: "60 item - Bi-Yearly Service",
    hasInfo: true,
  },
  "oil-filter-change": {
    hasIcon: true,
  },
  "vehicle-safety-check": {
    description: "Free for Blue Light Card holders (Select on Checkout page)",
    hasInfo: true,
  },
  "def-cleaning": { hasIcon: true },
  adblue: { hasIcon: true },
  "brake-fluid-replacement": { hasIcon: true },
  "coolant-change": { hasIcon: true },
  "diagnostic-check": { hasIcon: true },
  "front-wheel-alignment": { hasIcon: true },
  "winter-health-check": { hasInfo: true },
  "ac-re-gas-r1234yf": { hasIcon: true },
  "clutch-replacement": { hasIcon: true },
  "front-brakes-discs-pads": { hasIcon: true },
  "front-brakes-pads": { hasIcon: true },
  "rear-brakes-discs-pads": { hasIcon: true },
  "rear-brakes-pads": { hasIcon: true },
};
