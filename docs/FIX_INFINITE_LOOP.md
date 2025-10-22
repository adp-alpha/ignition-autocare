# Fix: Maximum Update Depth Exceeded Error

## Problem
The real-time calculation was causing an infinite loop with the error:
```
Maximum update depth exceeded. This can happen when a component calls 
setState inside useEffect, but useEffect either doesn't have a dependency 
array, or one of the dependencies changes on every render.
```

## Root Cause
The `useEffect` dependency array included:
1. Object references (`servicePricing?.hourlyRates`, `servicePricing?.oilQty`, etc.) that change on every render
2. The `setValue` function which wasn't needed as a dependency
3. The `setValue` calls triggered re-renders, which changed the watched values, creating a loop

## Solution Applied

### 1. **Added Update Guard**
```typescript
const isUpdating = useRef(false);

useEffect(() => {
  if (isUpdating.current) return; // Prevent recursive updates
  // ... calculation logic
  isUpdating.current = true;
  // ... setValue calls
  isUpdating.current = false;
}, [...]);
```

### 2. **Used JSON.stringify for Object Dependencies**
Instead of watching object references (which change every render), we now serialize them:
```typescript
// BEFORE (caused infinite loop)
servicePricing?.hourlyRates,
servicePricing?.oilQty,
servicePricing?.partCosts,

// AFTER (stable comparison)
JSON.stringify(servicePricing?.hourlyRates),
JSON.stringify(servicePricing?.oilQty),
JSON.stringify(servicePricing?.partCosts)
```

### 3. **Removed setValue from Dependencies**
```typescript
// BEFORE
], [
  servicingRates?.serviceLabourRate,
  servicingRates?.standardOilPrice,
  servicePricing?.hourlyRates,
  servicePricing?.oilQty,
  servicePricing?.partCosts,
  setValue  // ❌ Not needed!
]);

// AFTER
], [
  servicingRates?.serviceLabourRate,
  servicingRates?.standardOilPrice,
  JSON.stringify(servicePricing?.hourlyRates),
  JSON.stringify(servicePricing?.oilQty),
  JSON.stringify(servicePricing?.partCosts)
  // setValue removed ✅
]);
```

### 4. **Added Price Change Detection**
Only update if the price has actually changed (with tolerance for floating-point precision):
```typescript
const currentPrice = getValues(`servicePricing.prices.${engineSizeKey}.${service.key}`);

// Only update if price has actually changed
if (Math.abs(calculatedPrice - (currentPrice || 0)) > 0.01) {
  setValue(...);
}
```

### 5. **Disabled Form State Updates**
To prevent unnecessary re-renders and form state changes:
```typescript
setValue(`servicePricing.prices.${engineSizeKey}.${service.key}`, calculatedPrice, {
  shouldDirty: false,    // Don't mark form as dirty
  shouldTouch: false,    // Don't mark field as touched
  shouldValidate: false  // Don't trigger validation
});
```

## Why This Works

1. **`isUpdating` guard**: Prevents the effect from running while it's already updating values
2. **JSON.stringify**: Creates stable string representations of objects for comparison
3. **Change detection**: Only updates when values actually change, reducing unnecessary renders
4. **Disabled state updates**: Prevents form state changes from triggering re-renders

## Performance Benefits

- ✅ No infinite loops
- ✅ Only recalculates when input values actually change
- ✅ Doesn't mark form as dirty unnecessarily
- ✅ Minimal re-renders

## Testing
After applying this fix:
1. Navigate to `/admin`
2. Open browser console (F12)
3. Change any pricing input field
4. Verify:
   - ✅ Prices update correctly
   - ✅ No errors in console
   - ✅ Page remains responsive
   - ✅ Can change multiple fields without issues

## Alternative Solutions Considered

### Option 1: useMemo (Not Used)
```typescript
// Could memoize the calculation, but still have dependency issues
const prices = useMemo(() => calculateAllPrices(), [dependencies]);
```
❌ Still requires stable dependencies

### Option 2: Debouncing (Not Used)
```typescript
// Could debounce the updates
const debouncedUpdate = useDebounce(updatePrices, 300);
```
❌ Adds delay to real-time updates

### Option 3: Deep Comparison Hook (Not Used)
```typescript
// Could use useDeepCompareEffect
useDeepCompareEffect(() => { ... }, [servicePricing]);
```
❌ Requires additional dependency and more complex

## Chosen Solution
The combination of `isUpdating` ref guard + JSON.stringify + change detection is the most performant and straightforward solution that:
- Maintains real-time updates
- Prevents infinite loops
- Requires no additional dependencies
- Easy to understand and maintain
