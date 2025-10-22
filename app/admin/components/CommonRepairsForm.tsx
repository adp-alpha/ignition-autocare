
import { useFormContext, useWatch } from "react-hook-form";
import { FormSection } from "./shared/FormSection";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef } from "react";

// Base data for common repairs (OEM prices and labour hours)
const commonRepairsData = [
  { 
    product: "Clutch Replacement", 
    basePartsPrice: 300,
    labourHours: 4.5
  },
  { 
    product: "Brake Discs & Pads", 
    basePartsPrice: 120,
    labourHours: 2.0
  },
  { 
    product: "Brake Pads", 
    basePartsPrice: 50,
    labourHours: 1.5
  }
];

const VAT_RATE = 0.20; // 20% VAT

export function CommonRepairsForm() {
  const { control, setValue, getValues } = useFormContext();
  const isUpdating = useRef(false);
  
  // Watch the fields that affect price calculation
  const mechanicalLabourRate = useWatch({ control, name: "commonRepairs.mechanicalLabourRate" });
  const repairs = useWatch({ control, name: "commonRepairs.repairs" });

  // Calculate price for a specific repair
  const calculateRepairPrice = (repairIndex: number): number => {
    const currentRepairs = repairs || getValues("commonRepairs.repairs");
    const currentLabourRate = mechanicalLabourRate || getValues("commonRepairs.mechanicalLabourRate");
    
    if (!currentRepairs || !currentLabourRate) return 0;

    const repair = currentRepairs[repairIndex];
    const baseData = commonRepairsData[repairIndex];
    
    if (!repair || !baseData) return 0;

    const labourCost = currentLabourRate * baseData.labourHours;
    const modifier = repair.oemPartsPriceModifier || 0;
    const isIncrease = repair.oemPartsModifierIsIncrease !== false; // Default to true
    
    // Calculate parts price with modifier
    let partsPrice = baseData.basePartsPrice;
    const modifierAmount = (partsPrice / 100) * Math.abs(modifier);
    
    if (isIncrease) {
      partsPrice += modifierAmount;
    } else {
      partsPrice -= modifierAmount;
    }
    
    // Formula: ((Mechanical Labour Rate * Hours) + Parts Price) + VAT
    const subtotal = labourCost + partsPrice;
    const totalWithVAT = subtotal * (1 + VAT_RATE);
    
    return totalWithVAT;
  };

  // Update all repair prices whenever dependencies change
  useEffect(() => {
    if (isUpdating.current) return;
    if (!mechanicalLabourRate || !repairs) return;

    isUpdating.current = true;

    commonRepairsData.forEach((_, index) => {
      const calculatedPrice = calculateRepairPrice(index);
      const currentPrice = getValues(`commonRepairs.repairs.${index}.examplePrice`);
      
      // Only update if price has actually changed
      if (Math.abs(calculatedPrice - (currentPrice || 0)) > 0.01) {
        setValue(`commonRepairs.repairs.${index}.examplePrice`, calculatedPrice, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false
        });
      }
    });

    isUpdating.current = false;
  }, [
    mechanicalLabourRate,
    JSON.stringify(repairs?.map((r: any) => ({
      modifier: r?.oemPartsPriceModifier,
      isIncrease: r?.oemPartsModifierIsIncrease
    })))
  ]);

  return (
    <FormSection title="Common Repairs" collapsible className="bg-[var(--v3-mot-form-bg)]">
      <div className="space-y-6">
        <FormField
          control={control}
          name="commonRepairs.mechanicalLabourRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mechanical Labour Rate</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="pl-8 w-32 bg-white"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p>All parts are at OEM prices. You can modify the OEM prices by putting in an percentage based price modifier below.</p>
            <p>All labour times are at OEM fitment times. These are multiplied by your mechanical labour rate.</p>
            <p>The part price modifier multiplied by your labour rate plus VAT will be your published price.</p>
          </div>
          
          <div className="text-sm italic text-gray-600">
            <p>Example prices are based on a Ford Focus 2015 (15 reg) 1.0 EcoBoost 125 Zetec 5dr</p>
            <p>((Mechanical Labour Rate * Hours ) + Parts Price) + ((PartsPrice / 100 ) * Modifier) + VAT</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
              <TableHead className="text-white">Enabled</TableHead>
              <TableHead className="text-white">Product</TableHead>
              <TableHead className="text-white">OEM Parts Price Modifier %</TableHead>
              <TableHead className="text-white">Price Type</TableHead>
              <TableHead className="text-white">Example Price</TableHead>
              <TableHead className="text-white">Lead Time (Working Days)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commonRepairsData.map((repair, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormField
                    control={control}
                    name={`commonRepairs.repairs.${index}.enabled`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{repair.product}</span>
                  <div className="text-xs text-gray-500">
                    Base: £{repair.basePartsPrice} + {repair.labourHours}h labour
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">%</span>
                    <FormField
                      control={control}
                      name={`commonRepairs.repairs.${index}.oemPartsPriceModifier`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="w-20 h-8 text-center bg-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`commonRepairs.repairs.${index}.oemPartsModifierIsIncrease`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <button
                              type="button"
                              onClick={() => field.onChange(!field.value)}
                              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                            >
                              <span className={`text-xs ${!field.value ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                                Decrease
                              </span>
                              <div className={`w-10 h-5 rounded-full relative transition-colors ${
                                field.value ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                                  field.value ? 'translate-x-5' : 'translate-x-0.5'
                                }`}></div>
                              </div>
                              <span className={`text-xs ${field.value ? 'font-bold text-green-600' : 'text-gray-500'}`}>
                                Increase
                              </span>
                            </button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`commonRepairs.repairs.${index}.priceType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select price type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EXAMPLE">Example Price</SelectItem>
                              <SelectItem value="REVEAL">Reveal Price</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`commonRepairs.repairs.${index}.examplePrice`}
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
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={control}
                      name={`commonRepairs.repairs.${index}.leadTimeEnabled`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`commonRepairs.repairs.${index}.leadTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              className="w-16 h-8 text-center bg-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FormSection>
  );
}
