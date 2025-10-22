# Engine Size Mapping Reference

## Quick Reference Table

| Engine CC | Service Pricing Range | Product Tier | Custom Product Tier |
|-----------|----------------------|--------------|---------------------|
| 800cc     | 0cc-1200cc          | 0cc-1500cc   | ≤2000cc            |
| 1200cc    | 0cc-1200cc          | 0cc-1500cc   | ≤2000cc            |
| 1201cc    | 1201cc-1500cc       | 0cc-1500cc   | ≤2000cc            |
| 1400cc    | 1201cc-1500cc       | 0cc-1500cc   | ≤2000cc            |
| 1500cc    | 1201cc-1500cc       | 0cc-1500cc   | ≤2000cc            |
| 1501cc    | 1501cc-2000cc       | 1501cc-2400cc| ≤2000cc            |
| 1800cc    | 1501cc-2000cc       | 1501cc-2400cc| ≤2000cc            |
| 2000cc    | 1501cc-2000cc       | 1501cc-2400cc| ≤2000cc            |
| 2001cc    | 2001cc-2400cc       | 1501cc-2400cc| >2000cc            |
| 2200cc    | 2001cc-2400cc       | 1501cc-2400cc| >2000cc            |
| 2400cc    | 2001cc-2400cc       | 1501cc-2400cc| >2000cc            |
| 2401cc    | 2401cc-3500cc       | 2401cc+      | >2000cc            |
| 3000cc    | 2401cc-3500cc       | 2401cc+      | >2000cc            |
| 3500cc    | 2401cc-3500cc       | 2401cc+      | >2000cc            |
| 3501cc    | 3501cc+             | 2401cc+      | >2000cc            |
| 4000cc    | 3501cc+             | 2401cc+      | >2000cc            |
| 5000cc    | 3501cc+             | 2401cc+      | >2000cc            |

## Popular Vehicle Examples

### Small Cars (0cc-1200cc)
- Fiat 500 (875cc) → 0cc-1200cc
- Toyota Aygo (998cc) → 0cc-1200cc
- Volkswagen Up! (999cc) → 0cc-1200cc
- Smart ForTwo (999cc) → 0cc-1200cc

**Service Prices** (from adminData.json):
- Oil Change: £95.36
- Interim: £125.60
- Full: £146.48
- Major: £211.28

### Small-Medium Cars (1201cc-1500cc)
- Ford Fiesta (1242cc) → 1201cc-1500cc
- Vauxhall Corsa (1398cc) → 1201cc-1500cc
- Honda Jazz (1318cc) → 1201cc-1500cc
- Renault Clio (1461cc) → 1201cc-1500cc

**Service Prices**:
- Oil Change: £118.38
- Interim: £150.06
- Full: £173.96
- Major: £231.56

### Medium Cars (1501cc-2000cc)
- Ford Focus (1596cc) → 1501cc-2000cc
- Volkswagen Golf (1598cc) → 1501cc-2000cc
- Honda Civic (1799cc) → 1501cc-2000cc
- BMW 3 Series (1995cc) → 1501cc-2000cc

**Service Prices**:
- Oil Change: £126.79
- Interim: £189.67
- Full: £202.78
- Major: £260.38

### Large Cars (2001cc-2400cc)
- Audi A4 (2143cc) → 2001cc-2400cc
- Mercedes C-Class (2143cc) → 2001cc-2400cc
- BMW 5 Series (2231cc) → 2001cc-2400cc
- Mazda 6 (2184cc) → 2001cc-2400cc

**Service Prices**:
- Oil Change: £135.84
- Interim: £183.00
- Full: £231.00
- Major: £288.60

### Performance/Luxury (2401cc-3500cc)
- Range Rover Sport (2993cc) → 2401cc-3500cc
- Porsche Cayenne (2967cc) → 2401cc-3500cc
- Mercedes E-Class (2987cc) → 2401cc-3500cc
- BMW X5 (2993cc) → 2401cc-3500cc

**Service Prices**:
- Oil Change: £135.84
- Interim: £173.40
- Full: £221.40
- Major: £279.00

### High Performance (3501cc+)
- Range Rover (4999cc) → 3501cc or above
- Porsche 911 (3996cc) → 3501cc or above
- Mercedes S-Class (4663cc) → 3501cc or above
- BMW M5 (4395cc) → 3501cc or above

**Service Prices**:
- Oil Change: £153.62
- Interim: £216.91
- Full: £250.51
- Major: £308.11

## Boundary Cases

### Critical Boundaries (Exact Matching)

| CC Value | Result | Notes |
|----------|--------|-------|
| 1200     | 0cc-1200cc | Inclusive upper bound |
| 1201     | 1201cc-1500cc | First value of next range |
| 1500     | 1201cc-1500cc | Inclusive upper bound |
| 1501     | 1501cc-2000cc | First value of next range |
| 2000     | 1501cc-2000cc | Inclusive upper bound |
| 2001     | 2001cc-2400cc | First value of next range |
| 2400     | 2001cc-2400cc | Inclusive upper bound |
| 2401     | 2401cc-3500cc | First value of next range |
| 3500     | 2401cc-3500cc | Inclusive upper bound |
| 3501     | 3501cc or above | First value of final range |

## Testing Edge Cases

```javascript
// Test boundary values
console.log(getEngineRangeKey(1200)); // "0cc-1200cc" ✓
console.log(getEngineRangeKey(1201)); // "1201cc-1500cc" ✓
console.log(getEngineRangeKey(1500)); // "1201cc-1500cc" ✓
console.log(getEngineRangeKey(1501)); // "1501cc-2000cc" ✓
console.log(getEngineRangeKey(2000)); // "1501cc-2000cc" ✓
console.log(getEngineRangeKey(2001)); // "2001cc-2400cc" ✓
console.log(getEngineRangeKey(2400)); // "2001cc-2400cc" ✓
console.log(getEngineRangeKey(2401)); // "2401cc-3500cc" ✓
console.log(getEngineRangeKey(3500)); // "2401cc-3500cc" ✓
console.log(getEngineRangeKey(3501)); // "3501cc or above" ✓
```

## Product Tier Boundaries

### Standard Products (3 Tiers)

| CC Value | Product Tier | Example Products |
|----------|-------------|------------------|
| 1400     | 0cc-1500cc | Air Con Re-gas, Brake Fluid |
| 1500     | 0cc-1500cc | (Boundary - inclusive) |
| 1501     | 1501cc-2400cc | Air Con Re-gas, Brake Fluid |
| 2000     | 1501cc-2400cc | Air Con Re-gas, Brake Fluid |
| 2400     | 1501cc-2400cc | (Boundary - inclusive) |
| 2401     | 2401cc or above | Air Con Re-gas, Brake Fluid |
| 5000     | 2401cc or above | Air Con Re-gas, Brake Fluid |

### Custom Products (2 Tiers)

| CC Value | Custom Product Tier | Price Used |
|----------|-------------------|------------|
| 1000     | ≤2000cc | below2000ccPrice |
| 2000     | ≤2000cc | below2000ccPrice |
| 2001     | >2000cc | above2000ccPrice |
| 5000     | >2000cc | above2000ccPrice |

**Example** (Full Wheel Alignment):
- 1800cc engine → Uses `below2000ccPrice` (£99)
- 2500cc engine → Uses `above2000ccPrice` (£99)

## Code Implementation

```typescript
// Service pricing (6 ranges)
export function getEngineRangeKey(cc: number): EngineSize {
  if (cc <= 1200) return "0cc-1200cc";
  if (cc <= 1500) return "1201cc-1500cc";
  if (cc <= 2000) return "1501cc-2000cc";
  if (cc <= 2400) return "2001cc-2400cc";
  if (cc <= 3500) return "2401cc-3500cc";
  return "3501cc or above";
}

// Product pricing (3 tiers)
function getProductPrice(cc: number, product: Product): number {
  if (cc <= 1500) return product['0cc-1500cc'];
  if (cc <= 2400) return product['1501cc-2400cc'];
  return product['2401cc or above'];
}

// Custom product pricing (2 tiers)
function getCustomProductPrice(cc: number, product: CustomProduct): number {
  return cc <= 2000 ? product.below2000ccPrice : product.above2000ccPrice;
}
```

## Common Questions

**Q: Why different ranges for services vs products?**
A: Services require more granular pricing due to varying labour times and parts costs. Products have simpler 3-tier pricing for easier management.

**Q: What happens at boundary values?**
A: Boundaries are inclusive. 1500cc uses "1201cc-1500cc", 1501cc uses "1501cc-2000cc".

**Q: Can I add new engine ranges?**
A: Yes, but you must update:
1. `EngineSize` type in types/adminData.ts
2. `getEngineRangeKey()` function in pricing-engine.ts
3. ServicingForm tables
4. Admin data structure

**Q: What if engine size is missing?**
A: The function defaults to the largest range ("3501cc or above") for any value over 3500cc.

## Validation

### Recommended Validations
```typescript
// Engine size should be positive
if (engineCC <= 0) throw new Error('Invalid engine size');

// Reasonable upper limit
if (engineCC > 10000) console.warn('Unusually large engine');

// Ensure adminData has all required ranges
const requiredRanges: EngineSize[] = [
  "0cc-1200cc",
  "1201cc-1500cc", 
  "1501cc-2000cc",
  "2001cc-2400cc",
  "2401cc-3500cc",
  "3501cc or above"
];
```
