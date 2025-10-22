
import { useFormContext, useWatch } from "react-hook-form";
import { FormSection } from "./shared/FormSection";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useRef } from "react";

// Engine size configurations
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

// Service type configurations
const serviceTypes = [
  { key: "oilChange", label: "Oil Change (£)" },
  { key: "interim", label: "Interim (£)" },
  { key: "full", label: "Full (£)" },
  { key: "major", label: "Major (£)" }
] as const;

// Parts required for each service type
const servicePartsMap: Record<string, string[]> = {
  oilChange: ["oilFilter"],
  interim: ["oilFilter", "airFilter"],
  full: ["oilFilter", "airFilter", "pollenFilter"],
  major: ["oilFilter", "airFilter", "pollenFilter"]
};

// Part configurations
const partTypes = [
  { key: "airFilter", label: "Air Filter (£)" },
  { key: "pollenFilter", label: "Pollen Filter (£)" },
  { key: "oilFilter", label: "Oil Filter (£)" }
];

const VAT_RATE = 0.20; // 20% VAT

export function ServicingForm() {
  const { control, setValue, getValues } = useFormContext();
  const isUpdating = useRef(false);

  // Watch all the fields needed for price calculation
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

    // Formula: (Labour Rate × Labour Time) + Parts Costs + (Oil Qty × Oil Price)
    const subtotal = (labourRate * labourTime) + partsCost + (oilQty * oilPrice);
    
    // Add VAT
    const totalWithVAT = subtotal * (1 + VAT_RATE);

    return totalWithVAT;
  };

  // Update all prices whenever dependencies change - Real-time calculation
  useEffect(() => {
    if (isUpdating.current) return;
    if (!servicingRates || !servicePricing) return;

    isUpdating.current = true;

    serviceTypes.forEach(service => {
      engineSizeKeys.forEach(engineSizeKey => {
        const calculatedPrice = calculatePrice(service.key, engineSizeKey);
        const currentPrice = getValues(`servicePricing.prices.${engineSizeKey}.${service.key}`);
        
        // Only update if price has actually changed (with tolerance for floating point precision)
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
    <FormSection title="Servicing" collapsible className="bg-[var(--v3-mot-form-bg)]">
      {/* Lead Time and Rate Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <FormField
            control={control}
            name="servicingRates.servicingLeadTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servicing Lead Time (Working Days)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-white"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="servicingRates.servicingLeadTimeEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Enabled</FormLabel>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h4 className="text-base font-medium">Enter your hourly rates (excluding VAT).</h4>
            
            <FormField
              control={control}
              name="servicingRates.serviceLabourRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Labour Rate</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="pl-8 w-32 bg-white"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="servicingRates.electricalVehicleLabourRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Electrical Vehicle Labour Rate</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="pl-8 w-32 bg-white"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-base font-medium">Enter your oil prices per litre (excluding VAT):</h4>
          
          <FormField
            control={control}
            name="servicingRates.standardOilPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Standard Oil</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <Input 
                      type="number" 
                      step="0.01"
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="pl-8 w-32 bg-white"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="servicingRates.specialistOilPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialist Oil</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                    <Input 
                      type="number" 
                      step="0.01"
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="pl-8 w-32 bg-white"
                      placeholder="8.5"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Oil Quantity Table */}
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

      {/* Part Costs Table */}
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
            {partTypes.map((part) => (
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

      {/* Hourly Time Table */}
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
            {serviceTypes.map((service) => (
              <TableRow key={service.key}>
                <TableCell><span className="text-sm font-medium">{service.label.replace(' (£)', ' (Hours)')}</span></TableCell>
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

      {/* Prices Table - Auto-calculated */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Prices (including VAT)</h3>
        <p className="text-sm text-gray-600 mb-2">(Hourly Rate x Labour Time) + Parts Costs + Oil Price + VAT</p>
        <p className="text-xs text-gray-500 mb-4">✨ Prices update automatically as you change the inputs above</p>
        
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
      </div>
    </FormSection>
  );
}
