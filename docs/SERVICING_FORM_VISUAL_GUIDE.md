# Servicing Form - Visual Structure Guide

## Complete Form Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                          SERVICING FORM                             │
│                     (Collapsible Section)                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  SECTION 1: Configuration & Rates (2-column grid)                  │
├──────────────────────────────────┬──────────────────────────────────┤
│  LEFT COLUMN:                    │  RIGHT COLUMN:                   │
│                                  │                                  │
│  • Servicing Lead Time (days)    │  Enter your oil prices per litre │
│  • Enabled checkbox              │  (excluding VAT):                │
│                                  │                                  │
│  Enter your hourly rates         │  • Standard Oil (£/litre)        │
│  (excluding VAT):                │  • Specialist Oil (£/litre)      │
│                                  │                                  │
│  • Service Labour Rate (£/hr)    │                                  │
│  • Electrical Vehicle Labour     │                                  │
│    Rate (£/hr)                   │                                  │
└──────────────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  SECTION 2: Oil Quantity Table                                     │
│  "Enter the oil quantity used for the specified engine size         │
│   (in Litres)"                                                      │
├───────────┬────────┬────────┬────────┬────────┬────────┬────────────┤
│           │ 0cc -  │1201cc -│1501cc -│2001cc -│2401cc -│3501cc or   │
│           │1200cc  │1500cc  │2000cc  │2400cc  │3500cc  │above       │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ Oil Qty.  │  [3]   │  [5]   │  [6]   │  [6]   │  [6]   │   [8]      │
│ (Litres)  │        │        │        │        │        │            │
└───────────┴────────┴────────┴────────┴────────┴────────┴────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  SECTION 3: Part Costs Table                                       │
│  "Enter the cost of part for the specified engine size             │
│   (excluding VAT)"                                                  │
├───────────┬────────┬────────┬────────┬────────┬────────┬────────────┤
│           │ 0cc -  │1201cc -│1501cc -│2001cc -│2401cc -│3501cc or   │
│           │1200cc  │1500cc  │2000cc  │2400cc  │3500cc  │above       │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ Air       │ [12]   │ [12]   │ [20]   │[23.7]  │[15.7]  │  [19.14]   │
│ Filter(£) │        │        │        │        │        │            │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ Pollen    │ [5.4]  │[7.92]  │[16.92] │ [28]   │ [28]   │   [28]     │
│ Filter(£) │        │        │        │        │        │            │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ Oil       │[5.64]  │  [6]   │  [6]   │[8.74]  │[8.74]  │  [9.54]    │
│ Filter(£) │        │        │        │        │        │            │
└───────────┴────────┴────────┴────────┴────────┴────────┴────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  SECTION 4: Hourly Time Table                                      │
│  "Enter the hourly time for each engine size and service type      │
│   (in hours, can be decimal)"                                      │
├───────────┬────────┬────────┬────────┬────────┬────────┬────────────┤
│           │ 0cc -  │1201cc -│1501cc -│2001cc -│2401cc -│3501cc or   │
│           │1200cc  │1500cc  │2000cc  │2400cc  │3500cc  │above       │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ Oil Change│ [0.88] │[0.96]  │[0.96]  │[1.04]  │[1.04]  │  [1.04]    │
│ (Hours)   │        │        │        │        │        │            │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ Interim   │ [1.1]  │ [1.2]  │ [1.5]  │ [1.3]  │ [1.3]  │   [1.6]    │
│ (Hours)   │        │        │        │        │        │            │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ Full      │ [1.3]  │ [1.4]  │ [1.4]  │ [1.5]  │ [1.5]  │   [1.6]    │
│ (Hours)   │        │        │        │        │        │            │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ Major     │ [2.2]  │ [2.2]  │ [2.2]  │ [2.3]  │ [2.3]  │   [2.4]    │
│ (Hours)   │        │        │        │        │        │            │
└───────────┴────────┴────────┴────────┴────────┴────────┴────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  SECTION 5: Prices (including VAT) - AUTO-CALCULATED               │
│  "(Hourly Rate x Labour Time) + Parts Costs + Oil Price + VAT"     │
│  "✨ Prices update automatically as you change the inputs above"    │
├───────────┬────────┬────────┬────────┬────────┬────────┬────────────┤
│           │ 0cc -  │1201cc -│1501cc -│2001cc -│2401cc -│3501cc or   │
│           │1200cc  │1500cc  │2000cc  │2400cc  │3500cc  │above       │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ ☑ Oil     │ £95.36 │£118.38 │£126.79 │£135.84 │£135.84 │  £153.62   │
│ Change(£) │        │        │        │        │        │            │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ ☑ Interim │£125.60 │£150.06 │£189.67 │ £183.00│£173.40 │  £216.91   │
│ (£)       │        │        │        │        │        │            │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ ☑ Full    │£146.48 │£173.96 │£202.78 │ £231.00│£221.40 │  £250.51   │
│ (£)       │        │        │        │        │        │            │
├───────────┼────────┼────────┼────────┼────────┼────────┼────────────┤
│ ☑ Major   │£211.28 │£231.56 │£260.38 │ £288.60│ £279.00│  £308.11   │
│ (£)       │        │        │        │        │        │            │
└───────────┴────────┴────────┴────────┴────────┴────────┴────────────┘
          ↑ Checkboxes to enable/disable each service type
          ↑ Gradient green/blue background indicates auto-calculated
```

## Data Flow Diagram

```
                    ┌──────────────────────┐
                    │  User Changes Input  │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   useWatch triggers     │
                    │   when these change:    │
                    │  • serviceLabourRate    │
                    │  • standardOilPrice     │
                    │  • oilQty               │
                    │  • partCosts            │
                    │  • hourlyRates          │
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   useEffect fires       │
                    │   calculatePrice()      │
                    │   for all combinations  │
                    └──────────┬──────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────▼─────┐        ┌────▼─────┐       ┌─────▼─────┐
    │ Oil Change│        │ Interim  │       │   Full    │
    │   Price   │        │  Price   │       │   Price   │
    └─────┬─────┘        └────┬─────┘       └─────┬─────┘
          │                   │                    │
          │            ┌──────▼──────┐             │
          └────────────►    Major    ◄─────────────┘
                       │    Price    │
                       └──────┬──────┘
                              │
                   ┌──────────▼───────────┐
                   │  setValue() updates  │
                   │  all calculated      │
                   │  prices in form      │
                   └──────────────────────┘
```

## Calculation Example

**Scenario**: Calculate Oil Change price for 1201cc-1500cc engine

**Inputs**:
- Service Labour Rate: £60/hour
- Labour Time (Oil Change, 1201cc-1500cc): 0.96 hours
- Oil Quantity (1201cc-1500cc): 5 litres
- Standard Oil Price: £7.01/litre
- Oil Filter Cost (1201cc-1500cc): £6

**Calculation**:
```
Parts Required for Oil Change: oilFilter only
Parts Cost = £6

Labour Cost = £60 × 0.96 = £57.60
Oil Cost = 5 × £7.01 = £35.05
Parts Cost = £6

Subtotal = £57.60 + £35.05 + £6 = £98.65
VAT (20%) = £98.65 × 0.20 = £19.73
Total = £98.65 + £19.73 = £118.38
```

**Result**: £118.38 (matches the data in adminData.json)

## Field Dependencies

### Independent Fields (Don't trigger recalculation)
- Servicing Lead Time
- Servicing Lead Time Enabled
- Electrical Vehicle Labour Rate (not currently used)
- Specialist Oil Price (not currently used)
- Service checkboxes (enable/disable)

### Dependent Fields (Trigger price recalculation)
- Service Labour Rate → Affects all prices
- Standard Oil Price → Affects all prices
- Oil Qty (any engine size) → Affects that engine size's prices
- Part Costs (any part, any size) → Affects relevant service types
- Hourly Rates (any service, any size) → Affects that specific price

## Performance Optimizations

1. **isUpdating Flag**: Prevents infinite loops during calculation updates
2. **Tolerance Check**: Only updates if change > £0.01
3. **shouldDirty: false**: Prevents form from being marked dirty on auto-calculations
4. **Memoization**: Uses useRef to avoid re-creating calculation function
5. **Selective Dependencies**: useEffect only watches the specific fields that affect calculations

## Browser Support

The form uses standard React Hook Form features and should work in all modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Accessibility

- ✅ All inputs have proper labels
- ✅ Semantic HTML structure
- ✅ Table headers properly marked
- ✅ Keyboard navigation supported
- ✅ Form validation feedback
