
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFormContext } from "react-hook-form";
import { FormSection } from "./shared/FormSection";

const singlePriceProducts = [
  "AdBlue",
  "Car Wash & Vacuum", 
  "Coronavirus Neutraliser for Car Interiors",
  "DPF Cleaning",
  "Pre MOT",
  "Summer Health Check",
  "Winter Health Check"
];

export function SinglePriceProductsForm() {
  const { control, watch } = useFormContext();

  return (
    <FormSection title="Single Price Products (including VAT)" collapsible className="bg-[var(--v3-mot-form-bg)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-900 text-white hover:bg-blue-900">
            <TableHead className="text-white">Enabled Products</TableHead>
            <TableHead className="text-white">Default Price</TableHead>
            <TableHead className="text-white">Enable Service Price</TableHead>
            <TableHead className="text-white">Price With Service</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {singlePriceProducts.map((productName, index) => {
            const isEnabled = watch(`singlePriceProducts.${index}.enabled`);
            const isServicePriceEnabled = watch(`singlePriceProducts.${index}.enableServicePrice`);
            
            return (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={control}
                    name={`singlePriceProducts.${index}.enabled`}
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
                  <span className="text-sm">{productName}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">£</span>
                  <FormField
                    control={control}
                    name={`singlePriceProducts.${index}.defaultPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="pl-8 w-24 bg-white"
                            disabled={!isEnabled}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`singlePriceProducts.${index}.enableServicePrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={control}
                  name={`singlePriceProducts.${index}.priceWithService`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                          className="w-24 bg-white"
                          disabled={!isEnabled || !isServicePriceEnabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </FormSection>
  );
}
