import * as z from "zod";

// Shared schemas
export const discountSchema = z.object({
  price: z.number().min(0, "Price must be non-negative"),
  enabled: z.boolean(),
});

export const motServiceSchema = z.object({
  enabled: z.boolean(),
  standardPrice: z.number().min(0, "Price must be non-negative"),
  leadTime: z.number().min(0, "Lead time must be non-negative"),
  leadTimeEnabled: z.boolean(),
  availability: z.array(z.string()),
  discounts: z.object({
    priceWithInterimService: discountSchema,
    priceWithFullService: discountSchema,
    priceWithMajorService: discountSchema,
  }),
});

export const deliveryOptionSchema = z.object({
  enabled: z.boolean(),
  name: z.string().min(1, "Name is required"),
  availability: z.array(z.string()),
  allowMOTs: z.boolean(),
  priceWithMOT: z.number().min(0, "Price must be non-negative"),
  priceWithService: z.number().min(0, "Price must be non-negative"),
  leadTime: z.number().min(0, "Lead time must be non-negative"),
  leadTimeEnabled: z.boolean(),
  maxDistance: z.union([z.number().min(0), z.string()]),
});

export const customProductSchema = z.object({
  enabled: z.boolean(),
  name: z.string().min(1, "Name is required"),
  extraDescription: z.string(),
  below2000ccPrice: z.number().min(0, "Price must be non-negative"),
  above2000ccPrice: z.number().min(0, "Price must be non-negative"),
  petrol: z.boolean(),
  diesel: z.boolean(),
  electric: z.boolean(),
});

export const singlePriceProductSchema = z.object({
  enabled: z.boolean(),
  name: z.string().min(1, "Name is required"),
  defaultPrice: z.number().min(0, "Price must be non-negative"),
  enableServicePrice: z.boolean(),
  priceWithService: z.number().min(0).nullable(),
});

export const productSchema = z.object({
  enabled: z.boolean(),
  name: z.string().min(1, "Name is required"),
  "0cc-1500cc": z.number().min(0, "Price must be non-negative"),
  "1501cc-2400cc": z.number().min(0, "Price must be non-negative"),
  "2401cc or above": z.number().min(0, "Price must be non-negative"),
});

export const vehicleSafetyCheckSchema = z.object({
  isVehicleSafetyCheckEnabled: z.boolean(),
  isFreeVehicleSafetyCheckEnabled: z.boolean(),
  price: z.number().min(0, "Price must be non-negative"),
  priceWithMOT: discountSchema,
  priceWithInterimService: discountSchema,
  priceWithFullService: discountSchema,
  priceWithMajorService: discountSchema,
});

export const servicePricingDetailSchema = z.object({
  oilChange: z.number().min(0, "Price must be non-negative"),
  interim: z.number().min(0, "Price must be non-negative"),
  full: z.number().min(0, "Price must be non-negative"),
  major: z.number().min(0, "Price must be non-negative"),
});

export const engineSizeSchema = z.enum([
  "0cc-1200cc",
  "1201cc-1500cc",
  "1501cc-2000cc",
  "2001cc-2400cc",
  "2401cc-3500cc",
  "3501cc or above",
]);

export const servicePricingSchema = z.object({
  prices: z.object({
    "0cc-1200cc": servicePricingDetailSchema,
    "1201cc-1500cc": servicePricingDetailSchema,
    "1501cc-2000cc": servicePricingDetailSchema,
    "2001cc-2400cc": servicePricingDetailSchema,
    "2401cc-3500cc": servicePricingDetailSchema,
    "3501cc or above": servicePricingDetailSchema,
  }),
  oilQty: z.record(engineSizeSchema, z.number().min(0)),
  partCosts: z.object({
    airFilter: z.record(engineSizeSchema, z.number().min(0)),
    pollenFilter: z.record(engineSizeSchema, z.number().min(0)),
    oilFilter: z.record(engineSizeSchema, z.number().min(0)),
  }),
  hourlyRates: z.object({
    oilChange: z.record(engineSizeSchema, z.number().min(0)),
    interim: z.record(engineSizeSchema, z.number().min(0)),
    full: z.record(engineSizeSchema, z.number().min(0)),
    major: z.record(engineSizeSchema, z.number().min(0)),
  }),
});

export const servicingRatesSchema = z.object({
  servicingLeadTime: z.number().min(0, "Lead time must be non-negative"),
  servicingLeadTimeEnabled: z.boolean(),
  serviceLabourRate: z.number().min(0, "Rate must be non-negative"),
  electricalVehicleLabourRate: z.number().min(0, "Rate must be non-negative"),
  standardOilPrice: z.number().min(0, "Price must be non-negative"),
  specialistOilPrice: z.number().min(0, "Price must be non-negative"),
});

export const offerSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  offerContent: z.string().min(1, "Offer content is required"),
  tooltipContent: z.string().min(1, "Tooltip content is required"),
});

export const commonRepairItemSchema = z.object({
  enabled: z.boolean(),
  product: z.string().min(1, "Product name is required"),
  oemPartsPriceModifier: z.number().min(0, "Modifier must be non-negative"),
  oemPartsModifierIsIncrease: z.boolean(),
  examplePrice: z.number().min(0, "Price must be non-negative"),
  leadTimeEnabled: z.boolean(),
  leadTime: z.number().min(0, "Lead time must be non-negative"),
  priceType: z.enum(['EXAMPLE', 'REVEAL']),
});

export const commonRepairsSchema = z.object({
  mechanicalLabourRate: z.number().min(0, "Rate must be non-negative"),
  repairs: z.array(commonRepairItemSchema),
});

export const offersAndExtrasSchema = z.object({
  manufacturerService: z.boolean(),
  monthlyRepaymentOptions: z.boolean(),
  servicePlanEligibilityCheck: z.boolean(),
  videoAuthorisation: z.boolean(),
});

// Main admin data schema
export const adminDataSchema = z.object({
  defaultLeadTime: z.number().min(0, "Lead time must be non-negative"),
  motClass4: motServiceSchema,
  motClass7: motServiceSchema,
  deliveryOptions: z.array(deliveryOptionSchema),
  customProducts: z.array(customProductSchema),
  singlePriceProducts: z.array(singlePriceProductSchema),
  products: z.array(productSchema),
  vehicleSafetyCheck: vehicleSafetyCheckSchema,
  servicePricing: servicePricingSchema,
  servicingRates: servicingRatesSchema,
  offers: z.array(offerSchema),
  commonRepairs: commonRepairsSchema,
  offersAndExtras: offersAndExtrasSchema,
});

// Type exports
export type AdminDataInput = z.infer<typeof adminDataSchema>;
export type MotService = z.infer<typeof motServiceSchema>;
export type DeliveryOption = z.infer<typeof deliveryOptionSchema>;
export type CustomProduct = z.infer<typeof customProductSchema>;
export type SinglePriceProduct = z.infer<typeof singlePriceProductSchema>;
export type Product = z.infer<typeof productSchema>;
export type VehicleSafetyCheck = z.infer<typeof vehicleSafetyCheckSchema>;
export type ServicePricing = z.infer<typeof servicePricingSchema>;
export type ServicingRates = z.infer<typeof servicingRatesSchema>;
export type Offer = z.infer<typeof offerSchema>;
export type CommonRepairs = z.infer<typeof commonRepairsSchema>;
export type OffersAndExtras = z.infer<typeof offersAndExtrasSchema>;
