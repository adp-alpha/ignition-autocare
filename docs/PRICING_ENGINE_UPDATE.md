# Pricing Engine Update - Integration with Servicing Form

## Overview
The pricing engine has been updated to work perfectly with the new unified ServicingForm and ensure all engine-size-based pricing is accurate.

## Updates Made

### 1. Added Oil Change Service ✅
**Previous**: Only included Interim, Full, and Major services
**Updated**: Now includes all 4 service types:
- Oil Change
- Interim Service
- Full Service
- Major Service

### 2. Fixed Product Price Mapping ✅
**Previous**: Hardcoded to use `'0cc-1500cc'` for all engine sizes
**Updated**: Correctly maps engine size to the appropriate price tier:

```typescript
if (engineSizeCC <= 1500) {
  price = product['0cc-1500cc'];
} else if (engineSizeCC <= 2400) {
  price = product['1501cc-2400cc'];
} else {
  price = product['2401cc or above'];
}
```

### 3. Added Custom Products Support ✅
**New Feature**: Custom products now correctly use engine-size-based pricing:
- Below or equal to 2000cc: Uses `below2000ccPrice`
- Above 2000cc: Uses `above2000ccPrice`

### 4. Enhanced Documentation ✅
Added comprehensive inline comments explaining:
- How service prices are pre-calculated in ServicingForm
- Engine size mapping logic
- Discount condition building
- Section organization

## How It Works

### Engine Size Mapping

The pricing engine uses two different mapping systems:

#### 1. Service Pricing (6 ranges - matches ServicingForm)
```
0cc - 1200cc
1201cc - 1500cc
1501cc - 2000cc
2001cc - 2400cc
2401cc - 3500cc
3501cc or above
```

#### 2. Product Pricing (3 tiers)
```
0cc - 1500cc
1501cc - 2400cc
2401cc or above
```

#### 3. Custom Product Pricing (2 tiers)
```
≤ 2000cc
> 2000cc
```

### Service Price Integration

**Key Point**: Service prices (Oil Change, Interim, Full, Major) are **pre-calculated** in the ServicingForm using:

```
Price = [(Labour Rate × Labour Time) + Parts + (Oil Qty × Oil Price)] × 1.2 (VAT)
```

The pricing engine simply **retrieves** these pre-calculated prices from `adminData.servicePricing.prices[engineRangeKey]`.

### Example Flow

1. **Admin configures pricing** in ServicingForm:
   - Sets labour rate: £60/hour
   - Sets oil price: £7.01/litre
   - Sets parts costs, oil quantities, hourly times
   - ServicingForm calculates and saves all prices to adminData

2. **User enters vehicle details**:
   - Engine capacity: 1800cc
   - System calls: `getEngineRangeKey(1800)` → returns `"1501cc-2000cc"`

3. **Pricing engine retrieves data**:
   - Gets `adminData.servicePricing.prices["1501cc-2000cc"]`
   - Returns pre-calculated prices:
     - Oil Change: £126.79
     - Interim: £189.67
     - Full: £202.78
     - Major: £260.38

4. **For products**:
   - 1800cc falls into `"1501cc-2400cc"` tier for standard products
   - Uses `product['1501cc-2400cc']` price
   - For custom products, uses `below2000ccPrice`

## Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│         Admin Configures Pricing            │
│              (ServicingForm)                │
│                                             │
│  • Labour Rate: £60/hr                      │
│  • Oil Price: £7.01/L                       │
│  • Parts Costs                              │
│  • Oil Quantities                           │
│  • Hourly Times                             │
└──────────────┬──────────────────────────────┘
               │
               │ Auto-calculates & saves
               ▼
┌─────────────────────────────────────────────┐
│          adminData.json                     │
│                                             │
│  servicePricing.prices:                     │
│    "0cc-1200cc": {                          │
│      oilChange: 95.36,                      │
│      interim: 125.60,                       │
│      full: 146.48,                          │
│      major: 211.28                          │
│    }                                        │
│    ... (other engine sizes)                 │
└──────────────┬──────────────────────────────┘
               │
               │ User enters vehicle
               ▼
┌─────────────────────────────────────────────┐
│       calculatePrices(1800, adminData)      │
│                                             │
│  1. getEngineRangeKey(1800)                 │
│     → "1501cc-2000cc"                       │
│                                             │
│  2. Get servicePricing.prices               │
│     ["1501cc-2000cc"]                       │
│                                             │
│  3. Map products to correct tier            │
│     1800cc → "1501cc-2400cc"                │
│                                             │
│  4. Build discount arrays                   │
│                                             │
│  5. Return FormattedPricingData             │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│         Frontend Components                 │
│                                             │
│  • ServicePageClient                        │
│  • BookingContext                           │
│  • BookingSummary                           │
│                                             │
│  Display prices to user                     │
└─────────────────────────────────────────────┘
```

## Testing Examples

### Test Case 1: Small Engine (1100cc)

**Input**:
- Engine: 1100cc
- Maps to: `"0cc-1200cc"`

**Expected Output**:
```javascript
{
  motAndServicing: [
    { id: 'oilChange', basePrice: 95.36, ... },
    { id: 'interimService', basePrice: 125.60, ... },
    { id: 'fullService', basePrice: 146.48, ... },
    { id: 'majorService', basePrice: 211.28, ... }
  ],
  // Products use "0cc-1500cc" tier
  // Custom products use "below2000ccPrice"
}
```

### Test Case 2: Medium Engine (1800cc)

**Input**:
- Engine: 1800cc
- Maps to: `"1501cc-2000cc"`

**Expected Output**:
```javascript
{
  motAndServicing: [
    { id: 'oilChange', basePrice: 126.79, ... },
    { id: 'interimService', basePrice: 189.67, ... },
    { id: 'fullService', basePrice: 202.78, ... },
    { id: 'majorService', basePrice: 260.38, ... }
  ],
  // Products use "1501cc-2400cc" tier
  // Custom products use "below2000ccPrice"
}
```

### Test Case 3: Large Engine (3000cc)

**Input**:
- Engine: 3000cc
- Maps to: `"2401cc-3500cc"`

**Expected Output**:
```javascript
{
  motAndServicing: [
    { id: 'oilChange', basePrice: 135.84, ... },
    { id: 'interimService', basePrice: 173.40, ... },
    { id: 'fullService', basePrice: 221.40, ... },
    { id: 'majorService', basePrice: 279.00, ... }
  ],
  // Products use "2401cc or above" tier
  // Custom products use "above2000ccPrice"
}
```

### Test Case 4: Very Large Engine (4500cc)

**Input**:
- Engine: 4500cc
- Maps to: `"3501cc or above"`

**Expected Output**:
```javascript
{
  motAndServicing: [
    { id: 'oilChange', basePrice: 153.62, ... },
    { id: 'interimService', basePrice: 216.91, ... },
    { id: 'fullService', basePrice: 250.51, ... },
    { id: 'majorService', basePrice: 308.11, ... }
  ],
  // Products use "2401cc or above" tier
  // Custom products use "above2000ccPrice"
}
```

## Key Features

### 1. Accurate Engine Size Mapping ✅
- Services: 6 precise ranges
- Products: 3 broad tiers
- Custom Products: 2 tiers
- All mappings work correctly

### 2. Pre-Calculated Prices ✅
- Service prices come from ServicingForm calculations
- No duplication of calculation logic
- Single source of truth for pricing

### 3. Comprehensive Discount Support ✅
- MOT with service discounts
- Vehicle Safety Check with multiple conditions
- Single price products with service discounts

### 4. Flexible Product Categories ✅
- Custom Products (2-tier pricing)
- Standard Products (3-tier pricing)
- Single Price Products (flat pricing)
- All correctly integrated

## Compatibility

### ✅ Works With:
- New unified ServicingForm
- Current adminData.json structure
- All frontend components (ServicePageClient, BookingContext, etc.)
- Existing discount system

### ✅ Supports:
- All 6 engine size ranges
- Oil Change service (newly added)
- Custom products with engine-based pricing
- All discount conditions

## Edge Cases Handled

1. **Missing Data**: Returns 0 or empty array
2. **Disabled Items**: Skips items with `enabled: false`
3. **Null Prices**: Handles gracefully
4. **Engine Size Boundaries**: Correct tier selection at boundaries
   - 1500cc → Uses "0cc-1500cc" (≤ 1500)
   - 1501cc → Uses "1501cc-2400cc" (> 1500)
   - 2400cc → Uses "1501cc-2400cc" (≤ 2400)
   - 2401cc → Uses "2401cc or above" (> 2400)

## Performance

- **Fast Lookups**: O(1) dictionary access for service prices
- **Linear Scanning**: O(n) for products/repairs (acceptable for small datasets)
- **No Heavy Calculations**: All service prices pre-calculated
- **Minimal Memory**: Returns structured data only

## Future Enhancements

1. **Caching**: Could cache pricing data for repeated lookups
2. **Validation**: Add runtime validation of adminData structure
3. **Error Handling**: More granular error messages
4. **Logging**: Add optional logging for debugging
5. **Type Guards**: Add runtime type checking for safety

## Conclusion

The pricing engine is now fully compatible with the new ServicingForm and correctly handles all engine size ranges. The integration is clean, maintainable, and performant.
