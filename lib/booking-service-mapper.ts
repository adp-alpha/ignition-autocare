import { BookingServicesData } from '@/types/booking';

/**
 * Service to map booking context data to structured booking services data
 */
export class BookingServiceMapper {
  /**
   * Maps the booking context (from ConfirmationPageClient) to structured services data
   */
  static mapContextToServicesData(
    selectedServices: string[],
    displayPrices: any,
    isBlueLightCardHolder: boolean,
    totalPrice: number
  ): BookingServicesData {
    const servicesData: BookingServicesData = {
      subtotal: totalPrice,
      discounts: {},
      totalPrice: totalPrice,
    };

    // Helper to find service by ID
    const findService = (id: string) => {
      const allServices = [
        ...(displayPrices.motAndServicing || []),
        ...(displayPrices.additionalWork || []),
        ...(displayPrices.repairs || []),
        ...(displayPrices.addons || []),
      ];
      return allServices.find((s: any) => s.id === id);
    };

    selectedServices.forEach((serviceId) => {
      const service = findService(serviceId);
      if (!service) return;

      // MOT Services
      if (serviceId === 'mot' || serviceId === 'motClass7') {
        servicesData.mot = {
          type: serviceId === 'motClass7' ? 'MOT_CLASS_7' : 'MOT_CLASS_4',
          price: service.finalPrice,
        };
        
        if (service.originalPrice && service.originalPrice !== service.finalPrice) {
          servicesData.mot.originalPrice = service.originalPrice;
          servicesData.mot.discount = service.discount || 0;
        }

        if (service.metadata?.leadTime) {
          servicesData.mot.leadTime = service.metadata.leadTime;
        }
      }

      // Main Services (Interim, Full, Major, Oil Change)
      if (['interimService', 'fullService', 'majorService', 'oilChange'].includes(serviceId)) {
        const serviceType = 
          serviceId === 'interimService' ? 'INTERIM' :
          serviceId === 'fullService' ? 'FULL' :
          serviceId === 'majorService' ? 'MAJOR' : 'OIL_CHANGE';
        
        servicesData.service = {
          type: serviceType,
          engineSize: service.metadata?.engineSize || 'N/A',
          price: service.finalPrice,
        };

        if (service.metadata?.oilQuantity) {
          servicesData.service.oilQuantity = service.metadata.oilQuantity;
        }

        if (service.metadata?.parts) {
          servicesData.service.parts = service.metadata.parts;
          servicesData.service.partsCost = Object.values(service.metadata.parts)
            .reduce((sum: number, part: any) => sum + (part.cost || 0), 0);
        }

        if (service.metadata?.labourCost) {
          servicesData.service.labourCost = service.metadata.labourCost;
        }
      }

      // Delivery Options
      if (serviceId.startsWith('delivery-')) {
        servicesData.delivery = {
          name: service.name,
          price: service.finalPrice,
          maxDistance: service.metadata?.maxDistance || 'N/A',
        };

        if (service.metadata?.leadTime) {
          servicesData.delivery.leadTime = service.metadata.leadTime;
        }
      }

      // Vehicle Safety Check
      if (serviceId === 'vehicle-safety-check') {
        const wasFree = isBlueLightCardHolder && service.finalPrice === 0;
        
        servicesData.vehicleSafetyCheck = {
          name: 'Vehicle Safety Check',
          price: service.finalPrice,
          wasFree,
        };

        if (service.originalPrice) {
          servicesData.vehicleSafetyCheck.originalPrice = service.originalPrice;
        }

        if (wasFree && service.originalPrice) {
          servicesData.discounts.blueLightCard = 
            (servicesData.discounts.blueLightCard || 0) + service.originalPrice;
        }
      }

      // Custom Products
      if (serviceId.startsWith('custom-product-')) {
        if (!servicesData.customProducts) {
          servicesData.customProducts = [];
        }

        servicesData.customProducts.push({
          name: service.name,
          engineCategory: service.metadata?.engineCategory || 'below2000cc',
          price: service.finalPrice,
          description: service.metadata?.description,
        });
      }

      // Single Price Products
      if (serviceId.startsWith('single-price-product-')) {
        if (!servicesData.singlePriceProducts) {
          servicesData.singlePriceProducts = [];
        }

        servicesData.singlePriceProducts.push({
          name: service.name,
          price: service.finalPrice,
          hadServiceDiscount: service.metadata?.hadServiceDiscount,
        });
      }

      // Repairs
      if (serviceId.startsWith('repair-')) {
        if (!servicesData.repairs) {
          servicesData.repairs = [];
        }

        servicesData.repairs.push({
          product: service.name,
          partsType: service.metadata?.partsType || 'STANDARD',
          price: service.finalPrice,
          examplePrice: service.metadata?.examplePrice,
          leadTime: service.metadata?.leadTime,
        });
      }
    });

    // Calculate any bundle discounts
    const bundleDiscount = servicesData.subtotal - totalPrice;
    if (bundleDiscount > 0) {
      servicesData.discounts.bundleDiscounts = bundleDiscount;
    }

    return servicesData;
  }

  /**
   * Create a simplified version for display purposes
   */
  static createDisplaySummary(servicesData: BookingServicesData): string[] {
    const summary: string[] = [];

    if (servicesData.mot) {
      summary.push(`MOT (${servicesData.mot.type}): £${servicesData.mot.price.toFixed(2)}`);
    }

    if (servicesData.service) {
      summary.push(`${servicesData.service.type} Service: £${servicesData.service.price.toFixed(2)}`);
    }

    if (servicesData.delivery) {
      summary.push(`${servicesData.delivery.name}: £${servicesData.delivery.price.toFixed(2)}`);
    }

    if (servicesData.vehicleSafetyCheck) {
      const freeText = servicesData.vehicleSafetyCheck.wasFree ? ' (FREE)' : '';
      summary.push(`Vehicle Safety Check: £${servicesData.vehicleSafetyCheck.price.toFixed(2)}${freeText}`);
    }

    if (servicesData.customProducts) {
      servicesData.customProducts.forEach(product => {
        summary.push(`${product.name}: £${product.price.toFixed(2)}`);
      });
    }

    if (servicesData.singlePriceProducts) {
      servicesData.singlePriceProducts.forEach(product => {
        summary.push(`${product.name}: £${product.price.toFixed(2)}`);
      });
    }

    if (servicesData.repairs) {
      servicesData.repairs.forEach(repair => {
        summary.push(`${repair.product}: £${repair.price.toFixed(2)}`);
      });
    }

    return summary;
  }
}
