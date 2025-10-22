"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VehicleData, MotHistoryData } from '@/types/vehicleData';
import { FormattedPricingData, ServiceItem } from '@/lib/pricing-engine';

// Define the shape of the data passed to the provider initially
interface InitialData {
  vehicleData: VehicleData | null;
  motHistoryData: MotHistoryData | null;
  pricingData: FormattedPricingData;
}

// Define the shape of our context's state
interface BookingContextType {
  // State
  vehicleData: VehicleData | null;
  motHistoryData: MotHistoryData | null;
  displayPrices: FormattedPricingData | null;
  selectedServices: string[];
  totalPrice: number;
  isVan: boolean;
  isBlueLightCardHolder: boolean;
  registration: string | null;
  isMotClass7Vehicle: boolean;

  // Actions
  setInitialData: (data: InitialData) => void;
  handleServiceSelection: (serviceId: string) => void;
  toggleBlueLightCard: () => void;
  setRegistration: (reg: string) => void;
}

// Create the context with a default undefined value
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Create the Provider component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  // Raw data from server
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [motHistoryData, setMotHistoryData] = useState<MotHistoryData | null>(null);
  const [pricingData, setPricingData] = useState<FormattedPricingData | null>(null);

  // Derived and UI state
  const [displayPrices, setDisplayPrices] = useState<FormattedPricingData | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>(["mot"]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isVan, setIsVan] = useState(false);
  const [isBlueLightCardHolder, setIsBlueLightCardHolder] = useState(false);
  const [registration, setRegistration] = useState<string | null>(null);
  const [isMotClass7Vehicle, setIsMotClass7Vehicle] = useState(false);

  // Function to load initial data on the service page
  const setInitialData = (data: InitialData) => {
    // Only update if data has actually changed to prevent unnecessary re-renders
    if (data.vehicleData !== vehicleData) {
      setVehicleData(data.vehicleData);
    }
    if (data.motHistoryData !== motHistoryData) {
      setMotHistoryData(data.motHistoryData);
    }
    if (data.pricingData !== pricingData) {
      setPricingData(data.pricingData);
      setDisplayPrices(data.pricingData); // Set initial display prices
    }
  };

  console.log(isVan, 'isVan');

  const toggleBlueLightCard = () => {
    setIsBlueLightCardHolder((prev) => !prev);
  };

  // Effect to check vehicle type (e.g., Van, MOT class 7)
  useEffect(() => {
    
    if (vehicleData?.Results?.ModelDetails) {
      const { ModelClassification, Weights } = vehicleData.Results.ModelDetails;

      // Check if "van" is present in either BodyStyle or DvlaBodyType (case-insensitive)
      const bodyStyle = vehicleData.Results.ModelDetails.BodyDetails?.BodyStyle?.toLowerCase() || '';
      const dvlaBodyType = vehicleData.Results.VehicleDetails?.VehicleIdentification?.DvlaBodyType?.toLowerCase() || '';
      setIsVan(
        bodyStyle.includes('van') ||
        dvlaBodyType.includes('van') ||
        (ModelClassification.VehicleClass?.toLowerCase().includes('van') ?? false)
      );
      
      // MOT Class 7 threshold check
      // 🧪 TESTING: Set to 2000kg to test with sample data (2200kg)
      // 🔧 PRODUCTION: Change to 3000kg for real usage
      if (Weights.GrossVehicleWeightKg && Weights.GrossVehicleWeightKg > 3000) {
        setIsMotClass7Vehicle(true);
      } else {
        setIsMotClass7Vehicle(false);
      }
    }
  }, [vehicleData]);

  // The core pricing logic, now centralized in the provider
  useEffect(() => {
    if (!pricingData) return;

    // Create a deep copy to avoid mutating the original pricing data.
    const newPricingData = JSON.parse(JSON.stringify(pricingData));

    // --- START: Helper flags for discount conditions ---
    const hasMot = selectedServices.includes("mot");
    const hasInterimService = selectedServices.includes("interimService");
    const hasFullService = selectedServices.includes("fullService");
    const hasMajorService = selectedServices.includes("majorService");
    const hasAnyService =
      hasInterimService || hasFullService || hasMajorService;
    // --- END: Helper flags ---

    // A map to check conditions efficiently.
    const conditionMap: { [key: string]: boolean } = {
      WITH_MOT: hasMot,
      WITH_INTERIM_SERVICE: hasInterimService,
      WITH_FULL_SERVICE: hasFullService,
      WITH_MAJOR_SERVICE: hasMajorService,
      WITH_ANY_SERVICE: hasAnyService,
    };

    /**
     * A generic function to process any list of services and apply discounts.
     * This makes the logic reusable and easier to maintain.
     */
    const processServices = (services: ServiceItem[]): ServiceItem[] => {
      return services.map((service) => {
        let finalPrice = service.basePrice;
        let appliedDiscount = false;

        // Iterate through available discounts for the service.
        for (const discount of service.discounts) {
          if (conditionMap[discount.condition]) {
            finalPrice = discount.discountedPrice;
            appliedDiscount = true;
            break; // Apply the first matching discount.
          }
        }

        // If a discount was applied, calculate the percentage for UI display.
        if (appliedDiscount) {
          const discountAmount = service.basePrice - finalPrice;
          const discountPercentage = (discountAmount / service.basePrice) * 100;
          return {
            ...service,
            finalPrice,
            originalPrice: service.basePrice,
            discount: Math.round(discountPercentage), // Round to the nearest whole number.
          };
        } else {
          // If no discount, ensure originalPrice and discount are cleared.
          return {
            ...service,
            finalPrice: service.basePrice,
            originalPrice: undefined,
            discount: undefined,
          };
        }
      });
    };

    // Apply the logic to each category of services.
    newPricingData.motAndServicing = processServices(
      newPricingData.motAndServicing
    );
    newPricingData.additionalWork = processServices(
      newPricingData.additionalWork
    );
    newPricingData.repairs = processServices(newPricingData.repairs);
    newPricingData.addons = processServices(newPricingData.addons);

    // --- START: Blue Light Card Discount ---
    if (
      isBlueLightCardHolder &&
      newPricingData.isFreeVehicleSafetyCheckEnabled
    ) {
      const safetyCheck = newPricingData.additionalWork.find(
        (s: ServiceItem) => s.id === "vehicle-safety-check"
      );
      if (safetyCheck) {
        safetyCheck.finalPrice = 0;
        safetyCheck.originalPrice = safetyCheck.basePrice;
        safetyCheck.discount = 100;
      }
    }
    // --- END: Blue Light Card Discount ---

    // Update the state with the newly calculated prices.
    setDisplayPrices(newPricingData);
  }, [selectedServices, pricingData, isBlueLightCardHolder]);

  // Effect to calculate the total price whenever selections or prices change
  useEffect(() => {
    if (!displayPrices) return;

    let total = 0;
    const allServices = [
      ...displayPrices.motAndServicing,
      ...displayPrices.additionalWork,
      ...displayPrices.repairs,
      ...displayPrices.addons,
    ];

    selectedServices.forEach((selectedId) => {
      const service = allServices.find((s: ServiceItem) => s.id === selectedId);
      if (service) {
        total += service.finalPrice;
      }
    });

    setTotalPrice(total);
  }, [selectedServices, displayPrices]);

  // The single function to handle service selection logic
  const handleServiceSelection = (serviceId: string) => {
    setSelectedServices(prev => {
      const isService = ['interimService', 'fullService', 'majorService'].includes(serviceId);

      if (prev.includes(serviceId)) {
        return prev.filter(s => s !== serviceId);
      } else {
        if (isService) {
          // If selecting a new service, deselect any other main service
          const otherServices = prev.filter(s => !['interimService', 'fullService', 'majorService'].includes(s));
          return [...otherServices, serviceId];
        } else {
          return [...prev, serviceId];
        }
      }
    });
  };

  return (
    <BookingContext.Provider
      value={{
        vehicleData,
        motHistoryData,
        displayPrices,
        selectedServices,
        totalPrice,
        isVan,
        isBlueLightCardHolder,
        registration,
        isMotClass7Vehicle,
        setInitialData,
        handleServiceSelection,
        toggleBlueLightCard,
        setRegistration,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
