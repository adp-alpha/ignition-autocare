/**
 * Test script to validate the adminData.json file
 * Run with: npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/validate-admin-data.ts
 */

import { promises as fs } from 'fs';
import path from 'path';
import { adminDataSchema } from '../lib/validations/admin-data';

async function validateAdminData() {
  try {
    console.log('📋 Validating admin data...\n');

    // Read JSON file
    const jsonFilePath = path.join(process.cwd(), 'data', 'adminData.json');
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(fileContents);

    // Validate against schema
    const result = adminDataSchema.safeParse(jsonData);

    if (result.success) {
      console.log('✅ Validation successful!');
      console.log('\nData structure is valid and ready for database migration.');
      console.log('\n📊 Summary:');
      console.log(`  - MOT Class 4: ${result.data.motClass4.enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`  - MOT Class 7: ${result.data.motClass7.enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Delivery Options: ${result.data.deliveryOptions.length}`);
      console.log(`  - Custom Products: ${result.data.customProducts.length}`);
      console.log(`  - Single Price Products: ${result.data.singlePriceProducts.length}`);
      console.log(`  - Products: ${result.data.products.length}`);
      console.log(`  - Common Repairs: ${result.data.commonRepairs.repairs.length}`);
      console.log(`  - Offers: ${result.data.offers.length}`);
      
      process.exit(0);
    } else {
      console.log('❌ Validation failed!\n');
      console.log('Errors found:');
      result.error.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.message}`);
        console.log(`   Path: ${issue.path.join(' → ')}`);
        console.log(`   Code: ${issue.code}`);
      });
      
      console.log('\n💡 Fix the issues above before migrating to database.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

validateAdminData();
