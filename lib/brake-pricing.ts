/**
 * Brake Pricing Utility
 * Provides functions to get brake replacement pricing based on vehicle make
 */

import adminData from "@/data/adminData.json";

export type BrakeServiceType =
  | "frontPads"
  | "rearPads"
  | "frontDiscsAndPads"
  | "rearDiscsAndPads";

export interface BrakePriceResult {
  price: number | null;
  make: string;
  serviceType: BrakeServiceType;
  found: boolean;
  fallbackPrice?: number;
}

/**
 * Get brake service pricing for a specific vehicle make
 */
export function getBrakePricing(
  make: string,
  serviceType: BrakeServiceType
): BrakePriceResult {
  const brakePricing = adminData.brakePricing;

  // Normalize make name (handle common variations)
  const normalizedMake = normalizeMakeName(make);

  let price: number | null = null;
  let found = false;

  // Get price based on service type
  switch (serviceType) {
    case "frontPads":
      price =
        (brakePricing.frontBrakePads.prices as any)[normalizedMake] || null;
      break;
    case "rearPads":
      price =
        (brakePricing.rearBrakePads.prices as any)[normalizedMake] || null;
      break;
    case "frontDiscsAndPads":
      price =
        (brakePricing.frontBrakesDiscAndPad.prices as any)[normalizedMake] ||
        null;
      break;
    case "rearDiscsAndPads":
      price =
        (brakePricing.rearBrakesDiscAndPad.prices as any)[normalizedMake] ||
        null;
      break;
  }

  found = price !== null;

  // If no specific price found, use fallback from commonRepairs
  let fallbackPrice: number | undefined;
  if (!found) {
    fallbackPrice = getFallbackPrice(serviceType);
  }

  return {
    price,
    make: normalizedMake,
    serviceType,
    found,
    fallbackPrice,
  };
}

/**
 * Get all available makes for brake pricing
 */
export function getAvailableMakes(): string[] {
  const brakePricing = adminData.brakePricing;

  // Get unique makes from all brake service types
  const makes = new Set<string>();

  Object.keys(brakePricing.frontBrakePads.prices).forEach((make) =>
    makes.add(make)
  );
  Object.keys(brakePricing.rearBrakePads.prices).forEach((make) =>
    makes.add(make)
  );
  Object.keys(brakePricing.frontBrakesDiscAndPad.prices).forEach((make) =>
    makes.add(make)
  );
  Object.keys(brakePricing.rearBrakesDiscAndPad.prices).forEach((make) =>
    makes.add(make)
  );

  return Array.from(makes).sort();
}

/**
 * Get price range for a specific brake service type
 */
export function getPriceRange(serviceType: BrakeServiceType): {
  min: number;
  max: number;
  average: number;
} {
  const brakePricing = adminData.brakePricing;
  let prices: number[] = [];

  switch (serviceType) {
    case "frontPads":
      prices = Object.values(brakePricing.frontBrakePads.prices);
      break;
    case "rearPads":
      prices = Object.values(brakePricing.rearBrakePads.prices);
      break;
    case "frontDiscsAndPads":
      prices = Object.values(brakePricing.frontBrakesDiscAndPad.prices);
      break;
    case "rearDiscsAndPads":
      prices = Object.values(brakePricing.rearBrakesDiscAndPad.prices);
      break;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  return {
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    average: Math.round(average * 100) / 100,
  };
}

/**
 * Get brake pricing for multiple service types for a specific make
 */
export function getAllBrakePricingForMake(make: string): {
  frontPads: BrakePriceResult;
  rearPads: BrakePriceResult;
  frontDiscsAndPads: BrakePriceResult;
  rearDiscsAndPads: BrakePriceResult;
} {
  return {
    frontPads: getBrakePricing(make, "frontPads"),
    rearPads: getBrakePricing(make, "rearPads"),
    frontDiscsAndPads: getBrakePricing(make, "frontDiscsAndPads"),
    rearDiscsAndPads: getBrakePricing(make, "rearDiscsAndPads"),
  };
}

/**
 * Normalize vehicle make name to match pricing data
 */
function normalizeMakeName(make: string): string {
  const normalized = make.trim();

  // Handle common variations
  const makeMap: Record<string, string> = {
    MERCEDES: "Mercedes-Benz",
    "MERCEDES BENZ": "Mercedes-Benz",
    "MERCEDES-BENZ": "Mercedes-Benz",
    LANDROVER: "Land Rover",
    "LAND-ROVER": "Land Rover",
    VOLKSWAGON: "Volkswagen",
    VW: "Volkswagen",
    "MINI COOPER": "MINI",
    "BMW MINI": "MINI",
  };

  const upperMake = normalized.toUpperCase();

  // Check if we have a mapping for this make
  for (const [key, value] of Object.entries(makeMap)) {
    if (upperMake === key) {
      return value;
    }
  }

  // Return with proper capitalization
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

/**
 * Get fallback pricing from commonRepairs section
 */
function getFallbackPrice(serviceType: BrakeServiceType): number | undefined {
  const commonRepairs = adminData.commonRepairs.repairs;

  const serviceMap: Record<BrakeServiceType, string> = {
    frontPads: "Front Brakes (Pads)",
    rearPads: "Rear Brakes (Pads)",
    frontDiscsAndPads: "Front Brakes (Discs & Pads)",
    rearDiscsAndPads: "Rear Brakes (Discs & Pads)",
  };

  const serviceName = serviceMap[serviceType];
  const repair = commonRepairs.find((r) => r.product === serviceName);

  return repair?.examplePrice || undefined;
}

/**
 * Format price for display
 */
export function formatBrakePrice(price: number): string {
  return `£${price.toFixed(2)}`;
}

/**
 * Get brake service display name
 */
export function getBrakeServiceDisplayName(
  serviceType: BrakeServiceType
): string {
  const displayNames: Record<BrakeServiceType, string> = {
    frontPads: "Front Brake Pads",
    rearPads: "Rear Brake Pads",
    frontDiscsAndPads: "Front Brakes (Discs & Pads)",
    rearDiscsAndPads: "Rear Brakes (Discs & Pads)",
  };

  return displayNames[serviceType];
}

/**
 * Get warning signs for brake replacement
 */
export function getBrakeWarningSigns(): string[] {
  return adminData.brakePricing.notes.warningSigns;
}

/**
 * Get brake pricing recommendation text
 */
export function getBrakeRecommendation(): string {
  return adminData.brakePricing.notes.recommendation;
}
