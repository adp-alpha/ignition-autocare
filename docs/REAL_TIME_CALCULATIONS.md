# Real-Time Price Calculations in Admin Panel

## Overview
The admin panel now features **real-time calculation** of service prices. When you change any input field that affects pricing, all calculated prices update instantly.

## How It Works

### Formula
```
Service Price = (Hourly Rate × Labour Time) + Parts Costs + (Oil Qty × Oil Price) + VAT (20%)
```

### Input Fields (What You Enter)
1. **Service Labour Rate** (from ServicingForm)
   - Hourly rate for mechanics (excluding VAT)

2. **Oil Quantity** (litres)
   - Amount of oil needed for each engine size

3. **Oil Price** (from ServicingForm)
   - Standard oil price per litre (excluding VAT)

4. **Part Costs** (excluding VAT)
   - Air Filter cost
   - Pollen Filter cost
   - Oil Filter cost

5. **Labour Time** (hours)
   - Time required for each service type and engine size
   - Can be decimal (e.g., 1.5 hours)

### Calculated Fields (Auto-Updated)
✨ **Service Prices** (displayed with green background):
- Oil Change prices for all engine sizes
- Interim Service prices for all engine sizes
- Full Service prices for all engine sizes
- Major Service prices for all engine sizes

## Parts Used by Each Service

- **Oil Change**: Oil Filter only
- **Interim Service**: Oil Filter + Air Filter
- **Full Service**: Oil Filter + Air Filter + Pollen Filter
- **Major Service**: Oil Filter + Air Filter + Pollen Filter

## Example Calculation

### For a Full Service on 1201cc-1500cc engine:

**Inputs:**
- Labour Rate: £50/hour
- Labour Time: 2 hours
- Oil Quantity: 5 litres
- Oil Price: £4/litre
- Oil Filter Cost: £8
- Air Filter Cost: £12
- Pollen Filter Cost: £7.92

**Calculation:**
```
Labour Cost = £50 × 2 hours = £100
Oil Cost = 5 litres × £4 = £20
Parts Cost = £8 + £12 + £7.92 = £27.92
Subtotal = £100 + £20 + £27.92 = £147.92
VAT (20%) = £147.92 × 0.20 = £29.58
Total Price = £147.92 + £29.58 = £177.50
```

## Visual Indicators

- **Green highlighted boxes**: Calculated prices (read-only)
- **White input boxes**: Fields you can edit
- **Real-time updates**: Prices recalculate as soon as you change any input

## What Updates the Calculations

Any change to these fields triggers recalculation:
- ✏️ Service Labour Rate
- ✏️ Oil Price (Standard or Specialist)
- ✏️ Oil Quantities
- ✏️ Part Costs (Air, Pollen, Oil filters)
- ✏️ Labour Times (hourly rates for each service)

## Benefits

1. ✅ **Instant Feedback** - See price changes immediately
2. ✅ **No Manual Math** - System calculates for you
3. ✅ **Consistent Pricing** - Formula applied uniformly
4. ✅ **Error Prevention** - Reduces manual calculation mistakes
5. ✅ **VAT Included** - Automatically adds 20% VAT

## Technical Implementation

The system uses:
- `useWatch` from react-hook-form to monitor field changes
- `useEffect` hook to trigger recalculations
- `setValue` to update calculated fields automatically
- Smart dependency tracking to optimize performance
