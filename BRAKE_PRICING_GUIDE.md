# Brake Pricing System - Usage Guide

## 📊 What's Been Added

I've integrated comprehensive brake replacement pricing data into your adminData.json based on the BookMyGarage data you provided. Here's what's now available:

### 🔧 Brake Services Covered:
- **Front Brake Pads** - 21 vehicle makes
- **Rear Brake Pads** - 22 vehicle makes  
- **Front Brakes (Discs & Pads)** - 22 vehicle makes
- **Rear Brakes (Discs & Pads)** - 22 vehicle makes

### 🚗 Vehicle Makes Included:
Audi, BMW, Citroen, Fiat, Ford, Honda, Hyundai, Jaguar, Kia, Land Rover, Mazda, Mercedes-Benz, MINI, Mitsubishi, Nissan, Peugeot, Renault, SEAT, Skoda, Toyota, Vauxhall, Volkswagen, Volvo

## 🛠️ How to Use

### 1. **In Your Code (TypeScript/JavaScript)**

```typescript
import { getBrakePricing, getAllBrakePricingForMake } from '@/lib/brake-pricing';

// Get specific service pricing
const frontPadsPricing = getBrakePricing('BMW', 'frontPads');
console.log(frontPadsPricing.price); // 168.07

// Get all brake services for a make
const allBMWPricing = getAllBrakePricingForMake('BMW');
console.log(allBMWPricing.frontPads.price); // 168.07
console.log(allBMWPricing.frontDiscsAndPads.price); // 361.10
```

### 2. **Via API Endpoints**

```bash
# Get pricing for specific service
curl "http://your-domain.com/api/brake-pricing?make=BMW&serviceType=frontPads"

# Get all pricing for a make
curl "http://your-domain.com/api/brake-pricing?make=BMW&action=all-pricing"

# Get available makes
curl "http://your-domain.com/api/brake-pricing?action=makes"

# Get price ranges for all services
curl "http://your-domain.com/api/brake-pricing?action=price-ranges"
```

### 3. **React Component**

```tsx
import BrakePricingDisplay from '@/components/brake-pricing/BrakePricingDisplay';

// Show all brake services for a specific make
<BrakePricingDisplay 
  vehicleMake="BMW" 
  showAllServices={true}
  showWarningSigns={true}
/>
```

## 📈 Price Examples

### Front Brake Pads:
- **Cheapest:** Renault (£100.14)
- **Most Expensive:** BMW (£168.07)
- **Average:** £130.42

### Front Brakes (Discs & Pads):
- **Cheapest:** Nissan (£215.24)
- **Most Expensive:** Jaguar (£536.18)
- **Average:** £285.67

## 🔧 Integration with Existing System

### Updated Common Repairs:
Your existing brake repair entries in `commonRepairs` have been updated with realistic pricing:

- **Front Brakes (Discs & Pads):** £275 (was £302.40)
- **Front Brakes (Pads):** £130 (was £174)
- **Rear Brakes (Discs & Pads):** £240 (was £0)
- **Rear Brakes (Pads):** £110 (was £0)

### Fallback System:
If a specific make isn't found in the pricing data, the system falls back to the `commonRepairs` pricing.

## 🎯 Use Cases

### 1. **Dynamic Pricing in Booking System**
```typescript
// In your booking flow
const vehicleMake = vehicleData.Results.VehicleDetails.VehicleIdentification.DvlaMake;
const brakePricing = getBrakePricing(vehicleMake, 'frontPads');

if (brakePricing.found) {
  // Use specific pricing for this make
  displayPrice = brakePricing.price;
} else {
  // Use fallback pricing
  displayPrice = brakePricing.fallbackPrice;
}
```

### 2. **Price Comparison Tool**
```typescript
// Show price ranges to customers
const priceRange = getPriceRange('frontPads');
console.log(`Front brake pads: £${priceRange.min} - £${priceRange.max}`);
```

### 3. **Customer Education**
```typescript
// Show warning signs
const warningSigns = getBrakeWarningSigns();
// Display to customer when they select brake services
```

## 📊 Data Structure in adminData.json

```json
{
  "brakePricing": {
    "frontBrakePads": {
      "prices": {
        "BMW": 168.07,
        "Audi": 155.75,
        // ... more makes
      }
    },
    "rearBrakePads": { /* similar structure */ },
    "frontBrakesDiscAndPad": { /* similar structure */ },
    "rearBrakesDiscAndPad": { /* similar structure */ },
    "notes": {
      "warningSigns": [
        "Squeaking or scraping sounds from brakes",
        // ... more signs
      ]
    }
  }
}
```

## 🚀 Next Steps

1. **Test the API endpoints** to make sure everything works
2. **Integrate into your booking flow** where brake services are selected
3. **Add price display** to your service selection pages
4. **Use warning signs** to educate customers about brake maintenance

## 🔍 Testing

```bash
# Test the brake pricing API
curl "http://localhost:3000/api/brake-pricing?make=BMW&serviceType=frontPads"

# Expected response:
{
  "success": true,
  "price": 168.07,
  "make": "BMW",
  "serviceType": "frontPads",
  "found": true
}
```

Your brake pricing system is now ready to use! 🎉