import { AdminData } from "../types/adminData";

// --- UPDATED TYPES ---

/**
 * Defines the specific string literals used for engine size ranges.
 */
export type EngineSize =
  | "0cc-1200cc"
  | "1201cc-1500cc"
  | "1501cc-2000cc"
  | "2001cc-2400cc"
  | "2401cc-3500cc"
  | "3501cc or above";

/**
 * Defines the specific conditions under which a discount can be applied.
 */
export type DiscountCondition =
  | "WITH_INTERIM_SERVICE"
  | "WITH_FULL_SERVICE"
  | "WITH_MAJOR_SERVICE"
  | "WITH_ANY_SERVICE"
  | "WITH_MOT";

/**
 * Represents a discount applicable to a service or product.
 */
export interface Discount {
  condition: DiscountCondition;
  discountedPrice: number;
}

/**
 * Represents a single billable item, which can be a service, product, or repair.
 */
export interface ServiceItem {
  id: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  originalPrice?: number;
  discount?: number;
  discounts: Discount[];
  type: "service" | "product" | "repair";
  priceType?: "EXAMPLE" | "REVEAL" | "ESTIMATE";
}

/**
 * The final structured data containing all calculated prices for the frontend.
 */
export interface FormattedPricingData {
  motAndServicing: ServiceItem[];
  additionalWork: ServiceItem[];
  repairs: ServiceItem[];
  addons: ServiceItem[];
  isFreeVehicleSafetyCheckEnabled: boolean;
}


// --- PRICE CALCULATION ENGINE ---

/**
 * Maps an engine capacity (in cc) to the corresponding engine size range key.
 * This is used to look up prices in the admin data structure.
 * 
 * @param cc - Engine capacity in cubic centimeters
 * @returns The engine size range key
 */
export function getEngineRangeKey(cc: number): EngineSize {
  if (cc <= 1200) return "0cc-1200cc";
  if (cc <= 1500) return "1201cc-1500cc";
  if (cc <= 2000) return "1501cc-2000cc";
  if (cc <= 2400) return "2001cc-2400cc";
  if (cc <= 3500) return "2401cc-3500cc";
  return "3501cc or above";
}

/**
 * Calculates all prices for services, products, repairs, and add-ons based on
 * the vehicle's engine size and current admin configuration.
 * 
 * This function is the core pricing engine that:
 * 1. Determines the correct engine size range
 * 2. Retrieves all calculated service prices (from ServicingForm)
 * 3. Maps product prices to the correct engine size
 * 4. Applies any conditional discounts
 * 5. Returns structured pricing data for the frontend
 * 
 * @param engineSizeCC - The vehicle's engine capacity in cc
 * @param adminData - The complete admin configuration data
 * @returns Formatted pricing data organized by category
 */
export function calculatePrices(engineSizeCC: number, adminData: AdminData): FormattedPricingData {
  // Determine the engine size range key for this vehicle
  const engineRangeKey = getEngineRangeKey(engineSizeCC);

  // --- MOT & SERVICING SECTION ---
  const motAndServicing: ServiceItem[] = [];

  // MOT Class 4 (if enabled)
  if (adminData.motClass4.enabled) {
    const discounts: Discount[] = [];
    
    // Build array of applicable discounts for MOT
    if (adminData.motClass4.discounts.priceWithInterimService.enabled) {
      discounts.push({ 
        condition: 'WITH_INTERIM_SERVICE', 
        discountedPrice: adminData.motClass4.discounts.priceWithInterimService.price 
      });
    }
    if (adminData.motClass4.discounts.priceWithFullService.enabled) {
      discounts.push({ 
        condition: 'WITH_FULL_SERVICE', 
        discountedPrice: adminData.motClass4.discounts.priceWithFullService.price 
      });
    }
    if (adminData.motClass4.discounts.priceWithMajorService.enabled) {
      discounts.push({ 
        condition: 'WITH_MAJOR_SERVICE', 
        discountedPrice: adminData.motClass4.discounts.priceWithMajorService.price 
      });
    }

    motAndServicing.push({
      id: 'mot',
      name: 'MOT (Class 4)',
      basePrice: adminData.motClass4.standardPrice,
      finalPrice: adminData.motClass4.standardPrice,
      discounts,
      type: 'service',
    });
  }

  // Get pre-calculated service prices for the specific engine range
  // These prices are calculated in ServicingForm using:
  // (Labour Rate × Labour Time) + Parts + (Oil Qty × Oil Price) + VAT
  const servicePrices = adminData.servicePricing.prices[engineRangeKey];

  // Oil Change Service
  motAndServicing.push({
    id: 'oilChange',
    name: 'Oil Change',
    basePrice: servicePrices.oilChange,
    finalPrice: servicePrices.oilChange,
    discounts: [],
    type: 'service',
  });

  // Interim Service
  motAndServicing.push({
    id: 'interimService',
    name: 'Interim Service',
    basePrice: servicePrices.interim,
    finalPrice: servicePrices.interim,
    discounts: [],
    type: 'service',
  });

  // Full Service
  motAndServicing.push({
    id: 'fullService',
    name: 'Full Service',
    basePrice: servicePrices.full,
    finalPrice: servicePrices.full,
    discounts: [],
    type: 'service',
  });

  // Major Service
  motAndServicing.push({
    id: 'majorService',
    name: 'Major Service',
    basePrice: servicePrices.major,
    finalPrice: servicePrices.major,
    discounts: [],
    type: 'service',
  });

  // --- ADDITIONAL WORK SECTION ---
  const additionalWork: ServiceItem[] = [];

  // Custom Products (engine-size-based: below/above 2000cc)
  // These are products with special pricing for different engine sizes
  adminData.customProducts.forEach(product => {
    if (product.enabled) {
      const price = engineSizeCC <= 2000 ? product.below2000ccPrice : product.above2000ccPrice;
      
      additionalWork.push({
        id: product.name.toLowerCase().replace(/\s/g, '-'),
        name: product.name,
        basePrice: price,
        finalPrice: price,
        discounts: [],
        type: 'product',
      });
    }
  });

  // Standard Products (3-tier engine-size-based pricing)
  adminData.products.forEach(product => {
    if (product.enabled) {
      // Map engine size to the correct product price tier
      let price: number;
      if (engineSizeCC <= 1500) {
        price = product['0cc-1500cc'];
      } else if (engineSizeCC <= 2400) {
        price = product['1501cc-2400cc'];
      } else {
        price = product['2401cc or above'];
      }
      
      additionalWork.push({
        id: product.name.toLowerCase().replace(/\s/g, '-'),
        name: product.name,
        basePrice: price,
        finalPrice: price,
        discounts: [],
        type: 'product',
      });
    }
  });

  // Single Price Products (flat pricing with optional service discounts)
  adminData.singlePriceProducts.forEach(product => {
    if (product.enabled) {
      const discounts: Discount[] = [];
      
      // Add discount if product has a discounted price when purchased with any service
      if (product.enableServicePrice && product.priceWithService) {
        discounts.push({ 
          condition: 'WITH_ANY_SERVICE', 
          discountedPrice: product.priceWithService 
        });
      }
      
      additionalWork.push({
        id: product.name.toLowerCase().replace(/\s/g, '-'),
        name: product.name,
        basePrice: product.defaultPrice,
        finalPrice: product.defaultPrice,
        discounts,
        type: 'product',
      });
    }
  });

  // Vehicle Safety Check (with multiple discount conditions)
  if (adminData.vehicleSafetyCheck.isVehicleSafetyCheckEnabled) {
    const discounts: Discount[] = [];
    
    // Build array of all applicable discounts for safety check
    if (adminData.vehicleSafetyCheck.priceWithMOT.enabled) {
      discounts.push({ 
        condition: 'WITH_MOT', 
        discountedPrice: adminData.vehicleSafetyCheck.priceWithMOT.price 
      });
    }
    if (adminData.vehicleSafetyCheck.priceWithInterimService.enabled) {
      discounts.push({ 
        condition: 'WITH_INTERIM_SERVICE', 
        discountedPrice: adminData.vehicleSafetyCheck.priceWithInterimService.price 
      });
    }
    if (adminData.vehicleSafetyCheck.priceWithFullService.enabled) {
      discounts.push({ 
        condition: 'WITH_FULL_SERVICE', 
        discountedPrice: adminData.vehicleSafetyCheck.priceWithFullService.price 
      });
    }
    if (adminData.vehicleSafetyCheck.priceWithMajorService.enabled) {
      discounts.push({ 
        condition: 'WITH_MAJOR_SERVICE', 
        discountedPrice: adminData.vehicleSafetyCheck.priceWithMajorService.price 
      });
    }

    additionalWork.push({
      id: 'vehicle-safety-check',
      name: 'Vehicle Safety Check',
      basePrice: adminData.vehicleSafetyCheck.price,
      finalPrice: adminData.vehicleSafetyCheck.price,
      discounts,
      type: 'product',
    });
  }

  // --- REPAIRS SECTION ---
  const repairs: ServiceItem[] = [];

  // Common Repairs configured in admin
  adminData.commonRepairs.repairs.forEach(repair => {
    if (repair.enabled) {
      repairs.push({
        id: repair.product.toLowerCase().replace(/\s/g, '-'),
        name: repair.product,
        basePrice: repair.examplePrice,
        finalPrice: repair.examplePrice,
        discounts: [],
        type: 'repair',
        priceType: repair.priceType, // EXAMPLE or REVEAL
      });
    }
  });

  // --- ADD-ONS SECTION ---
  const addons: ServiceItem[] = [];

  // Delivery Options (Loan Car, Collect & Deliver, Customer Drop-off)
  adminData.deliveryOptions.forEach(option => {
    if (option.enabled) {
      addons.push({
        id: option.name.toLowerCase().replace(/\s/g, '-'),
        name: option.name,
        basePrice: option.priceWithService,
        finalPrice: option.priceWithService,
        discounts: [],
        type: 'product',
      });
    }
  });

  // Return all formatted pricing data
  return {
    motAndServicing,
    additionalWork,
    repairs,
    addons,
    isFreeVehicleSafetyCheckEnabled: adminData.vehicleSafetyCheck.isFreeVehicleSafetyCheckEnabled,
  };
}
