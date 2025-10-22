# Common Repairs: OEM Parts Price Modifier

## Overview
The Common Repairs section now features a **real-time toggle** to control whether the OEM Parts Price Modifier increases or decreases the final price.

## How It Works

### Formula
```
Final Price = ((Labour Rate × Hours) + Adjusted Parts Price) + VAT (20%)

where:
Adjusted Parts Price = Base Parts Price ± (Base Parts Price × Modifier %)
```

### Components

#### 1. **OEM Parts Price Modifier %**
- Input field to enter the modifier percentage (e.g., 10, 15, 25)
- Applies to the base OEM parts price

#### 2. **Toggle: Decrease/Increase**
- **Visual Indicator**: 
  - Red toggle (left) = **Decrease** price
  - Green toggle (right) = **Increase** price
- **Interactive**: Click to toggle between modes
- **Real-time**: Price updates instantly when toggled

### Example Calculations

#### Base Data: Clutch Replacement
- Base Parts Price: £300
- Labour Hours: 4.5 hours
- Labour Rate: £50/hour

#### Scenario 1: 10% Increase (Toggle RIGHT - Green)
```
Labour Cost = £50 × 4.5 = £225
Modifier Amount = (£300 / 100) × 10 = £30
Adjusted Parts = £300 + £30 = £330
Subtotal = £225 + £330 = £555
Final Price (with VAT) = £555 × 1.20 = £666.00
```

#### Scenario 2: 10% Decrease (Toggle LEFT - Red)
```
Labour Cost = £50 × 4.5 = £225
Modifier Amount = (£300 / 100) × 10 = £30
Adjusted Parts = £300 - £30 = £270
Subtotal = £225 + £270 = £495
Final Price (with VAT) = £495 × 1.20 = £594.00
```

## Base Repair Data

### 1. Clutch Replacement
- Base Parts: £300
- Labour: 4.5 hours

### 2. Brake Discs & Pads
- Base Parts: £120
- Labour: 2.0 hours

### 3. Brake Pads
- Base Parts: £50
- Labour: 1.5 hours

## Visual Guide

### Toggle States

**Decrease Mode (Red)**
```
[Decrease] ●━━━━━ Increase
```
- Toggle is on the LEFT
- Background is RED
- "Decrease" text is bold and red
- Reduces parts price by modifier percentage

**Increase Mode (Green)**
```
Decrease ━━━━━● [Increase]
```
- Toggle is on the RIGHT
- Background is GREEN
- "Increase" text is bold and green
- Increases parts price by modifier percentage

## Real-Time Updates

The price recalculates automatically when:
1. ✏️ **Mechanical Labour Rate** changes
2. ✏️ **OEM Parts Price Modifier %** changes
3. 🔄 **Toggle** is switched (Decrease ↔ Increase)

## Features

### ✅ What Works Now
- Interactive toggle button
- Visual feedback (red/green states)
- Real-time price calculation
- Smooth animations
- Price displayed with green background
- Base data shown under product name

### 🎨 UI/UX Improvements
- Color-coded toggle states
- Clear labeling (Decrease/Increase)
- Animated toggle transition
- Calculated prices highlighted in green
- Base parts and labour info visible

## Testing

### Test the Toggle
1. Go to `/admin`
2. Scroll to "Common Repairs" section
3. Set Mechanical Labour Rate (e.g., £50)
4. For any repair item:
   - Enter a modifier percentage (e.g., 10)
   - Click the toggle button
   - Watch the price change instantly!

### Expected Behavior
- **Increase (Green)**: Price goes UP
- **Decrease (Red)**: Price goes DOWN
- Toggle should switch smoothly with animation
- Price should update immediately

## Data Structure

### In adminData.json
```json
{
  "commonRepairs": {
    "mechanicalLabourRate": 50,
    "repairs": [
      {
        "enabled": true,
        "product": "Clutch Replacement",
        "oemPartsPriceModifier": 10,
        "oemPartsModifierIsIncrease": true,  // ← New field
        "examplePrice": 666.00,
        "leadTimeEnabled": true,
        "leadTime": 1,
        "priceType": "EXAMPLE"
      }
    ]
  }
}
```

### Fields
- `oemPartsPriceModifier`: Percentage value (0-100)
- `oemPartsModifierIsIncrease`: Boolean
  - `true` = Increase mode (green toggle)
  - `false` = Decrease mode (red toggle)
- `examplePrice`: Calculated price (auto-updated)

## Price Type Options

### EXAMPLE
- Shows the calculated price immediately
- Displayed as: £XXX.XX

### REVEAL
- Shows "Reveal Price" button instead
- Price hidden until customer clicks

## Technical Implementation

### Key Changes

1. **Added Toggle Field**
   - New field: `oemPartsModifierIsIncrease: boolean`
   - Stored in form state
   - Controls price calculation direction

2. **Real-Time Calculation**
   - Uses `useWatch` to monitor changes
   - `useEffect` recalculates on any input change
   - Guard prevents infinite loops

3. **Visual Toggle Component**
   - Interactive button with click handler
   - Conditional styling based on state
   - Smooth CSS transitions

4. **Formula Implementation**
```typescript
let partsPrice = basePartsPrice;
const modifierAmount = (partsPrice / 100) * Math.abs(modifier);

if (isIncrease) {
  partsPrice += modifierAmount;
} else {
  partsPrice -= modifierAmount;
}
```

## Benefits

✅ **Flexibility**: Can markup OR markdown prices  
✅ **Real-time**: Instant price updates  
✅ **Visual**: Clear indication of mode (red/green)  
✅ **User-friendly**: Simple toggle interaction  
✅ **Accurate**: Calculated using exact formula  

## Use Cases

### Markup Scenario (Increase)
- Premium parts sourcing
- Specialized repairs
- Extended warranty coverage
→ Use **Increase** mode (green toggle)

### Discount Scenario (Decrease)
- Bulk repair packages
- Promotional pricing
- Preferred supplier discounts
→ Use **Decrease** mode (red toggle)
