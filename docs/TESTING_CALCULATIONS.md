# Testing Real-Time Price Calculations

## How to Test

1. **Navigate to Admin Panel**
   ```
   Go to: /admin
   ```

2. **Scroll to "Prices (including VAT)" Section**
   - This section shows the calculated prices with green backgrounds

3. **Open "Servicing" Section** (if collapsed)
   - Find the "Service Labour Rate" field
   - Note the current value

4. **Test Labour Rate Change**
   - Change the Service Labour Rate from (e.g., £50 to £60)
   - Watch ALL service prices update instantly in the green boxes above
   - All prices should increase proportionally

5. **Test Oil Quantity Change**
   - In the "Prices" section, find "Oil Qty. (Litres)" row
   - Change a value (e.g., from 5 to 6 litres for "1201cc-1500cc")
   - Watch the prices for that engine size column update instantly

6. **Test Part Costs**
   - Change an "Air Filter" cost
   - Notice that:
     - Oil Change prices don't change (doesn't use air filter)
     - Interim, Full, and Major prices DO change (they use air filter)

7. **Test Labour Time**
   - Change a labour time value (e.g., "Interim" hours for a specific engine size)
   - Watch only that specific cell in the prices table update

8. **Test Oil Price**
   - In "Servicing" section, change "Standard Oil" price
   - Watch ALL service prices update (all services use oil)

## Expected Behavior

✅ **Instant Updates**: Prices should update immediately when you change any input
✅ **Correct Formula**: Verify the calculation matches: (Rate × Time) + Parts + Oil + VAT
✅ **Visual Feedback**: Calculated prices have green background
✅ **Persistence**: Changes should be saved when you click "Update" button

## Calculation Examples to Verify

### Example 1: Oil Change for 0cc-1200cc
If you set:
- Labour Rate: £50/hour
- Labour Time: 1 hour
- Oil Qty: 3 litres
- Oil Price: £4/litre
- Oil Filter: £8

Expected: (50×1) + 8 + (3×4) = £70 + 20% VAT = **£84.00**

### Example 2: Full Service for 1501cc-2000cc
If you set:
- Labour Rate: £50/hour
- Labour Time: 2.5 hours
- Oil Qty: 6 litres
- Oil Price: £4/litre
- Oil Filter: £8
- Air Filter: £20
- Pollen Filter: £16.92

Expected: (50×2.5) + 8 + 20 + 16.92 + (6×4) = £193.92 + 20% VAT = **£232.70**

## Common Issues to Check

❌ **Prices don't update**: Make sure you're typing numbers, not text
❌ **Incorrect calculations**: Verify all input fields have valid numbers (not NaN or empty)
❌ **Only zeros showing**: Check that ServicingForm has labour rate and oil price set

## Debug Tips

If prices aren't updating:
1. Open browser console (F12)
2. Check for any errors
3. Verify all form fields have numeric values
4. Try refreshing the page and re-entering values

## Performance Note

The calculations are optimized to only recalculate when relevant fields change, so you shouldn't notice any lag or performance issues even with many fields.
