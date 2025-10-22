# Servicing Form - Testing Checklist

## Pre-Testing Setup
- [ ] Clear browser cache
- [ ] Ensure adminData.json is backed up
- [ ] Open browser developer console to check for errors
- [ ] Navigate to `/admin` page

---

## Section 1: Configuration & Rates

### Lead Time Settings
- [ ] Input a value in "Servicing Lead Time" field
- [ ] Toggle the "Enabled" checkbox
- [ ] Verify values are saved on form submission

### Labour Rates
- [ ] Enter a value in "Service Labour Rate" (e.g., 60)
- [ ] **VERIFY**: All prices in the prices table update automatically
- [ ] Change the value again
- [ ] **VERIFY**: Prices recalculate in real-time
- [ ] Enter a value in "Electrical Vehicle Labour Rate"
- [ ] **VERIFY**: This does NOT affect prices (not currently used in calculations)

### Oil Prices
- [ ] Enter a value in "Standard Oil" (e.g., 7.01)
- [ ] **VERIFY**: All prices update automatically
- [ ] Change the value (e.g., to 8.00)
- [ ] **VERIFY**: Prices increase proportionally
- [ ] Enter a value in "Specialist Oil"
- [ ] **VERIFY**: This does NOT affect prices (not currently used)

---

## Section 2: Oil Quantity Table

### Test Each Engine Size
- [ ] Change oil quantity for "0cc - 1200cc"
  - **VERIFY**: Only prices for this engine size column update
- [ ] Change oil quantity for "1201cc - 1500cc"
  - **VERIFY**: Only prices for this engine size column update
- [ ] Repeat for all other engine sizes
- [ ] Enter decimal values (e.g., 4.5)
  - **VERIFY**: Decimal values are accepted and used in calculations

### Validation
- [ ] Try entering negative values
- [ ] Try entering non-numeric values
- [ ] **VERIFY**: Form handles invalid inputs gracefully

---

## Section 3: Part Costs Table

### Air Filter Costs
- [ ] Change air filter cost for "0cc - 1200cc"
- [ ] **VERIFY**: Only Interim, Full, and Major prices update for this column
- [ ] **VERIFY**: Oil Change price does NOT change (doesn't use air filter)
- [ ] Repeat for other engine sizes

### Pollen Filter Costs
- [ ] Change pollen filter cost for any engine size
- [ ] **VERIFY**: Only Full and Major prices update
- [ ] **VERIFY**: Oil Change and Interim prices do NOT change

### Oil Filter Costs
- [ ] Change oil filter cost for any engine size
- [ ] **VERIFY**: ALL service types update (all use oil filter)

### Decimal Values
- [ ] Enter values with 2 decimal places (e.g., 12.75)
- [ ] **VERIFY**: Calculations use full precision

---

## Section 4: Hourly Time Table

### Oil Change Time
- [ ] Change oil change time for "0cc - 1200cc"
- [ ] **VERIFY**: Only Oil Change price updates for this column
- [ ] Change from 0.88 to 1.0
- [ ] **VERIFY**: Price increases accordingly

### Interim Time
- [ ] Change interim time for any engine size
- [ ] **VERIFY**: Only Interim price updates for that column

### Full Time
- [ ] Change full time for any engine size
- [ ] **VERIFY**: Only Full price updates for that column

### Major Time
- [ ] Change major time for any engine size
- [ ] **VERIFY**: Only Major price updates for that column

### Edge Cases
- [ ] Enter 0 hours
  - **VERIFY**: Calculation still works (labour cost = 0)
- [ ] Enter very small values (e.g., 0.01)
- [ ] Enter large values (e.g., 10.5)
  - **VERIFY**: All calculations are accurate

---

## Section 5: Prices Table (Auto-Calculated)

### Visual Verification
- [ ] **VERIFY**: All price cells have gradient green/blue background
- [ ] **VERIFY**: Prices are displayed with 2 decimal places
- [ ] **VERIFY**: All prices show "£" symbol

### Service Type Checkboxes
- [ ] Uncheck "Oil Change"
  - **VERIFY**: Checkbox state changes
  - **VERIFY**: Prices still display correctly
- [ ] Re-check "Oil Change"
- [ ] Repeat for all service types

### Real-Time Updates
- [ ] Make a change to any input field
- [ ] **VERIFY**: Prices update within 1 second (no page refresh needed)
- [ ] Make multiple rapid changes
- [ ] **VERIFY**: Form doesn't lag or freeze

---

## Calculation Accuracy Tests

### Manual Calculation Test 1: Oil Change (0cc-1200cc)
**Given**:
- Service Labour Rate: £60/hour
- Oil Change Time: 0.88 hours
- Oil Quantity: 3 litres
- Oil Price: £7.01/litre
- Oil Filter Cost: £5.64

**Manual Calculation**:
```
Labour: £60 × 0.88 = £52.80
Oil: 3 × £7.01 = £21.03
Parts: £5.64
Subtotal: £52.80 + £21.03 + £5.64 = £79.47
VAT (20%): £79.47 × 0.20 = £15.894
Total: £79.47 + £15.894 = £95.364
```

**Expected Result**: £95.36

- [ ] **VERIFY**: Displayed price matches calculation

### Manual Calculation Test 2: Full (1501cc-2000cc)
**Given**:
- Service Labour Rate: £60/hour
- Full Time: 1.4 hours
- Oil Quantity: 6 litres
- Oil Price: £7.01/litre
- Air Filter: £20
- Pollen Filter: £16.92
- Oil Filter: £6

**Manual Calculation**:
```
Labour: £60 × 1.4 = £84.00
Oil: 6 × £7.01 = £42.06
Parts: £20 + £16.92 + £6 = £42.92
Subtotal: £84.00 + £42.06 + £42.92 = £168.98
VAT (20%): £168.98 × 0.20 = £33.796
Total: £168.98 + £33.796 = £202.776
```

**Expected Result**: £202.78

- [ ] **VERIFY**: Displayed price matches calculation

### Manual Calculation Test 3: Major (3501cc or above)
**Given**:
- Service Labour Rate: £60/hour
- Major Time: 2.4 hours
- Oil Quantity: 8 litres
- Oil Price: £7.01/litre
- Air Filter: £19.14
- Pollen Filter: £28
- Oil Filter: £9.54

**Manual Calculation**:
```
Labour: £60 × 2.4 = £144.00
Oil: 8 × £7.01 = £56.08
Parts: £19.14 + £28 + £9.54 = £56.68
Subtotal: £144.00 + £56.08 + £56.68 = £256.76
VAT (20%): £256.76 × 0.20 = £51.352
Total: £256.76 + £51.352 = £308.112
```

**Expected Result**: £308.11

- [ ] **VERIFY**: Displayed price matches calculation

---

## Form Submission & Persistence

### Save Functionality
- [ ] Make changes to various fields
- [ ] Click "Update" button
- [ ] **VERIFY**: Success message appears
- [ ] Refresh the page
- [ ] **VERIFY**: All changes are persisted

### Data Structure
- [ ] After saving, check adminData.json file
- [ ] **VERIFY**: `servicingRates` object contains all rate values
- [ ] **VERIFY**: `servicePricing.prices` contains all calculated prices
- [ ] **VERIFY**: `servicePricing.oilQty` contains all oil quantities
- [ ] **VERIFY**: `servicePricing.partCosts` contains all part costs
- [ ] **VERIFY**: `servicePricing.hourlyRates` contains all hourly times

---

## Cross-Browser Testing

### Chrome/Edge
- [ ] All functionality works
- [ ] No console errors
- [ ] Real-time updates work

### Firefox
- [ ] All functionality works
- [ ] No console errors
- [ ] Real-time updates work

### Safari
- [ ] All functionality works
- [ ] No console errors
- [ ] Real-time updates work

---

## Performance Testing

### Speed Test
- [ ] Change a value that affects all 24 prices (e.g., labour rate)
- [ ] **VERIFY**: Update happens in < 500ms
- [ ] Make 10 rapid changes in a row
- [ ] **VERIFY**: No lag or freezing

### Memory Test
- [ ] Open browser dev tools → Performance/Memory tab
- [ ] Make changes for 2-3 minutes
- [ ] **VERIFY**: No memory leaks
- [ ] **VERIFY**: Memory usage stays stable

---

## Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try to save form
- [ ] **VERIFY**: Appropriate error message appears
- [ ] Reconnect internet
- [ ] Try again
- [ ] **VERIFY**: Save works

### Invalid Data
- [ ] Enter very large numbers (e.g., 999999)
- [ ] **VERIFY**: Calculation still works
- [ ] Enter 0 in all fields
- [ ] **VERIFY**: All prices show £0.00

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all form fields
- [ ] **VERIFY**: Focus indicator is visible
- [ ] **VERIFY**: All fields are reachable via keyboard

### Screen Reader
- [ ] Use screen reader (VoiceOver/NVDA)
- [ ] **VERIFY**: Labels are read correctly
- [ ] **VERIFY**: Table structure is announced

---

## Regression Testing

### Other Admin Forms
- [ ] Navigate to MOT forms
- [ ] **VERIFY**: Still working correctly
- [ ] Navigate to Products forms
- [ ] **VERIFY**: Still working correctly
- [ ] Check all other forms
- [ ] **VERIFY**: No side effects from servicing form changes

---

## Final Verification

- [ ] All prices in the Prices table are read-only (can't be edited directly)
- [ ] All input fields in other sections are editable
- [ ] Form is collapsible (can expand/collapse)
- [ ] Form title shows "Servicing"
- [ ] No TypeScript errors in console
- [ ] No runtime errors in console
- [ ] No warning messages in console

---

## Sign-Off

**Tester Name**: ___________________________

**Date**: ___________________________

**Overall Result**: 
- [ ] ✅ PASS - Ready for production
- [ ] ⚠️ PASS WITH MINOR ISSUES - Note issues below
- [ ] ❌ FAIL - Critical issues found

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________

---

## Issues Found (if any)

| # | Severity | Description | Steps to Reproduce | Status |
|---|----------|-------------|-------------------|---------|
| 1 |          |             |                   |         |
| 2 |          |             |                   |         |
| 3 |          |             |                   |         |
