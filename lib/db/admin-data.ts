import { prisma } from '@/lib/prisma';
import { AdminDataInput, adminDataSchema } from '@/lib/validations/admin-data';

/**
 * Get admin data from database
 * Falls back to creating default entry if none exists
 */
export async function getAdminData() {
  try {
    // Get the first (and should be only) admin data entry
    const adminData = await prisma.adminData.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!adminData) {
      return null;
    }

    // Return the data - Prisma will handle JSON fields automatically
    return {
      defaultLeadTime: adminData.defaultLeadTime,
      motClass4: adminData.motClass4,
      motClass7: adminData.motClass7,
      deliveryOptions: adminData.deliveryOptions,
      customProducts: adminData.customProducts,
      singlePriceProducts: adminData.singlePriceProducts,
      products: adminData.products,
      vehicleSafetyCheck: adminData.vehicleSafetyCheck,
      servicePricing: adminData.servicePricing,
      servicingRates: adminData.servicingRates,
      offers: adminData.offers,
      commonRepairs: adminData.commonRepairs,
      offersAndExtras: adminData.offersAndExtras,
    };
  } catch (error) {
    console.error('Error fetching admin data from database:', error);
    throw new Error('Failed to fetch admin data');
  }
}

/**
 * Update or create admin data with validation
 * @param data - The admin data to save
 * @returns The saved admin data
 */
export async function upsertAdminData(data: AdminDataInput) {
  try {
    // Validate the data against the schema
    const validatedData = adminDataSchema.parse(data);

    // Check if any admin data exists
    const existingData = await prisma.adminData.findFirst();

    let result;

    if (existingData) {
      // Update existing record
      result = await prisma.adminData.update({
        where: {
          id: existingData.id,
        },
        data: {
          defaultLeadTime: validatedData.defaultLeadTime,
          motClass4: validatedData.motClass4,
          motClass7: validatedData.motClass7,
          deliveryOptions: validatedData.deliveryOptions,
          customProducts: validatedData.customProducts,
          singlePriceProducts: validatedData.singlePriceProducts,
          products: validatedData.products,
          vehicleSafetyCheck: validatedData.vehicleSafetyCheck,
          servicePricing: validatedData.servicePricing,
          servicingRates: validatedData.servicingRates,
          offers: validatedData.offers,
          commonRepairs: validatedData.commonRepairs,
          offersAndExtras: validatedData.offersAndExtras,
        },
      });
    } else {
      // Create new record
      result = await prisma.adminData.create({
        data: {
          defaultLeadTime: validatedData.defaultLeadTime,
          motClass4: validatedData.motClass4,
          motClass7: validatedData.motClass7,
          deliveryOptions: validatedData.deliveryOptions,
          customProducts: validatedData.customProducts,
          singlePriceProducts: validatedData.singlePriceProducts,
          products: validatedData.products,
          vehicleSafetyCheck: validatedData.vehicleSafetyCheck,
          servicePricing: validatedData.servicePricing,
          servicingRates: validatedData.servicingRates,
          offers: validatedData.offers,
          commonRepairs: validatedData.commonRepairs,
          offersAndExtras: validatedData.offersAndExtras,
        },
      });
    }

    return result;
  } catch (error) {
    console.error('Error upserting admin data:', error);
    throw error;
  }
}

/**
 * Initialize database with data from JSON file (for migration)
 */
export async function initializeFromJSON(jsonData: AdminDataInput) {
  try {
    const validatedData = adminDataSchema.parse(jsonData);
    
    // Check if data already exists
    const existingData = await prisma.adminData.findFirst();
    
    if (existingData) {
      console.log('Admin data already exists in database. Skipping initialization.');
      return existingData;
    }

    // Create initial data
    const result = await prisma.adminData.create({
      data: {
        defaultLeadTime: validatedData.defaultLeadTime,
        motClass4: validatedData.motClass4,
        motClass7: validatedData.motClass7,
        deliveryOptions: validatedData.deliveryOptions,
        customProducts: validatedData.customProducts,
        singlePriceProducts: validatedData.singlePriceProducts,
        products: validatedData.products,
        vehicleSafetyCheck: validatedData.vehicleSafetyCheck,
        servicePricing: validatedData.servicePricing,
        servicingRates: validatedData.servicingRates,
        offers: validatedData.offers,
        commonRepairs: validatedData.commonRepairs,
        offersAndExtras: validatedData.offersAndExtras,
      },
    });

    console.log('Admin data initialized from JSON file successfully');
    return result;
  } catch (error) {
    console.error('Error initializing admin data from JSON:', error);
    throw error;
  }
}
