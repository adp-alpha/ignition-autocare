import { format } from 'date-fns';
import { PrismaClient } from '@prisma/client';

/**
 * Generate a unique booking reference
 * Format: IGN-YYYYMMDD-XXX
 */
export async function generateBookingReference(
  prismaClient: PrismaClient | any
): Promise<string> {
  const date = format(new Date(), 'yyyyMMdd');
  
  // Get the count of bookings today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  
  const count = await prismaClient.booking.count({
    where: {
      createdAt: {
        gte: startOfToday,
      },
    },
  });
  
  const sequence = (count + 1).toString().padStart(3, '0');
  
  return `IGN-${date}-${sequence}`;
}

/**
 * Format services data for display in calendar/emails
 */
export function formatServicesForDisplay(services: any): string {
  const lines: string[] = [];
  
  if (services.mot) {
    lines.push(`- MOT (${services.mot.type}): £${services.mot.price.toFixed(2)}`);
  }
  
  if (services.service) {
    lines.push(`- ${services.service.type} Service: £${services.service.price.toFixed(2)}`);
  }
  
  if (services.delivery) {
    lines.push(`- ${services.delivery.name}: £${services.delivery.price.toFixed(2)}`);
  }
  
  if (services.vehicleSafetyCheck) {
    const wasFree = services.vehicleSafetyCheck.wasFree ? ' (FREE - Blue Light Card)' : '';
    lines.push(`- Vehicle Safety Check: £${services.vehicleSafetyCheck.price.toFixed(2)}${wasFree}`);
  }
  
  if (services.customProducts && services.customProducts.length > 0) {
    services.customProducts.forEach((product: any) => {
      lines.push(`- ${product.name}: £${product.price.toFixed(2)}`);
    });
  }
  
  if (services.singlePriceProducts && services.singlePriceProducts.length > 0) {
    services.singlePriceProducts.forEach((product: any) => {
      lines.push(`- ${product.name}: £${product.price.toFixed(2)}`);
    });
  }
  
  if (services.repairs && services.repairs.length > 0) {
    services.repairs.forEach((repair: any) => {
      lines.push(`- ${repair.product} (${repair.partsType}): £${repair.price.toFixed(2)}`);
    });
  }
  
  return lines.join('\n');
}

/**
 * Validate booking request data
 */
export function validateBookingRequest(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Validate customer data
  if (!data.customer?.firstName) errors.push('First name is required');
  if (!data.customer?.lastName) errors.push('Last name is required');
  if (!data.customer?.email) errors.push('Email is required');
  if (!data.customer?.contactNumber) errors.push('Contact number is required');
  
  // Validate vehicle data
  if (!data.vehicle?.vrm) errors.push('Vehicle registration is required');
  if (!data.vehicle?.make) errors.push('Vehicle make is required');
  if (!data.vehicle?.model) errors.push('Vehicle model is required');
  
  // Validate slot data
  if (!data.slot?.date) errors.push('Booking date is required');
  if (!data.slot?.startTime) errors.push('Start time is required');
  if (!data.slot?.endTime) errors.push('End time is required');
  
  // Validate services
  if (!data.services || typeof data.services !== 'object') {
    errors.push('Services data is required');
  } else if (typeof data.services.totalPrice !== 'number' || data.services.totalPrice <= 0) {
    errors.push('Valid total price is required');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
