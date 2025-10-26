import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { adminDataSchema } from "../lib/validations/admin-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  try {
    // Read the JSON file
    const jsonFilePath = path.join(process.cwd(), "data", "adminData.json");
    const fileContents = await fs.readFile(jsonFilePath, "utf8");
    const jsonData = JSON.parse(fileContents);

    // Validate the data
    const validatedData = adminDataSchema.parse(jsonData);

    // Check if data already exists
    const existingData = await prisma.adminData.findFirst();

    if (existingData) {
      console.log("Admin data already exists. Updating...");
      await prisma.adminData.update({
        where: { id: existingData.id },
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
      console.log("Admin data updated successfully!");
    } else {
      console.log("Creating new admin data...");
      await prisma.adminData.create({
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
      console.log("Admin data created successfully!");
    }

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
