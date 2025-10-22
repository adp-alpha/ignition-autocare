# Servicing Form Implementation

## Overview
The Servicing Form has been completely rewritten from scratch to consolidate all servicing-related functionality into a single, robust component with real-time price calculations.

## Previous Architecture (DEPRECATED)
Previously, servicing functionality was split across two forms:
- **ServicingForm.tsx** - Only handled lead time, labour rates, and oil prices
- **PricingForm.tsx** - Handled oil quantity, parts costs, hourly times, and price calculations

This split created confusion and made the data flow difficult to maintain.

## New Architecture
All servicing functionality is now unified in **ServicingForm.tsx**, which includes:

### 1. Configuration Section
- Servicing lead time (working days)
- Lead time enabled checkbox
- Service labour rate (£/hour, excluding VAT)
- Electrical vehicle labour rate (£/hour, excluding VAT)
- Standard oil price (£/litre, excluding VAT)
- Specialist oil price (£/litre, excluding VAT)

### 2. Oil Quantity Table
- Input fields for oil quantity in litres for each engine size:
  - 0cc - 1200cc
  - 1201cc - 1500cc
  - 1501cc - 2000cc
  - 2001cc - 2400cc
  - 2401cc - 3500cc
  - 3501cc or above

### 3. Parts Cost Table
- Input fields for parts costs (excluding VAT) for each engine size:
  - Air Filter (£)
  - Pollen Filter (£)
  - Oil Filter (£)

### 4. Hourly Time Table
- Input fields for labour time (in hours, decimal allowed) for each service type:
  - Oil Change
  - Interim
  - Full
  - Major

### 5. Prices Table (Auto-calculated, Read-only Display)
- Automatically calculated prices (including VAT) for each service type and engine size
- Real-time updates when any dependency changes
- Checkboxes to enable/disable each service type
- Visual styling with gradient background to indicate calculated values

## Price Calculation Logic

### Formula
```
Final Price = [(Labour Rate × Labour Time) + Parts Costs + (Oil Qty × Oil Price)] × (1 + VAT)
```

Where:
- **Labour Rate**: `servicingRates.serviceLabourRate`
- **Labour Time**: `servicePricing.hourlyRates.[serviceType].[engineSize]`
- **Parts Costs**: Sum of required parts based on service type
- **Oil Qty**: `servicePricing.oilQty.[engineSize]`
- **Oil Price**: `servicingRates.standardOilPrice`
- **VAT**: 20% (0.20)

### Parts Required by Service Type
```javascript
{
  oilChange: ["oilFilter"],
  interim: ["oilFilter", "airFilter"],
  full: ["oilFilter", "airFilter", "pollenFilter"],
  major: ["oilFilter", "airFilter", "pollenFilter"]
}
```

### Real-time Updates
The form uses React Hook Form's `useWatch` and `useEffect` to monitor changes to:
- Service labour rate
- Standard oil price
- Oil quantities
- Parts costs
- Hourly times

When any of these values change, all affected prices are automatically recalculated and updated in real-time.

## Data Structure

### servicingRates
```json
{
  "servicingLeadTime": 0,
  "servicingLeadTimeEnabled": true,
  "serviceLabourRate": 60,
  "electricalVehicleLabourRate": 60,
  "standardOilPrice": 7.01,
  "specialistOilPrice": 9.5
}
```

### servicePricing
```json
{
  "prices": {
    "0cc-1200cc": {
      "oilChange": 95.36,
      "interim": 125.60,
      "full": 146.48,
      "major": 211.28
    },
    // ... other engine sizes
  },
  "oilQty": {
    "0cc-1200cc": 3,
    "1201cc-1500cc": 5,
    // ... other engine sizes
  },
  "partCosts": {
    "airFilter": {
      "0cc-1200cc": 12,
      // ... other engine sizes
    },
    "pollenFilter": {
      "0cc-1200cc": 5.4,
      // ... other engine sizes
    },
    "oilFilter": {
      "0cc-1200cc": 5.64,
      // ... other engine sizes
    }
  },
  "hourlyRates": {
    "oilChange": {
      "0cc-1200cc": 0.88,
      // ... other engine sizes
    },
    "interim": {
      "0cc-1200cc": 1.1,
      // ... other engine sizes
    },
    "full": {
      "0cc-1200cc": 1.3,
      // ... other engine sizes
    },
    "major": {
      "0cc-1200cc": 2.2,
      // ... other engine sizes
    }
  }
}
```

## Key Features

### 1. Robust Calculation Engine
- Uses a dedicated `calculatePrice()` function
- Handles null/undefined values gracefully
- Applies proper floating-point tolerance (0.01) for comparisons
- Prevents unnecessary re-renders with `isUpdating` ref flag

### 2. Performance Optimized
- Only updates prices when values actually change
- Uses `shouldDirty: false` to prevent form from being marked as dirty on calculations
- Batches all price updates in a single effect

### 3. User Experience
- Clear visual indication of auto-calculated fields (gradient background)
- Informative labels and descriptions
- Consistent table layouts matching the design
- Real-time feedback on price changes

### 4. Data Integrity
- All input fields use proper type coercion (`parseFloat`)
- Fallback to 0 for invalid inputs
- Proper step increments (0.01) for decimal values
- Maintains data structure consistency with adminData.json

## Migration Notes

### For Developers
1. **PricingForm.tsx** is now deprecated and marked for removal
2. Use only **ServicingForm.tsx** for all servicing-related functionality
3. The admin page has been updated to remove the duplicate form
4. All existing data in `adminData.json` is fully compatible

### Breaking Changes
None. The data structure remains unchanged, and all existing functionality is preserved.

## Testing Checklist

- [ ] Verify servicing lead time input works
- [ ] Verify labour rate changes trigger price recalculation
- [ ] Verify oil price changes trigger price recalculation
- [ ] Verify oil quantity changes trigger price recalculation
- [ ] Verify parts cost changes trigger price recalculation
- [ ] Verify hourly time changes trigger price recalculation
- [ ] Verify prices are calculated correctly for all service types
- [ ] Verify prices include VAT (20%)
- [ ] Verify prices update in real-time without page refresh
- [ ] Verify form submission saves all data correctly
- [ ] Verify data loads correctly from adminData.json
- [ ] Verify checkboxes for enabling/disabling services work

## Future Enhancements

1. **Specialist Oil Support**: Currently only uses standard oil price; could add logic to use specialist oil for certain engine sizes or service types
2. **EV Labour Rate**: Electrical vehicle labour rate is captured but not currently used in calculations
3. **Custom VAT Rate**: VAT is hardcoded at 20%; could be made configurable
4. **Price Override**: Option to manually override calculated prices if needed
5. **Calculation Audit Trail**: Log when and why prices change for debugging

## Conclusion

The new unified ServicingForm provides a robust, maintainable, and user-friendly solution for managing all servicing-related configuration and pricing. The real-time calculation engine ensures prices are always accurate and up-to-date, while the consolidated architecture makes the codebase easier to understand and maintain.
