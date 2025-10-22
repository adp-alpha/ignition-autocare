type Day = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';

interface Discount {
  price: number;
  enabled: boolean;
}

interface MotService {
  enabled: boolean;
  standardPrice: number;
  leadTime: number;
  leadTimeEnabled: boolean;
  availability: Day[];
  discounts: {
    priceWithInterimService: Discount;
    priceWithFullService: Discount;
    priceWithMajorService: Discount;
  };
}

interface DeliveryOption {
  enabled: boolean;
  name: string;
  availability: Day[];
  allowMOTs: boolean;
  priceWithMOT: number;
  priceWithService: number;
  leadTime: number;
  leadTimeEnabled: boolean;
  maxDistance: number | 'N/A';
}

interface CustomProduct {
  enabled: boolean;
  name: string;
  extraDescription: string;
  below2000ccPrice: number;
  above2000ccPrice: number;
  petrol: boolean;
  diesel: boolean;
  electric: boolean;
}

interface SinglePriceProduct {
  enabled: boolean;
  name: string;
  defaultPrice: number;
  enableServicePrice: boolean;
  priceWithService: number | null;
}

interface Product {
  enabled: boolean;
  name: string;
  '0cc-1500cc': number;
  '1501cc-2400cc': number;
  '2401cc or above': number;
}

interface VehicleSafetyCheck {
  isVehicleSafetyCheckEnabled: boolean;
  isFreeVehicleSafetyCheckEnabled: boolean;
  price: number;
  priceWithMOT: Discount;
  priceWithInterimService: Discount;
  priceWithFullService: Discount;
  priceWithMajorService: Discount;
}

type EngineSize = '0cc-1200cc' | '1201cc-1500cc' | '1501cc-2000cc' | '2001cc-2400cc' | '2401cc-3500cc' | '3501cc or above';

interface ServicePricingDetail {
  oilChange: number;
  interim: number;
  full: number;
  major: number;
}

interface ServicePricing {
  prices: Record<EngineSize, ServicePricingDetail>;
  oilQty: Record<EngineSize, number>;
  partCosts: {
    airFilter: Record<EngineSize, number>;
    pollenFilter: Record<EngineSize, number>;
    oilFilter: Record<EngineSize, number>;
  };
  hourlyRates: {
    oilChange: Record<EngineSize, number>;
    interim: Record<EngineSize, number>;
    full: Record<EngineSize, number>;
    major: Record<EngineSize, number>;
  };
}

interface ServicingRates {
  servicingLeadTime: number;
  servicingLeadTimeEnabled: boolean;
  serviceLabourRate: number;
  electricalVehicleLabourRate: number;
  standardOilPrice: number;
  specialistOilPrice: number;
}

interface Offer {
  product: string;
  offerContent: string;
  tooltipContent: string;
}

interface CommonRepairItem {
  enabled: boolean;
  product: string;
  oemPartsPriceModifier: number;
  oemPartsModifierIsIncrease: boolean;
  examplePrice: number;
  leadTimeEnabled: boolean;
  leadTime: number;
  priceType: 'EXAMPLE' | 'REVEAL';
}

interface CommonRepairs {
    mechanicalLabourRate: number;
    repairs: CommonRepairItem[];
}

interface OffersAndExtras {
    manufacturerService: boolean;
    monthlyRepaymentOptions: boolean;
    servicePlanEligibilityCheck: boolean;
    videoAuthorisation: boolean;
}

export interface AdminData {
  motClass4: MotService;
  motClass7: MotService;
  deliveryOptions: DeliveryOption[];
  customProducts: CustomProduct[];
  singlePriceProducts: SinglePriceProduct[];
  products: Product[];
  vehicleSafetyCheck: VehicleSafetyCheck;
  servicePricing: ServicePricing;
  servicingRates: ServicingRates;
  offers: Offer[];
  commonRepairs: CommonRepairs;
  offersAndExtras: OffersAndExtras;
}
