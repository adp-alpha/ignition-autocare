/**
 * @deprecated This form has been merged into ServicingForm.tsx
 * 
 * PricingForm is deprecated and should not be used.
 * All pricing functionality has been consolidated into ServicingForm.tsx
 * which now handles:
 * - Servicing lead time settings
 * - Labour rates (service & electrical vehicle)
 * - Oil prices (standard & specialist)
 * - Oil quantity per engine size
 * - Parts costs (air filter, pollen filter, oil filter)
 * - Hourly time for each service type
 * - Auto-calculated prices (including VAT) with real-time updates
 * 
 * This file is kept for reference only and should be removed in a future cleanup.
 */

import { useFormContext, useWatch } from "react-hook-form";
import { FormSection } from "./shared/FormSection";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

const engineSizes = [
  "0cc - 1200cc",
  "1201cc - 1500cc", 
  "1501cc - 2000cc",
  "2001cc - 2400cc",
  "2401cc - 3500cc",
  "3501cc or above"
];

const engineSizeKeys = [
  "0cc-1200cc",
  "1201cc-1500cc",
  "1501cc-2000cc",
  "2001cc-2400cc",
  "2401cc-3500cc",
  "3501cc or above"
] as const;

const serviceTypes = [
  { key: "oilChange", label: "Oil Change (£)" },
  { key: "interim", label: "Interim (£)" },
  { key: "full", label: "Full (£)" },
  { key: "major", label: "Major (£)" }
] as const;

// Parts needed for each service type
const servicePartsMap: Record<string, string[]> = {
  oilChange: ["oilFilter"],
  interim: ["oilFilter", "airFilter"],
  full: ["oilFilter", "airFilter", "pollenFilter"],
  major: ["oilFilter", "airFilter", "pollenFilter"]
};

const VAT_RATE = 0.20; // 20% VAT

export function PricingForm() {
  const { control, setValue, getValues } = useFormContext();
  const isUpdating = useRef(false);

  // Watch all the fields needed for calculation
  const servicingRates = useWatch({ control, name: "servicingRates" });
  const servicePricing = useWatch({ control, name: "servicePricing" });

  // Calculate price for a specific service and engine size
  const calculatePrice = (serviceKey: string, engineSizeKey: string): number => {
    const currentServicingRates = servicingRates || getValues("servicingRates");
    const currentServicePricing = servicePricing || getValues("servicePricing");
    
    if (!currentServicingRates || !currentServicePricing) return 0;

    const labourRate = currentServicingRates.serviceLabourRate || 0;
    const labourTime = currentServicePricing.hourlyRates?.[serviceKey]?.[engineSizeKey] || 0;
    const oilQty = currentServicePricing.oilQty?.[engineSizeKey] || 0;
    const oilPrice = currentServicingRates.standardOilPrice || 0;

    // Calculate parts cost based on service type
    const partsNeeded = servicePartsMap[serviceKey] || [];
    let partsCost = 0;
    partsNeeded.forEach(partKey => {
      partsCost += currentServicePricing.partCosts?.[partKey]?.[engineSizeKey] || 0;
    });

    // Formula: (Hourly Rate × Labour Time) + Parts Costs + (Oil Qty × Oil Price)
    const subtotal = (labourRate * labourTime) + partsCost + (oilQty * oilPrice);
    
    // Add VAT
    const totalWithVAT = subtotal * (1 + VAT_RATE);

    return totalWithVAT;
  };

  // Update all prices whenever dependencies change
  useEffect(() => {
    if (isUpdating.current) return;
    if (!servicingRates || !servicePricing) return;

    isUpdating.current = true;

    serviceTypes.forEach(service => {
      engineSizeKeys.forEach(engineSizeKey => {
        const calculatedPrice = calculatePrice(service.key, engineSizeKey);
        const currentPrice = getValues(`servicePricing.prices.${engineSizeKey}.${service.key}`);
        
        // Only update if price has actually changed (with small tolerance for floating point)
        if (Math.abs(calculatedPrice - (currentPrice || 0)) > 0.01) {
          setValue(`servicePricing.prices.${engineSizeKey}.${service.key}`, calculatedPrice, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false
          });
        }
      });
    });

    isUpdating.current = false;
  }, [
    servicingRates?.serviceLabourRate,
    servicingRates?.standardOilPrice,
    JSON.stringify(servicePricing?.hourlyRates),
    JSON.stringify(servicePricing?.oilQty),
    JSON.stringify(servicePricing?.partCosts)
  ]);

  return (
    <FormSection title="Prices (including VAT)" collapsible className="bg-[var(--v3-mot-form-bg)]">
      <div className="mb-4">
        <p className="text-sm text-gray-600">(Hourly Rate x Labour Time) + Parts Costs + Oil Price + VAT</p>
        <p className="text-xs text-gray-500 mt-1">✨ Prices update automatically as you change the inputs below</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
            <TableHead className="text-white"></TableHead>
            {engineSizes.map((size) => (
              <TableHead key={size} className="text-white text-center">{size}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceTypes.map((service) => (
            <TableRow key={service.key}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={control}
                    name={`servicePricing.prices.${service.key}.enabled`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value !== false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-sm font-medium">{service.label}</span>
                </div>
              </TableCell>
              {engineSizes.map((size, sizeIndex) => (
                <TableCell key={size} className="text-center">
                  <FormField
                    control={control}
                    name={`servicePricing.prices.${engineSizeKeys[sizeIndex]}.${service.key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="text-sm bg-gradient-to-br from-green-50 to-blue-50 p-2 rounded font-semibold text-green-700 border border-green-200">
                            £{field.value?.toFixed(2) || "0.00"}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Enter the oil quantity used for the specified engine size (in Litres)</h3>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
              <TableHead className="text-white"></TableHead>
              {engineSizes.map((size) => (
                <TableHead key={size} className="text-white text-center">{size}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell><span className="text-sm font-medium">Oil Qty. (Litres)</span></TableCell>
              {engineSizes.map((size, index) => (
                <TableCell key={size} className="text-center">
                  <FormField
                    control={control}
                    name={`servicePricing.oilQty.${engineSizeKeys[index]}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="w-16 h-8 text-center bg-white"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Enter the cost of part for the specified engine size (excluding VAT)</h3>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
              <TableHead className="text-white"></TableHead>
              {engineSizes.map((size) => (
                <TableHead key={size} className="text-white text-center">{size}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { key: "airFilter", label: "Air Filter (£)" },
              { key: "pollenFilter", label: "Pollen Filter (£)" },
              { key: "oilFilter", label: "Oil Filter (£)" }
            ].map((part) => (
              <TableRow key={part.key}>
                <TableCell><span className="text-sm font-medium">{part.label}</span></TableCell>
                {engineSizes.map((size, index) => (
                  <TableCell key={size} className="text-center">
                    <FormField
                      control={control}
                      name={`servicePricing.partCosts.${part.key}.${engineSizeKeys[index]}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="w-16 h-8 text-center bg-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Enter the hourly time for each engine size and service type (in hours, can be decimal)</h3>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
              <TableHead className="text-white"></TableHead>
              {engineSizes.map((size) => (
                <TableHead key={size} className="text-white text-center">{size}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { key: "oilChange", label: "Oil Change (Hours)" },
              { key: "interim", label: "Interim (Hours)" },
              { key: "full", label: "Full (Hours)" },
              { key: "major", label: "Major (Hours)" }
            ].map((service) => (
              <TableRow key={service.key}>
                <TableCell><span className="text-sm font-medium">{service.label}</span></TableCell>
                {engineSizes.map((size, index) => (
                  <TableCell key={size} className="text-center">
                    <FormField
                      control={control}
                      name={`servicePricing.hourlyRates.${service.key}.${engineSizeKeys[index]}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="w-16 h-8 text-center bg-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FormSection>
  );
}
